# MariePrime Global Services — Platform

Premium corporate website + CMS + admin platform for MariePrime Global Services Ltd.

Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion,
Prisma, NextAuth v5, and Cloudinary.

## What's included (Phases 1–3)

**Public site** — Home, About, Services, Contact. Fully responsive and animated.
Content is now CMS-driven where it matters most:

- Homepage hero copy, services, testimonials, director profile, contact
  details and social links are all pulled live from the database.
- Mission/Vision/Values and the "Why Choose" / trust-stat blocks remain static
  in `src/lib/data.ts` for this phase — flag it if you'd like those made
  editable too, it's a small extension of the same pattern.

**Admin dashboard** at `/admin` (protected by NextAuth):

| Screen | What it does |
|---|---|
| Overview | Quick counts + recent enquiries |
| Services | Full CRUD, publish/draft toggle, reorder |
| Testimonials | Full CRUD, publish/draft toggle, star rating |
| Director Profile | Name, position, biography, and **photo upload straight to Cloudinary** |
| Media Library | Upload/browse/delete images on Cloudinary, copy URL into any field |
| Enquiries | Every contact form submission, filterable by status, with an internal note field |
| SEO Settings | Per-page meta title/description/keywords/OG image for Home, About, Services, Contact |
| Site Settings | Contact info, social links, homepage hero copy |

## Fastest path to live (no local setup required)

You don't need to run this on your machine first. Here's the direct route:

**1. Get a database (2 min)**
Create a free Postgres project on [Supabase](https://supabase.com) or
[Neon](https://neon.tech). Copy the connection string — that's `DATABASE_URL`.

**2. Get Cloudinary keys (1 min)**
From your Cloudinary dashboard: Cloud Name, API Key, API Secret.

**3. Get a Resend key (2 min)**
[resend.com](https://resend.com) → API Keys → create one. This powers the
"new enquiry" email notification — the site works without it too.

**4. Push this folder to GitHub**
Upload this project as a new GitHub repository (via GitHub's web uploader, or
GitHub Desktop if you prefer not to use a terminal at all — either works,
no `npm install` needed on your machine either way).

**5. Import into Vercel**
[vercel.com](https://vercel.com) → New Project → import the GitHub repo →
before deploying, add these Environment Variables:

| Variable | Value |
|---|---|
| `DATABASE_URL` | from step 1 |
| `NEXTAUTH_URL` | `https://yourdomain.com` (or the `.vercel.app` URL for now) |
| `NEXTAUTH_SECRET` | any long random string — e.g. mash the keyboard for 40 characters |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | from step 2 |
| `RESEND_API_KEY` | from step 3 |
| `NOTIFY_EMAIL_TO` | `mariaiyabi@gmail.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `2347069660521` |
| `SEED_ADMIN_EMAIL` | `mariaiyabi@gmail.com` |
| `SEED_ADMIN_PASSWORD` | pick a temporary password |
| `SETUP_SECRET` | any long random string |

Click **Deploy**. The build automatically runs `prisma generate` and
`prisma migrate deploy`, so the database tables are created during the
build — no local migration step.

**6. Seed the database — one URL, no terminal**
Once deployed, visit this in your browser (swap in your domain and secret):

```
https://yourdomain.com/api/setup?secret=YOUR_SETUP_SECRET
```

This creates the admin login and loads the six services, testimonials,
director profile, contact info and SEO defaults. You'll see a JSON response
confirming what was created. **Then delete the `SETUP_SECRET` env var in
Vercel** (Settings → Environment Variables → remove it, redeploy) — this
locks the endpoint so it can't be run again by anyone who finds the URL.

**7. Log in**
Go to `https://yourdomain.com/admin/login`, sign in with `SEED_ADMIN_EMAIL` /
`SEED_ADMIN_PASSWORD`, then immediately go to **Account** and set a real
password.

**8. Point your domain at it**
Vercel → your project → Settings → Domains → add `yourdomain.com`. Vercel
shows you a DNS record to add at wherever the domain is registered
(Namecheap, GoDaddy, etc.). Add it there — SSL is issued automatically once
DNS resolves, usually within minutes to a couple of hours.

That's it — live site, live admin dashboard, real data, no local dev server
ever needed.

## Local development (optional, if you want it later)

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```


## Uploading the director's portrait

Once Maria's AI-generated professional portrait is ready:

1. Log into `/admin`
2. Go to **Director Profile**
3. Click **Upload photo** — it uploads directly to Cloudinary and shows a live preview
4. Click **Save changes**

The About page picks it up immediately (no redeploy needed).

## Real company data already in place

- Director: Maria Karinate Iyabi
- Email: mariaiyabi@gmail.com
- Phone / WhatsApp: +2347069660521
- Address: House 12, 71 Road A Close, Festac Town, Lagos, Lagos State, Nigeria

All editable from **Admin → Site Settings** and **Admin → Director Profile**
without touching code. Social media links are still placeholders — update
them in Site Settings once the real profiles are ready.

## Phase 4 — Enquiry pipeline (complete)

- Every contact form submission is saved to the `Enquiry` table and shows up
  instantly in **Admin → Enquiries** (list, status filter, detail view, status
  tracking NEW → IN_PROGRESS → RESPONDED → CLOSED, internal notes).
- New enquiries now also trigger an email notification via Resend to
  `NOTIFY_EMAIL_TO` (defaults to Maria's email) with a direct link into the
  admin dashboard. Set `RESEND_API_KEY` in `.env` to enable this — if it's
  unset, enquiries still save normally, the email is just skipped.

## Phase 5 — SEO (complete)

- `sitemap.xml` — auto-generated from the four public routes (`src/app/sitemap.ts`)
- `robots.txt` — allows all crawlers, disallows `/admin/` and `/api/` (`src/app/robots.ts`)
- JSON-LD schema markup:
  - `TravelAgency` organization schema on every page (root layout)
  - `ItemList`/`Service` schema on the Services page
  - `ContactPage` schema on the Contact page
- Dynamic Open Graph image (`src/app/opengraph-image.tsx`) — brand-styled,
  generated on request. Any page can override it by setting an OG image URL
  in **Admin → SEO Settings**.
- Per-page meta title/description/keywords already editable in **Admin → SEO Settings**
  (from Phase 3), now actually wired into each page's `generateMetadata()`.

### Go-live steps

See **"Fastest path to live"** near the top of this file for the full
deploy walkthrough (GitHub → Vercel → `/api/setup` → domain). After that's
done:

- Submit `https://yourdomain.com/sitemap.xml` in Google Search Console.
- Upload Maria's professional portrait via **Admin → Director Profile**.

## Notes

- No "Proof of Funds" service is exposed publicly, per brief.
- No video sections, per brief.
- The contact form (`/contact`) already writes to the `Enquiry` table and
  shows up in **Admin → Enquiries** immediately — no extra wiring needed.
- Middleware protects every `/admin/*` route except `/admin/login`.
