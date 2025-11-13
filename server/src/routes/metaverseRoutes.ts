import { Router } from 'express';
import { z } from 'zod';

import prisma from '../db.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { startTracking, stopTracking } from '../services/usageTracker.js';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const metaverses = await prisma.metaverse.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(metaverses);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = req.params;

    const metaverse = await prisma.metaverse.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!metaverse) {
      return res.status(404).json({ message: 'Metaverse not found' });
    }

    res.json(metaverse);
  } catch (error) {
    next(error);
  }
});

const createMetaverseSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  kind: z.enum(['TWO_D', 'THREE_D']),
  region: z.enum(['ASIA', 'EU', 'US']).optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const parsed = createMetaverseSchema.parse(req.body);

    const metaverse = await prisma.metaverse.create({
      data: {
        userId,
        name: parsed.name,
        kind: parsed.kind,
        region: parsed.region ?? 'ASIA',
        status: 'STOPPED',
      },
    });

    res.status(201).json(metaverse);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.issues[0]?.message ?? 'Invalid request' });
    }
    next(error);
  }
});

const actionParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

router.post('/start/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = actionParamSchema.parse(req.params);

    const metaverse = await prisma.metaverse.findFirst({ where: { id, userId } });
    if (!metaverse) {
      return res.status(404).json({ message: 'Metaverse not found' });
    }

    if (metaverse.status !== 'STOPPED' && metaverse.status !== 'ERROR') {
      return res.status(400).json({ message: 'Metaverse must be STOPPED or ERROR to start' });
    }

    // Transition to STARTING
    await prisma.metaverse.update({
      where: { id },
      data: { status: 'STARTING' },
    });

    // After 2 seconds, transition to RUNNING (or ERROR with 10% chance)
    setTimeout(async () => {
      try {
        const current = await prisma.metaverse.findUnique({ where: { id } });
        if (!current || current.status !== 'STARTING') {
          return; // State changed externally
        }

        const shouldError = Math.random() < 0.1; // 10% chance
        const finalStatus = shouldError ? 'ERROR' : 'RUNNING';
        const playersOnline = shouldError ? 0 : Math.floor(Math.random() * 20) + 5;

        await prisma.metaverse.update({
          where: { id },
          data: {
            status: finalStatus,
            playersOnline,
          },
        });

        // Start tracking if RUNNING
        if (finalStatus === 'RUNNING') {
          startTracking(id);
        }
      } catch (error) {
        console.error(`Error in start transition for metaverse ${id}:`, error);
      }
    }, 2000);

    const updated = await prisma.metaverse.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid metaverse id' });
    }
    next(error);
  }
});

router.post('/stop/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = actionParamSchema.parse(req.params);

    const metaverse = await prisma.metaverse.findFirst({ where: { id, userId } });
    if (!metaverse) {
      return res.status(404).json({ message: 'Metaverse not found' });
    }

    if (metaverse.status !== 'RUNNING' && metaverse.status !== 'ERROR') {
      return res.status(400).json({ message: 'Metaverse must be RUNNING or ERROR to stop' });
    }

    // Stop tracking immediately
    stopTracking(id);

    // Transition to STOPPING
    await prisma.metaverse.update({
      where: { id },
      data: { status: 'STOPPING' },
    });

    // After 2 seconds, transition to STOPPED
    setTimeout(async () => {
      try {
        const current = await prisma.metaverse.findUnique({ where: { id } });
        if (!current || current.status !== 'STOPPING') {
          return; // State changed externally
        }

        await prisma.metaverse.update({
          where: { id },
          data: {
            status: 'STOPPED',
            playersOnline: 0,
          },
        });
      } catch (error) {
        console.error(`Error in stop transition for metaverse ${id}:`, error);
      }
    }, 2000);

    const updated = await prisma.metaverse.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid metaverse id' });
    }
    next(error);
  }
});

router.post('/restart/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = actionParamSchema.parse(req.params);

    const metaverse = await prisma.metaverse.findFirst({ where: { id, userId } });
    if (!metaverse) {
      return res.status(404).json({ message: 'Metaverse not found' });
    }

    if (metaverse.status !== 'RUNNING') {
      return res.status(400).json({ message: 'Metaverse must be RUNNING to restart' });
    }

    // Stop tracking
    stopTracking(id);

    // Transition to STOPPING
    await prisma.metaverse.update({
      where: { id },
      data: { status: 'STOPPING' },
    });

    // After 1 second, transition to STARTING
    setTimeout(async () => {
      try {
        const current = await prisma.metaverse.findUnique({ where: { id } });
        if (!current || current.status !== 'STOPPING') {
          return;
        }

        await prisma.metaverse.update({
          where: { id },
          data: { status: 'STARTING' },
        });

        // After another 1 second, transition to RUNNING
        setTimeout(async () => {
          try {
            const current2 = await prisma.metaverse.findUnique({ where: { id } });
            if (!current2 || current2.status !== 'STARTING') {
              return;
            }

            const playersOnline = Math.floor(Math.random() * 20) + 5;
            await prisma.metaverse.update({
              where: { id },
              data: {
                status: 'RUNNING',
                playersOnline,
              },
            });

            // Start tracking
            startTracking(id);
          } catch (error) {
            console.error(`Error in restart RUNNING transition for metaverse ${id}:`, error);
          }
        }, 1000);
      } catch (error) {
        console.error(`Error in restart STARTING transition for metaverse ${id}:`, error);
      }
    }, 1000);

    const updated = await prisma.metaverse.findUnique({ where: { id } });
    res.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid metaverse id' });
    }
    next(error);
  }
});

router.delete('/delete/:id', async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { id } = actionParamSchema.parse(req.params);

    const metaverse = await prisma.metaverse.findFirst({ where: { id, userId } });
    if (!metaverse) {
      return res.status(404).json({ message: 'Metaverse not found' });
    }

    // Stop tracking if running
    stopTracking(id);

    await prisma.metaverse.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid metaverse id' });
    }
    next(error);
  }
});

export { router as metaverseRouter };
