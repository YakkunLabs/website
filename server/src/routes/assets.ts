import { Router } from 'express';

import prisma from '../db.js';

const router = Router();

router.get('/:id', async (req, res, next) => {
  try {
    const asset = await prisma.asset.findUnique({
      where: { id: req.params.id },
    });

    if (!asset) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    res.json({ asset });
  } catch (error) {
    next(error);
  }
});

export { router as assetsRouter };

