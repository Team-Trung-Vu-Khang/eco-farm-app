export type BankAccountStatus = "active" | "inactive";

export interface BankFormData {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  status: BankAccountStatus;
  note: string;
  logo: string;
}
