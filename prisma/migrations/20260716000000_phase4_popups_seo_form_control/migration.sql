-- Idempotent (IF NOT EXISTS / DO $$ EXCEPTION) — see 20260712000000 for why.

-- AlterEnum: ServiceApplicationMode — rename + add new modes.
-- Rename first (safe same-transaction), then add (not used elsewhere in
-- this same migration, so also safe same-transaction).
DO $$ BEGIN
  ALTER TYPE "ServiceApplicationMode" RENAME VALUE 'ONLINE_APPLICATION' TO 'APPLY_ONLY';
EXCEPTION
  WHEN undefined_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationMode" ADD VALUE 'APPLY_AND_ENQUIRY';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationMode" ADD VALUE 'HIDDEN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateEnum: ServiceStatus, ApplyRedirectTarget
DO $$ BEGIN
  CREATE TYPE "ServiceStatus" AS ENUM ('ACTIVE', 'CLOSED', 'MAINTENANCE', 'COMING_SOON');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "ApplyRedirectTarget" AS ENUM ('CONTACT', 'ENQUIRY', 'SERVICE_DETAILS', 'CUSTOM');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- AlterTable: Service — Website Form Control Center fields
ALTER TABLE "Service"
  ADD COLUMN IF NOT EXISTS "showApplyButton" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "showEnquiryButton" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "applyRedirectUrl" TEXT;

DO $$ BEGIN
  ALTER TABLE "Service" ADD COLUMN "status" "ServiceStatus" NOT NULL DEFAULT 'ACTIVE';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

DO $$ BEGIN
  ALTER TABLE "Service" ADD COLUMN "applyRedirect" "ApplyRedirectTarget" NOT NULL DEFAULT 'SERVICE_DETAILS';
EXCEPTION
  WHEN duplicate_column THEN null;
END $$;

-- AlterTable: SeoSetting — per-page canonical/social/index-follow
ALTER TABLE "SeoSetting"
  ADD COLUMN IF NOT EXISTS "canonicalUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "twitterImageUrl" TEXT,
  ADD COLUMN IF NOT EXISTS "noIndex" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "noFollow" BOOLEAN NOT NULL DEFAULT false;

-- CreateEnum: Popup
DO $$ BEGIN
  CREATE TYPE "PopupType" AS ENUM ('PROMOTION', 'NEWSLETTER', 'TRAVEL_UPDATE', 'VISA_UPDATE', 'HOLIDAY_NOTICE', 'INFORMATION', 'GENERAL_ANNOUNCEMENT');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PopupDisplayRule" AS ENUM ('ENTIRE_WEBSITE', 'HOMEPAGE_ONLY', 'SPECIFIC_PAGE', 'SPECIFIC_SERVICE', 'SPECIFIC_BLOG');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE "PopupTriggerRule" AS ENUM ('AFTER_SECONDS', 'AFTER_SCROLL_PERCENT', 'EXIT_INTENT', 'FIRST_VISIT', 'ONCE_PER_SESSION', 'ALWAYS');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: Popup
CREATE TABLE IF NOT EXISTS "Popup" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "imageUrl" TEXT,
    "bgColor" TEXT NOT NULL DEFAULT '#0B0F1A',
    "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "popupType" "PopupType" NOT NULL DEFAULT 'GENERAL_ANNOUNCEMENT',
    "displayRule" "PopupDisplayRule" NOT NULL DEFAULT 'ENTIRE_WEBSITE',
    "displayTarget" TEXT,
    "triggerRule" "PopupTriggerRule" NOT NULL DEFAULT 'AFTER_SECONDS',
    "triggerValue" INTEGER NOT NULL DEFAULT 5,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "closes" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Popup_pkey" PRIMARY KEY ("id")
);

-- CreateEnum: Announcement
DO $$ BEGIN
  CREATE TYPE "AnnouncementDisplayRule" AS ENUM ('ENTIRE_WEBSITE', 'HOMEPAGE', 'SELECTED_PAGES');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: Announcement
CREATE TABLE IF NOT EXISTS "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "icon" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "bgColor" TEXT NOT NULL DEFAULT '#1B4332',
    "textColor" TEXT NOT NULL DEFAULT '#FFFFFF',
    "priority" INTEGER NOT NULL DEFAULT 0,
    "isEnabled" BOOLEAN NOT NULL DEFAULT true,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "displayRule" "AnnouncementDisplayRule" NOT NULL DEFAULT 'ENTIRE_WEBSITE',
    "selectedPages" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "Announcement_isEnabled_isArchived_idx" ON "Announcement"("isEnabled", "isArchived");

-- AlterTable: Notification — category, for the Notification Center's filter feature
ALTER TABLE "Notification"
  ADD COLUMN IF NOT EXISTS "category" TEXT NOT NULL DEFAULT 'SYSTEM';

CREATE INDEX IF NOT EXISTS "Notification_recipientAdminId_category_idx" ON "Notification"("recipientAdminId", "category");
