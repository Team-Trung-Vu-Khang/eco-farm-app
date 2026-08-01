import PageWrapper from "@/components/PageWrapper";
import {
  Badge,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Check,
  Eye,
  Layers3,
  MapPin,
  PencilLine,
  Plus,
  Search,
  Sprout,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
  type Edge,
  type Node,
} from "reactflow";
import { useLocation, useParams } from "wouter";
import type {
  WorkflowActionItem,
  WorkflowCardNodeData,
  WorkflowNodeStatus,
} from "../growth-cycle/components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "../growth-cycle/components/workflow/WorkflowCardNode";
import {
  type Plot,
  type Region,
  type SubArea,
} from "../region-chart/constants";
import {
  getLandTypeName,
  getTerrainTypeName,
} from "../region-chart/utils/lookups";
import type {
  AreaNode,
  GeographicalUnit,
  PlotNode,
  RegionNode,
} from "./components/GeographicalTree";
import { buildGeographicalTree } from "./components/GeographicalTree";
import { getAquacultureDetailDraft } from "./data/detail-dummy";

const nodeTypes = {
  workflowCard: WorkflowCardNode,
};

type TreeKind = "root" | "region" | "area" | "plot";

type TreeModel = {
  id: string;
  parentId?: string;
  kind: TreeKind;
  title: string;
  subtitle?: string;
  description?: string;
  icon?: WorkflowCardNodeData["icon"];
  status?: WorkflowNodeStatus;
  wide?: boolean;
  summaries?: Array<{ label: string; value: string }>;
  actions?: WorkflowActionItem[];
  children: TreeModel[];
  width?: number;
  x?: number;
  y?: number;
};

type TreeDialogState = {
  title: string;
  subtitle: string;
  parentNodeId: string;
  parentKind: TreeKind;
  items: AddDialogItem[];
  emptyLabel: string;
  icon: WorkflowCardNodeData["icon"];
};

type AddDialogItem = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  kind: Exclude<TreeKind, "root">;
  data: Region | SubArea | Plot;
};

type RegionLike = RegionNode | Region;
type AreaLike = AreaNode | SubArea;
type PlotLike = PlotNode | Plot;

const CARD_WIDTH: Record<TreeKind, number> = {
  root: 360,
  region: 340,
  area: 340,
  plot: 340,
};

const NODE_Y_GAP = 290;
const NODE_X_GAP = 56;

function countTree(hierarchy: RegionNode[]) {
  let regions = 0;
  let areas = 0;
  let plots = 0;

  for (const region of hierarchy) {
    regions += 1;
    for (const area of region.areas || []) {
      areas += 1;
      plots += area.plots?.length ?? 0;
    }
  }

  return { regions, areas, plots };
}

function measureTree(node: TreeModel): number {
  const baseWidth = CARD_WIDTH[node.kind];
  if (!node.children.length) {
    node.width = baseWidth;
    return baseWidth;
  }

  const childWidths = node.children.map((child) => measureTree(child));
  const childrenTotal =
    childWidths.reduce((sum, width) => sum + width, 0) +
    NODE_X_GAP * (childWidths.length - 1);
  node.width = Math.max(baseWidth, childrenTotal);
  return node.width;
}

function layoutTree(node: TreeModel, x: number, y: number) {
  node.x = x;
  node.y = y;

  if (!node.children.length) return;

  const childrenTotal =
    node.children.reduce((sum, child) => sum + (child.width ?? 0), 0) +
    NODE_X_GAP * (node.children.length - 1);
  let cursor = x - childrenTotal / 2;

  for (const child of node.children) {
    const childWidth = child.width ?? CARD_WIDTH[child.kind];
    const childX = cursor + childWidth / 2;
    layoutTree(child, childX, y + NODE_Y_GAP);
    cursor += childWidth + NODE_X_GAP;
  }
}

function getGridPosition(
  index: number,
  total: number,
  options: {
    centerX: number;
    startY: number;
    columnGap: number;
    rowGap: number;
    columns: number;
  },
) {
  const row = Math.floor(index / options.columns);
  const column = index % options.columns;
  const itemsInRow = Math.min(options.columns, total - row * options.columns);
  const rowWidth = (itemsInRow - 1) * options.columnGap;

  return {
    x: options.centerX - rowWidth / 2 + column * options.columnGap,
    y: options.startY + row * options.rowGap,
  };
}

