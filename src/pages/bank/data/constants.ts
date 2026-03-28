import { BANK_LIST, BANK_LOGOS } from "./bank-constants";
import type { BankFormData } from "../types/types";

export const emptyBankFormData: BankFormData = {
  bankName: "",
  accountNumber: "",
  accountHolder: "",
  branch: "",
  status: "active",
  note: "",
  logo: "",
};

export const bankStatusOptions = [
  { label: "Hoạt động", value: "active" },
  { label: "Không hoạt động", value: "inactive" },
] as const;

export const bankFilters: any[] = [
  {
    key: "status",
    label: "Trạng thái",
    options: [...bankStatusOptions],
  },
  {
    key: "bankName",
    label: "Ngân hàng",
    options: BANK_LIST,
  },
] as const;

export { BANK_LIST, BANK_LOGOS };
