import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { initialAnimalGrowthPlans } from "./animalGrowthWorkflowSeed";

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
  geographicalSelections?: import("../pages/plan-animal-growth/types").GeographicalSelection[];
  isRepeating?: boolean;
  repeatDays?: number[];
  repeatWeeks?: number;
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  workflowId?: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  selectedRegionIds: string[];
  selectedZoneIds: string[];
  selectedPlotIds: string[];
  crop: string;
  variety: string;
  purpose:
    | "cultivation"
    | "facility-upgrade"
    | "treatment"
    | "amendment"
    | "harvest"
    | "incurred";
  zone?: string;
  cultivationRegion?: string;
  plot?: string;
  area?: string;
  expectedYield?: string;
  growthCycleId: string;
  regimenId?: string;
  selectedStages: string[];
  materialAllocations: MaterialAllocation[];
  taskAllocations: TaskAllocation[];
  status: "draft" | "active" | "completed" | "cancelled";
  createdAt: string;
}

export { initialAnimalGrowthPlans };

interface AnimalGrowthPlanStore {
  plans: Plan[];
  getPlanById: (id: number) => Plan | undefined;
  addPlan: (plan: Omit<Plan, "id" | "createdAt">) => void;
  updatePlan: (id: number, updates: Partial<Plan>) => void;
  deletePlan: (id: number) => void;
  duplicatePlan: (id: number) => void;
  resetPlans: () => void;
  getStatistics: () => {
    active: number;
    draft: number;
    completed: number;
    cancelled: number;
    total: number;
  };
}

const useAnimalGrowthPlanStore = create<AnimalGrowthPlanStore>()(
  devtools(
    persist(
      (set, get) => ({
        plans: initialAnimalGrowthPlans,

        getPlanById: (id) => get().plans.find((p) => p.id === id),

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
          set((state) => ({ plans: [...state.plans, newPlan] }));
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

        duplicatePlan: (id) => {
          const plan = get().plans.find((p) => p.id === id);
          if (!plan) return;

          const newId =
            get().plans.length > 0
              ? Math.max(...get().plans.map((p) => p.id)) + 1
              : 1;
          const newPlan: Plan = {
            ...plan,
            id: newId,
            name: `${plan.name} (Bản sao)`,
            code: `${plan.code}-COPY`,
            status: "draft",
            createdAt: new Date().toISOString().split("T")[0],
          };
          set((state) => ({ plans: [...state.plans, newPlan] }));
        },

        resetPlans: () => {
          set({ plans: initialAnimalGrowthPlans });
        },

        getStatistics: () => {
          const plans = get().plans;
          return {
            active: plans.filter((p) => p.status === "active").length,
            draft: plans.filter((p) => p.status === "draft").length,
            completed: plans.filter((p) => p.status === "completed").length,
            cancelled: plans.filter((p) => p.status === "cancelled").length,
            total: plans.length,
          };
        },
      }),
      {
        name: "animal-growth-plan-storage-v1",
      },
    ),
    { name: "AnimalGrowthPlanStore" },
  ),
);

export default useAnimalGrowthPlanStore;
