-- Fixes the Supabase security-linter alert: every table in the public
-- schema is auto-exposed via Supabase's PostgREST API by default, and none
-- of them had Row Level Security (RLS) enabled. This app never uses
-- Supabase's client SDK / PostgREST — it talks to Postgres directly via
-- Prisma using the table-owner role — so enabling RLS with zero policies
-- simply blocks the public REST API path while leaving Prisma's own access
-- completely unaffected (table owners always bypass RLS in Postgres,
-- regardless of policies).
--
-- ENABLE ROW LEVEL SECURITY is naturally idempotent — running it again on a
-- table that already has it enabled is a safe no-op.

ALTER TABLE "public"."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SiteSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Testimonial" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."DirectorProfile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."MediaAsset" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."BlogPost" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Faq" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Enquiry" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."JobListing" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."JobApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ApplicationDocument" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ApplicationStatusEvent" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ApplicationNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ReferenceCounter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Popup" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."NewsletterSubscriber" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."SeoSetting" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Announcement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."PasswordResetToken" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."EnquiryNote" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Service" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Notification" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ServiceApplication" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."ServiceDocumentRequirement" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AdminPermissionGrant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Newsletter" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."NewsletterRecipient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."EmailTemplate" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."AuditLog" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "public"."Admin" ENABLE ROW LEVEL SECURITY;
