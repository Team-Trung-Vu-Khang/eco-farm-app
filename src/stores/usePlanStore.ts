import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { initialPlans } from "./planWorkflowSeed";

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
  geographicalSelections?: import("../pages/plan/types").GeographicalSelection[];
  isRepeating?: boolean;
  repeatDays?: number[];
  repeatWeeks?: number;
  // ISO date strings (YYYY-MM-DD) explicitly picked on the repeat calendar —
  // supersedes repeatDays/repeatWeeks for tasks created after that UI change.
  repeatDates?: string[];
}

export interface Plan {
  id: number;
  code: string;
  name: string;
  description: string;
  scopeNote?: string;
  workflowId?: string;
  seasonId: string;
  seasonName: string;
  startDate: string;
  endDate: string;
  // Total planned duration in days, straight from the API's
  // FarmPlanResponse.durationDays — the source of truth for display, since
  // startDate/endDate are often unset on a freshly created draft plan.
  durationDays?: number;

  // Location & Crop
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

  // Additional display fields
  zone?: string;
  cultivationRegion?: string;
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
  // Free-form metadata from the API. `parentId` links this plan to the plan
  // node it branched off from in the workflow canvas — the canvas graph is
  // otherwise local-draft-only and doesn't survive a reload from the backend.
  metadataJson?: Record<string, any>;
}


export { initialPlans };


interface PlanStore {
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

        duplicatePlan: (id) => {
          const plan = get().plans.find((p) => p.id === id);
          if (plan) {
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
            set((state) => ({
              plans: [...state.plans, newPlan],
            }));
          }
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
            cancelled: plans.filter((p) => p.status === "cancelled").length,
            total: plans.length,
          };
        },
      }),
      {
        // v2: reseeded with the "5 sơ đồ x 5-6 kế hoạch" demo dataset and
        // workflowId links — bumped so old persisted plans don't mix in.
        name: "plan-reset-storage-v2",
      },
    ),
    { name: "PlanStore" },
  ),
);

export default usePlanStore;
