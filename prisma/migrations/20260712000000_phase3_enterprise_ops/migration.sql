-- NOTE: written idempotently (IF NOT EXISTS / DO $$ EXCEPTION guards)
-- following the same pattern used to fix 20260710000000_rbac_users_audit_log
-- after a prior deploy through the connection pooler partially applied a
-- migration before failing. Safe to re-run.

-- AlterTable: Notification — in-app read state + click-through link
ALTER TABLE "Notification"
  ADD COLUMN IF NOT EXISTS "link" TEXT,
  ADD COLUMN IF NOT EXISTS "isRead" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "readAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Notification_recipientAdminId_isRead_idx" ON "Notification"("recipientAdminId", "isRead");

-- AlterEnum: EnquiryStatus — rename to match the Phase 3 spec's wording.
-- Existing rows keep their meaning: IN_PROGRESS (being worked) -> CONTACTED,
-- RESPONDED (got a reply) -> CONVERTED.
-- Guarded because RENAME VALUE errors (rather than no-ops) if the source
-- value is already gone from a prior partial run.
DO $$ BEGIN
  ALTER TYPE "EnquiryStatus" RENAME VALUE 'IN_PROGRESS' TO 'CONTACTED';
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "EnquiryStatus" RENAME VALUE 'RESPONDED' TO 'CONVERTED';
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

-- AlterTable: Enquiry — subject line + staff assignment
ALTER TABLE "Enquiry"
  ADD COLUMN IF NOT EXISTS "subject" TEXT,
  ADD COLUMN IF NOT EXISTS "assignedStaffId" TEXT;

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "Enquiry" ADD CONSTRAINT "Enquiry_assignedStaffId_fkey" FOREIGN KEY ("assignedStaffId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: EnquiryNote — internal notes history (adminNote on Enquiry stays as legacy single-note data)
CREATE TABLE IF NOT EXISTS "EnquiryNote" (
    "id" TEXT NOT NULL,
    "enquiryId" TEXT NOT NULL,
    "authorId" TEXT,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EnquiryNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX IF NOT EXISTS "EnquiryNote_enquiryId_idx" ON "EnquiryNote"("enquiryId");

-- AddForeignKey
DO $$ BEGIN
  ALTER TABLE "EnquiryNote" ADD CONSTRAINT "EnquiryNote_enquiryId_fkey" FOREIGN KEY ("enquiryId") REFERENCES "Enquiry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "EnquiryNote" ADD CONSTRAINT "EnquiryNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: Service Application Settings (Super Admin only, per Phase 3)
DO $$ BEGIN
  CREATE TYPE "ServiceApplicationMode" AS ENUM ('ONLINE_APPLICATION', 'ENQUIRY_ONLY');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: Service — application mode, requirements, processing time, banner, archive
ALTER TABLE "Service"
  ADD COLUMN IF NOT EXISTS "requirements" JSONB,
  ADD COLUMN IF NOT EXISTS "processingTime" TEXT,
  ADD COLUMN IF NOT EXISTS "bannerUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "isArchived" BOOLEAN NOT NULL DEFAULT false;

-- applicationMode needs the enum type to exist first (see above); added
-- separately since a plain "IF NOT EXISTS" column add can't be combined this
-- way with a typed enum default in one clause reliably across reruns.
DO $$ BEGIN
  ALTER TABLE "Service" ADD COLUMN "applicationMode" "ServiceApplicationMode" NOT NULL DEFAULT 'ONLINE_APPLICATION';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;
