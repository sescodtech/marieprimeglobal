-- NOTE: the AdminRole enum changes (EDITOR -> ADMIN rename, STAFF add) were
-- moved to migration 20260709235959_add_rbac_enum_values so they commit in
-- their own transaction before 'STAFF' is used below as a column default.
--
-- NOTE: this migration is written to be idempotent (safe to re-run) because
-- a previous deploy attempt partially applied it before failing, leaving
-- some objects (e.g. the AdminStatus enum) already present in the DB.

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SYSTEM', 'SMS', 'WHATSAPP');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
  CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "Admin"
  ADD COLUMN IF NOT EXISTS "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN IF NOT EXISTS "canManageAdmins" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "suspendedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "createdById" TEXT;

-- AlterTable
-- Existing rows keep whatever role they already had (SUPER_ADMIN, or the
-- newly-renamed ADMIN); only the column default changes for future inserts.
ALTER TABLE "Admin" ALTER COLUMN "role" SET DEFAULT 'STAFF';

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "actorName" TEXT NOT NULL,
    "actorEmail" TEXT NOT NULL,
    "actorRole" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT,
    "entityId" TEXT,
    "description" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "Notification" (
    "id" TEXT NOT NULL,
    "recipientAdminId" TEXT,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'SYSTEM',
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Notification_recipientAdminId_idx" ON "Notification"("recipientAdminId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientAdminId_fkey" FOREIGN KEY ("recipientAdminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
