export type AuthProvider = "center" | "farm" | (string & {});

export interface AuthMeResponse {
  userId: string;
  username: string;
  email: string;
  name: string;
  phoneNumber: string;
  provider: string;
  sessionId: string;
  mustChangePassword: boolean;
}
