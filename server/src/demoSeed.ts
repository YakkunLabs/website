import bcrypt from 'bcryptjs';

import prisma from './db.js';

export const DEMO_EMAIL = 'demo@gg.play';
export const DEMO_PASSWORD = 'demo123';

export async function ensureDemoCreator(): Promise<void> {
  if (process.env.SEED_DEMO_DATA === 'false') {
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email: DEMO_EMAIL },
  });

  if (existing) {
    return;
  }

  const hashed = await bcrypt.hash(DEMO_PASSWORD, 10);

  const subscriptionResetDate = new Date('2025-11-30T00:00:00.000Z');
  const nextBillingDate = new Date('2025-12-01T00:00:00.000Z');

  const user = await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      password: hashed,
      subscription: {
        create: {
          plan: 'INDIE',
          monthlyHours: 200,
          usedHours: 128,
          resetDate: subscriptionResetDate,
          nextBilling: nextBillingDate,
        },
      },
    },
  });

  await prisma.metaverse.createMany({
    data: [
      {
        userId: user.id,
        name: 'Ocean Explorers',
        kind: 'THREE_D',
        region: 'ASIA',
        status: 'RUNNING',
        playersOnline: 12,
        uptimeMinutes: 270,
        hoursUsed: 72,
        version: 'v1.0.0',
      },
      {
        userId: user.id,
        name: 'Skyline Demo',
        kind: 'THREE_D',
        status: 'STOPPED',
        region: 'EU',
        playersOnline: 0,
        uptimeMinutes: 0,
        hoursUsed: 0,
      },
      {
        userId: user.id,
        name: 'Tiny Fish',
        kind: 'TWO_D',
        status: 'ERROR',
        region: 'US',
        playersOnline: 0,
        uptimeMinutes: 0,
        hoursUsed: 0,
      },
    ],
  });
}

