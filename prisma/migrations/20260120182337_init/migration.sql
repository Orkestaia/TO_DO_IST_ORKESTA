-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 1,
    "primaryColor" TEXT NOT NULL DEFAULT '#814AC8',
    "accentColor" TEXT NOT NULL DEFAULT '#23475B',
    "darkMode" BOOLEAN NOT NULL DEFAULT true,
    "gamification" BOOLEAN NOT NULL DEFAULT true,
    "soundEnabled" BOOLEAN NOT NULL DEFAULT false,
    "tasksPerDay" INTEGER NOT NULL DEFAULT 3,
    "deepWorkPerDay" INTEGER NOT NULL DEFAULT 1,
    "p1PerWeek" INTEGER NOT NULL DEFAULT 5,
    "globalWipLimit" INTEGER NOT NULL DEFAULT 5
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "icon" TEXT,
    "color" TEXT,
    "wipLimit" INTEGER,
    "archived" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Project_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'backlog',
    "priority" TEXT NOT NULL DEFAULT 'P4',
    "projectId" TEXT,
    "labels" TEXT,
    "dueDate" DATETIME,
    "estimateMinutes" INTEGER,
    "audioTranscript" TEXT,
    "source" TEXT NOT NULL DEFAULT 'manual',
    "energyLabel" TEXT,
    "contextLabel" TEXT,
    "timezoneLabel" TEXT,
    "completedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
