import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const DEFAULT_UPLOAD_DIR = './uploads';

export function getUploadDir() {
  return path.resolve(process.cwd(), process.env.UPLOAD_DIR ?? DEFAULT_UPLOAD_DIR);
}

export async function ensureUploadDir() {
  await fs.promises.mkdir(getUploadDir(), { recursive: true });
}

export function generateFilename(originalName: string) {
  const ext = path.extname(originalName);
  const safeExt = ext || '';
  const id = crypto.randomUUID();
  return `${id}${safeExt}`;
}

export function getPublicUrl(filename: string) {
  return `/uploads/${filename}`;
}

export async function removeFile(filename: string) {
  const target = path.join(getUploadDir(), filename);
  try {
    await fs.promises.unlink(target);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

