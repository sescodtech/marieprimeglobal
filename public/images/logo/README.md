# Manual logo folder

This is the fallback logo location described in the redesign brief.

The preferred way to change the logo is **Admin Dashboard → Settings → Branding**,
which uploads to Cloudinary and takes priority automatically.

If you ever need to swap the logo without touching the Admin Dashboard (e.g. no
internet access to Cloudinary, or a quick emergency fix), just drop a single
image file directly into this folder:

    public/images/logo/logo.png       (or .svg / .webp / .jpg)

The site automatically uses the most recently modified file in this folder
whenever no logo has been uploaded through Settings. To replace it, delete the
old file and add the new one (or just overwrite the same filename) — no code
changes or redeploy step beyond a normal deploy are required.

This README file is ignored; only image files are considered.
