import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowLeft,
  Eye,
  Layers3,
  MapPin,
  PencilLine,
  Sprout,
} from "lucide-react";
import { useEffect, useMemo } from "react";
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
} from "../../growth-cycle/components/workflow/WorkflowCardNode";
import { WorkflowCardNode } from "../../growth-cycle/components/workflow/WorkflowCardNode";
import { buildGeographicalTree } from "./components/GeographicalTree";
import type {
  AreaNode,
  GeographicalUnit,
  PlotNode,
  RegionNode,
} from "./components/GeographicalTree";
import {
  MOCK_REGIONS,
} from "../../region-chart/constants";
import {
  getLandTypeName,
  getTerrainTypeName,
} from "../../region-chart/utils/lookups";

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
  summaries?: Array<{ label: string; value: string }>;
  actions?: WorkflowActionItem[];
  children: TreeModel[];
  width?: number;
  x?: number;
  y?: number;
};

const CARD_WIDTH: Record<TreeKind, number> = {
  root: 360,
  region: 300,
  area: 260,
  plot: 240,
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

function buildTreeModel(
  rootName: string,
  regionTree: RegionNode[],
  setLocation: (path: string) => void,
  cultivationRegionId: string,
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
    subtitle: "Vùng canh tác",
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
      `/cultivation-region/${cultivationRegionId}`,
      `/cultivation-region/${cultivationRegionId}/edit`,
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
  region: RegionNode,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  const totalPlots = (region.areas || []).reduce(
    (sum, area) => sum + (area.plots?.length ?? 0),
    0,
  );

  return {
    id: `region-${region.id}`,
    parentId,
    kind: "region",
    title: region.name,
    subtitle: `${region.areas?.length ?? 0} khu vực, ${totalPlots} lô`,
    description: `Diện tích ${formatArea(region.area)} · ${getLandTypeName(region.landType)} · ${getTerrainTypeName(region.terrain)}`,
    icon: MapPin,
    summaries: [
      { label: "Diện tích", value: formatArea(region.area) },
      { label: "Loại đất", value: getLandTypeName(region.landType) },
      { label: "Địa hình", value: getTerrainTypeName(region.terrain) },
      { label: "Cập nhật", value: region.createdAt?.slice(0, 10) || "Không rõ" },
    ],
    actions: makeActions(
      setLocation,
      `/region-distribution/detail/${region.id}`,
      `/region-distribution/edit/${region.id}`,
    ),
    children: (region.areas || []).map((area) =>
      buildAreaModel(area, setLocation, `region-${region.id}`),
    ),
  };
}

function buildAreaModel(
  area: AreaNode,
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
  plot: PlotNode,
  setLocation: (path: string) => void,
  parentId: string,
): TreeModel {
  return {
    id: `plot-${plot.id}`,
    parentId,
    kind: "plot",
    title: plot.name,
    subtitle: `${formatArea(plot.area)} · ${plot.altitude} m`,
    description: `Đường đồng mức ${plot.contour || "chưa rõ"} · ${plot.coordinates?.length ?? 0} điểm tọa độ`,
    icon: Sprout,
    summaries: [
      { label: "Diện tích", value: formatArea(plot.area) },
      { label: "Cao độ", value: `${plot.altitude} m` },
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
    areas?: Array<{
      id: number | string;
      name?: string;
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
    });

    const regionAreas = (region.areas ?? []).map((area) => {
      const areaId = String(area.id);
      const areaUnit: GeographicalUnit = {
        id: areaId,
        name: area.name ?? "",
        level: 2,
        type: "area",
      };
      units.push(areaUnit);

      const areaPlots = (area.plots ?? []).map((plot) => {
        const plotUnit: GeographicalUnit = {
          id: String(plot.id),
          name: plot.name ?? "",
          level: 1,
          type: "plot",
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

function createNodesAndEdges(root: TreeModel) {
  const nodes: Node<WorkflowCardNodeData>[] = [];
  const edges: Edge[] = [];

  const allNodes = flattenTree(root);
  for (const model of allNodes) {
    if (model.kind === "root") {
      nodes.push({
        id: model.id,
        type: "workflowCard",
        position: { x: model.x ?? 0, y: model.y ?? 0 },
        data: {
          kind: "cycle",
          eyebrow: "Vùng canh tác",
          title: model.title,
          subtitle: model.subtitle,
          description: model.description,
          icon: model.icon,
          wide: true,
          sourceBottomHandleId: `${model.id}-source-bottom`,
          summaries: model.summaries,
          actions: model.actions,
        },
      });
      continue;
    }

    const parentId = model.parentId ?? root.id;
    nodes.push({
      id: model.id,
      type: "workflowCard",
      position: { x: model.x ?? 0, y: model.y ?? 0 },
      data: {
        kind: model.kind,
        eyebrow:
          model.kind === "region"
            ? "Vùng"
            : model.kind === "area"
              ? "Khu vực"
              : "Lô",
        title: model.title,
        subtitle: model.subtitle,
        description: model.description,
        icon: model.icon,
        targetTopHandleId: `${model.id}-target-top`,
        sourceBottomHandleId: `${model.id}-source-bottom`,
        summaries: model.summaries,
        actions: model.actions,
      },
    });

    edges.push({
      id: `edge-${parentId}-${model.id}`,
      source: parentId,
      target: model.id,
      sourceHandle:
        parentId === root.id
          ? `${root.id}-source-bottom`
          : `${parentId}-source-bottom`,
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

  return { nodes, edges };
}

export default function CultivationRegionWorkflowPage() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const selectedRegionId = Number(params.id);
  const selectedRegion = useMemo(() => {
    return (
      MOCK_REGIONS.find((region) => region.id === selectedRegionId) ??
      MOCK_REGIONS[0]
    );
  }, [selectedRegionId]);

  const treeData = useMemo(() => {
    if (!selectedRegion) return null;

    const sourceRegions = MOCK_REGIONS.map((region) => ({
      id: region.id,
      name: region.name,
      areas: region.subAreas || [],
    }));

    const { units, areasByRegion, plotsByArea } = toGeographicalUnits(
      sourceRegions,
    );
    const selectedScopeIds = [
      String(selectedRegion.id),
      ...(selectedRegion.subAreas || []).map((area) => String(area.id)),
      ...(selectedRegion.subAreas || []).flatMap((area) =>
        (area.plots || []).map((plot) => String(plot.id)),
      ),
    ];

    return buildGeographicalTree(
      units,
      selectedScopeIds,
      areasByRegion,
      plotsByArea,
    );
  }, [selectedRegion]);

  const flowDefinition = useMemo(() => {
    if (!selectedRegion || !treeData) {
      return { nodes: [] as Node[], edges: [] as Edge[] };
    }

    const root = buildTreeModel(
      selectedRegion.name || "Vùng canh tác",
      treeData.selectedHierarchy,
      setLocation,
      params.id,
      selectedRegion,
    );

    measureTree(root);
    layoutTree(root, 0, 0);
    return createNodesAndEdges(root);
  }, [params.id, selectedRegion, setLocation, treeData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(flowDefinition.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flowDefinition.edges);

  useEffect(() => {
    setNodes(flowDefinition.nodes);
    setEdges(flowDefinition.edges);
  }, [selectedRegionId, flowDefinition.nodes, flowDefinition.edges, setEdges, setNodes]);
  const totals = treeData ? countTree(treeData.selectedHierarchy) : { regions: 0, areas: 0, plots: 0 };

  return (
    <AdminLayout
      isDev
      title="Workflow vùng canh tác"
      description={`Trực quan hóa ${selectedRegion.name} theo cây Vùng -> Khu vực -> Lô`}
      actions={
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation("/cultivation-region")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Danh sách
          </Button>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => setLocation(`/cultivation-region/${params.id}`)}
          >
            <Eye className="mr-2 h-4 w-4" />
            Chi tiết
          </Button>
          <Button
            className="h-9 px-3"
            onClick={() => setLocation(`/cultivation-region/${params.id}/edit`)}
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
    </AdminLayout>
  );
}
