import { create } from "zustand";

export interface BankAccount {
  id: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  note: string;
  status: "active" | "inactive";
  logo: string;
  createdAt: string;
}

interface BankState {
  bankAccounts: BankAccount[];
  getBankAccountById: (id: number) => BankAccount | undefined;
  addBankAccount: (account: BankAccount) => void;
  updateBankAccount: (id: number, data: Partial<BankAccount>) => void;
  deleteBankAccount: (id: number) => void;
}

const initialBankAccounts: BankAccount[] = [
  {
    id: 1,
    bankName: "Vietcombank",
    accountNumber: "0011001234567",
    accountHolder: "ECOFARM CORP",
    branch: "Sở Giao Dịch",
    note: "Tài khoản chính",
    status: "active",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png",
    createdAt: "2024-01-15",
  },
  {
    id: 2,
    bankName: "Agribank",
    accountNumber: "9876543210",
    accountHolder: "ECOFARM CORP",
    branch: "Chi nhánh Cầu Giấy",
    note: "Tài khoản phụ",
    status: "active",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank-V.png",
    createdAt: "2024-01-20",
  },
  {
    id: 3,
    bankName: "MBBank",
    accountNumber: "88889999",
    accountHolder: "NGUYEN VAN A",
    branch: "Chi nhánh Hoàn Kiếm",
    note: "Tài khoản cá nhân",
    status: "inactive",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-MB-Bank-MBB.png",
    createdAt: "2024-02-01",
  },
];

const useBankStore = create<BankState>()((set, get) => ({
  bankAccounts: initialBankAccounts,

  getBankAccountById: (id) => {
    return get().bankAccounts.find((account) => account.id === id);
  },

  addBankAccount: (account) => {
    set((state) => ({
      bankAccounts: [...state.bankAccounts, account],
    }));
  },

  updateBankAccount: (id, data) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) =>
        account.id === id ? { ...account, ...data } : account,
      ),
    }));
  },

  deleteBankAccount: (id) => {
    set((state) => ({
      bankAccounts: state.bankAccounts.filter((account) => account.id !== id),
    }));
  },
}));

export default useBankStore;
