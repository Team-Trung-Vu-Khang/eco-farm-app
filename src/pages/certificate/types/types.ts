import type {
  CertificateStandardDocument,
  CertificateIssuerRecord,
  CertificateStandardRecord,
} from "@/features/master-data";
import type { OrganizationFormValues } from "../data/organization-form.schema";

export type CertificationOrganization = CertificateIssuerRecord;

export interface Certificate {
  id: number;
  code: string;
  name: string;
  organizationIds: number[];
  issuers?: CertificationOrganization[];
  documents?: CertificateStandardDocument[];
  content: string;
  contentType: "editor" | "file";
  fileUrl?: string;
  stampUrl?: string;
  stampType: "url" | "file";
  stampFileUrl?: string;
  validityMonths: number;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

export type CategoryType = "standards" | "organizations";

export type StandardFormData = Omit<Certificate, "id" | "createdAt">;
export type OrganizationFormData = OrganizationFormValues;

export type CertificateStandardApiRecord = CertificateStandardRecord;
