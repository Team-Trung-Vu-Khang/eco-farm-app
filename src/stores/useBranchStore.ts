import { create } from "zustand";

interface ContactPerson {
  id: string;
  name: string;
  position: string;
  phone: string;
  email: string;
  isPrimary: boolean;
}

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  branch: string;
  isPrimary: boolean;
}

export interface Branch {
  id: number;
  code: string;
  name: string;
  enterpriseName: string;
  phone: string;
  email: string;
  address: string;
  taxCode?: string;
  taxAddress?: string;
  website?: string;
  city?: string;
  district?: string;
  ward?: string;
  imageUrl?: string;
  latitude?: string;
  longitude?: string;
  mapUrl?: string;
  contacts?: ContactPerson[];
  bankAccounts?: BankAccount[];
  status: "active" | "inactive";
  createdAt: string;
}

interface BranchState {
  branches: Branch[];
  getBranchById: (id: number) => Branch | undefined;
  addBranch: (branch: Branch) => void;
  updateBranch: (id: number, data: Partial<Branch>) => void;
  deleteBranch: (id: number) => void;
}

const initialBranches: Branch[] = [
  {
    id: 1,
    code: "CN001",
    name: "Chi nhánh Miền Nam",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02839999888",
    email: "hcm@ecofarm.vn",
    address: "123 Nguyễn Huệ",
    taxCode: "0123456789-001",
    taxAddress: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",
    website: "https://ecofarm.vn",
    ward: "Phường Bến Nghé",
    district: "Quận 1",
    city: "TP.HCM",
    imageUrl:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    latitude: "10.7769",
    longitude: "106.7009",
    contacts: [
      {
        id: "1",
        name: "Nguyễn Văn A",
        position: "Giám đốc chi nhánh",
        phone: "0901234567",
        email: "nguyenvana@ecofarm.vn",
        isPrimary: true,
      },
    ],
    bankAccounts: [
      {
        id: "1",
        bankName: "Vietcombank",
        accountNumber: "0123456789",
        accountHolder: "Chi nhánh Miền Nam - EcoFarm",
        branch: "Chi nhánh Sài Gòn",
        isPrimary: true,
      },
    ],
    status: "active",
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    code: "CN002",
    name: "Chi nhánh Miền Trung",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02363888777",
    email: "dn@ecofarm.vn",
    address: "456 Lê Duẩn",
    ward: "Phường Hải Châu 1",
    district: "Hải Châu",
    city: "Đà Nẵng",
    imageUrl:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    latitude: "16.0544",
    longitude: "108.2022",
    contacts: [
      {
        id: "1",
        name: "Trần Thị B",
        position: "Trưởng chi nhánh",
        phone: "0907654321",
        email: "tranthib@ecofarm.vn",
        isPrimary: true,
      },
    ],
    bankAccounts: [
      {
        id: "1",
        bankName: "Techcombank",
        accountNumber: "9876543210",
        accountHolder: "Chi nhánh Miền Trung - EcoFarm",
        branch: "Chi nhánh Đà Nẵng",
        isPrimary: true,
      },
    ],
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: 3,
    code: "CN003",
    name: "Văn phòng Hà Nội",
    enterpriseName: "HTX Rau sạch Thanh Hà",
    phone: "02437776666",
    email: "thanhha_hn@gmail.com",
    address: "789 Giải Phóng",
    ward: "Phường Hoàng Văn Thụ",
    district: "Hoàng Mai",
    city: "Hà Nội",
    imageUrl:
      "https://images.unsplash.com/photo-1486718448742-163732cd1544?w=800",
    status: "active",
    createdAt: "2024-02-01",
  },
  {
    id: 4,
    code: "CN004",
    name: "Kho vận Cần Thơ",
    enterpriseName: "Công ty CP Nông nghiệp Xanh EcoFarm",
    phone: "02923666555",
    email: "kho_cantho@ecofarm.vn",
    address: "321 Mậu Thân",
    ward: "Phường An Hòa",
    district: "Ninh Kiều",
    city: "Cần Thơ",
    status: "inactive",
    createdAt: "2024-02-05",
  },
];

const useBranchStore = create<BranchState>()((set, get) => ({
  branches: initialBranches,

  getBranchById: (id) => {
    return get().branches.find((branch) => branch.id === id);
  },

  addBranch: (branch) => {
    set((state) => ({
      branches: [...state.branches, branch],
    }));
  },

  updateBranch: (id, data) => {
    set((state) => ({
      branches: state.branches.map((branch) =>
        branch.id === id ? { ...branch, ...data } : branch,
      ),
    }));
  },

  deleteBranch: (id) => {
    set((state) => ({
      branches: state.branches.filter((branch) => branch.id !== id),
    }));
  },
}));

export default useBranchStore;
