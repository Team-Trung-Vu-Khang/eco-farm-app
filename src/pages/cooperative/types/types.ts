export type CooperativeClassification = "production" | "processing" | "trading" | "service" | "other";

export interface Branch {
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

export interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
  bin: string;
}

export interface Contact {
  name: string;
  phone: string;
  email: string;
}

export interface Cooperative {
  id: number;
  code: string;
  name: string;
  image?: string;
  type: "cooperative";
  classification: CooperativeClassification[];
  taxCode: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
}

export interface CooperativeFormData {
  id?: string | number;
  type: "cooperative" | "enterprise" | "farm";
  code: string;
  name: string;
  brandName: string;
  taxCode: string;
  taxAddress: string;
  taxAuthority: string;
  issueDate: string;
  classification: string[];
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
  documents: { name: string; type: string; size: string }[];
}
