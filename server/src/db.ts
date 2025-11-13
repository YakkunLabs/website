import { config } from 'dotenv';
import { resolve } from 'path';
import { PrismaClient } from '@prisma/client';

// Ensure .env is loaded before Prisma client is instantiated
// Try root directory first (where Prisma schema is), then server directory
if (!process.env.DATABASE_URL) {
  config({ path: resolve(process.cwd(), '..', '.env') });
  config({ path: resolve(process.cwd(), '.env') });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;

