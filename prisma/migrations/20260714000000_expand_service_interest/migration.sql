-- New enum values must be committed in their own migration before they can
-- be referenced anywhere else — same Postgres rule that required splitting
-- 20260709235959_add_rbac_enum_values out on its own. Guarded with DO $$
-- blocks so this is safe to re-run if a deploy partially applies it.

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'HOTEL_RESERVATION';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'TRAVEL_INSURANCE';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'LOGISTICS';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'PROCUREMENT';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'EVENT_COORDINATION';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  ALTER TYPE "ServiceInterest" ADD VALUE 'BEAUTY_SERVICES';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;
