import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from root directory (where Prisma schema is)
config({ path: resolve(process.cwd(), '..', '.env') });
// Also try loading from server directory as fallback
config({ path: resolve(process.cwd(), '.env') });

import cors from 'cors';
import express, { type NextFunction, type Request, type Response } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { MulterError } from 'multer';

import { ensureDemoCreator } from './demoSeed.js';
import { assetsRouter } from './routes/assets.js';
import { buildRouter } from './routes/build.js';
import { authRouter } from './routes/authRoutes.js';
import { metaverseRouter } from './routes/metaverseRoutes.js';
import { projectRouter } from './routes/project.js';
import { subscriptionRouter } from './routes/subscriptionRoutes.js';
import { uploadRouter } from './routes/upload.js';
import { ensureUploadDir, getUploadDir } from './services/storage.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

const defaultOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  'http://127.0.0.1:5176',
];

const clientOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((origin) => origin.trim())
  : defaultOrigins;

ensureUploadDir().catch((error) => {
  console.error('Unable to create upload directory', error);
  process.exit(1);
});

ensureDemoCreator().catch((error) => {
  console.error('Failed to provision demo creator', error);
});

app.use(
  cors({
    origin: clientOrigins,
  }),
);
app.use(helmet());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

const uploadLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
});

const buildLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(
  '/uploads',
  express.static(getUploadDir(), {
    maxAge: '1d',
  }),
);

app.use('/api/upload', uploadLimiter, uploadRouter);
app.use('/api/assets', assetsRouter);
app.use('/api/project', projectRouter);
app.use('/api/build', buildLimiter, buildRouter);
app.use('/api/auth', authRouter);
app.use('/api/metaverses', metaverseRouter);
app.use('/api/subscription', subscriptionRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof MulterError) {
    return res.status(400).json({ message: err.message });
  }

  if (err instanceof Error) {
    const status = (err as Error & { status?: number }).status ?? 500;
    return res.status(status).json({ message: err.message });
  }

  return res.status(500).json({ message: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

