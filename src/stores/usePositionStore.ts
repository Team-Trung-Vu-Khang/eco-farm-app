import { create } from "zustand";

export interface Position {
  id: number;
  code: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  createdAt: string;
}

interface PositionStore {
  positions: Position[];

  // CRUD operations
  getPositionById: (id: number) => Position | undefined;
  addPosition: (position: Omit<Position, "id" | "createdAt">) => void;
  updatePosition: (
    id: number,
    updates: Partial<Omit<Position, "id" | "createdAt">>,
  ) => void;
  deletePosition: (id: number) => void;
}

const usePositionStore = create<PositionStore>((set, get) => ({
  // Initial data
  positions: [
    {
      id: 1,
      code: "POS-GD",
      name: "Giám Đốc",
      description:
        "Người đứng đầu, chịu trách nhiệm quản lý chung toàn bộ hoạt động của doanh nghiệp.",
      status: "active",
      createdAt: "2024-01-01",
    },
    {
      id: 2,
      code: "POS-TP",
      name: "Trưởng Phòng",
      description:
        "Quản lý hoạt động của một phòng ban cụ thể (Kinh doanh, Kỹ thuật, ...).",
      status: "active",
      createdAt: "2024-01-05",
    },
    {
      id: 3,
      code: "POS-KS",
      name: "Kỹ Sư Nông Nghiệp",
      description:
        "Chịu trách nhiệm kỹ thuật trồng trọt, chăm sóc và bảo vệ thực vật.",
      status: "active",
      createdAt: "2024-01-10",
    },
    {
      id: 4,
      code: "POS-NV",
      name: "Nhân Viên Kinh Doanh",
      description: "Thực hiện tìm kiếm khách hàng, tư vấn và bán sản phẩm.",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 5,
      code: "POS-KT",
      name: "Kế Toán Viên",
      description:
        "Thực hiện các công việc liên quan đến tài chính, kế toán, thuế.",
      status: "active",
      createdAt: "2024-01-20",
    },
    {
      id: 6,
      code: "POS-QL",
      name: "Quản Lý Kho",
      description: "Quản lý xuất nhập tồn, bảo quản hàng hóa trong kho.",
      status: "active",
      createdAt: "2024-01-25",
    },
    {
      id: 7,
      code: "POS-CN",
      name: "Công Nhân Sản Xuất",
      description: "Thực hiện các công việc lao động trực tiếp tại nông trại.",
      status: "active",
      createdAt: "2024-01-30",
    },
    {
      id: 8,
      code: "POS-BV",
      name: "Nhân Viên Bảo Vệ",
      description: "Đảm bảo an ninh, trật tự và tài sản của doanh nghiệp.",
      status: "active",
      createdAt: "2024-02-01",
    },
  ],

  // CRUD operations
  getPositionById: (id) => {
    return get().positions.find((p) => p.id === id);
  },

  addPosition: (positionData) => {
    set((state) => {
      const newId =
        state.positions.length > 0
          ? Math.max(...state.positions.map((p) => p.id)) + 1
          : 1;
      const newPosition: Position = {
        ...positionData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        positions: [...state.positions, newPosition],
      };
    });
  },

  updatePosition: (id, updates) => {
    set((state) => ({
      positions: state.positions.map((p) =>
        p.id === id ? { ...p, ...updates } : p,
      ),
    }));
  },

  deletePosition: (id) => {
    set((state) => ({
      positions: state.positions.filter((p) => p.id !== id),
    }));
  },
}));

export default usePositionStore;
