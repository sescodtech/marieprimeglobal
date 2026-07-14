-- Idempotent (IF NOT EXISTS / DO $$ EXCEPTION) — see 20260712000000 for why.

-- AlterTable: ServiceApplication — secure re-upload token
ALTER TABLE "ServiceApplication"
  ADD COLUMN IF NOT EXISTS "uploadToken" TEXT,
  ADD COLUMN IF NOT EXISTS "uploadTokenExpiresAt" TIMESTAMP(3);

-- CreateIndex
DO $$ BEGIN
  CREATE UNIQUE INDEX "ServiceApplication_uploadToken_key" ON "ServiceApplication"("uploadToken");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

-- AddUniqueConstraint: ApplicationDocument — one row per (application, docType),
-- so a re-upload can update the existing document instead of creating a
-- duplicate. Safe for existing data: each application was only ever
-- submitted once before this feature existed, so no duplicates can exist yet.
DO $$ BEGIN
  ALTER TABLE "ApplicationDocument" ADD CONSTRAINT "ApplicationDocument_applicationId_docType_key" UNIQUE ("applicationId", "docType");
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- CreateTable: ServiceDocumentRequirement
CREATE TABLE IF NOT EXISTS "ServiceDocumentRequirement" (
    "id" TEXT NOT NULL,
    "serviceType" "ServiceApplicationType" NOT NULL,
    "docKey" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isRequired" BOOLEAN NOT NULL DEFAULT true,
    "fileTypes" TEXT NOT NULL DEFAULT 'image/jpeg,image/png,application/pdf',
    "maxSizeMb" INTEGER NOT NULL DEFAULT 8,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceDocumentRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
DO $$ BEGIN
  CREATE UNIQUE INDEX "ServiceDocumentRequirement_serviceType_docKey_key" ON "ServiceDocumentRequirement"("serviceType", "docKey");
EXCEPTION
  WHEN duplicate_table THEN null;
END $$;

CREATE INDEX IF NOT EXISTS "ServiceDocumentRequirement_serviceType_idx" ON "ServiceDocumentRequirement"("serviceType");
