import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

import prisma from '../db.js';
import { authenticate, generateAccessToken } from '../middleware/authMiddleware.js';

const router = Router();

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

router.post('/login', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: parsed.email },
      include: {
        subscription: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await bcrypt.compare(parsed.password, user.password);
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = generateAccessToken({ userId: user.id, email: user.email });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid credentials' });
    }
    next(error);
  }
});

router.get('/me', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.post('/signup', async (req, res, next) => {
  try {
    const parsed = credentialsSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const hashed = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        password: hashed,
        subscription: {
          create: {
            plan: 'INDIE',
            monthlyHours: 200,
            usedHours: 0,
            resetDate: new Date(),
            nextBilling: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        },
      },
    });

    const token = generateAccessToken({ userId: user.id, email: user.email });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid credentials' });
    }
    next(error);
  }
});

export { router as authRouter };


