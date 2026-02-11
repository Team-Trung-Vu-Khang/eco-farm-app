import { create } from "zustand";

export interface Personnel {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  position: string;
  department: string;
  team: string; // Đội nhóm
  province: string;
  district: string;
  address: string;
  taxCode: string;
  taxAddress: string;
  status: "active" | "inactive";
  avatar: string; // URL ảnh đại diện
  bankName?: string;
  bankBranch?: string;
  accountNumber?: string;
  accountHolder?: string;
  createdAt: string;
}

interface PersonnelStore {
  personnel: Personnel[];

  // CRUD operations
  getPersonnelById: (id: number) => Personnel | undefined;
  addPersonnel: (personnel: Omit<Personnel, "id" | "createdAt">) => void;
  updatePersonnel: (
    id: number,
    updates: Partial<Omit<Personnel, "id" | "createdAt">>,
  ) => void;
  deletePersonnel: (id: number) => void;
  bulkAddPersonnel: (
    personnelList: Omit<Personnel, "id" | "createdAt">[],
  ) => void;
}

const usePersonnelStore = create<PersonnelStore>((set, get) => ({
  // Initial data
  personnel: [
    {
      id: 1,
      fullName: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@ecofarm.vn",
      position: "Trưởng phòng",
      department: "Kinh doanh",
      team: "Đội kinh doanh miền Bắc",
      province: "Hà Nội",
      district: "Cầu Giấy",
      address: "Số 123 Đường Xuân Thủy",
      taxCode: "1234567890",
      taxAddress: "Hà Nội",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      bankName: "Vietcombank",
      bankBranch: "Sở Giao Dịch",
      accountNumber: "0011001234567",
      accountHolder: "NGUYEN VAN A",
      createdAt: "2024-01-10",
    },
    {
      id: 2,
      fullName: "Trần Thị B",
      phone: "0909876543",
      email: "tranthib@ecofarm.vn",
      position: "Kế toán trưởng",
      department: "Kế toán",
      team: "Tổ kế toán tổng hợp",
      province: "TP.HCM",
      district: "Quận 1",
      address: "Số 456 Nguyễn Thị Minh Khai",
      taxCode: "0987654321",
      taxAddress: "TP.HCM",
      status: "active",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      bankName: "VietinBank",
      bankBranch: "CN Quận 1",
      accountNumber: "0021002345678",
      accountHolder: "TRAN THI B",
      createdAt: "2024-01-11",
    },
    {
      id: 3,
      fullName: "Lê Văn C",
      phone: "0912345678",
      email: "levanc@ecofarm.vn",
      position: "Kỹ sư nông nghiệp",
      department: "Kỹ thuật",
      team: "Đội kỹ thuật trại 1",
      province: "Đà Nẵng",
      district: "Hải Châu",
      address: "Số 789 Nguyễn Văn Linh",
      taxCode: "5678901234",
      taxAddress: "Đà Nẵng",
      status: "inactive",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024e",
      createdAt: "2024-01-12",
    },
  ],

  // CRUD operations
  getPersonnelById: (id) => {
    return get().personnel.find((p) => p.id === id);
  },

  addPersonnel: (personnelData) => {
    set((state) => {
      const newId =
        state.personnel.length > 0
          ? Math.max(...state.personnel.map((p) => p.id)) + 1
          : 1;
      const newPersonnel: Personnel = {
        ...personnelData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        personnel: [...state.personnel, newPersonnel],
      };
    });
  },

  updatePersonnel: (id, updates) => {
    set((state) => ({
      personnel: state.personnel.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  },

  deletePersonnel: (id) => {
    set((state) => ({
      personnel: state.personnel.filter((p) => p.id !== id),
    }));
  },

  bulkAddPersonnel: (personnelList) => {
    set((state) => {
      const currentMaxId =
        state.personnel.length > 0
          ? Math.max(...state.personnel.map((p) => p.id))
          : 0;

      const newPersonnel = personnelList.map((data, index) => ({
        ...data,
        id: currentMaxId + index + 1,
        createdAt: new Date().toISOString().split("T")[0],
      }));

      return {
        personnel: [...state.personnel, ...newPersonnel],
      };
    });
  },
}));

export default usePersonnelStore;
