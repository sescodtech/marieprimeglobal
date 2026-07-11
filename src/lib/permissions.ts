// Central definition of the enterprise RBAC system: three roles
// (Super Admin, Admin, Staff), the permissions each role holds, and the
// helpers used everywhere else (Server Actions, pages, the sidebar) to check
// access. Keeping this in one file is what makes the permission set
// consistent and auditable instead of scattered role === "..." checks.

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export const PERMISSIONS = {
  // Service configuration is Super Admin only as of Phase 3: create/edit/
  // delete/archive services, application mode (online application vs
  // enquiry-only), documents config, FAQs/requirements/processing time,
  // display order.
  MANAGE_SERVICES: "MANAGE_SERVICES",
  // Day-to-day content Admins are still trusted with.
  MANAGE_BLOG: "MANAGE_BLOG",
  MANAGE_TESTIMONIALS: "MANAGE_TESTIMONIALS",
  MANAGE_FAQS: "MANAGE_FAQS",
  MANAGE_CAREERS: "MANAGE_CAREERS",
  // Site-wide settings (contact info, social links, working hours, email
  // templates) — Super Admin only as of Phase 3.
  MANAGE_SETTINGS: "MANAGE_SETTINGS",
  MANAGE_EMAIL_TEMPLATES: "MANAGE_EMAIL_TEMPLATES",

  // Client enquiries.
  MANAGE_ENQUIRIES: "MANAGE_ENQUIRIES",

  // Client service applications.
  VIEW_APPLICATIONS: "VIEW_APPLICATIONS",
  REVIEW_APPLICATIONS: "REVIEW_APPLICATIONS",
  VIEW_ASSIGNED_APPLICATIONS: "VIEW_ASSIGNED_APPLICATIONS",
  // Assigning an application/enquiry to a staff member — distinct from
  // ASSIGN_ROLES, which governs changing a *user's* role.
  ASSIGN_STAFF: "ASSIGN_STAFF",

  // Analytics / reporting.
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
  VIEW_REPORTS: "VIEW_REPORTS",
  EXPORT_REPORTS: "EXPORT_REPORTS",

  // User management.
  MANAGE_STAFF: "MANAGE_STAFF",
  MANAGE_ADMINS: "MANAGE_ADMINS",
  ASSIGN_ROLES: "ASSIGN_ROLES",

  // System / platform.
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
  CONFIGURE_SYSTEM: "CONFIGURE_SYSTEM",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

// What each role can do. SUPER_ADMIN is intentionally "everything" so newly
// added permissions are automatically granted to it without needing to be
// listed twice.
const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  SUPER_ADMIN: ALL_PERMISSIONS,
  ADMIN: [
    PERMISSIONS.MANAGE_BLOG,
    PERMISSIONS.MANAGE_TESTIMONIALS,
    PERMISSIONS.MANAGE_FAQS,
    PERMISSIONS.MANAGE_CAREERS,
    PERMISSIONS.MANAGE_ENQUIRIES,
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.REVIEW_APPLICATIONS,
    PERMISSIONS.ASSIGN_STAFF,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.MANAGE_STAFF,
  ],
  STAFF: [PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS],
};

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role as AdminRole];
  return perms ? perms.includes(permission) : false;
}

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === "SUPER_ADMIN";
}

/**
 * Whether an actor (role + their canManageAdmins grant) is allowed to
 * create/edit/suspend/delete a user who currently has `targetRole`.
 *
 * - Super Admin can manage anyone.
 * - Admin can always manage Staff, and can only manage other Admins if
 *   they've been explicitly granted `canManageAdmins` by a Super Admin.
 * - Admin can never manage a Super Admin.
 * - Staff can never manage anyone.
 */
export function canManageRole(
  actorRole: string | null | undefined,
  actorCanManageAdmins: boolean,
  targetRole: string
): boolean {
  if (actorRole === "SUPER_ADMIN") return true;
  if (actorRole === "ADMIN") {
    if (targetRole === "STAFF") return true;
    if (targetRole === "ADMIN") return actorCanManageAdmins;
    return false;
  }
  return false;
}

/** Which roles an actor may assign when creating or editing a user. */
export function assignableRoles(
  actorRole: string | null | undefined,
  actorCanManageAdmins: boolean
): AdminRole[] {
  if (actorRole === "SUPER_ADMIN") return ["SUPER_ADMIN", "ADMIN", "STAFF"];
  if (actorRole === "ADMIN") return actorCanManageAdmins ? ["ADMIN", "STAFF"] : ["STAFF"];
  return [];
}

export const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  STAFF: "Staff",
};
