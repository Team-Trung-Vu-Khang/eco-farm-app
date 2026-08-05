export type AuthProvider = "center" | "farm" | (string & {});

export interface ReferrerSummary {
  userId: number;
  fullName: string;
  phoneNumber: string;
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
  status: string;
  mustChangePassword: boolean;
  createdAt: string;
}