function flattenTree(node: TreeModel) {
  const nodes: TreeModel[] = [node];
  for (const child of node.children) {
    nodes.push(...flattenTree(child));
  }
  return nodes;
}

function makeActions(
  setLocation: (path: string) => void,
  detailPath: string,
  editPath: string,
): WorkflowActionItem[] {
  return [
    {
      label: "Xem chi tiết",
      icon: Eye,
      onClick: () => setLocation(detailPath),
    },
    {
      label: "Chỉnh sửa",
      icon: PencilLine,
      onClick: () => setLocation(editPath),
    },
  ];
}

function formatArea(value?: number) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return "Chưa rõ";
  }

  const rounded = Math.round(value * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded.toFixed(0) : rounded.toFixed(1)} ha`;
}

function getChildKindForNode(kind: TreeKind): Exclude<TreeKind, "root"> | null {
  if (kind === "root") return "region";
  if (kind === "region") return "area";
  if (kind === "area") return "plot";
  return null;
}

function getAddDialogState(node: TreeModel): TreeDialogState | null {
  const childKind = getChildKindForNode(node.kind);
  if (!childKind) return null;

  if (node.kind === "root") {
    return {
      title: "Chọn vùng để thêm",
      subtitle: `Chọn các vùng canh tác để thêm vào ${node.title}`,
      parentNodeId: node.id,
      parentKind: node.kind,
      items: [],
      emptyLabel: "Chưa có vùng nào để thêm.",
      icon: MapPin,
    };
  }

  if (node.kind === "region") {
    return {
      title: "Chọn khu vực để thêm",
      subtitle: `Chọn các khu vực để thêm vào ${node.title}`,
      parentNodeId: node.id,
      parentKind: node.kind,
      items: [],
      emptyLabel: "Chưa có khu vực nào để thêm.",
      icon: Layers3,
    };
  }

  return {
    title: "Chọn lô để thêm",
    subtitle: `Chọn các lô để thêm vào ${node.title}`,
    parentNodeId: node.id,
    parentKind: node.kind,
    items: [],
    emptyLabel: "Chưa có lô nào để thêm.",
    icon: Sprout,
  };
}

function buildAddDialogItemsForNode(
  node: TreeModel,
  regions: Region[],
  getAreaById: (id: string) => { area: SubArea; region: Region } | undefined,
): AddDialogItem[] {
  if (node.kind === "root") {
    return regions.map((region) => ({
      id: `region-${region.id}`,
      title: region.name,
      subtitle: `${region.subAreas?.length ?? 0} khu vực`,
      description: `Diện tích ${formatArea(region.area)} · ${getLandTypeName(region.landType)} · ${getTerrainTypeName(region.terrain)}`,
      kind: "region",
      data: region,
    }));
  }

  if (node.kind === "region") {
    const regionId = Number(node.id.replace("region-", ""));
    const region = regions.find((item) => item.id === regionId);
    return (region?.subAreas ?? []).map((area) => ({
      id: `area-${area.id}`,
      title: area.name,
      subtitle: `${area.plots?.length ?? 0} lô`,
      description: `Diện tích ${formatArea(area.area)} · ${getLandTypeName(area.landType)} · ${getTerrainTypeName(area.terrain)}`,
      kind: "area",
      data: area,
    }));
  }

  if (node.kind === "area") {
    const areaId = node.id.replace("area-", "");
    const result = getAreaById(areaId);
    return (result?.area.plots ?? []).map((plot) => ({
      id: `plot-${plot.id}`,
      title: plot.name,
      subtitle: `${formatArea(plot.area)} · ${plot.altitude} m`,
      description: `Đường đồng mức ${plot.contour || "chưa rõ"} · ${plot.coordinates?.length ?? 0} điểm tọa độ`,
      kind: "plot",
      data: plot,
    }));
  }

  return [];
}

function getExistingChildIds(parentId: string, edges: Edge[]) {
  return edges
    .filter((edge) => edge.source === parentId)
    .map((edge) => edge.target);
}

function buildTreeModelFromAddItem(
  item: AddDialogItem,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  switch (item.kind) {
    case "region":
      return buildRegionModel(item.data as RegionLike, setLocation, parentId);
    case "area":
      return buildAreaModel(item.data as AreaLike, setLocation, parentId);
    case "plot":
      return buildPlotModel(item.data as PlotLike, setLocation, parentId);
    default:
      throw new Error("Unsupported add dialog item kind");
  }
}

function collectDescendantIds(nodeId: string, edges: Edge[]) {
  const descendants = new Set<string>();
  const queue = [nodeId];

  while (queue.length) {
    const current = queue.shift();
    if (!current) continue;

    for (const edge of edges) {
      if (edge.source !== current || descendants.has(edge.target)) continue;
      descendants.add(edge.target);
      queue.push(edge.target);
    }
  }

  return descendants;
}

function buildTreeModel(
  rootName: string,
  regionTree: RegionNode[],
  setLocation: (path: string) => void,
  cultivationRegionId: string,
  options: {
    basePath: string;
    rootSubtitle: string;
  },
  selectedRegion: {
    area: number;
    landType: string;
    terrain: string;
    note?: string;
  },
): TreeModel {
  const totals = countTree(regionTree);

  const root: TreeModel = {
    id: `cultivation-zone-${cultivationRegionId}`,
    kind: "root",
    title: rootName,
    subtitle: options.rootSubtitle,
    description:
      selectedRegion.note ||
      `Tổng hợp ${totals.regions} vùng, ${totals.areas} khu vực và ${totals.plots} lô trong workflow.`,
    icon: MapPin,
    summaries: [
      { label: "Diện tích", value: formatArea(selectedRegion.area) },
      { label: "Loại đất", value: getLandTypeName(selectedRegion.landType) },
      { label: "Địa hình", value: getTerrainTypeName(selectedRegion.terrain) },
      { label: "Ghi chú", value: selectedRegion.note || "Không có" },
    ],
    actions: makeActions(
      setLocation,
      `${options.basePath}/${cultivationRegionId}`,
      `${options.basePath}/${cultivationRegionId}/edit`,
    ),
    children: regionTree.map((region) =>
      buildRegionModel(
        region,
        setLocation,
        `cultivation-zone-${cultivationRegionId}`,
      ),
    ),
  };

  return root;
}

function buildRegionModel(
  region: RegionLike,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  const regionAreas = region.areas ?? region.subAreas ?? [];
  const totalPlots = regionAreas.reduce(
    (sum, area) => sum + (area.plots?.length ?? 0),
    0,
  );

  return {
    id: `region-${region.id}`,
    parentId,
    kind: "region",
    title: region.name,
    subtitle: `${regionAreas.length} khu vực, ${totalPlots} lô`,
    description: `Diện tích ${formatArea(region.area)} · ${getLandTypeName(region.landType)} · ${getTerrainTypeName(region.terrain)}`,
    icon: MapPin,
    wide: true,
    summaries: [
      { label: "Diện tích", value: formatArea(region.area) },
      { label: "Loại đất", value: getLandTypeName(region.landType) },
      { label: "Địa hình", value: getTerrainTypeName(region.terrain) },
      {
        label: "Cập nhật",
        value: region.createdAt?.slice(0, 10) || "Không rõ",
      },
    ],
    actions: makeActions(
      setLocation,
      `/region-distribution/detail/${region.id}`,
      `/region-distribution/edit/${region.id}`,
    ),
    children: regionAreas.map((area) =>
      buildAreaModel(area, setLocation, `region-${region.id}`),
    ),
  };
}

function buildAreaModel(
  area: AreaLike,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  return {
    id: `area-${area.id}`,
    parentId,
    kind: "area",
    title: area.name,
    subtitle: `${area.plots?.length ?? 0} lô`,
    description: `Diện tích ${formatArea(area.area)} · ${getLandTypeName(area.landType)} · ${getTerrainTypeName(area.terrain)}`,
    icon: Layers3,
    wide: true,
    summaries: [
      { label: "Diện tích", value: formatArea(area.area) },
      { label: "Loại đất", value: getLandTypeName(area.landType) },
      { label: "Địa hình", value: getTerrainTypeName(area.terrain) },
      { label: "Tạo ngày", value: area.createdAt?.slice(0, 10) || "Không rõ" },
    ],
    actions: makeActions(
      setLocation,
      `/cultivation-area/${area.id}`,
      `/cultivation-area/${area.id}/edit`,
    ),
    children: (area.plots || []).map((plot) =>
      buildPlotModel(plot, setLocation, `area-${area.id}`),
    ),
  };
}

function buildPlotModel(
  plot: PlotLike,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  return {
    id: `plot-${plot.id}`,
    parentId,
    kind: "plot",
    title: plot.name,
    subtitle: `${formatArea(plot.area)} · ${plot.altitude ?? "?"} m`,
    description: `Đường đồng mức ${plot.contour || "chưa rõ"} · ${plot.coordinates?.length ?? 0} điểm tọa độ`,
    icon: Sprout,
    wide: true,
    summaries: [
      { label: "Diện tích", value: formatArea(plot.area) },
      { label: "Cao độ", value: `${plot.altitude ?? "?"} m` },
      { label: "Đường đồng mức", value: plot.contour || "Chưa rõ" },
      { label: "Tọa độ", value: `${plot.coordinates?.length ?? 0} điểm` },
    ],
    actions: makeActions(
      setLocation,
      `/cultivation-plot/${plot.id}`,
      `/cultivation-plot/${plot.id}/edit`,
    ),
    children: [],
  };
}

function toGeographicalUnits(
  regions: Array<{
    id: number;
    name?: string;
    area?: number;
    landType?: string;
    terrain?: string;
    createdAt?: string;
    areas?: Array<{
      id: number | string;
      name?: string;
      area?: number;
      landType?: string;
      terrain?: string;
      createdAt?: string;
      plots?: Array<{ id: number | string; name?: string }>;
    }>;
  }>,
) {
  const units: GeographicalUnit[] = [];
  const areasByRegion: Record<string, GeographicalUnit[]> = {};
  const plotsByArea: Record<string, GeographicalUnit[]> = {};

  for (const region of regions) {
    const regionId = String(region.id);
    units.push({
      id: regionId,
      name: region.name ?? "",
      level: 3,
      type: "region",
      area: region.area,
      landType: region.landType,
      terrain: region.terrain,
      createdAt: region.createdAt,
    });

    const regionAreas = (region.areas ?? []).map((area) => {
      const areaId = String(area.id);
      const areaUnit: GeographicalUnit = {
        id: areaId,
        name: area.name ?? "",
        level: 2,
        type: "area",
        area: area.area,
        landType: area.landType,
        terrain: area.terrain,
        createdAt: area.createdAt,
      };
      units.push(areaUnit);

      const areaPlots = (area.plots ?? []).map((plot) => {
        const plotUnit: GeographicalUnit = {
          id: String(plot.id),
          name: plot.name ?? "",
          level: 1,
          type: "plot",
          area: plot.area,
          altitude: plot.altitude,
          contour: plot.contour,
          coordinates: plot.coordinates,
        };
        units.push(plotUnit);
        return plotUnit;
      });

      plotsByArea[areaId] = areaPlots;
      return areaUnit;
    });

    areasByRegion[regionId] = regionAreas;
  }

  return { units, areasByRegion, plotsByArea };
}

function buildWorkflowNodeData(
  model: TreeModel,
  openChildDialog: (node: TreeModel) => void,
  onDeleteNode: (nodeId: string) => void,
): WorkflowCardNodeData {
  const kind = model.kind === "root" ? "cycle" : model.kind;
  const childKind = getChildKindForNode(model.kind);
  const actions =
    model.kind === "root"
      ? model.actions
      : [
          ...(model.actions ?? []),
          {
            label: "Xoá",
            icon: Trash2,
            tone: "destructive" as const,
            onClick: () => onDeleteNode(model.id),
          },
        ];

  return {
    kind,
    eyebrow:
      model.kind === "root"
        ? "Vùng nuôi trồng"
        : model.kind === "region"
          ? "Vùng"
          : model.kind === "area"
            ? "Khu vực"
            : "Lô",
    title: model.title,
    subtitle: model.subtitle,
    description: model.description,
    icon: model.icon,
    status: model.status,
    wide: true,
    summaries: model.summaries,
    actions,
    footerAction: childKind
      ? {
          label:
            childKind === "region"
              ? "Thêm vùng"
              : childKind === "area"
                ? "Thêm khu vực"
                : "Thêm lô",
          icon: Plus,
          onClick: () => openChildDialog(model),
        }
      : undefined,
    sourceBottomHandleId: `${model.id}-source-bottom`,
    targetTopHandleId:
      model.kind === "root" ? undefined : `${model.id}-target-top`,
  };
}

function createNodesAndEdges(
  root: TreeModel,
  openChildDialog: (node: TreeModel) => void,
  onDeleteNode: (nodeId: string) => void,
  parentNodeId?: string,
) {
  const nodes: Node<WorkflowCardNodeData>[] = [];
  const edges: Edge[] = [];

  const allNodes = flattenTree(root);
  for (const model of allNodes) {
    const parentId =
      model === root
        ? (parentNodeId ?? model.parentId ?? null)
        : (model.parentId ?? null);
    nodes.push({
      id: model.id,
      type: "workflowCard",
      position: { x: model.x ?? 0, y: model.y ?? 0 },
      data: buildWorkflowNodeData(model, openChildDialog, onDeleteNode),
    });

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${model.id}`,
        source: parentId,
        target: model.id,
        sourceHandle: `${parentId}-source-bottom`,
        targetHandle: `${model.id}-target-top`,
        type: "step",
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
        },
        style: {
          strokeWidth: 2,
          stroke: "#94a3b8",
        },
      });
    }
  }

  return { nodes, edges };
}

