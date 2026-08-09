import { applyEdgeChanges, applyNodeChanges } from "reactflow";
import type { Edge, EdgeChange, Node, NodeChange } from "reactflow";
import { create } from "zustand";

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

function applyTreeLayout(nodes: DraftNode[]): DraftNode[] {
  const positions = new Map<string, { x: number; y: number }>();
  let cursorX = 0;

  function layout(node: DraftNode, depth: number): number {
    const children = getDirectChildren(nodes, node.id);
    let x: number;

    if (!children.length) {
      x = cursorX;
      cursorX += depth === 0 ? ROOT_GAP : CHILD_GAP;
    } else {
      const childXs = children.map((child) => layout(child, depth + 1));
      x = (Math.min(...childXs) + Math.max(...childXs)) / 2;
    }

    positions.set(node.id, { x, y: depth * LEVEL_HEIGHT });
    return x;
  }

  const roots = nodes.filter((node) => !getParentId(node));
  roots.forEach((root) => layout(root, 0));

  return nodes.map((node) => {
    const position = positions.get(node.id);
    return position ? { ...node, position } : node;
  });
}

interface PlanWorkflowDraftState {
  nodes: DraftNode[];
  edges: Edge[];
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setEdges: (updater: Edge[] | ((current: Edge[]) => Edge[])) => void;
  addNode: (node: DraftNode) => void;
  addNodeWithEdge: (node: DraftNode, edge: Edge) => void;
  updateNodePayload: (nodeId: string, payload: StagePayload | DetailPayload) => void;
  removeNodeCascade: (nodeId: string) => void;
}

export const usePlanWorkflowDraftStore = create<PlanWorkflowDraftState>()((set, get) => ({
  nodes: [],
  edges: [],

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as DraftNode[] });
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
    set((state) => ({ nodes: applyTreeLayout([...state.nodes, node]) }));
  },

  addNodeWithEdge: (node, edge) => {
    set((state) => ({
      nodes: applyTreeLayout([...state.nodes, node]),
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
      nodes: applyTreeLayout(nodes.filter((node) => !removable.has(node.id))),
      edges: edges.filter((edge) => !removable.has(edge.source) && !removable.has(edge.target)),
    });
  },
}));
