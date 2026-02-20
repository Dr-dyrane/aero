import type { AeroUser, UserRole } from './types';

/* ==========================================================================
   AERO RBAC Helpers
   Roles: user, partner, admin
   Enforced at Supabase RLS (primary) + RBACProvider for UI gating.
   ========================================================================== */

const ROLE_HIERARCHY: Record<UserRole, number> = {
  user: 0,
  partner: 1,
  admin: 2,
};

function hasMinRole(user: AeroUser | null, minRole: UserRole): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[minRole];
}

/** Can the user view their own vault? (any authenticated user) */
export function canViewVault(user: AeroUser | null): boolean {
  return hasMinRole(user, 'user');
}

/** Can the user manage merits? (partner or admin) */
export function canManageMerits(user: AeroUser | null): boolean {
  return hasMinRole(user, 'partner');
}

/** Can the user access the admin panel? (admin only) */
export function canAccessAdminPanel(user: AeroUser | null): boolean {
  return hasMinRole(user, 'admin');
}

/** Generic role check helper */
export function hasRole(user: AeroUser | null, role: UserRole): boolean {
  return hasMinRole(user, role);
}

/** Permission checker for feature flags */
export function canAccess(
  user: AeroUser | null,
  feature: string
): boolean {
  const featurePermissions: Record<string, UserRole> = {
    vault: 'user',
    scan: 'user',
    score: 'user',
    merits_manage: 'partner',
    admin_panel: 'admin',
    user_management: 'admin',
  };

  const required = featurePermissions[feature];
  if (!required) return false;
  return hasMinRole(user, required);
}
