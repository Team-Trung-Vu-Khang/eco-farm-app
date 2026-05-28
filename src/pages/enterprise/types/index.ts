import type { BankAccount, Branch, Contact } from "../data/constants";

export interface EnterpriseDocument {
  name: string;
  type: string;
  size: string;
  url?: string;
}

export interface EnterpriseFormData {
  type: "enterprise" | "farm" | "cooperative";
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
  district: string;
  ward: string;
  address: string;
  image: string;
  description: string;
  contacts: Contact[];
  branches: Branch[];
  bankAccounts: BankAccount[];
  documents: EnterpriseDocument[];
}
