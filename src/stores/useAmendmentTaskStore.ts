import { create } from "zustand";

export interface AmendmentTask {
  id: number;
  code: string;
  name: string;
  plan: string; // Kế hoạch cải tạo
  zone: string; // Khu vực thực hiện
  method: string; // Phương pháp cải tạo
  assignedTo: string;
  assignedType: "individual" | "team";
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in_progress" | "completed" | "cancelled";
  materials: string[]; // Vật tư sử dụng
  equipment: string[]; // Thiết bị cần thiết
  targetArea: number; // Diện tích mục tiêu (ha)
  actualArea?: number; // Diện tích thực tế (ha)
  notes: string;
  createdAt: string;
}

interface AmendmentTaskStore {
  tasks: AmendmentTask[];

  // CRUD operations
  getTaskById: (id: number) => AmendmentTask | undefined;
  addTask: (task: Omit<AmendmentTask, "id" | "createdAt">) => void;
  updateTask: (
    id: number,
    updates: Partial<Omit<AmendmentTask, "id" | "createdAt">>,
  ) => void;
  deleteTask: (id: number) => void;

  // Statistics
  getStatistics: () => {
    pending: number;
    inProgress: number;
    completed: number;
    totalArea: string;
  };
}

const useAmendmentTaskStore = create<AmendmentTaskStore>((set, get) => ({
  // Initial data
  tasks: [
    {
      id: 1,
      code: "NVCT-001",
      name: "Rải vôi bột khử chua đất",
      plan: "Xử lý đất chua phèn Vùng B",
      zone: "Vùng B - Long An",
      method: "Bón vôi khử chua",
      assignedTo: "Đội Cải tạo đất",
      assignedType: "team",
      startDate: "2025-02-15",
      endDate: "2025-02-18",
      priority: "high",
      status: "in_progress",
      materials: ["Vôi bột CaCO3", "Phân hữu cơ"],
      equipment: ["Máy rải vôi", "Xe vận chuyển"],
      targetArea: 3.5,
      actualArea: 2.0,
      notes: "Liều lượng: 2 tấn/ha, rải đều trên bề mặt",
      createdAt: "2025-02-10",
    },
    {
      id: 2,
      code: "NVCT-002",
      name: "Tưới ngập rửa mặn lần 1",
      plan: "Cải tạo đất nhiễm mặn Vùng A",
      zone: "Vùng A - Cà Mau",
      method: "Rửa mặn",
      assignedTo: "Nguyễn Văn A",
      assignedType: "individual",
      startDate: "2025-02-20",
      endDate: "2025-02-25",
      priority: "urgent",
      status: "pending",
      materials: ["Nước ngọt"],
      equipment: ["Máy bơm nước", "Hệ thống tưới"],
      targetArea: 5.2,
      notes: "Tưới ngập 15-20cm, duy trì 3-5 ngày",
      createdAt: "2025-02-08",
    },
    {
      id: 3,
      code: "NVCT-003",
      name: "Cày xới sâu cải tạo cấu trúc đất",
      plan: "Phục hồi đất bạc màu Vùng C",
      zone: "Vùng C - Đồng Nai",
      method: "Cày xới sâu",
      assignedTo: "Đội Vận hành",
      assignedType: "team",
      startDate: "2025-01-10",
      endDate: "2025-01-15",
      priority: "medium",
      status: "completed",
      materials: [],
      equipment: ["Máy cày sâu", "Máy xới đất"],
      targetArea: 4.0,
      actualArea: 4.0,
      notes: "Cày sâu 40-50cm, phơi đất 7-10 ngày",
      createdAt: "2025-01-05",
    },
    {
      id: 4,
      code: "NVCT-004",
      name: "Bón phân hữu cơ cải thiện độ phì",
      plan: "Phục hồi đất bạc màu Vùng C",
      zone: "Vùng C - Đồng Nai",
      method: "Bón phân hữu cơ",
      assignedTo: "Trần Thị B",
      assignedType: "individual",
      startDate: "2025-02-22",
      endDate: "2025-02-24",
      priority: "medium",
      status: "pending",
      materials: ["Phân hữu cơ vi sinh", "Phân chuồng ủ"],
      equipment: ["Xe vận chuyển"],
      targetArea: 4.0,
      notes: "Liều lượng: 5 tấn/ha phân chuồng + 200kg/ha phân vi sinh",
      createdAt: "2025-02-12",
    },
    {
      id: 5,
      code: "NVCT-005",
      name: "Trồng đậu phụng phân xanh",
      plan: "Xử lý đất chua phèn Vùng B",
      zone: "Vùng B - Long An",
      method: "Trồng cây phân xanh",
      assignedTo: "Đội Kỹ thuật",
      assignedType: "team",
      startDate: "2025-03-01",
      endDate: "2025-03-05",
      priority: "low",
      status: "pending",
      materials: ["Hạt đậu phụng", "Phân lót"],
      equipment: ["Máy gieo hạt"],
      targetArea: 2.0,
      notes: "Gieo hạt mật độ 100kg/ha, sau 45 ngày cày vùi",
      createdAt: "2025-02-15",
    },
  ],

  // CRUD operations
  getTaskById: (id) => {
    return get().tasks.find((t) => t.id === id);
  },

  addTask: (taskData) => {
    set((state) => {
      const newId =
        state.tasks.length > 0
          ? Math.max(...state.tasks.map((t) => t.id)) + 1
          : 1;
      const newTask: AmendmentTask = {
        ...taskData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        tasks: [...state.tasks, newTask],
      };
    });
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));
  },

  deleteTask: (id) => {
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    }));
  },

  // Statistics
  getStatistics: () => {
    const tasks = get().tasks;
    return {
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in_progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
      totalArea: tasks
        .reduce((acc, curr) => acc + curr.targetArea, 0)
        .toFixed(1),
    };
  },
}));

export default useAmendmentTaskStore;
