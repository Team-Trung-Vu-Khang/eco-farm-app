export interface ContactPerson {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface ContactInfo {
  id: string;
  name?: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

export interface BranchBankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  note?: string;
  bin?: string;
  logo?: string;
  isPrimary: boolean;
}

export interface BranchFormData {
  code: string;
  name: string;
  enterpriseId: string;
  enterpriseName: string;
  taxCode: string;
  taxAddress: string;
  website: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  imageUrl: string;
  imageFile?: File;
  latitude: number;
  longitude: number;
  status: "active" | "inactive";
  contactInfos: ContactInfo[];
  contacts: ContactPerson[];
  bankAccounts: BranchBankAccount[];
}

export interface BranchEnterpriseOption {
  id: string;
  name: string;
}
