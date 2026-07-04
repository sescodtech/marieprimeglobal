import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { testimonials, directorProfile, siteContent, blogPosts, jobListings, faqCategories } from "./data";
import { servicePages } from "./servicePages";

export async function seedDatabase() {
  const log: string[] = [];

  // --- Admin user -----------------------------------------------------
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "mariaiyabi@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!";

  const existingAdmin = await prisma.admin.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(adminPassword, 10);
    await prisma.admin.create({
      data: {
        name: "Maria Karinate Iyabi",
        email: adminEmail,
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    log.push(`Created admin user: ${adminEmail} — sign in and change the password immediately.`);
  } else {
    log.push(`Admin user ${adminEmail} already exists, skipped.`);
  }

  // --- Services (11 total: the master spec's 10 plus Business Registration,
  // which the business also actually offers) -------------------------------
  for (const [index, service] of servicePages.entries()) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: {
        slug: service.slug,
        title: service.title,
        routeCode: service.routeCode,
        routeFrom: service.routeFrom,
        routeTo: service.routeTo,
        summary: service.summary,
        description: service.overview,
        tagline: service.tagline,
        benefits: service.benefits,
        process: service.process,
        faqs: service.faqs,
        order: index,
        isPublished: true,
      },
    });
  }
  log.push(`Seeded ${servicePages.length} services.`);

  // --- Blog posts -----------------------------------------------------
  for (const [index, post] of blogPosts.entries()) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        slug: post.slug,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        readTime: post.readTime,
        publishedLabel: post.publishedLabel,
        order: index,
        isPublished: true,
      },
    });
  }
  log.push(`Seeded ${blogPosts.length} blog posts.`);

  // --- Job listings -----------------------------------------------------
  for (const [index, job] of jobListings.entries()) {
    await prisma.jobListing.upsert({
      where: { slug: job.slug },
      update: {},
      create: {
        slug: job.slug,
        title: job.title,
        department: job.department,
        location: job.location,
        type: job.type,
        summary: job.summary,
        order: index,
        isPublished: true,
      },
    });
  }
  log.push(`Seeded ${jobListings.length} job listings.`);

  // --- FAQs -----------------------------------------------------------
  // Idempotent by question text (not just "run once if empty") so that
  // re-running the seed after adding new FAQ topics fills in only what's
  // missing, without duplicating anything already published or edited
  // through /admin/faq.
  const existingFaqCount = await prisma.faq.count();
  let highestOrder = await prisma.faq
    .aggregate({ _max: { order: true } })
    .then((r) => r._max.order ?? -1);
  let newFaqCount = 0;

  for (const category of faqCategories) {
    for (const item of category.items) {
      const exists = await prisma.faq.findFirst({ where: { question: item.question } });
      if (exists) continue;
      highestOrder += 1;
      await prisma.faq.create({
        data: {
          category: category.category,
          question: item.question,
          answer: item.answer,
          order: highestOrder,
          isPublished: true,
        },
      });
      newFaqCount += 1;
    }
  }

  if (existingFaqCount === 0) {
    log.push(`Seeded FAQs across ${faqCategories.length} categories.`);
  } else if (newFaqCount > 0) {
    log.push(`Added ${newFaqCount} new FAQ(s) not previously present.`);
  } else {
    log.push("FAQs already exist, skipped.");
  }

  // --- Testimonials -------------------------------------------------------
  const existingTestimonials = await prisma.testimonial.count();
  if (existingTestimonials === 0) {
    for (const [index, t] of testimonials.entries()) {
      await prisma.testimonial.create({
        data: {
          clientName: t.clientName,
          clientRole: t.clientRole,
          quote: t.quote,
          rating: t.rating,
          order: index,
          isPublished: true,
        },
      });
    }
    log.push(`Seeded ${testimonials.length} testimonials.`);
  } else {
    log.push("Testimonials already exist, skipped.");
  }

  // --- Director profile -----------------------------------------------
  const existingDirector = await prisma.directorProfile.findFirst({ where: { isActive: true } });
  if (!existingDirector) {
    await prisma.directorProfile.create({
      data: {
        name: directorProfile.name,
        position: directorProfile.position,
        biography: directorProfile.biography,
        isActive: true,
      },
    });
    log.push("Seeded director profile.");
  } else {
    log.push("Director profile already exists, skipped.");
  }

  // --- Site settings: contact, socials, hero -----------------------------
  const settingRows: { key: string; value: string; group: string }[] = [
    { key: "contact_email", value: siteContent.contact.email, group: "contact" },
    { key: "contact_phone", value: siteContent.contact.phone, group: "contact" },
    { key: "contact_whatsapp", value: siteContent.contact.whatsapp, group: "contact" },
    { key: "contact_address", value: siteContent.contact.address, group: "contact" },
    { key: "social_instagram", value: siteContent.contact.socials.instagram, group: "social" },
    { key: "social_linkedin", value: siteContent.contact.socials.linkedin, group: "social" },
    { key: "social_facebook", value: siteContent.contact.socials.facebook, group: "social" },
    { key: "social_tiktok", value: siteContent.contact.socials.tiktok, group: "social" },
    { key: "hero_eyebrow", value: siteContent.home.heroEyebrow, group: "home_hero" },
    { key: "hero_headline", value: siteContent.home.heroHeadline, group: "home_hero" },
    { key: "hero_subtext", value: siteContent.home.heroSubtext, group: "home_hero" },
  ];

  for (const row of settingRows) {
    await prisma.siteSetting.upsert({
      where: { key: row.key },
      update: {},
      create: row,
    });
  }
  log.push(`Seeded ${settingRows.length} site settings.`);

  // --- SEO defaults ---------------------------------------------------
  const seoDefaults = [
    {
      page: "home",
      metaTitle: "MariePrime Global Services | Flights, Visas, Study Abroad & Business Registration",
      metaDescription:
        "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support and business registration.",
      keywords: "visa assistance Nigeria, flight booking agency, study abroad consultant, business registration Nigeria",
    },
    {
      page: "about",
      metaTitle: "About Us | MariePrime Global Services",
      metaDescription:
        "Learn about MariePrime Global Services — our mission, vision, values, and the director behind our global mobility and business advisory practice.",
      keywords: "MariePrime about, travel agency Lagos, immigration consultant",
    },
    {
      page: "services",
      metaTitle: "Services | MariePrime Global Services",
      metaDescription:
        "Flight booking, visa and immigration assistance, travel loans, study abroad support and business registration from MariePrime Global Services.",
      keywords: "visa services, flight booking, study abroad, business registration Nigeria",
    },
    {
      page: "contact",
      metaTitle: "Contact Us | MariePrime Global Services",
      metaDescription:
        "Reach MariePrime Global Services by form, email, phone or WhatsApp for flight booking, visa, study abroad and business registration enquiries.",
      keywords: "contact MariePrime, travel agency Lagos contact",
    },
    {
      page: "blog",
      metaTitle: "Blog | MariePrime Global Services",
      metaDescription:
        "Notes on visas, immigration, study abroad and travel from the MariePrime Global Services team.",
      keywords: "visa blog, study abroad tips, travel advice Nigeria",
    },
    {
      page: "careers",
      metaTitle: "Careers | MariePrime Global Services",
      metaDescription:
        "Open roles at MariePrime Global Services across client services and operations, based in Lagos, Nigeria.",
      keywords: "MariePrime careers, travel agency jobs Lagos",
    },
    {
      page: "faq",
      metaTitle: "Frequently Asked Questions | MariePrime Global Services",
      metaDescription:
        "Answers to common questions about visas, study abroad, travel bookings, business registration and working with MariePrime Global Services.",
      keywords: "visa FAQ, study abroad FAQ, MariePrime questions",
    },
  ] as const;

  for (const seo of seoDefaults) {
    await prisma.seoSetting.upsert({
      where: { page: seo.page },
      update: {},
      create: seo,
    });
  }
  log.push("Seeded SEO defaults for all pages.");

  return log;
}
