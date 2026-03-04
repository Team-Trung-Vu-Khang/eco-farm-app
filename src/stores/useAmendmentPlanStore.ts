import { create } from "zustand";

export interface AmendmentPlan {
  id: number;
  code: string;
  name: string;
  zone: string;
  target_issue: string;
  technician: string;
  startDate: string;
  endDate: string;
  status: "planning" | "in_progress" | "completed" | "cancelled";
  area: number;
  budget: number;
  methodCount: number;
  priority?: string;
  description?: string;
  currentPH?: string;
  targetPH?: string;
  processId?: string;
  regimenId?: string;
  selectedRegionId?: string;
  selectedZoneIds?: string[];
  selectedPlotIds?: string[];
  crop?: string;
  variety?: string;
  seasonId?: string;
  purpose?: "amendment" | "treatment";
  allocations?: AllocationItem[];
  createdAt: string;
}

export interface AllocationItem {
  id: number;
  stage: string;
  type: "material" | "task";
  name: string;
  detail: string;
  subDetail?: string;
  labor?: string;
  duration?: string;
}

interface AmendmentPlanStore {
  plans: AmendmentPlan[];

  // CRUD operations
  getPlanById: (id: number) => AmendmentPlan | undefined;
  addPlan: (plan: Omit<AmendmentPlan, "id" | "createdAt">) => void;
  updatePlan: (
    id: number,
    updates: Partial<Omit<AmendmentPlan, "id" | "createdAt">>,
  ) => void;
  deletePlan: (id: number) => void;

  // Statistics
  getStatistics: () => {
    planning: number;
    inProgress: number;
    completed: number;
    totalArea: string;
  };
}

const useAmendmentPlanStore = create<AmendmentPlanStore>((set, get) => ({
  // Initial data
  plans: [
    {
      id: 1,
      code: "CT001",
      name: "Cải tạo đất nhiễm mặn Vùng A",
      zone: "Vùng A - Cà Mau",
      target_issue: "Nhiễm mặn (EC > 4dS/m)",
      technician: "Nguyễn Văn A",
      startDate: "2025-02-15",
      endDate: "2025-04-30",
      status: "in_progress",
      area: 5.2,
      budget: 150,
      methodCount: 3,
      createdAt: "2025-01-10",
    },
    {
      id: 2,
      code: "CT002",
      name: "Xử lý đất chua phèn Vùng B",
      zone: "Vùng B - Long An",
      target_issue: "Chua phèn (pH < 4.0)",
      technician: "Trần Thị B",
      startDate: "2025-03-01",
      endDate: "2025-05-15",
      status: "planning",
      area: 3.5,
      budget: 85,
      methodCount: 2,
      createdAt: "2025-01-15",
    },
    {
      id: 3,
      code: "CT003",
      name: "Phục hồi đất bạc màu Vùng C",
      zone: "Vùng C - Đồng Nai",
      target_issue: "Bạc màu, nghèo dinh dưỡng",
      technician: "Lê Văn C",
      startDate: "2024-11-01",
      endDate: "2025-01-30",
      status: "completed",
      area: 4.0,
      budget: 120,
      methodCount: 4,
      createdAt: "2024-10-15",
    },
  ],

  // CRUD operations
  getPlanById: (id) => {
    return get().plans.find((p) => p.id === id);
  },

  addPlan: (planData) => {
    set((state) => {
      const newId =
        state.plans.length > 0
          ? Math.max(...state.plans.map((p) => p.id)) + 1
          : 1;
      const newPlan: AmendmentPlan = {
        ...planData,
        id: newId,
        createdAt: new Date().toISOString().split("T")[0],
      };
      return {
        plans: [...state.plans, newPlan],
      };
    });
  },

  updatePlan: (id, updates) => {
    set((state) => ({
      plans: state.plans.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
  },

  deletePlan: (id) => {
    set((state) => ({
      plans: state.plans.filter((p) => p.id !== id),
    }));
  },

  // Statistics
  getStatistics: () => {
    const plans = get().plans;
    return {
      planning: plans.filter((p) => p.status === "planning").length,
      inProgress: plans.filter((p) => p.status === "in_progress").length,
      completed: plans.filter((p) => p.status === "completed").length,
      totalArea: plans.reduce((acc, curr) => acc + curr.area, 0).toFixed(1),
    };
  },
}));

export default useAmendmentPlanStore;
