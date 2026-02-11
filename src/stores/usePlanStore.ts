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
  selectedRegionId: string;
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;

  // Additional display fields
  zone?: string;
  cultivationArea?: string;
  plot?: string;
  area?: string;
  expectedYield?: string;

  // Process
  growthCycleId: string;
  selectedStages: string[];

  // Resources
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];

  // Status
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
}

interface PlanStore {
  plans: Plan[];
  getPlanById: (id: number) => Plan | undefined;
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
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
        plans: [
          {
            id: 1,
            code: "KH001",
            name: "Kế hoạch sầu riêng vụ Xuân 2025",
            description:
              "Kế hoạch canh tác sầu riêng Monthon vụ Xuân 2025 tại vùng A1",
            seasonId: "spring-2025",
            seasonName: "Vụ Xuân 2025",
            startDate: "2025-01-15",
            endDate: "2025-06-30",
            selectedRegionId: "pr-1",
            selectedZoneIds: ["zone-1-1"],
            selectedPlotIds: ["plot-1-1-1", "plot-1-1-2"],
            crop: "Sầu riêng",
            variety: "Monthon",
            growthCycleId: "durian-standard",
            selectedStages: [
              "Chuẩn bị đất",
              "Gieo trồng",
              "Chăm sóc giai đoạn 1",
              "Bón phân lần 1",
              "Phun thuốc BVTV",
            ],
            materialAllocations: [
              {
                id: 1,
                stageId: "Chuẩn bị đất",
                materialCategory: "Phân bón",
                materialType: "Phân hữu cơ",
                materialName: "Phân chuồng",
                quantity: "500",
                unit: "kg",
              },
              {
                id: 2,
                stageId: "Bón phân lần 1",
                materialCategory: "Phân bón",
                materialType: "Phân NPK",
                materialName: "NPK 20-20-15",
                quantity: "100",
                unit: "kg",
              },
            ],
            taskAllocations: [
              {
                id: 1,
                stageId: "Chuẩn bị đất",
                name: "Cày xới đất",
                description: "Cày sâu 30cm, phơi đất 5 ngày",
                labor: "2 người",
                duration: "3 ngày",
              },
            ],
            status: "active",
            createdAt: "2024-12-01",
          },
          {
            id: 2,
            code: "KH002",
            name: "Kế hoạch xoài vụ Hè 2025",
            description: "Kế hoạch canh tác xoài Cát Hòa Lộc vụ Hè 2025",
            seasonId: "summer-2025",
            seasonName: "Vụ Hè 2025",
            startDate: "2025-03-01",
            endDate: "2025-08-15",
            selectedRegionId: "pr-3",
            selectedZoneIds: ["zone-2-1"],
            selectedPlotIds: ["plot-2-1-1"],
            crop: "Xoài",
            variety: "Cát Hòa Lộc",
            growthCycleId: "mango-standard",
            selectedStages: [
              "Chuẩn bị đất",
              "Gieo trồng",
              "Chăm sóc giai đoạn 1",
            ],
            materialAllocations: [],
            taskAllocations: [],
            status: "draft",
            createdAt: "2024-12-10",
          },
          {
            id: 3,
            code: "KH003",
            name: "Kế hoạch bưởi da xanh 2025",
            description: "Kế hoạch canh tác bưởi da xanh vụ Thu 2025",
            seasonId: "fall-2025",
            seasonName: "Vụ Thu 2025",
            startDate: "2025-07-01",
            endDate: "2025-12-31",
            selectedRegionId: "pr-2",
            selectedZoneIds: ["zone-1-2"],
            selectedPlotIds: ["plot-1-2-1"],
            crop: "Bưởi",
            variety: "Da xanh",
            growthCycleId: "pomelo-standard",
            selectedStages: ["Chuẩn bị đất"],
            materialAllocations: [],
            taskAllocations: [],
            status: "draft",
            createdAt: "2024-12-15",
          },
        ],

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
        name: "plan-storage",
      },
    ),
  ),
);

export default usePlanStore;
