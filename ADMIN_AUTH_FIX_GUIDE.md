# Admin Authentication — Fix Placement Guide

This zip contains your full project with the admin auth fixes applied. If you'd
rather merge by hand instead of replacing the whole project, here is exactly
what changed.

## 1. Critical fix — middleware wasn't running at all

**Moved:** `middleware.ts` (project root) → `src/middleware.ts`

Your project uses a `src/` directory (`src/app`), so Next.js only looks for
middleware at `src/middleware.ts`. A `middleware.ts` sitting at the project
root in a `src`-based project is **silently ignored** — no error, no warning,
it just never runs. That's why `/admin` opened straight into the dashboard:
the auth check that was supposed to gate it never executed on any request.

Delete the old root-level `middleware.ts` if you're merging manually, and add
the new `src/middleware.ts`. It also now explicitly allow-lists
`/admin/login`, `/admin/forgot-password`, and `/admin/reset-password` as the
only public admin paths — everything else under `/admin` requires a session.

## 2. New forgot/reset password flow

New files:
- `src/app/admin/forgot-password/page.tsx`
- `src/components/admin/ForgotPasswordForm.tsx`
- `src/app/admin/reset-password/[token]/page.tsx`
- `src/components/admin/ResetPasswordForm.tsx`

Changed:
- `src/lib/actions/auth.ts` — added `requestPasswordReset` and `resetPassword`
  server actions, plus a rewritten `loginAction` (see below).
- `src/lib/email.ts` — added `sendPasswordResetEmail`. Falls back to logging
  the reset link to the server console if `RESEND_API_KEY` isn't set, so the
  flow is fully testable before email is wired up.
- `src/components/admin/ForgotPasswordLink.tsx` — now a real link to
  `/admin/forgot-password` instead of a static tooltip.
- `prisma/schema.prisma` — new `PasswordResetToken` model + relation on `Admin`.
- `prisma/migrations/20260705120000_password_reset_tokens/migration.sql` — new
  migration for that table.

**You must run this on your database before deploying:**
```bash
npx prisma migrate deploy   # or `npx prisma migrate dev` locally
```
(Your `build` script already runs `prisma migrate deploy`, so a normal deploy
will pick this up automatically as long as `DATABASE_URL`/`DIRECT_URL` are set.)

## 3. Login page rebuilt as an interactive client form

New file: `src/components/admin/LoginForm.tsx`
Changed: `src/app/admin/login/page.tsx` (now just renders `<LoginForm />`)

Adds: show/hide password toggle, a disabled/"Signing in…" loading state on
submit, and inline friendly error messages — all without changing how the
underlying `signIn()` call works.

## 4. Nothing else changed for logout

Your existing `signOutAction` in `src/lib/actions/auth.ts` already redirected
safely to `/admin/login` in both the success and error paths — it wasn't
actually broken in the code, but with middleware now running, `/admin/login`
is guaranteed reachable, which is likely what was producing the blank/404
page before.

## 5. Environment variables to double-check

| Variable | Purpose |
|---|---|
| `AUTH_SECRET` | **Required.** Signs/encrypts the session JWT. Generate with `openssl rand -base64 32`. |
| `DATABASE_URL` / `DIRECT_URL` | Postgres connection (already in use). |
| `RESEND_API_KEY` | Optional — enables real password-reset emails. Without it, reset links are logged to the server console instead. |
| `NEXT_PUBLIC_SITE_URL` | Used to build the absolute reset-password link sent by email. |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | Optional overrides for the seeded default admin account (see report). |

## 6. Default admin login

See the audit report for the current default admin credentials and how to
change them — they come from `prisma/seed.ts` and are unrelated to this fix.

## 7. Defense-in-depth: every admin Server Action now checks its own session

New file: `src/lib/actions/require-admin.ts` — a shared `requireAdmin()`
helper that calls `auth()` and redirects to `/admin/login` if there's no
session.

Previously, all the create/update/delete Server Actions behind the admin
dashboard (blog, careers, director profile, enquiries, FAQs, job
applications, media, newsletter subscriber deletion, SEO settings, services,
site settings, testimonials) relied **entirely** on the page-level middleware
check — the mutations themselves had no independent auth check. Server
Actions are exposed as their own POST endpoints, so this is now hardened:
`await requireAdmin();` was added as the first line of every admin-only
action across these files:

```
src/lib/actions/blog.ts
src/lib/actions/careers.ts
src/lib/actions/director.ts
src/lib/actions/enquiries.ts
src/lib/actions/faq.ts
src/lib/actions/jobApplications.ts
src/lib/actions/media.ts
src/lib/actions/newsletter.ts   (only deleteSubscriber — subscribeToNewsletter
                                  stays public, it's the site's signup form)
src/lib/actions/seo.ts
src/lib/actions/services.ts
src/lib/actions/settings.ts
src/lib/actions/testimonials.ts
```

`src/app/api/upload/route.ts` already had its own `auth()` check independently
— no change was needed there.
