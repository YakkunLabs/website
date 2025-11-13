import { Router } from 'express';
import { z } from 'zod';

import prisma from '../db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
    });

    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    res.json(subscription);
  } catch (error) {
    next(error);
  }
});

const buySchema = z.object({
  hours: z.number().int().min(1).max(500, 'Cannot add more than 500 hours at once'),
});

router.post('/buy-hours', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { hours } = buySchema.parse(req.body);

    const subscription = await prisma.subscription.findUnique({ where: { userId } });
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    const updated = await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        usedHours: Math.max(subscription.usedHours - hours, 0),
      },
    });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid request' });
    }
    next(error);
  }
});

const upgradeSchema = z.object({
  plan: z.enum(['INDIE', 'PRO', 'STUDIO']),
  monthlyHours: z.number().int().min(50).max(1000).optional(),
});

router.post('/upgrade', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsed = upgradeSchema.parse(req.body);

  const subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) {
    return res.status(404).json({ message: 'Subscription not found' });
  }

  const defaults = {
    INDIE: 200,
    PRO: 400,
    STUDIO: 800,
  } as const;

  const targetMonthly = parsed.monthlyHours ?? defaults[parsed.plan];

  const updated = await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      plan: parsed.plan,
      monthlyHours: targetMonthly,
      usedHours: Math.min(subscription.usedHours, targetMonthly),
      nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid request' });
    }
    next(error);
  }
});

export { router as subscriptionRouter };


