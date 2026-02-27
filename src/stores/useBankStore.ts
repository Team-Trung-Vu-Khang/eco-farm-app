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
  {
    id: 4,
    bankName: "BIDV",
    accountNumber: "123456789012",
    accountHolder: "ECOFARM CORP",
    branch: "Chi nhánh Đà Nẵng",
    note: "Tài khoản nhận thanh toán xuất khẩu",
    status: "active",
    logo: "https://news.mbbank.com.vn/file-service/uploads/v1/images/c21788de-1a22-48e0-a4ca-7bda44d5b2b4-logo-bidv-20220426071253.jpg?width=947&height=366",
    createdAt: "2024-03-05",
  },
  {
    id: 5,
    bankName: "Techcombank",
    accountNumber: "190012345678",
    accountHolder: "NGUYEN VAN B",
    branch: "Chi nhánh Bình Thạnh",
    note: "Tài khoản tiết kiệm",
    status: "active",
    logo: "https://inkythuatso.com/uploads/thumbnails/800/2021/09/logo-techcombank-inkythuatso-10-15-17-50.jpg",
    createdAt: "2024-03-10",
  },
  {
    id: 6,
    bankName: "VPBank",
    accountNumber: "555566667777",
    accountHolder: "ECOFARM CORP",
    branch: "Chi nhánh Hải Phòng",
    note: "Tài khoản chi trả nhà cung cấp",
    status: "active",
    logo: "https://inkythuatso.com/uploads/thumbnails/800/2021/11/vpbank-logo-inkythuatso-01-10-13-49-34.jpg",
    createdAt: "2024-04-01",
  },
  {
    id: 7,
    bankName: "ACB",
    accountNumber: "222233334444",
    accountHolder: "TRAN THI C",
    branch: "Chi nhánh Quận 1",
    note: "Tài khoản cá nhân dự phòng",
    status: "inactive",
    logo: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB.png",
    createdAt: "2024-04-12",
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
