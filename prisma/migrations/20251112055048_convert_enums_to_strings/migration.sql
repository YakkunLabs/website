-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Metaverse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL DEFAULT 'THREE_D',
    "region" TEXT NOT NULL DEFAULT 'ASIA',
    "status" TEXT NOT NULL DEFAULT 'STOPPED',
    "playersOnline" INTEGER NOT NULL DEFAULT 0,
    "uptimeMinutes" INTEGER NOT NULL DEFAULT 0,
    "hoursUsed" INTEGER NOT NULL DEFAULT 0,
    "version" TEXT NOT NULL DEFAULT 'v1.0.0',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "thumbnail" TEXT,
    CONSTRAINT "Metaverse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Metaverse" ("createdAt", "hoursUsed", "id", "kind", "name", "playersOnline", "region", "status", "thumbnail", "updatedAt", "uptimeMinutes", "userId", "version") SELECT "createdAt", "hoursUsed", "id", "kind", "name", "playersOnline", "region", "status", "thumbnail", "updatedAt", "uptimeMinutes", "userId", "version" FROM "Metaverse";
DROP TABLE "Metaverse";
ALTER TABLE "new_Metaverse" RENAME TO "Metaverse";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
