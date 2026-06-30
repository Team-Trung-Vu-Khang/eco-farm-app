import type { BankAccount, Branch, Contact } from "../data/constants";

export interface EnterpriseDocument {
  name: string;
  type: string;
  size: string;
  url?: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  content?: string;
}

export interface EnterpriseFormData {
  type: "enterprise" | "farm" | "cooperative";
  organizationTypeId: number | string | "";
  code: string;
  name: string;
  brandName: string;
  taxCode: string;
  taxAddress: string;
  taxAuthority: string;
  issueDate: string;
  classification: Array<string>;
  foundedDate: string;
  representative: string;
  website: string;
  phone: string;
  email: string;
  province: string;
  ward: string;
  latitude?: number;
  longitude?: number;
  address: string;
  image: string;
  description: string;
  contacts: Contact[];
  branches: Branch[];
  bankAccounts: BankAccount[];
  documents: EnterpriseDocument[];
}
