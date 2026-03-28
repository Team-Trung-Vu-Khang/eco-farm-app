export interface CertificationOrganization {
  id: number;
  code: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface Certificate {
  id: number;
  code: string;
  name: string;
  organizationIds: number[];
  content: string;
  contentType: "editor" | "file";
  fileUrl?: string;
  stampUrl?: string;
  stampType: "url" | "file";
  stampFileUrl?: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type CategoryType = "standards" | "organizations";

export type StandardFormData = Omit<Certificate, "id" | "createdAt">;
export type OrganizationFormData = Omit<
  CertificationOrganization,
  "id" | "createdAt"
>;