type CultivationRegionWorkflowPageProps = {
  basePath?: string;
  title?: string;
  rootSubtitle?: string;
  description?: string;
};

export default function AquacultureRegionWorkflowPage({
  basePath = "/aquaculture-region",
  title = "Workflow vùng nuôi trồng",
  rootSubtitle = "Vùng nuôi trồng",
  description,
}: CultivationRegionWorkflowPageProps = {}) {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const selectedRegionId = Number(params.id || "101");
  const draft = useMemo(
    () => getAquacultureDetailDraft(selectedRegionId),
    [selectedRegionId],
  );
  const selectedRegion = draft.details.region as Region;
  const regions = useMemo(() => [selectedRegion], [selectedRegion]);
  const getAreaById = useCallback(
    (id: string) => {
      for (const region of regions) {
        const area = region.subAreas?.find((item) => String(item.id) === id);
        if (area) {
          return { area, region };
        }
      }
      return undefined;
    },
    [regions],
  );
  const [addDialog, setAddDialog] = useState<TreeDialogState | null>(null);
  const [addDialogSearch, setAddDialogSearch] = useState("");
  const [selectedAddIds, setSelectedAddIds] = useState<string[]>([]);
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowCardNodeData>(
    [],
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const openAddDialog = useCallback(
    (node: TreeModel) => {
      const dialogState = getAddDialogState(node);
      if (!dialogState) return;
      setAddDialog({
        ...dialogState,
        items: buildAddDialogItemsForNode(node, regions, getAreaById),
      });
      setAddDialogSearch("");
      setSelectedAddIds([]);
    },
    [getAreaById, regions],
  );

  const closeAddDialog = useCallback(() => {
    setAddDialog(null);
    setAddDialogSearch("");
    setSelectedAddIds([]);
  }, []);

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setEdges((currentEdges) => {
        const descendants = collectDescendantIds(nodeId, currentEdges);
        setNodes((currentNodes) =>
          currentNodes.filter((node) => {
            if (node.id === nodeId) return false;
            return !descendants.has(node.id);
          }),
        );

        return currentEdges.filter(
          (edge) =>
            edge.source !== nodeId &&
            edge.target !== nodeId &&
            !descendants.has(edge.source) &&
            !descendants.has(edge.target),
        );
      });
    },
    [setEdges, setNodes],
  );

  const treeData = useMemo(() => {
    const sourceRegions = regions.map((region) => ({
      id: region.id,
      name: region.name,
      area: region.area,
      landType: region.landType,
      terrain: region.terrain,
      createdAt: region.createdAt,
      areas: region.subAreas || [],
    }));

    const { units, areasByRegion, plotsByArea } =
      toGeographicalUnits(sourceRegions);
    const selectedScopeIds = draft.area.targetIds;

    return buildGeographicalTree(
      units,
      selectedScopeIds,
      areasByRegion,
      plotsByArea,
    );
  }, [draft.area.targetIds, regions]);

  const flowDefinition = useMemo(() => {
    if (!treeData) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const root = buildTreeModel(
      selectedRegion.name || "Vùng nuôi trồng",
      treeData.selectedHierarchy,
      setLocation,
      params.id,
      { basePath, rootSubtitle },
      selectedRegion,
    );

    measureTree(root);
    layoutTree(root, 0, 0);
    return createNodesAndEdges(root, openAddDialog, handleDeleteNode);
  }, [
    basePath,
    handleDeleteNode,
    openAddDialog,
    params.id,
    regions,
    selectedRegion,
    rootSubtitle,
    setLocation,
    treeData,
  ]);

  useEffect(() => {
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  }, [
    selectedRegionId,
    flowDefinition.nodes,
    flowDefinition.edges,
    setEdges,
    setNodes,
  ]);

  const addDialogItems = useMemo(() => {
    if (!addDialog) return [];

    const query = addDialogSearch.trim().toLowerCase();
    return addDialog.items.filter((item) => {
      if (!query) return true;

      return [item.title, item.subtitle, item.description]
        .join(" ")
        .toLowerCase()
        .includes(query);
    });
  }, [addDialog, addDialogSearch]);

  const existingNodeIds = useMemo(
    () => new Set(nodes.map((node) => node.id)),
    [nodes],
  );

  const handleConfirmAddItems = useCallback(() => {
    if (!addDialog || !selectedAddIds.length) return;

    const selectedItems = addDialog.items.filter((item) =>
      selectedAddIds.includes(item.id),
    );

    if (!selectedItems.length) return;

    const parentNode = nodes.find((node) => node.id === addDialog.parentNodeId);
    const childKind = getChildKindForNode(addDialog.parentKind);
    if (!parentNode || !childKind) return;

    const existingChildCount = getExistingChildIds(
      addDialog.parentNodeId,
      edges,
    ).length;

    const graphBlocks = selectedItems.map((item, index) => {
      const model = buildTreeModelFromAddItem(
        item,
        setLocation,
        addDialog.parentNodeId,
      );
      measureTree(model);
      const position = getGridPosition(
        existingChildCount + index,
        existingChildCount + selectedItems.length,
        {
          centerX: parentNode.position.x,
          startY: parentNode.position.y + NODE_Y_GAP,
          columnGap: childKind === "plot" ? 240 : 300,
          rowGap: 230,
          columns: 3,
        },
      );
      layoutTree(model, position.x, position.y);
      return createNodesAndEdges(
        model,
        openAddDialog,
        handleDeleteNode,
        addDialog.parentNodeId,
      );
    });

    setNodes((currentNodes) => [
      ...currentNodes,
      ...graphBlocks.flatMap((block) => block.nodes),
    ]);
    setEdges((currentEdges) => [
      ...currentEdges,
      ...graphBlocks.flatMap((block) => block.edges),
    ]);
    closeAddDialog();
  }, [
    addDialog,
    closeAddDialog,
    edges,
    handleDeleteNode,
    nodes,
    openAddDialog,
    selectedAddIds,
    setEdges,
    setLocation,
    setNodes,
  ]);

  const totals = treeData
    ? countTree(treeData.selectedHierarchy)
    : { regions: 0, areas: 0, plots: 0 };

  return (
    <PageWrapper
      title={title}
      description={
        description ||
        `Trực quan hóa ${selectedRegion.name} theo cây Vùng -> Khu vực -> Lô`
      }
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(basePath)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(`${basePath}/${params.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            className="h-9 px-3"
            onClick={() => setLocation(`${basePath}/${params.id}/edit`)}
          >
            <PencilLine className="mr-2 h-4 w-4" />
            Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{selectedRegion.name}</Badge>
        <Badge variant="outline">{totals.regions} vùng</Badge>
        <Badge variant="outline">{totals.areas} khu vực</Badge>
        <Badge variant="outline">{totals.plots} lô</Badge>
        <Badge variant="outline">
          {1 +
            (selectedRegion.subAreas?.length ?? 0) +
            (selectedRegion.subAreas ?? []).reduce(
              (sum, area) => sum + (area.plots?.length ?? 0),
              0,
            )}{" "}
          phạm vi
        </Badge>
      </div>

      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-0">
          <div className="h-[980px] overflow-hidden bg-[#fafbfc]">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              fitView
              fitViewOptions={{ padding: 0.14 }}
              minZoom={0.32}
              maxZoom={1.2}
              nodesDraggable
              nodesConnectable={false}
              elementsSelectable={false}
              panOnDrag
              zoomOnScroll
              snapToGrid
              snapGrid={[24, 24]}
              proOptions={{ hideAttribution: true }}
            >
              <Background
                variant={BackgroundVariant.Dots}
                gap={24}
                size={1}
                color="#dbe4ee"
              />
              <Controls
                showInteractive={false}
                className="!border !border-slate-200 !bg-white/95 !shadow-lg"
              />
              <MiniMap
                nodeColor={(node) => {
                  const kind = String(node.data?.kind ?? "");
                  if (kind === "cycle") return "#0f172a";
                  if (kind === "region") return "#10b981";
                  if (kind === "area") return "#3b82f6";
                  return "#f59e0b";
                }}
                maskColor="rgba(248,250,252,0.78)"
                className="!rounded-xl !border !border-slate-200 !bg-white/95 !shadow-lg"
              />
            </ReactFlow>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(addDialog)}
        onOpenChange={(open) => !open && closeAddDialog()}
      >
        <DialogContent className="max-w-4xl w-[95vw] p-0 overflow-hidden rounded-3xl border-none shadow-2xl">
          <DialogHeader className="border-b bg-white px-6 py-5">
            <DialogTitle className="flex items-start gap-3 text-xl font-black text-slate-800">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                {(() => {
                  const DialogIcon = addDialog?.icon ?? MapPin;
                  return <DialogIcon className="h-5 w-5" />;
                })()}
              </div>
              <div className="min-w-0">
                <div>{addDialog?.title}</div>
                <div className="mt-1 text-sm font-medium text-slate-500">
                  {addDialog?.subtitle}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="border-b bg-white px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={addDialogSearch}
                onChange={(event) => setAddDialogSearch(event.target.value)}
                placeholder="Tìm nhanh trong danh sách..."
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="max-h-[68vh]">
            <div className="space-y-3 bg-slate-50/70 px-6 py-5">
              {addDialogItems.length ? (
                addDialogItems.map((item) => {
                  const ItemIcon =
                    item.kind === "region"
                      ? MapPin
                      : item.kind === "area"
                        ? Layers3
                        : Sprout;
                  const isSelected = selectedAddIds.includes(item.id);
                  const isExisting = existingNodeIds.has(item.id);

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={[
                        "w-full rounded-2xl border p-4 text-left shadow-sm transition-all",
                        isSelected
                          ? "border-primary bg-primary/5"
                          : "border-slate-200 bg-white hover:border-slate-300",
                        isExisting
                          ? "cursor-not-allowed opacity-45"
                          : "cursor-pointer",
                      ].join(" ")}
                      onClick={() => {
                        if (isExisting) return;
                        setSelectedAddIds((current) =>
                          current.includes(item.id)
                            ? current.filter((id) => id !== item.id)
                            : [...current, item.id],
                        );
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-600",
                            ].join(" ")}
                          >
                            {isSelected ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <ItemIcon className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <h4 className="truncate text-base font-bold text-slate-900">
                                {item.title}
                              </h4>
                              <Badge
                                variant="outline"
                                className="text-[10px] uppercase tracking-[0.18em]"
                              >
                                {item.kind === "region"
                                  ? "Vùng"
                                  : item.kind === "area"
                                    ? "Khu vực"
                                    : "Lô"}
                              </Badge>
                              {isExisting && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px]"
                                >
                                  Đã có
                                </Badge>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-slate-500">
                              {item.subtitle}
                            </p>
                            <p className="mt-2 text-sm leading-6 text-slate-700">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        <div
                          className={[
                            "mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border",
                            isSelected
                              ? "border-primary bg-primary text-white"
                              : "border-slate-200 bg-white text-slate-300",
                          ].join(" ")}
                        >
                          <Plus className="h-4 w-4" />
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-10 text-center text-slate-500">
                  {addDialog?.emptyLabel}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between gap-3 border-t bg-white px-6 py-4">
            <div className="text-sm text-slate-500">
              {selectedAddIds.length
                ? `Đã chọn ${selectedAddIds.length} mục`
                : "Chọn ít nhất 1 mục để thêm"}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeAddDialog}>
                Hủy
              </Button>
              <Button
                onClick={handleConfirmAddItems}
                disabled={!selectedAddIds.length}
              >
                Thêm vào workflow
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </PageWrapper>
  );
}
