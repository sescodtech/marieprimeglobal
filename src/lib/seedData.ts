import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import { services, testimonials, directorProfile, siteContent } from "./data";

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

  // --- Services -----------------------------------------------------------
  for (const [index, service] of services.entries()) {
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
        description: service.description,
        order: index,
        isPublished: true,
      },
    });
  }
  log.push(`Seeded ${services.length} services.`);

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
        "MariePrime Global Services manages flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory.",
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
        "Flight booking, visa and immigration assistance, travel loans, study abroad support, business registration and investment advisory from MariePrime Global Services.",
      keywords: "visa services, flight booking, study abroad, business registration Nigeria",
    },
    {
      page: "contact",
      metaTitle: "Contact Us | MariePrime Global Services",
      metaDescription:
        "Reach MariePrime Global Services by form, email, phone or WhatsApp for flight booking, visa, study abroad, business registration and investment enquiries.",
      keywords: "contact MariePrime, travel agency Lagos contact",
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
