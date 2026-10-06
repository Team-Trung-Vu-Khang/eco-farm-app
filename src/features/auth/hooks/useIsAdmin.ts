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
 * Hook kiểm tra xem người dùng hiện tại có quyền Admin (Hệ thống hoặc Nông trường) hay không.
 */
export function useIsAdmin(): UseIsAdminResult {
  const { currentUser, loadingCurrentUser, isLoading } = useCurrentUser();

  const roleCodes = currentUser?.roleCodes ?? [];
  const workspaceRoleCodes =
    currentUser?.workspaceRoles?.map((r) => r.roleCode) ?? [];
  const allRoles = Array.from(new Set([...roleCodes, ...workspaceRoleCodes]));

  const isAdmin = allRoles.some(
    (role) =>
      ADMIN_ROLE_CODES.includes(role as (typeof ADMIN_ROLE_CODES)[number]) ||
      role.toUpperCase().includes("ADMIN"),
  );

  return {
    isAdmin,
    isLoading: loadingCurrentUser || Boolean(isLoading),
    currentUser,
    allRoles,
  };
}
