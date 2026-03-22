import { vietQrBankData } from "../../../constants/banks";

export interface BankOption {
  label: string;
  value: string;
}

export const BANK_LIST: BankOption[] = vietQrBankData.map((bank) => ({
  label: bank.shortName,
  value: bank.shortName,
}));

export const BANK_LOGOS: Record<string, string> = vietQrBankData.reduce(
  (acc, bank) => {
    acc[bank.shortName] = bank.logo;
    return acc;
  },
  {} as Record<string, string>,
);
