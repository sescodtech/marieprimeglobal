-- AlterEnum
-- Renaming EDITOR -> ADMIN preserves the existing account's data (any admin
-- row currently stored as EDITOR becomes ADMIN with no manual backfill).
-- These enum changes must be committed in their own migration/transaction
-- before the new value 'STAFF' can be referenced anywhere else (Postgres
-- rule: a new enum value cannot be used in the same transaction that adds it).
ALTER TYPE "AdminRole" RENAME VALUE 'EDITOR' TO 'ADMIN';
ALTER TYPE "AdminRole" ADD VALUE 'STAFF';
