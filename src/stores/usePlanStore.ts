import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// Interface cho vật tư chi tiết
export interface MaterialAllocation {
  id: number;
  stageId: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
  cycle?: string;
  packaging?: string;
}

export interface TaskAllocation {
  id: number;
  stageId: string;
  name: string;
  description: string;
  labor: string;
  duration: string;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;

  // Location & Crop
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose: "cultivation" | "treatment";

  // Additional display fields
  zone?: string;
  cultivationArea?: string;
  plot?: string;
  area?: string;
  expectedYield?: string;

  // Process
  growthCycleId: string;
  regimenId?: string;
  selectedStages: string[];

  // Resources
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];

  // Status
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
}

const initialPlans: Plan[] = [
  {
    id: 1,
    code: "KH001",
    name: "Kế hoạch sầu riêng vụ Xuân 2025",
    description: "Kế hoạch canh tác sầu riêng Monthon vụ Xuân 2025 tại vùng A1",
    seasonId: "spring-2025",
    seasonName: "Vụ Xuân 2025",
    startDate: "2025-01-15",
    endDate: "2025-06-30",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-1"],
    selectedPlotIds: ["plot-1-1", "plot-1-2"],
    crop: "Sầu riêng",
    variety: "Monthon",
    purpose: "cultivation",
    growthCycleId: "GC001",
    area: "20.0",
    expectedYield: "45",
    selectedStages: [
      "Chuẩn bị đất",
      "Gieo trồng",
      "Chăm sóc giai đoạn 1",
      "Bón phân lần 1",
    ],
    materialAllocations: [
      {
        id: 1,
        stageId: "Chuẩn bị đất",
        materialCategory: "Phân bón",
        materialType: "Phân hữu cơ",
        materialName: "Phân chuồng hoai mục",
        quantity: "5000",
        unit: "kg",
      },
    ],
    taskAllocations: [
      {
        id: 1,
        stageId: "Chuẩn bị đất",
        name: "Cày ải và khử trùng đất",
        description: "Cày sâu 25-30cm, rải vôi bột khử trùng",
        labor: "5 người",
        duration: "7 ngày",
      },
    ],
    status: "active",
    createdAt: "2024-12-01",
  },
  {
    id: 2,
    code: "KH002",
    name: "Phác đồ khử phèn Khu B",
    description: "Cải tạo đất bị nhiễm phèn nặng tại Khu vực B",
    seasonId: "S2025-HE",
    seasonName: "Vụ Hè 2025",
    startDate: "2025-03-01",
    endDate: "2025-04-15",
    selectedRegionIds: ["1"],
    selectedZoneIds: ["sub-1-2"],
    selectedPlotIds: ["plot-1-3"],
    crop: "Cải tạo đất",
    variety: "",
    purpose: "treatment",
    regimenId: "reg-phen-cap-toc",
    growthCycleId: "",
    area: "15.5",
    expectedYield: "0",
    selectedStages: ["Xả phèn lần 1", "Bón vôi khử chua", "Kiểm tra pH đất"],
    materialAllocations: [
      {
        id: 3,
        stageId: "Bón vôi khử chua",
        materialCategory: "Khác",
        materialType: "Vôi bột",
        materialName: "Vôi nông nghiệp",
        quantity: "1500",
        unit: "kg",
      },
    ],
    taskAllocations: [
      {
        id: 2,
        stageId: "Xả phèn lần 1",
        name: "Bơm xả nước phèn",
        description: "Mở cống xả nước cũ, bơm nước mới vào ngâm",
        labor: "2 người",
        duration: "3 ngày",
      },
    ],
    status: "draft",
    createdAt: "2024-12-10",
  },
  {
    id: 3,
    code: "KH003",
    name: "Kế hoạch bưởi da xanh Bình Phước",
    description: "Canh tác bưởi da xanh tiêu chuẩn VietGAP",
    seasonId: "S001",
    seasonName: "Vụ Xuân 2024",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    selectedRegionIds: ["4"],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "Bưởi",
    variety: "Da xanh",
    purpose: "cultivation",
    growthCycleId: "GC002",
    area: "15.0",
    expectedYield: "12",
    selectedStages: ["Chuẩn bị cây giống", "Đào hố trồng"],
    materialAllocations: [],
    taskAllocations: [],
    status: "draft",
    createdAt: "2024-12-15",
  },
];

interface PlanStore {
  plans: Plan[];
  getPlanById: (id: number) => Plan | undefined;
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  resetPlans: () => void;
  getStatistics: () => {
    active: number;
    draft: number;
    completed: number;
    total: number;
  };
}

const usePlanStore = create<PlanStore>()(
  devtools(
    persist(
      (set, get) => ({
        plans: initialPlans,

        getPlanById: (id) => {
          return get().plans.find((p) => p.id === id);
        },

        addPlan: (planData) => {
          const newId =
            get().plans.length > 0
              ? Math.max(...get().plans.map((p) => p.id)) + 1
              : 1;
          const newPlan: Plan = {
            ...planData,
            id: newId,
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({
            plans: [...state.plans, newPlan],
          }));
        },

        updatePlan: (id, updates) => {
          set((state) => ({
            plans: state.plans.map((p) =>
              p.id === id ? { ...p, ...updates } : p,
            ),
          }));
        },

        deletePlan: (id) => {
          set((state) => ({
            plans: state.plans.filter((p) => p.id !== id),
          }));
        },

        resetPlans: () => {
          set({ plans: initialPlans });
        },

        getStatistics: () => {
          const plans = get().plans;
          return {
            active: plans.filter((p) => p.status === "active").length,
            draft: plans.filter((p) => p.status === "draft").length,
            completed: plans.filter((p) => p.status === "completed").length,
            total: plans.length,
          };
        },
      }),
      {
        name: "plan-reset-storage-v1",
      },
    ),
    { name: "PlanStore" },
  ),
);

export default usePlanStore;
