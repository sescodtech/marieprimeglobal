-- AlterEnum
-- Postgres has no direct "drop enum value" — recreate the type without it,
-- matching what `prisma migrate dev` generates for enum value removal.
BEGIN;
CREATE TYPE "ServiceInterest_new" AS ENUM ('FLIGHT_BOOKING', 'VISA_IMMIGRATION', 'TRAVEL_LOAN', 'STUDY_ABROAD', 'BUSINESS_REGISTRATION', 'GENERAL_ENQUIRY');
ALTER TABLE "Enquiry" ALTER COLUMN "serviceInterest" DROP DEFAULT;
ALTER TABLE "Enquiry" ALTER COLUMN "serviceInterest" TYPE "ServiceInterest_new" USING ("serviceInterest"::text::"ServiceInterest_new");
ALTER TYPE "ServiceInterest" RENAME TO "ServiceInterest_old";
ALTER TYPE "ServiceInterest_new" RENAME TO "ServiceInterest";
DROP TYPE "ServiceInterest_old";
ALTER TABLE "Enquiry" ALTER COLUMN "serviceInterest" SET DEFAULT 'GENERAL_ENQUIRY';
COMMIT;

-- AlterTable
ALTER TABLE "Service" ADD COLUMN "tagline" TEXT;
ALTER TABLE "Service" ADD COLUMN "benefits" JSONB;
ALTER TABLE "Service" ADD COLUMN "process" JSONB;
ALTER TABLE "Service" ADD COLUMN "faqs" JSONB;

-- CreateTable
CREATE TABLE "BlogPost" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT,
    "readTime" TEXT NOT NULL,
    "publishedLabel" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BlogPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "JobListing" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobListing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlogPost_slug_key" ON "BlogPost"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "JobListing_slug_key" ON "JobListing"("slug");
