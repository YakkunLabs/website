import { Router } from 'express';
import { z } from 'zod';

import prisma from '../db.js';

const router = Router();

const payloadSchema = z.object({
  characterId: z.string().optional(),
  modelId: z.string().optional(),
  worldMapId: z.string().optional(),
});

router.post('/', async (req, res, next) => {
  try {
    const parsed = payloadSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message:
          parsed.error.issues[0]?.message ?? 'Invalid payload. Provide asset IDs.',
      });
    }

    const payload = parsed.data;
    const name = 'gg.play default';

    const data = {
      name,
      characterId: payload.characterId ?? null,
      modelId: payload.modelId ?? null,
      worldMapId: payload.worldMapId ?? null,
    };

    const existing = await prisma.project.findFirst({
      where: { name },
    });

    let project;
    if (existing) {
      project = await prisma.project.update({
        where: { id: existing.id },
        data,
      });
    } else {
      project = await prisma.project.create({ data });
    }

    res.json({ project });
  } catch (error) {
    next(error);
  }
});

export { router as projectRouter };

