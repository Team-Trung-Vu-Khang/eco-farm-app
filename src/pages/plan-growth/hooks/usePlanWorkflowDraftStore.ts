import { applyEdgeChanges, applyNodeChanges } from "reactflow";
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow";
import { create } from "zustand";
import type { Plan } from "@/stores/usePlanStore";
import type { GeographicalSelection } from "../types";

export type WorkflowSetupKind = "plan" | "stage" | "detail";

export type StagePayload = {
  stageName: string;
  stageDescription: string;
  duration: string;
};

export type DetailPayload = {
  taskName: string;
  taskDescription: string;
  labor: string;
  materialCategory: string;
  materialType: string;
  materialName: string;
  quantity: string;
  unit: string;
};

export type WorkflowNodeData =
  | { setupKind: "plan"; planId: number; parentId?: string }
  | { setupKind: "stage"; payload: StagePayload; parentId: string }
  | { setupKind: "detail"; payload: DetailPayload; parentId: string };

export type DraftNode = Node<WorkflowNodeData>;

export type DiagramInfoRecord = {
  id: string;
  name: string;
  description: string;
  selections: GeographicalSelection[];
  plannedDurationYears: string;
  plannedDurationMonths: string;
  plannedDurationDays: string;
  isActive: boolean;
  position: { x: number; y: number };
};

export function getStagePayload(node: DraftNode): StagePayload {
  return node.data.setupKind === "stage"
    ? node.data.payload
    : { stageName: "", stageDescription: "", duration: "" };
}

export function getDetailPayload(node: DraftNode): DetailPayload {
  return node.data.setupKind === "detail"
    ? node.data.payload
    : {
        taskName: "",
        taskDescription: "",
        labor: "",
        materialCategory: "",
        materialType: "",
        materialName: "",
        quantity: "",
        unit: "",
      };
}

export const INFO_NODE_X = -560;
const INFO_NODE_GAP_Y = 300;

