import { Router } from 'express';
import { z } from 'zod';

import prisma from '../db.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

const payloadSchema = z.object({
  characterId: z.string().optional(),
  modelId: z.string().optional(),
  worldMapId: z.string().optional(),
});

// Get all projects for authenticated user
router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      include: {
        character: true,
        model: true,
        worldMap: true,
        buildJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
});

// Get single project by ID
router.get('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    const project = await prisma.project.findFirst({
      where: { id, userId },
      include: {
        character: true,
        model: true,
        worldMap: true,
        buildJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.json(project);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message:
          parsed.error.issues[0]?.message ?? 'Invalid payload. Provide asset IDs.',
      });
    }

    const payload = parsed.data;
    const name = `Project ${new Date().toLocaleDateString()}`;

    const data = {
      name,
      userId,
      characterId: payload.characterId ?? null,
      modelId: payload.modelId ?? null,
      worldMapId: payload.worldMapId ?? null,
    };

    const project = await prisma.project.create({ data });

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

// Update project
router.put('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message ?? 'Invalid payload.',
      });
    }

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const { characterId, modelId, worldMapId } = parsed.data;

    const project = await prisma.project.update({
      where: { id },
      data: {
        characterId: characterId || null,
        modelId: modelId || null,
        worldMapId: worldMapId || null,
      },
      include: {
        character: true,
        model: true,
        worldMap: true,
        buildJobs: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

// Delete project
router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id } = req.params;

    // Check if project exists and belongs to user
    const existingProject = await prisma.project.findFirst({
      where: { id, userId },
    });

    if (!existingProject) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ message: 'Project deleted successfully.' });
  } catch (error) {
    next(error);
  }
});

export { router as projectRouter };

