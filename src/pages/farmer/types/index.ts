export interface Contact {
  name: string;
  phone: string;
  email: string;
}

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
  bin?: string;
  logo?: string;
}

export interface Document {
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

export interface FarmerFormData {
  type: "enterprise" | "farm" | "cooperative";
  code: string;
  name: string;
  brandName?: string;
  taxCode: string;
  taxAddress?: string;
  taxAuthority?: string;
  issueDate?: string;
  classification: string[];
  foundedDate?: string;
  representative?: string;
  website?: string;
  phone: string;
  email: string;
  province?: string;
  district?: string;
  ward?: string;
  latitude?: number;
  longitude?: number;
  address: string;
  image?: string;
  description?: string;
  contacts: Contact[];
  branches: Branch[];
  bankAccounts: BankAccount[];
  documents: Document[];
}
