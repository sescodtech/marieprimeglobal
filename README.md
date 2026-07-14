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



##  — Enquiry pipeline (complete)

- Every contact form submission is saved to the `Enquiry` table and shows up
  instantly in **Admin → Enquiries** (list, status filter, detail view, status
  tracking NEW → IN_PROGRESS → RESPONDED → CLOSED, internal notes).
- New enquiries now also trigger an email notification via Resend to
  `NOTIFY_EMAIL_TO` (defaults to Maria's email) with a direct link into the
  admin dashboard. Set `RESEND_API_KEY` in `.env` to enable this — if it's
  unset, enquiries still save normally, the email is just skipped.

## — SEO (complete)

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

- The contact form (`/contact`) already writes to the `Enquiry` table and
- Middleware protects every `/admin/*` route except `/admin/login`.
