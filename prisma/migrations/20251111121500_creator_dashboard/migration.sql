-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Metaverse" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
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

-- CreateTable
CREATE TABLE "Subscription" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'INDIE',
    "monthlyHours" INTEGER NOT NULL DEFAULT 200,
    "usedHours" INTEGER NOT NULL DEFAULT 0,
    "resetDate" DATETIME NOT NULL,
    "nextBilling" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_key" ON "Subscription"("userId");

