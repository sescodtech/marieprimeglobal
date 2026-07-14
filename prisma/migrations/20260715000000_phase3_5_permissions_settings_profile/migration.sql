-- Idempotent (IF NOT EXISTS / DO $$ EXCEPTION) — see 20260712000000 for why.

-- AlterTable: Admin — profile fields
ALTER TABLE "Admin"
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "avatarUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "recoveryEmail" TEXT;

-- CreateTable: AdminPermissionGrant
CREATE TABLE IF NOT EXISTS "AdminPermissionGrant" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "permission" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminPermissionGrant_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  CREATE UNIQUE INDEX "AdminPermissionGrant_adminId_permission_key" ON "AdminPermissionGrant"("adminId", "permission");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "AdminPermissionGrant_adminId_idx" ON "AdminPermissionGrant"("adminId");

DO $$ BEGIN
  ALTER TABLE "AdminPermissionGrant" ADD CONSTRAINT "AdminPermissionGrant_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: SubscriberStatus
DO $$ BEGIN
  CREATE TYPE "SubscriberStatus" AS ENUM ('SUBSCRIBED', 'UNSUBSCRIBED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: NewsletterSubscriber — name/status/unsubscribedAt
ALTER TABLE "NewsletterSubscriber"
  ADD COLUMN IF NOT EXISTS "name" TEXT,
  ADD COLUMN IF NOT EXISTS "unsubscribedAt" TIMESTAMP(3);

DO $$ BEGIN
  ALTER TABLE "NewsletterSubscriber" ADD COLUMN "status" "SubscriberStatus" NOT NULL DEFAULT 'SUBSCRIBED';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- CreateEnum: NewsletterStatus
DO $$ BEGIN
  CREATE TYPE "NewsletterStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'SENDING', 'SENT', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: Newsletter
CREATE TABLE IF NOT EXISTS "Newsletter" (
    "id" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" "NewsletterStatus" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "recipientCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateEnum: NewsletterRecipientStatus
DO $$ BEGIN
  CREATE TYPE "NewsletterRecipientStatus" AS ENUM ('PENDING', 'SENT', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: NewsletterRecipient
CREATE TABLE IF NOT EXISTS "NewsletterRecipient" (
    "id" TEXT NOT NULL,
    "newsletterId" TEXT NOT NULL,
    "subscriberId" TEXT NOT NULL,
    "status" "NewsletterRecipientStatus" NOT NULL DEFAULT 'PENDING',
    "sentAt" TIMESTAMP(3),
    "error" TEXT,

    CONSTRAINT "NewsletterRecipient_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  CREATE UNIQUE INDEX "NewsletterRecipient_newsletterId_subscriberId_key" ON "NewsletterRecipient"("newsletterId", "subscriberId");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "NewsletterRecipient_newsletterId_idx" ON "NewsletterRecipient"("newsletterId");

DO $$ BEGIN
  ALTER TABLE "NewsletterRecipient" ADD CONSTRAINT "NewsletterRecipient_newsletterId_fkey" FOREIGN KEY ("newsletterId") REFERENCES "Newsletter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "NewsletterRecipient" ADD CONSTRAINT "NewsletterRecipient_subscriberId_fkey" FOREIGN KEY ("subscriberId") REFERENCES "NewsletterSubscriber"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: EmailTemplate
CREATE TABLE IF NOT EXISTS "EmailTemplate" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "bodyHtml" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

DO $$ BEGIN
  CREATE UNIQUE INDEX "EmailTemplate_key_key" ON "EmailTemplate"("key");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- Data migration: grant every existing ADMIN/STAFF account the permissions
-- their role currently implies, so nobody loses access the moment this
-- deploys. Super Admin needs no grants (bypasses the grant table entirely).
-- Uses ON CONFLICT DO NOTHING (backed by the unique index above) so this is
-- safe to re-run.
INSERT INTO "AdminPermissionGrant" ("id", "adminId", "permission")
SELECT gen_random_uuid()::text, "id", perm
FROM "Admin", unnest(ARRAY[
  'MANAGE_BLOG','MANAGE_TESTIMONIALS','MANAGE_FAQS','MANAGE_CAREERS','MANAGE_ENQUIRIES',
  'VIEW_APPLICATIONS','REVIEW_APPLICATIONS','ASSIGN_STAFF','APPROVE_APPLICATIONS','REJECT_APPLICATIONS',
  'REQUEST_ADDITIONAL_DOCUMENTS','DOWNLOAD_DOCUMENTS','EXPORT_APPLICATIONS',
  'VIEW_ENQUIRIES','REPLY_TO_ENQUIRIES','CLOSE_ENQUIRIES',
  'VIEW_ANALYTICS','VIEW_REPORTS','EXPORT_REPORTS','MANAGE_STAFF',
  'CREATE_STAFF','EDIT_USERS',
  'CREATE_NEWSLETTER','SEND_NEWSLETTER','MANAGE_SUBSCRIBERS',
  'UPLOAD_IMAGES','DELETE_IMAGES'
]) AS perm
WHERE "Admin"."role" = 'ADMIN'
ON CONFLICT ("adminId", "permission") DO NOTHING;

INSERT INTO "AdminPermissionGrant" ("id", "adminId", "permission")
SELECT gen_random_uuid()::text, "id", perm
FROM "Admin", unnest(ARRAY[
  'VIEW_ASSIGNED_APPLICATIONS','DOWNLOAD_DOCUMENTS'
]) AS perm
WHERE "Admin"."role" = 'STAFF'
ON CONFLICT ("adminId", "permission") DO NOTHING;
