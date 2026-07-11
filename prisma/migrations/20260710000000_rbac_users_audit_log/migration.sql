-- NOTE: the AdminRole enum changes (EDITOR -> ADMIN rename, STAFF add) were
-- moved to migration 20260709235959_add_rbac_enum_values so they commit in
-- their own transaction before 'STAFF' is used below as a column default.

-- CreateEnum
CREATE TYPE "AdminStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'SYSTEM', 'SMS', 'WHATSAPP');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');

-- AlterTable
ALTER TABLE "Admin"
  ADD COLUMN "status" "AdminStatus" NOT NULL DEFAULT 'ACTIVE',
  ADD COLUMN "canManageAdmins" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "suspendedAt" TIMESTAMP(3),
  ADD COLUMN "createdById" TEXT;

-- AlterTable
-- Existing rows keep whatever role they already had (SUPER_ADMIN, or the
-- newly-renamed ADMIN); only the column default changes for future inserts.
ALTER TABLE "Admin" ALTER COLUMN "role" SET DEFAULT 'STAFF';

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "AuditLog" (
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
CREATE INDEX "AuditLog_actorId_idx" ON "AuditLog"("actorId");

-- CreateIndex
CREATE INDEX "AuditLog_createdAt_idx" ON "AuditLog"("createdAt");

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Notification" (
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
CREATE INDEX "Notification_recipientAdminId_idx" ON "Notification"("recipientAdminId");

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientAdminId_fkey" FOREIGN KEY ("recipientAdminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
