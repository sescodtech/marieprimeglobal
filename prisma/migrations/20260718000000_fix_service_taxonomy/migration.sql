-- Fixes the service-taxonomy mismatch: the application-form config and the
-- enquiry-category config were both built against LOGISTICS / PROCUREMENT /
-- EVENT_COORDINATION / BEAUTY_SERVICES — boilerplate from a different
-- template that MariePrime Global never actually offered. This adds enum
-- values for the 11 real services (from src/lib/servicePages.ts) so every
-- service can finally have a working Apply form and enquiry category.
--
-- The old boilerplate values are intentionally NOT dropped here. Postgres
-- has no DROP VALUE for enums — removing them safely requires recreating
-- the type and rewriting every dependent column, which is unnecessary risk
-- for values the app no longer writes. They're left in place, unused, and
-- marked deprecated in schema.prisma.
--
-- Idempotent (DO $$ ... EXCEPTION) — see 20260712000000 and
-- 20260714000000 for why this pattern is required here.

-- ServiceApplicationType — used by ServiceApplication.serviceType and
-- ServiceDocumentRequirement.serviceType.
DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'STUDY_ABROAD';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'TRAVEL_PACKAGES';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'SCHOLARSHIP_ASSISTANCE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'TRAVEL_LOANS';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'EDUCATION_LOANS';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'CORPORATE_TRAVEL';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceApplicationType" ADD VALUE 'BUSINESS_REGISTRATION';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ServiceInterest — used by Enquiry.serviceInterest.
DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'TRAVEL_PACKAGES';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'SCHOLARSHIP_ASSISTANCE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'EDUCATION_LOAN';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'CORPORATE_TRAVEL';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
