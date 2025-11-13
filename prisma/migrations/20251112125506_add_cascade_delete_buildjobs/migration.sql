-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_BuildJob" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'QUEUED',
    "logs" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "BuildJob_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_BuildJob" ("createdAt", "id", "logs", "projectId", "status", "updatedAt") SELECT "createdAt", "id", "logs", "projectId", "status", "updatedAt" FROM "BuildJob";
DROP TABLE "BuildJob";
ALTER TABLE "new_BuildJob" RENAME TO "BuildJob";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
