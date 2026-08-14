import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type { Edge } from "reactflow";
import type { DraftNode } from "../pages/plan-growth/hooks/usePlanWorkflowDraftStore";
import { initialWorkflows } from "./planWorkflowSeed";

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
  // Canvas snapshot captured when "Lưu quy trình" is clicked, so the
  // workflow can be reopened later with its plan tree intact.
  nodes: DraftNode[];
  edges: Edge[];
}

type UpsertWorkflowInput = Omit<Workflow, "createdAt" | "nodes" | "edges"> & {
  createdAt?: string;
  nodes?: DraftNode[];
  edges?: Edge[];
};

interface WorkflowStore {
  workflows: Workflow[];
  upsertWorkflow: (workflow: UpsertWorkflowInput) => void;
  getWorkflowById: (id: string) => Workflow | undefined;
  deleteWorkflow: (id: string) => void;
  cloneWorkflow: (id: string) => Workflow | undefined;
}

const useWorkflowStore = create<WorkflowStore>()(
  devtools(
    persist(
      (set, get) => ({
        workflows: initialWorkflows,

        upsertWorkflow: (workflow) => {
          set((state) => {
            const existingIndex = state.workflows.findIndex(
              (item) => item.id === workflow.id,
            );
            const existing = state.workflows[existingIndex];
            const record: Workflow = {
              ...workflow,
              createdAt:
                workflow.createdAt || existing?.createdAt || new Date().toISOString(),
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

        getWorkflowById: (id) => get().workflows.find((item) => item.id === id),

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
        // v2: Workflow records now carry a nodes/edges canvas snapshot —
        // bumped so stale v1 records (saved before that field existed)
        // don't rehydrate without it.
        name: "workflow-storage-v2",
      },
    ),
    { name: "WorkflowStore" },
  ),
);

export default useWorkflowStore;
