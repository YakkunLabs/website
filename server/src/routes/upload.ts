import { Router } from 'express';
import multer from 'multer';
import path from 'node:path';

import prisma from '../db.js';
import {
  ensureUploadDir,
  generateFilename,
  getPublicUrl,
  getUploadDir,
  removeFile,
} from '../services/storage.js';

const uploadRouter = Router();

const storage = multer.diskStorage({
  destination: async (_req, _file, cb) => {
    try {
      await ensureUploadDir();
      cb(null, getUploadDir());
    } catch (error) {
      cb(error as Error, getUploadDir());
    }
  },
  filename: (_req, file, cb) => {
    const filename = generateFilename(file.originalname);
    cb(null, filename);
  },
});

const MAX_FILE_SIZE = 100 * 1024 * 1024;

type UploadType = 'character' | 'model' | 'worldMap';

const allowedExtensions: Record<UploadType, string[]> = {
  character: ['.glb'],
  model: ['.glb', '.gltf'],
  worldMap: ['.png', '.jpg', '.jpeg'],
};

function isUploadType(value: string): value is UploadType {
  return ['character', 'model', 'worldMap'].includes(value);
}

const upload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
  fileFilter: (req, file, cb) => {
    const { type } = req.params;
    if (!type || !isUploadType(type)) {
      const error = new Error('Unsupported asset type.') as Error & { status?: number };
      error.status = 400;
      return cb(error);
    }

    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions[type].includes(ext)) {
      const error = new Error('Invalid file type.') as Error & { status?: number };
      error.status = 400;
      return cb(error);
    }

    cb(null, true);
  },
});

uploadRouter.post('/:type', upload.single('file'), async (req, res, next) => {
  try {
    const { type } = req.params;
    if (!type || !isUploadType(type)) {
      if (req.file) {
        await removeFile(req.file.filename);
      }
      return res.status(400).json({ message: 'Unsupported asset type.' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'File is required.' });
    }

    const asset = await prisma.asset.create({
      data: {
        type,
        originalName: file.originalname,
        filename: file.filename,
        mime: file.mimetype,
        size: file.size,
        url: getPublicUrl(file.filename),
      },
    });

    res.json({ asset });
  } catch (error) {
    next(error);
  }
});

export { uploadRouter };

