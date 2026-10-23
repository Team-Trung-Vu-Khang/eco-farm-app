import { useCurrentUser } from "./useCurrentUser";

export const ADMIN_ROLE_CODES = [
  "MEVI_SUPER_ADMIN",
  "MEVI_ADMIN",
  "MEVI_FARM_ADMIN",
  "ADMIN",
  "SUPER_ADMIN",
] as const;

export interface UseIsAdminResult {
  isAdmin: boolean;
  isLoading: boolean;
  currentUser: ReturnType<typeof useCurrentUser>["currentUser"];
  allRoles: string[];
}

/**
 * Kiểm tra xem người dùng hoặc JWT token có thuộc nhóm Admin hay không.
 */
export function isUserAdmin(
  currentUser?: {
    roleCodes?: string[];
    workspaceRoles?: { roleCode?: string }[];
  } | null,
  jwtToken?: string | null,
): boolean {
  if (currentUser) {
    const roleCodes = currentUser.roleCodes ?? [];
    const workspaceRoleCodes =
      currentUser.workspaceRoles?.map((r) => r.roleCode ?? "") ?? [];
    const allRoles = Array.from(new Set([...roleCodes, ...workspaceRoleCodes]));

    if (
      allRoles.some(
        (role) =>
          ADMIN_ROLE_CODES.includes(
            role as (typeof ADMIN_ROLE_CODES)[number],
          ) || role.toUpperCase().includes("ADMIN"),
      )
    ) {
      return true;
    }
  }

  if (jwtToken) {
    try {
      const parts = jwtToken.split(".");
      if (parts.length >= 2) {
        const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
        const jsonStr = decodeURIComponent(
          atob(payloadBase64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );
        const payload = JSON.parse(jsonStr);
        const roles: string[] = Array.isArray(payload.roles)
          ? payload.roles
          : typeof payload.role === "string"
            ? [payload.role]
            : [];

        if (
          roles.some(
            (role) =>
              ADMIN_ROLE_CODES.includes(
                role as (typeof ADMIN_ROLE_CODES)[number],
              ) || role.toUpperCase().includes("ADMIN"),
          )
        ) {
          return true;
        }
      }
    } catch {
      // Ignore token decode errors
    }
  }

  return false;
}

/**
 * Hook kiểm tra xem người dùng hiện tại có quyền Admin (Hệ thống hoặc Nông trường) hay không.
 */
export function useIsAdmin(): UseIsAdminResult {
  const { currentUser, loadingCurrentUser, isLoading } = useCurrentUser();

  const roleCodes = currentUser?.roleCodes ?? [];
  const workspaceRoleCodes =
    currentUser?.workspaceRoles?.map((r) => r.roleCode) ?? [];
  const allRoles = Array.from(new Set([...roleCodes, ...workspaceRoleCodes]));

  const isAdmin = isUserAdmin(currentUser);

  return {
    isAdmin,
    isLoading: loadingCurrentUser || Boolean(isLoading),
    currentUser,
    allRoles,
  };
}
