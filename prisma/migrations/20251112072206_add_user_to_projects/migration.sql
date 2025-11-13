-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "userId" TEXT,
    "characterId" TEXT,
    "modelId" TEXT,
    "worldMapId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_modelId_fkey" FOREIGN KEY ("modelId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_worldMapId_fkey" FOREIGN KEY ("worldMapId") REFERENCES "Asset" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Project" ("characterId", "createdAt", "id", "modelId", "name", "updatedAt", "worldMapId") SELECT "characterId", "createdAt", "id", "modelId", "name", "updatedAt", "worldMapId" FROM "Project";
DROP TABLE "Project";
ALTER TABLE "new_Project" RENAME TO "Project";
CREATE UNIQUE INDEX "Project_characterId_key" ON "Project"("characterId");
CREATE UNIQUE INDEX "Project_modelId_key" ON "Project"("modelId");
CREATE UNIQUE INDEX "Project_worldMapId_key" ON "Project"("worldMapId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
