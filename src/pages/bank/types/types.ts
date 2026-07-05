import type { BankAccountStatus } from "@/features/bank";

export interface BankFormData {
  bankId: number | string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  status: BankAccountStatus;
  note: string;
  logo: string;
}
