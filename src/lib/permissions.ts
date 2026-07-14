// Central definition of the enterprise RBAC system. As of Phase 3.5, ADMIN
// and STAFF permissions are dynamic — stored per-account in the
// AdminPermissionGrant table and managed by a Super Admin through
// /admin/users/[id]/permissions — rather than fixed by role. This file still
// defines every known permission (so there's one canonical list to check
// against) and the *default* set a newly-created Admin/Staff account starts
// with, but the live/authoritative check for an existing account is
// src/lib/permissionGrants.ts, not the ROLE_PERMISSIONS map below.
//
// SUPER_ADMIN remains the one deliberately-hardcoded exception: it always
// has every permission and never touches the grants table, per spec
// ("Super Admin remains the only unrestricted account").

export type AdminRole = "SUPER_ADMIN" | "ADMIN" | "STAFF";

export const PERMISSIONS = {
  // ---- Website ----
  MANAGE_SERVICES: "MANAGE_SERVICES",
  MANAGE_BLOG: "MANAGE_BLOG",
  MANAGE_CAREERS: "MANAGE_CAREERS",
  MANAGE_FAQS: "MANAGE_FAQS",
  MANAGE_TESTIMONIALS: "MANAGE_TESTIMONIALS",

  // ---- Applications ----
  VIEW_APPLICATIONS: "VIEW_APPLICATIONS",
  VIEW_ASSIGNED_APPLICATIONS: "VIEW_ASSIGNED_APPLICATIONS",
  ASSIGN_STAFF: "ASSIGN_STAFF", // "Assign Applications" in the spec's wording
  APPROVE_APPLICATIONS: "APPROVE_APPLICATIONS",
  REJECT_APPLICATIONS: "REJECT_APPLICATIONS",
  REQUEST_ADDITIONAL_DOCUMENTS: "REQUEST_ADDITIONAL_DOCUMENTS",
  DOWNLOAD_DOCUMENTS: "DOWNLOAD_DOCUMENTS",
  EXPORT_APPLICATIONS: "EXPORT_APPLICATIONS",
  // Legacy bundle — still checked in a couple of not-yet-split call paths
  // (e.g. general status updates). Functionally a superset of
  // approve/reject/request-docs; kept so nothing silently loses access.
  REVIEW_APPLICATIONS: "REVIEW_APPLICATIONS",

  // ---- Enquiries ----
  VIEW_ENQUIRIES: "VIEW_ENQUIRIES",
  REPLY_TO_ENQUIRIES: "REPLY_TO_ENQUIRIES",
  CLOSE_ENQUIRIES: "CLOSE_ENQUIRIES",
  DELETE_ENQUIRIES: "DELETE_ENQUIRIES",
  // Legacy bundle, same idea as REVIEW_APPLICATIONS above.
  MANAGE_ENQUIRIES: "MANAGE_ENQUIRIES",

  // ---- Users ----
  CREATE_STAFF: "CREATE_STAFF",
  CREATE_ADMIN: "CREATE_ADMIN",
  EDIT_USERS: "EDIT_USERS",
  SUSPEND_USERS: "SUSPEND_USERS",
  RESET_PASSWORDS: "RESET_PASSWORDS",
  MANAGE_PERMISSIONS: "MANAGE_PERMISSIONS", // Super Admin only, never grantable
  // Legacy bundle covering create/edit/suspend/reset for Staff-level targets.
  MANAGE_STAFF: "MANAGE_STAFF",
  MANAGE_ADMINS: "MANAGE_ADMINS",
  ASSIGN_ROLES: "ASSIGN_ROLES",

  // ---- Reports & Analytics ----
  VIEW_REPORTS: "VIEW_REPORTS",
  EXPORT_REPORTS: "EXPORT_REPORTS",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",

  // ---- Newsletter ----
  CREATE_NEWSLETTER: "CREATE_NEWSLETTER",
  SEND_NEWSLETTER: "SEND_NEWSLETTER",
  MANAGE_SUBSCRIBERS: "MANAGE_SUBSCRIBERS",

  // ---- Media ----
  UPLOAD_IMAGES: "UPLOAD_IMAGES",
  DELETE_IMAGES: "DELETE_IMAGES",

  // ---- Settings ---- (all Super Admin only, never grantable to Admin/Staff)
  COMPANY_SETTINGS: "COMPANY_SETTINGS",
  BRANDING_SETTINGS: "BRANDING_SETTINGS",
  EMAIL_SETTINGS: "EMAIL_SETTINGS",
  SECURITY_SETTINGS: "SECURITY_SETTINGS",
  MANAGE_SETTINGS: "MANAGE_SETTINGS", // legacy bundle covering all four above
  MANAGE_EMAIL_TEMPLATES: "MANAGE_EMAIL_TEMPLATES",

  // ---- System ---- (Super Admin only, never grantable)
  VIEW_AUDIT_LOGS: "VIEW_AUDIT_LOGS",
  CONFIGURE_SYSTEM: "CONFIGURE_SYSTEM",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as Permission[];

// Permissions that stay Super-Admin-only no matter what a grant record
// says — defense in depth so a bug or bad data can't accidentally grant
// system-level control to an Admin/Staff account.
export const SUPER_ADMIN_ONLY_PERMISSIONS: Permission[] = [
  PERMISSIONS.MANAGE_PERMISSIONS,
  PERMISSIONS.COMPANY_SETTINGS,
  PERMISSIONS.BRANDING_SETTINGS,
  PERMISSIONS.EMAIL_SETTINGS,
  PERMISSIONS.SECURITY_SETTINGS,
  PERMISSIONS.MANAGE_SETTINGS,
  PERMISSIONS.MANAGE_EMAIL_TEMPLATES,
  PERMISSIONS.MANAGE_SERVICES,
  PERMISSIONS.VIEW_AUDIT_LOGS,
  PERMISSIONS.CONFIGURE_SYSTEM,
  PERMISSIONS.CREATE_ADMIN,
];

/** What a brand-new ADMIN or STAFF account starts with — a Super Admin can
 *  freely add or remove from here afterward via the permissions page. */
export const DEFAULT_PERMISSIONS_BY_ROLE: Record<"ADMIN" | "STAFF", Permission[]> = {
  ADMIN: [
    PERMISSIONS.MANAGE_BLOG,
    PERMISSIONS.MANAGE_TESTIMONIALS,
    PERMISSIONS.MANAGE_FAQS,
    PERMISSIONS.MANAGE_CAREERS,
    PERMISSIONS.MANAGE_ENQUIRIES,
    PERMISSIONS.VIEW_ENQUIRIES,
    PERMISSIONS.REPLY_TO_ENQUIRIES,
    PERMISSIONS.CLOSE_ENQUIRIES,
    PERMISSIONS.VIEW_APPLICATIONS,
    PERMISSIONS.REVIEW_APPLICATIONS,
    PERMISSIONS.ASSIGN_STAFF,
    PERMISSIONS.APPROVE_APPLICATIONS,
    PERMISSIONS.REJECT_APPLICATIONS,
    PERMISSIONS.REQUEST_ADDITIONAL_DOCUMENTS,
    PERMISSIONS.DOWNLOAD_DOCUMENTS,
    PERMISSIONS.EXPORT_APPLICATIONS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.MANAGE_STAFF,
    PERMISSIONS.CREATE_STAFF,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.CREATE_NEWSLETTER,
    PERMISSIONS.SEND_NEWSLETTER,
    PERMISSIONS.MANAGE_SUBSCRIBERS,
    PERMISSIONS.UPLOAD_IMAGES,
    PERMISSIONS.DELETE_IMAGES,
  ],
  STAFF: [PERMISSIONS.VIEW_ASSIGNED_APPLICATIONS, PERMISSIONS.DOWNLOAD_DOCUMENTS],
};

/** Grouped for the Super Admin permission-management UI. */
export const PERMISSION_GROUPS: { label: string; permissions: { key: Permission; label: string }[] }[] = [
  {
    label: "Website",
    permissions: [
      { key: PERMISSIONS.MANAGE_SERVICES, label: "Manage Services" },
      { key: PERMISSIONS.MANAGE_BLOG, label: "Manage Blog" },
      { key: PERMISSIONS.MANAGE_CAREERS, label: "Manage Careers" },
      { key: PERMISSIONS.MANAGE_FAQS, label: "Manage FAQs" },
      { key: PERMISSIONS.MANAGE_TESTIMONIALS, label: "Manage Testimonials" },
    ],
  },
  {
    label: "Applications",
    permissions: [
      { key: PERMISSIONS.VIEW_APPLICATIONS, label: "View Applications" },
      { key: PERMISSIONS.ASSIGN_STAFF, label: "Assign Applications" },
      { key: PERMISSIONS.APPROVE_APPLICATIONS, label: "Approve Applications" },
      { key: PERMISSIONS.REJECT_APPLICATIONS, label: "Reject Applications" },
      { key: PERMISSIONS.REQUEST_ADDITIONAL_DOCUMENTS, label: "Request Additional Documents" },
      { key: PERMISSIONS.DOWNLOAD_DOCUMENTS, label: "Download Documents" },
      { key: PERMISSIONS.EXPORT_APPLICATIONS, label: "Export Applications" },
    ],
  },
  {
    label: "Enquiries",
    permissions: [
      { key: PERMISSIONS.VIEW_ENQUIRIES, label: "View Enquiries" },
      { key: PERMISSIONS.REPLY_TO_ENQUIRIES, label: "Reply to Enquiries" },
      { key: PERMISSIONS.CLOSE_ENQUIRIES, label: "Close Enquiries" },
      { key: PERMISSIONS.DELETE_ENQUIRIES, label: "Delete Enquiries" },
    ],
  },
  {
    label: "Users",
    permissions: [
      { key: PERMISSIONS.CREATE_STAFF, label: "Create Staff" },
      { key: PERMISSIONS.EDIT_USERS, label: "Edit Users" },
      { key: PERMISSIONS.SUSPEND_USERS, label: "Suspend Users" },
      { key: PERMISSIONS.RESET_PASSWORDS, label: "Reset Passwords" },
    ],
  },
  {
    label: "Reports",
    permissions: [
      { key: PERMISSIONS.VIEW_REPORTS, label: "View Reports" },
      { key: PERMISSIONS.EXPORT_REPORTS, label: "Export Reports" },
    ],
  },
  {
    label: "Analytics",
    permissions: [{ key: PERMISSIONS.VIEW_ANALYTICS, label: "View Analytics" }],
  },
  {
    label: "Newsletter",
    permissions: [
      { key: PERMISSIONS.CREATE_NEWSLETTER, label: "Create Newsletter" },
      { key: PERMISSIONS.SEND_NEWSLETTER, label: "Send Newsletter" },
      { key: PERMISSIONS.MANAGE_SUBSCRIBERS, label: "Manage Subscribers" },
    ],
  },
  {
    label: "Media",
    permissions: [
      { key: PERMISSIONS.UPLOAD_IMAGES, label: "Upload Images" },
      { key: PERMISSIONS.DELETE_IMAGES, label: "Delete Images" },
    ],
  },
];

export function isSuperAdmin(role: string | null | undefined): boolean {
  return role === "SUPER_ADMIN";
}

/** Static, role-shape check — used only as a display fallback or for the
 *  small set of permissions that stay role-gated (Super Admin only). For
 *  ADMIN/STAFF's real, current access, use getEffectivePermissions() from
 *  permissionGrants.ts instead. */
export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  if (role === "SUPER_ADMIN") return true;
  if (role === "ADMIN") return DEFAULT_PERMISSIONS_BY_ROLE.ADMIN.includes(permission);
  if (role === "STAFF") return DEFAULT_PERMISSIONS_BY_ROLE.STAFF.includes(permission);
  return false;
}

/** Checks a resolved, already-fetched permission list (from
 *  getEffectivePermissions) — this is the one that reflects a Super Admin's
 *  actual per-account grants and should be preferred everywhere it's
 *  available. */
export function hasGrantedPermission(permissions: Permission[], permission: Permission): boolean {
  return permissions.includes(permission);
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