export function createInfoNodeId() {
  return `info-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getNextInfoNodePosition(existing: DiagramInfoRecord[]) {
  return { x: INFO_NODE_X, y: existing.length * INFO_NODE_GAP_Y };
}

export function createNodeId(kind: "plan" | "stage" | "detail") {
  return `${kind}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Placeholder — usePlanWorkflowDraftStore auto-lays out the whole tree after
// every add/remove, so the exact initial value doesn't matter.
export const PLACEHOLDER_POSITION = { x: 0, y: 0 };

function buildAutoPlanCode() {
  const now = new Date();
  const stamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("");

  return `KH-DRAFT-${stamp}`;
}

export function createEmptyPlanDraft(name = ""): Omit<Plan, "id" | "createdAt"> {
  return {
    code: buildAutoPlanCode(),
    name,
    description: "",
    seasonId: "",
    seasonName: "",
    startDate: "",
    endDate: "",
    selectedRegionIds: [],
    selectedZoneIds: [],
    selectedPlotIds: [],
    crop: "",
    variety: "",
    purpose: "cultivation",
    growthCycleId: "",
    regimenId: "",
    selectedStages: [],
    materialAllocations: [],
    taskAllocations: [],
    status: "draft",
  };
}

export const DEFAULT_DRAFT_PLAN_NAME = "Kế hoạch Draft";

export function getParentId(node: DraftNode): string | undefined {
  return node.data.parentId;
}

export function getDirectChildren(nodes: DraftNode[], parentId: string): DraftNode[] {
  return nodes.filter((node) => getParentId(node) === parentId);
}

export function getDescendantNodes(nodes: DraftNode[], parentId: string): DraftNode[] {
  const directChildren = getDirectChildren(nodes, parentId);
  return directChildren.flatMap((child) => [child, ...getDescendantNodes(nodes, child.id)]);
}

const LEVEL_HEIGHT = 320;
const ROOT_GAP = 900;
const CHILD_GAP = 480;

// Places a newly added node next to its existing siblings (or the last root)
// without moving any already-positioned node, so the tree only grows outward.
function placeNewNode(nodes: DraftNode[], parentId: string | undefined) {
  if (!parentId) {
    const roots = nodes.filter((node) => !getParentId(node));
    if (!roots.length) return { x: 0, y: 0 };
    const maxX = Math.max(...roots.map((node) => node.position.x));
    return { x: maxX + ROOT_GAP, y: 0 };
  }

  const parent = nodes.find((node) => node.id === parentId);
  if (!parent) return { x: 0, y: 0 };

  const siblings = getDirectChildren(nodes, parentId);
  const y = parent.position.y + LEVEL_HEIGHT;
  if (!siblings.length) return { x: parent.position.x, y };

  const maxSiblingX = Math.max(...siblings.map((node) => node.position.x));
  return { x: maxSiblingX + CHILD_GAP, y };
}

interface PlanWorkflowDraftState {
  nodes: DraftNode[];
  edges: Edge[];
  infoNodes: DiagramInfoRecord[];
  // Which saved workflow (if any) this draft currently mirrors. null means
  // "unsaved fresh draft" — used to tell that apart from "draft still holds
  // a previously opened saved workflow" so a bare /create/workflow visit
  // knows when it must reset instead of reusing stale state.
  activeWorkflowId: string | null;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setEdges: (updater: Edge[] | ((current: Edge[]) => Edge[])) => void;
  addNode: (node: DraftNode) => void;
  addNodeWithEdge: (node: DraftNode, edge: Edge) => void;
  updateNodePayload: (nodeId: string, payload: StagePayload | DetailPayload) => void;
  removeNodeCascade: (nodeId: string) => void;
  setInfoNodes: (updater: DiagramInfoRecord[] | ((current: DiagramInfoRecord[]) => DiagramInfoRecord[])) => void;
  loadWorkflow: (data: {
    nodes: DraftNode[];
    edges: Edge[];
    infoNodes: DiagramInfoRecord[];
    activeWorkflowId: string;
  }) => void;
  resetDraft: () => void;
}

export const usePlanWorkflowDraftStore = create<PlanWorkflowDraftState>()((set, get) => ({
  nodes: [],
  edges: [],
  infoNodes: [],
  activeWorkflowId: null,

  onNodesChange: (changes) => {
    set((state) => {
      const knownIds = new Set(state.nodes.map((node) => node.id));
      const relevantChanges = changes.filter((change) =>
        "id" in change ? knownIds.has(change.id) : true,
      );
      // Nodes rendered outside this store (e.g. DiagramInfo cards) still emit
      // dimension/position changes here. Returning the same state reference
      // (instead of a fresh array with no matching ids) lets zustand skip the
      // update — otherwise those foreign, ever-unmeasured nodes trigger an
      // infinite re-render loop.
      if (relevantChanges.length === 0) return state;
      return { ...state, nodes: applyNodeChanges(relevantChanges, state.nodes) as DraftNode[] };
    });
  },

  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },

  setEdges: (updater) => {
    set((state) => ({
      edges: typeof updater === "function" ? updater(state.edges) : updater,
    }));
  },

  addNode: (node) => {
    set((state) => ({
      nodes: [
        ...state.nodes,
        { ...node, position: placeNewNode(state.nodes, getParentId(node)) },
      ],
    }));
  },

  addNodeWithEdge: (node, edge) => {
    set((state) => ({
      nodes: [
        ...state.nodes,
        { ...node, position: placeNewNode(state.nodes, getParentId(node)) },
      ],
      edges: [...state.edges, edge],
    }));
  },

  updateNodePayload: (nodeId, payload) => {
    set((state) => ({
      nodes: state.nodes.map((node) => {
        if (node.id !== nodeId) return node;
        if (node.data.setupKind === "stage") {
          return { ...node, data: { ...node.data, payload: payload as StagePayload } };
        }
        if (node.data.setupKind === "detail") {
          return { ...node, data: { ...node.data, payload: payload as DetailPayload } };
        }
        return node;
      }),
    }));
  },

  removeNodeCascade: (nodeId) => {
    const { nodes, edges } = get();
    const removable = new Set([
      nodeId,
      ...getDescendantNodes(nodes, nodeId).map((node) => node.id),
    ]);

    set({
      nodes: nodes.filter((node) => !removable.has(node.id)),
      edges: edges.filter((edge) => !removable.has(edge.source) && !removable.has(edge.target)),
    });
  },

  setInfoNodes: (updater) => {
    set((state) => ({
      infoNodes: typeof updater === "function" ? updater(state.infoNodes) : updater,
    }));
  },

  loadWorkflow: ({ nodes, edges, infoNodes, activeWorkflowId }) => {
    set({ nodes, edges, infoNodes, activeWorkflowId });
  },

  resetDraft: () => {
    set({ nodes: [], edges: [], infoNodes: [], activeWorkflowId: null });
  },
}));
