export type AuthProvider = "center" | "farm" | (string & {});

export interface ReferrerSummary {
  userId: number;
  fullName: string;
  phoneNumber: string;
}

export interface WorkspaceRole {
  id: number;
  roleId: number;
  roleCode: string;
  roleName: string;
  workspaceId: number | null;
  createdAt: string;
}

export interface AuthMeResponse {
  id: number;
  username: string;
  email?: string;
  fullName: string;
  phoneNumber: string;
  birthYear?: number;
  operatingArea?: string;
  audienceType?: string;
  isReferrer: boolean;
  referrer?: ReferrerSummary;
  roleCodes: string[];
  workspaceRoles: WorkspaceRole[];
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
}
