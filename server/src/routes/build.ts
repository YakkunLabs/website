import { Router } from 'express';
import { z } from 'zod';

import prisma from '../db.js';

const router = Router();

const createBuildSchema = z.object({
  projectId: z.string().min(1, 'projectId is required'),
});

const jobTimers = new Map<string, NodeJS.Timeout[]>();

async function scheduleBuild(jobId: string) {
  const timers: NodeJS.Timeout[] = [];

  const processingTimer = setTimeout(async () => {
    await prisma.buildJob.update({
      where: { id: jobId },
      data: { status: 'PROCESSING', logs: 'Processing assets…' },
    });
  }, 3000);

  const doneTimer = setTimeout(async () => {
    await prisma.buildJob.update({
      where: { id: jobId },
      data: {
        status: 'DONE',
        logs: 'Build completed successfully.',
      },
    });
    jobTimers.delete(jobId);
  }, 10000);

  timers.push(processingTimer, doneTimer);
  jobTimers.set(jobId, timers);
}

router.post('/', async (req, res, next) => {
  try {
    const parsed = createBuildSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: parsed.error.issues[0]?.message ?? 'projectId is required',
      });
    }

    const { projectId } = parsed.data;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const job = await prisma.buildJob.create({
      data: {
        projectId,
        status: 'QUEUED',
        logs: 'Build request queued.',
      },
    });

    scheduleBuild(job.id).catch((error) => {
      console.error('Failed to schedule build', error);
    });

    res.status(201).json({ jobId: job.id });
  } catch (error) {
    next(error);
  }
});

router.get('/:jobId', async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const job = await prisma.buildJob.findUnique({
      where: { id: jobId },
      select: {
        status: true,
        logs: true,
      },
    });

    if (!job) {
      return res.status(404).json({ message: 'Build job not found.' });
    }

    res.json(job);
  } catch (error) {
    next(error);
  }
});

export { router as buildRouter };

