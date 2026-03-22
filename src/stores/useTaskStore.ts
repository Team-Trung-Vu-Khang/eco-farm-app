import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface MaterialAllocation {
  id: number;
  name: string;
  quantity: string;
  unit: string;
  type: "fertilizer" | "pesticide" | "other" | "tool";
  stageId: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
}

export interface Task {
  id: number;
  code: string;
  name: string;
  plan: string;
  stage: string;
  assignedTo: string[];
  assignedType: "individual" | "team";
  supervisors?: string[];
  qualityInspectors?: string[];
  startDate: string;
  endDate: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in-progress" | "completed" | "overdue";
  description: string;
  createdAt: string;
  materials?: MaterialAllocation[];
  tasks?: any[];
  geographicalSelections?: any[];
}

interface TaskStore {
  tasks: Task[];
  getTaskById: (id: number) => Task | undefined;
  addTask: (task: Omit<Task, "id" | "createdAt" | "status">) => void;
  updateTask: (id: number, updates: Partial<Task>) => void;
  deleteTask: (id: number) => void;
  getStatistics: () => {
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
    total: number;
  };
}

const initialData: Task[] = [
  // Tháng 1/2026 (Quá khứ/Hoàn thành)
  {
    id: 1,
    code: "CV26-001",
    name: "Cắt tỉa cành tạo tán sau thu hoạch",
    plan: "Kế hoạch bưởi Da Xanh 2026",
    stage: "Tỉa cành",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2026-01-05",
    endDate: "2026-01-10",
    priority: "high",
    status: "completed",
    description:
      "Cắt tỉa cành già, cành sâu bệnh, tạo độ thông thoáng cho vườn",
    createdAt: "2025-12-25",
  },
  {
    id: 2,
    code: "CV26-002",
    name: "Bón vôi xử lý đất",
    plan: "Kế hoạch sầu riêng vụ Xuân 2026",
    stage: "Chuẩn bị đất",
    assignedTo: ["Nguyễn Văn Hùng"],
    assignedType: "individual",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Lê Thị Hoa", "Trần Thị Lan"],
    startDate: "2026-01-12",
    endDate: "2026-01-15",
    priority: "medium",
    status: "completed",
    description: "Rải vôi bột khử chua, diệt nấm bệnh trong đất",
    createdAt: "2026-01-05",
  },

  // Tháng 2/2026 (Hiện tại)
  {
    id: 3,
    code: "CV26-003",
    name: "Xử lý ra hoa sầu riêng",
    plan: "Kế hoạch sầu riêng vụ Xuân 2026",
    stage: "Xử lý ra hoa",
    assignedTo: ["Đội Kỹ thuật & BVTV"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng", "Lê Văn Tám"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2026-02-01",
    endDate: "2026-02-07",
    priority: "high",
    status: "in-progress",
    description:
      "Kiểm tra độ ẩm đất, phun thuốc kích thích ra hoa theo quy trình",
    createdAt: "2026-01-25",
  },
  {
    id: 4,
    code: "CV26-004",
    name: "Bao trái xoài đợt 1",
    plan: "Kế hoạch xoài Cát Chu 2026",
    stage: "Bao trái",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: ["Lê Thị Hoa"],
    startDate: "2026-02-05",
    endDate: "2026-02-12",
    priority: "medium",
    status: "in-progress",
    description: "Bao trái bằng túi chuyên dụng để tránh ruồi vàng",
    createdAt: "2026-01-30",
  },
  {
    id: 5,
    code: "CV26-005",
    name: "Kiểm tra hệ thống tưới",
    plan: "Kế hoạch bưởi Da Xanh 2026",
    stage: "Chăm sóc trái non",
    assignedTo: ["Phạm Quốc Bảo"],
    assignedType: "individual",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Trần Thị Lan", "Lê Thị Hoa"],
    startDate: "2026-02-06",
    endDate: "2026-02-06",
    priority: "high",
    status: "pending",
    description: "Kiểm tra áp lực nước, vệ sinh béc tưới khu A",
    createdAt: "2026-02-01",
  },
  {
    id: 6,
    code: "CV26-006",
    name: "Phun thuốc phòng trừ nhện đỏ",
    plan: "Kế hoạch bưởi Da Xanh 2026",
    stage: "Phòng trừ nhện đỏ",
    assignedTo: ["Đội Kỹ thuật & BVTV"],
    assignedType: "team",
    supervisors: ["Lê Văn Tám"],
    qualityInspectors: ["Trần Thị Lan"],
    startDate: "2026-02-08",
    endDate: "2026-02-10",
    priority: "high",
    status: "pending",
    description: "Phun thuốc đặc trị nhện đỏ, lưu ý phun kỹ mặt dưới lá",
    createdAt: "2026-02-02",
  },
  {
    id: 7,
    code: "CV26-007",
    name: "Bón phân nuôi trái lần 1",
    plan: "Kế hoạch sầu riêng vụ Xuân 2026",
    stage: "Bón phân nuôi trái",
    assignedTo: ["Lê Văn Tám"],
    assignedType: "individual",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: ["Lê Thị Hoa"],
    startDate: "2026-02-15",
    endDate: "2026-02-18",
    priority: "medium",
    status: "pending",
    description: "Bón NPK 12-12-17 + TE, liều lượng 1kg/gốc",
    createdAt: "2026-02-01",
  },

  // Tháng 3/2026 (Tương lai)
  {
    id: 8,
    code: "CV26-008",
    name: "Tuyển trái sầu riêng đợt 1",
    plan: "Kế hoạch sầu riêng vụ Xuân 2026",
    stage: "Tuyển trái L1",
    assignedTo: ["Đội Kỹ thuật & BVTV"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo", "Nguyễn Văn Hùng"],
    qualityInspectors: ["Trần Thị Lan", "Lê Thị Hoa"],
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    priority: "high",
    status: "pending",
    description: "Loại bỏ trái méo, trái nhỏ, giữ lại trái đẹp phân bố đều",
    createdAt: "2026-02-01",
  },
  {
    id: 9,
    code: "CV26-009",
    name: "Thu hoạch xoài đợt 1",
    plan: "Kế hoạch xoài Cát Chu 2026",
    stage: "Thu hoạch",
    assignedTo: ["Đội Thu hoạch & Vận chuyển"],
    assignedType: "team",
    supervisors: ["Lê Văn Tám"],
    qualityInspectors: ["Lê Thị Hoa"],
    startDate: "2026-03-20",
    endDate: "2026-03-25",
    priority: "high",
    status: "pending",
    description: "Thu hoạch xoài đủ độ già, vận chuyển về kho đóng gói",
    createdAt: "2026-02-15",
  },
  {
    id: 10,
    code: "CV26-010",
    name: "Bảo dưỡng máy móc định kỳ",
    plan: "Kế hoạch sầu riêng vụ Xuân 2026",
    stage: "Chuẩn bị đất",
    assignedTo: ["Đội Cơ giới hóa"],
    assignedType: "team",
    supervisors: ["Phạm Quốc Bảo"],
    qualityInspectors: [],
    startDate: "2026-02-28",
    endDate: "2026-02-28",
    priority: "low",
    status: "pending",
    description: "Thay nhớt, kiểm tra động cơ máy cày, máy phun thuốc",
    createdAt: "2026-02-01",
  },
  {
    id: 11,
    code: "CV26-011",
    name: "Phát cỏ vườn bưởi",
    plan: "Kế hoạch bưởi Da Xanh 2026",
    stage: "Chăm sóc trái non",
    assignedTo: ["Trần Thị Mai"],
    assignedType: "individual",
    supervisors: ["Nguyễn Văn Hùng"],
    qualityInspectors: [],
    startDate: "2026-02-20",
    endDate: "2026-02-22",
    priority: "low",
    status: "pending",
    description: "Phát cỏ giữ ẩm chân gốc",
    createdAt: "2026-02-05",
  },
  {
    id: 12,
    code: "CV26-012",
    name: "Gia cố bờ bao chống ngập",
    plan: "Xử lý ngập úng bất ngờ",
    stage: "Phát sinh",
    assignedTo: ["Đội Canh tác & Chăm sóc"],
    assignedType: "team",
    supervisors: ["Nguyễn Văn Hùng"],
    startDate: "2026-02-10",
    endDate: "2026-02-11",
    priority: "high",
    status: "completed",
    description: "Đắp thêm bao cát tại các điểm thấp trũng của bờ bao",
    createdAt: "2026-02-10",
  },
  {
    id: 13,
    code: "CV26-013",
    name: "Lắp đặt rào chắn thu hoạch",
    plan: "Kế hoạch Thu hoạch Sầu riêng 2026",
    stage: "Chuẩn bị kho",
    assignedTo: ["Phạm Quốc Bảo"],
    assignedType: "individual",
    startDate: "2026-05-15",
    endDate: "2026-05-16",
    priority: "medium",
    status: "pending",
    description: "Lắp đặt rào chắn và biển báo khu vực thu hoạch",
    createdAt: "2026-02-15",
  },
  {
    id: 14,
    code: "CV26-014",
    name: "Kiểm tra mật độ rầy",
    plan: "Điều trị rầy phấn trắng đợt 1",
    stage: "Kiểm tra sau phun",
    assignedTo: ["Trần Thị Lan"],
    assignedType: "individual",
    startDate: "2026-03-20",
    endDate: "2026-03-20",
    priority: "high",
    status: "pending",
    description: "Đếm số lượng rầy trên 10 lá ngẫu nhiên mỗi cây",
    createdAt: "2026-03-05",
  },
  {
    id: 15,
    code: "CV26-015",
    name: "Chuẩn bị giá thể xơ dừa",
    plan: "Kế hoạch Dưa lưới nhà màng",
    stage: "Ươm cây con",
    assignedTo: ["Lê Thị Hoa"],
    assignedType: "individual",
    startDate: "2026-03-01",
    endDate: "2026-03-05",
    priority: "medium",
    status: "completed",
    description: "Xử lý xơ dừa, phối trộn dinh dưỡng và đóng bầu",
    createdAt: "2026-02-20",
  },
];

const useTaskStore = create<TaskStore>()(
  devtools(
    persist(
      (set, get) => ({
        tasks: initialData,

        getTaskById: (id) => {
          return get().tasks.find((t) => t.id === id);
        },

        addTask: (taskData) => {
          const newId =
            get().tasks.length > 0
              ? Math.max(...get().tasks.map((t) => t.id)) + 1
              : 1;
          const newTask: Task = {
            ...taskData,
            id: newId,
            status: "pending",
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            tasks: [...state.tasks, newTask],
          }));
        },

        updateTask: (id, updates) => {
          set((state) => ({
            tasks: state.tasks.map((t) =>
              t.id === id ? { ...t, ...updates } : t,
            ),
          }));
        },

        deleteTask: (id) => {
          set((state) => ({
            tasks: state.tasks.filter((t) => t.id !== id),
          }));
        },

        getStatistics: () => {
          const tasks = get().tasks;
          return {
            pending: tasks.filter((t) => t.status === "pending").length,
            inProgress: tasks.filter((t) => t.status === "in-progress").length,
            completed: tasks.filter((t) => t.status === "completed").length,
            overdue: tasks.filter((t) => t.status === "overdue").length,
            total: tasks.length,
          };
        },
      }),
      {
        name: "task-storage",
      },
    ),
  ),
);

export default useTaskStore;
