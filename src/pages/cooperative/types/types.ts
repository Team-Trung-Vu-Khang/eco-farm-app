export type CooperativeClassification = "production" | "processing" | "trading" | "service" | "other";

export interface Branch {
  id?: number | string;
  contactId?: number | string;
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

export interface BankAccount {
  id?: number | string;
  bankId?: number | string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
  bin: string;
  logo?: string;
}

export interface Contact {
  id?: number | string;
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
  aliasName: string;
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
  latitude?: number;
  longitude?: number;
  address: string;
  image: string;
  description: string;
  contacts: Contact[];
  branches: Branch[];
  bankAccounts: BankAccount[];
  documents: {
    id?: number | string;
    name: string;
    type: string;
    size: string;
    url?: string;
    fileName?: string;
    fileUrl?: string;
    mimeType?: string;
    sizeBytes?: number;
  }[];
}
