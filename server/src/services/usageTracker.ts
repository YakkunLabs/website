import prisma from '../db.js';

// In-memory map to track running instances and their intervals
const trackingIntervals = new Map<string, NodeJS.Timeout>();

export function startTracking(metaverseId: string): void {
  // Clear any existing interval for this metaverse
  stopTracking(metaverseId);

  const interval = setInterval(async () => {
    try {
      const metaverse = await prisma.metaverse.findUnique({
        where: { id: metaverseId },
      });

      if (!metaverse || metaverse.status !== 'RUNNING') {
        stopTracking(metaverseId);
        return;
      }

      // Increment uptime by 1 minute
      // Add player hours: playersOnline / 60 (since we're tracking per minute)
      // Since hoursUsed is Int, we accumulate fractional hours and increment when >= 1
      const playerHoursThisMinute = metaverse.playersOnline / 60;
      
      // Track fractional hours in memory, update DB when we accumulate >= 1 hour
      // For simplicity, we'll increment by 1 hour for every 60 player-minutes
      // In a real system, you'd want to track fractional hours more precisely
      const hoursToAdd = Math.floor(playerHoursThisMinute);
      
      await prisma.metaverse.update({
        where: { id: metaverseId },
        data: {
          uptimeMinutes: { increment: 1 },
          // Increment hoursUsed by the whole number of player-hours
          // (e.g., 60 players = 1 hour, 120 players = 2 hours, etc.)
          ...(hoursToAdd > 0 ? { hoursUsed: { increment: hoursToAdd } } : {}),
        },
      });
    } catch (error) {
      console.error(`Error tracking usage for metaverse ${metaverseId}:`, error);
      stopTracking(metaverseId);
    }
  }, 60000); // Every minute

  trackingIntervals.set(metaverseId, interval);
}

export function stopTracking(metaverseId: string): void {
  const interval = trackingIntervals.get(metaverseId);
  if (interval) {
    clearInterval(interval);
    trackingIntervals.delete(metaverseId);
  }
}

export function isTracking(metaverseId: string): boolean {
  return trackingIntervals.has(metaverseId);
}

