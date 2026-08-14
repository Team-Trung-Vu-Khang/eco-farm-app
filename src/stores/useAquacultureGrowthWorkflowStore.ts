import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Edge } from "reactflow";
import type { DraftNode } from "../pages/plan-aquaculture-growth/hooks/useAquacultureGrowthWorkflowDraftStore";
import { initialAquacultureGrowthWorkflows } from "./aquacultureGrowthWorkflowSeed";

export interface WorkflowGeographicalSelection {
  id: string;
  type: "region" | "area" | "plot";
  regionId: string;
  areaId?: string;
  plotId?: string;
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  selections: WorkflowGeographicalSelection[];
  isActive: boolean;
  createdAt: string;
  nodes: DraftNode[];
  edges: Edge[];
}

type UpsertWorkflowInput = Omit<Workflow, "createdAt" | "nodes" | "edges"> & {
  createdAt?: string;
  nodes?: DraftNode[];
  edges?: Edge[];
};

interface AquacultureGrowthWorkflowStore {
  workflows: Workflow[];
  upsertWorkflow: (workflow: UpsertWorkflowInput) => void;
  getWorkflowById: (id: string) => Workflow | undefined;
  deleteWorkflow: (id: string) => void;
  cloneWorkflow: (id: string) => Workflow | undefined;
}

const useAquacultureGrowthWorkflowStore = create<AquacultureGrowthWorkflowStore>()(
  devtools(
    persist(
      (set, get) => ({
        workflows: initialAquacultureGrowthWorkflows,

        upsertWorkflow: (workflow) => {
          set((state) => {
            const existingIndex = state.workflows.findIndex(
              (item) => item.id === workflow.id,
            );
            const existing = state.workflows[existingIndex];
            const record: Workflow = {
              ...workflow,
              createdAt:
                workflow.createdAt ||
                existing?.createdAt ||
                new Date().toISOString(),
              nodes: workflow.nodes ?? existing?.nodes ?? [],
              edges: workflow.edges ?? existing?.edges ?? [],
            };

            if (existingIndex === -1) {
              return { workflows: [...state.workflows, record] };
            }

            const nextWorkflows = [...state.workflows];
            nextWorkflows[existingIndex] = record;
            return { workflows: nextWorkflows };
          });
        },

        getWorkflowById: (id) =>
          get().workflows.find((item) => item.id === id),

        deleteWorkflow: (id) => {
          set((state) => ({
            workflows: state.workflows.filter((item) => item.id !== id),
          }));
        },

        cloneWorkflow: (id) => {
          const source = get().workflows.find((item) => item.id === id);
          if (!source) return undefined;

          const clone: Workflow = {
            ...source,
            id: `workflow-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            name: `${source.name} (Bản sao)`,
            createdAt: new Date().toISOString(),
          };
          set((state) => ({ workflows: [...state.workflows, clone] }));
          return clone;
        },
      }),
      {
        name: "aquaculture-growth-workflow-storage-v1",
      },
    ),
    { name: "AquacultureGrowthWorkflowStore" },
  ),
);

export default useAquacultureGrowthWorkflowStore;
