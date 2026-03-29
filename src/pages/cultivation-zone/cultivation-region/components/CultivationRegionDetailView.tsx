import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  DataTable,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Label,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  AlertTriangle,
  ArrowUpRight,
  Award,
  Beaker,
  Bug,
  Calendar,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock,
  Contact,
  CreditCard,
  Droplets,
  FileText,
  Globe,
  Hash,
  Image as ImageIcon,
  Layers,
  Leaf,
  Mail,
  MapPin,
  Maximize2,
  Package,
  Phone,
  Scale3d,
  ShieldCheck,
  ShoppingBag,
  Sprout,
  Tag,
  Target,
  TrendingDown,
  TrendingUp,
  User,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Tooltip as LeafletTooltip,
  MapContainer,
  Polygon,
  TileLayer,
} from "react-leaflet";
import {
  CartesianGrid,
  Tooltip as ChartTooltip,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useLocation, useParams } from "wouter";
import { HorizontalPersonnelList } from "../../../../components/personnel/HorizontalPersonnelList";
import useGrowthCycleStore from "../../../../stores/useGrowthCycleStore";
import usePersonnelStore, {
  type Personnel,
} from "../../../../stores/usePersonnelStore";
import usePlanStore, { type Plan } from "../../../../stores/usePlanStore";
import useRegionStore from "../../../../stores/useRegionStore";
import useTaskStore, { type Task } from "../../../../stores/useTaskStore";
import TaskDetailDialog from "../../../task/components/TaskDetailDialog";
import { DISTRICTS, PROVINCES } from "../../../region-chart/constants";
import styles from "../styles.module.css";
import { useCultivationRegionDetail } from "../useCultivationRegionDetail";

export const CultivationRegionDetailView = ({ id }: { id?: string }) => {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/cultivation-region");
  };

  const [isScopeMapExpanded, setIsScopeMapExpanded] = useState(false);
  const scopeMapRef = useRef<L.Map | null>(null);
  const expandedScopeMapRef = useRef<L.Map | null>(null);

  const [selectedStaffId, setSelectedStaffId] = useState<number | null>(null);
  const { growthCycles } = useGrowthCycleStore();

  const staffColumns: Column<Personnel>[] = [
    {
      key: "avatar",
      label: "Thợ",
      render: (value: string, item: Personnel) => (
        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-200">
          {value ? (
            <img
              src={value}
              alt={item.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            item.fullName.charAt(0)
          )}
        </div>
      ),
    },
    {
      key: "fullName",
      label: "Họ và tên",
      render: (value: string) => (
        <span className="font-semibold text-slate-700">{value}</span>
      ),
    },
    {
      key: "position",
      label: "Chức vụ",
      render: (value: string) => (
        <Badge variant="outline" className="text-[10px] font-medium">
          {value}
        </Badge>
      ),
    },
    {
      key: "phone",
      label: "Số điện thoại",
      render: (value: string) => (
        <span className="text-xs text-muted-foreground">{value}</span>
      ),
    },
  ];

  const getActiveScopeMap = () => {
    if (isScopeMapExpanded) return expandedScopeMapRef.current;
    return scopeMapRef.current;
  };

  const formatFullAddress = (reg: any) => {
    if (!reg) return "";
    const p = PROVINCES.find((p) => p.id === reg.provinceId)?.name || "";
    const d = DISTRICTS.find((d) => d.id === reg.districtId)?.name || "";
    const w = reg.ward || "";
    const a = reg.address || "";
    return [a, w, d, p].filter(Boolean).join(", ");
  };

  const focusScopeMapToCoordinates = (
    coordinates?: { lat: number; lng: number }[],
  ) => {
    if (!coordinates?.length) return;
    const map = getActiveScopeMap();
    if (!map) return;
    const bounds = L.latLngBounds(
      coordinates.map((c) => [c.lat, c.lng] as [number, number]),
    );
    map.flyToBounds(bounds, { padding: [40, 40], duration: 1.1 });
  };

  const { area, details } = useCultivationRegionDetail(resolvedId);

  const { regions } = useRegionStore();
  const { plans } = usePlanStore();
  const { personnel } = usePersonnelStore();

  const regionIndex = useMemo(() => {
    const regionById = new Map<string, any>();
    const areaById = new Map<string, { area: any; region: any }>();
    const plotById = new Map<string, { plot: any; area: any; region: any }>();

    for (const r of regions) {
      regionById.set(String(r.id), r);
      for (const a of r.subAreas || []) {
        areaById.set(String(a.id), { area: a, region: r });
        for (const p of a.plots || []) {
          plotById.set(String(p.id), { plot: p, area: a, region: r });
        }
      }
    }

    return { regionById, areaById, plotById };
  }, [regions]);

  const groupedCrops = useMemo(() => {
    const crops = details?.technicalConfig?.crops;
    if (!crops) return {};

    return crops.reduce(
      (acc: Record<string, any[]>, crop: any) => {
        const cropName = crop.crop || "Khác";
        if (!acc[cropName]) acc[cropName] = [];
        acc[cropName].push(crop);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }, [details]);

  const scopeMapData = useMemo(() => {
    if (!area) return null;

    const explicitRegionIds = new Set<string>();
    const explicitAreaIds = new Set<string>();
    const explicitPlotIds = new Set<string>();

    const regionsMap = new Map<string, { region: any; explicit: boolean }>();
    const areasMap = new Map<string, { area: any; explicit: boolean }>();
    const plotsMap = new Map<string, { plot: any; explicit: boolean }>();

    const addRegion = (r: any, explicit: boolean) => {
      const key = String(r.id);
      const existing = regionsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      regionsMap.set(key, { region: r, explicit });
    };

    const addArea = (a: any, explicit: boolean) => {
      const key = String(a.id);
      const existing = areasMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      areasMap.set(key, { area: a, explicit });
    };

    const addPlot = (p: any, explicit: boolean) => {
      const key = String(p.id);
      const existing = plotsMap.get(key);
      if (existing) {
        if (explicit) existing.explicit = true;
        return;
      }
      plotsMap.set(key, { plot: p, explicit });
    };

    const ids = (area.targetIds || []).map(String);
    for (const id of ids) {
      const reg = regionIndex.regionById.get(id);
      if (reg) {
        explicitRegionIds.add(String(reg.id));
        addRegion(reg, true);
        for (const a of reg.subAreas || []) {
          addArea(a, false);
          for (const p of a.plots || []) {
            addPlot(p, false);
          }
        }
        continue;
      }

      const areaHit = regionIndex.areaById.get(id);
      if (areaHit) {
        explicitAreaIds.add(String(areaHit.area.id));
        addRegion(areaHit.region, false);
        addArea(areaHit.area, true);
        for (const p of areaHit.area.plots || []) {
          addPlot(p, false);
        }
        continue;
      }

      const plotHit = regionIndex.plotById.get(id);
      if (plotHit) {
        explicitPlotIds.add(String(plotHit.plot.id));
        addRegion(plotHit.region, false);
        addArea(plotHit.area, false);
        addPlot(plotHit.plot, true);
      }
    }

    const regionsToRender = Array.from(regionsMap.values());
    const areasToRender = Array.from(areasMap.values());
    const plotsToRender = Array.from(plotsMap.values());

    const allCoords: { lat: number; lng: number }[] = [];
    for (const r of regionsToRender)
      allCoords.push(...(r.region.coordinates || []));
    for (const a of areasToRender)
      allCoords.push(...(a.area.coordinates || []));
    for (const p of plotsToRender)
      allCoords.push(...(p.plot.coordinates || []));

    const bounds =
      allCoords.length > 0
        ? allCoords.map((c) => [c.lat, c.lng] as [number, number])
        : null;

    return {
      regions: regionsToRender,
      areas: areasToRender,
      plots: plotsToRender,
      bounds,
      explicitRegionIds,
      explicitAreaIds,
      explicitPlotIds,
    };
  }, [area, regionIndex]);

  const scopeMapBounds = scopeMapData?.bounds ?? null;

  const ScopeMapPolygons = () => {
    if (!scopeMapData) return null;

    return (
      <>
        {/* Regions */}
        {scopeMapData.regions.map(({ region, explicit }) => {
          if (!region?.coordinates || region.coordinates.length < 3)
            return null;
          return (
            <Polygon
              key={`scope-region-${region.id}`}
              positions={(region.coordinates || []).map((c: any) => [
                c.lat,
                c.lng,
              ])}
              pathOptions={{
                color: "#3b82f6",
                weight: explicit ? 2.5 : 2,
                fillColor: "#3b82f6",
                fillOpacity: explicit ? 0.08 : 0,
                dashArray: explicit ? undefined : "6, 6",
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  focusScopeMapToCoordinates(region.coordinates);
                },
              }}
            >
              <LeafletTooltip sticky>
                <div className="px-3 py-2 w-64">
                  <div className="font-black text-blue-600 text-[10px] uppercase tracking-widest mb-1 border-b border-blue-100 pb-1">
                    Vùng trồng
                  </div>

                  <div className="w-full overflow-hidden min-w-0 text-wrap font-bold text-slate-800 text-sm mb-1">
                    {region.code}: {region.name}
                  </div>

                  <div className="flex w-full items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <Scale3d className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />

                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {region.area} ha
                    </span>
                  </div>

                  <div className="flex w-full items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />

                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {formatFullAddress(region)}
                    </span>
                  </div>
                </div>
              </LeafletTooltip>
            </Polygon>
          );
        })}

        {/* Areas */}
        {scopeMapData.areas.map(({ area: a, explicit }) => {
          if (!a?.coordinates || a.coordinates.length < 3) return null;
          return (
            <Polygon
              key={`scope-area-${a.id}`}
              positions={(a.coordinates || []).map((c: any) => [c.lat, c.lng])}
              pathOptions={{
                color: "#10b981",
                weight: explicit ? 2.5 : 1.75,
                fillColor: "#10b981",
                fillOpacity: explicit ? 0.12 : 0.06,
                dashArray: explicit ? undefined : "4, 6",
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  focusScopeMapToCoordinates(a.coordinates);
                },
              }}
            >
              <LeafletTooltip sticky>
                <div className="px-3 py-2 w-64">
                  <div className="font-black text-emerald-600 text-[10px] uppercase tracking-widest mb-1 border-b border-emerald-100 pb-1">
                    Khu vực
                  </div>
                  <div className="w-full overflow-hidden min-w-0 text-wrap font-bold text-slate-800 text-sm mb-1">
                    {a.code}: {a.name}
                  </div>

                  <div className="flex w-full items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <Scale3d className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />

                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {a.area} ha
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {formatFullAddress(
                        regionIndex.areaById.get(String(a.id))?.region,
                      )}
                    </span>
                  </div>
                </div>
              </LeafletTooltip>
            </Polygon>
          );
        })}

        {/* Plots */}
        {scopeMapData.plots.map(({ plot, explicit }) => {
          if (!plot?.coordinates || plot.coordinates.length < 3) return null;
          return (
            <Polygon
              key={`scope-plot-${plot.id}`}
              positions={(plot.coordinates || []).map((c: any) => [
                c.lat,
                c.lng,
              ])}
              pathOptions={{
                color: "#f59e0b",
                weight: explicit ? 2.25 : 1.5,
                fillColor: "#f59e0b",
                fillOpacity: explicit ? 0.22 : 0.12,
                dashArray: explicit ? undefined : "3, 7",
              }}
              eventHandlers={{
                click: (e) => {
                  L.DomEvent.stopPropagation(e);
                  focusScopeMapToCoordinates(plot.coordinates);
                },
              }}
            >
              <LeafletTooltip sticky>
                <div className="px-3 py-2 w-64">
                  <div className="font-black text-amber-600 text-[10px] uppercase tracking-widest mb-1 border-b border-amber-100 pb-1">
                    Lô đất
                  </div>
                  <div className="w-full overflow-hidden min-w-0 text-wrap font-bold text-slate-800 text-sm mb-1">
                    {plot.code}: {plot.name}
                  </div>

                  <div className="flex w-full items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <Scale3d className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />

                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {plot.area} ha
                    </span>
                  </div>

                  <div className="flex items-start gap-1.5 text-slate-500 text-[11px] leading-relaxed">
                    <MapPin className="w-3 h-3 text-red-500 shrink-0 mt-0.5" />
                    <span className="block overflow-hidden text-wrap flex-1 min-w-0">
                      {formatFullAddress(
                        regionIndex.plotById.get(String(plot.id))?.region,
                      )}
                    </span>
                  </div>
                </div>
              </LeafletTooltip>
            </Polygon>
          );
        })}
      </>
    );
  };

  const scopeTargetIds = useMemo(() => {
    const regionIds = new Set<string>();
    const areaIds = new Set<string>();
    const plotIds = new Set<string>();

    for (const item of scopeMapData?.regions || []) {
      regionIds.add(String(item.region.id));
    }
    for (const item of scopeMapData?.areas || []) {
      areaIds.add(String(item.area.id));
    }
    for (const item of scopeMapData?.plots || []) {
      plotIds.add(String(item.plot.id));
    }

    return { regionIds, areaIds, plotIds };
  }, [scopeMapData]);

  const baseRelevantPlans = useMemo(() => {
    const intersects = (a: string[] | undefined, b: Set<string>) =>
      (a || []).some((id) => b.has(String(id)));

    const matches = (p: Plan) =>
      intersects(p.selectedPlotIds, scopeTargetIds.plotIds) ||
      intersects(p.selectedZoneIds, scopeTargetIds.areaIds) ||
      intersects(p.selectedRegionIds, scopeTargetIds.regionIds);

    return plans.filter(matches);
  }, [plans, scopeTargetIds]);

  const [planFilter, setPlanFilter] = useState<Plan["purpose"]>("cultivation");

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isTaskDetailOpen, setIsTaskDetailOpen] = useState(false);

  const relevantPlans = useMemo(() => {
    const statusRank: Record<Plan["status"], number> = {
      active: 0,
      draft: 1,
      completed: 2,
      cancelled: 3,
    };

    return baseRelevantPlans
      .filter((p) => p.purpose === planFilter)
      .sort((a, b) => {
        const ra = statusRank[a.status] ?? 99;
        const rb = statusRank[b.status] ?? 99;
        if (ra !== rb) return ra - rb;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      });
  }, [baseRelevantPlans, planFilter]);

  const tasks = useTaskStore((state) => state.tasks);

  const incurredTasks = useMemo(() => {
    const incurredPlanNames = new Set(
      baseRelevantPlans
        .filter((p) => p.purpose === "incurred")
        .map((p) => p.name),
    );

    const isInScope = (t: Task) => {
      if (!t.geographicalSelections || t.geographicalSelections.length === 0)
        return true;
      return t.geographicalSelections.some((sel) => {
        return (
          scopeTargetIds.regionIds.has(String(sel.regionId)) ||
          scopeTargetIds.areaIds.has(String(sel.areaId)) ||
          scopeTargetIds.plotIds.has(String(sel.plotId))
        );
      });
    };

    return tasks.filter((t) => incurredPlanNames.has(t.plan) && isInScope(t));
  }, [baseRelevantPlans, tasks, scopeTargetIds]);

  const prevRegionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!baseRelevantPlans || baseRelevantPlans.length === 0) return;

    // Only auto-switch IF the region just changed or it's the first time data is available
    if (prevRegionIdRef.current !== resolvedId) {
      prevRegionIdRef.current = resolvedId;
      const purposes: Plan["purpose"][] = [
        "cultivation",
        "treatment",
        "amendment",
        "harvest",
        "incurred",
      ];
      const firstWithData = purposes.find((p) =>
        baseRelevantPlans.some((plan) => plan.purpose === p),
      );
      if (firstWithData) {
        setPlanFilter(firstWithData);
      }
    }
  }, [baseRelevantPlans, resolvedId]);

  const planStatusBadge = (status: Plan["status"]) => {
    const config: Record<Plan["status"], { label: string; className: string }> =
      {
        draft: { label: "Bản nháp", className: "bg-slate-200 text-slate-700" },
        active: { label: "Đang thực hiện", className: "bg-primary text-white" },
        completed: {
          label: "Hoàn thành",
          className: "bg-green-600 text-white",
        },
        cancelled: {
          label: "Đã hủy",
          className: "bg-red-500 text-white",
        },
      };
    const c = config[status] || config.draft;
    return <Badge className={cn("border-none", c.className)}>{c.label}</Badge>;
  };

  const getSelectionSummary = (selections: any[]) => {
    if (!selections || selections.length === 0) return [];

    const summary: {
      regionId: string;
      regionName: string;
      items: {
        type: "region" | "area" | "plot";
        id: string;
        name: string;
        parentName?: string;
      }[];
    }[] = [];

    selections.forEach((sel) => {
      const region = regions.find((r) => String(r.id) === String(sel.regionId));
      if (!region) return;

      let group = summary.find((s) => s.regionId === sel.regionId);
      if (!group) {
        group = {
          regionId: sel.regionId,
          regionName: region.name,
          items: [],
        };
        summary.push(group);
      }

      if (sel.type === "region") {
        group.items.push({
          type: "region",
          id: sel.id,
          name: "Toàn bộ vùng " + region.name,
        });
      } else if (sel.type === "area") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        group.items.push({
          type: "area",
          id: sel.id,
          name: "Khu vực " + (area?.name || sel.areaId),
        });
      } else if (sel.type === "plot") {
        const area = region.subAreas?.find(
          (a: any) => String(a.id) === String(sel.areaId),
        );
        const plot = area?.plots?.find(
          (p: any) => String(p.id) === String(sel.plotId),
        );
        group.items.push({
          type: "plot",
          id: sel.id,
          name: "Lô " + (plot?.name || sel.plotId),
          parentName: area?.name,
        });
      }
    });

    return summary;
  };

  // const scopeNameKeywords = useMemo(() => {
  //   const keys = new Set<string>();
  //   if (area?.name) keys.add(area.name);
  //   for (const r of scopeMapData?.regions || []) keys.add(r.region.name);
  //   for (const a of scopeMapData?.areas || []) keys.add(a.area.name);
  //   for (const p of scopeMapData?.plots || []) keys.add(p.plot.name);
  //   return Array.from(keys)
  //     .map((k) => k.trim().toLowerCase())
  //     .filter(Boolean);
  // }, [area?.name, scopeMapData]);

  // const relevantTreatments = useMemo(() => {
  //   const matchesScope = (t: TreatmentPlan) => {
  //     const hay = `${t.code} ${t.name} ${t.zone}`.toLowerCase();
  //     return scopeNameKeywords.some((k) => hay.includes(k));
  //   };

  //   const scoped = initialTreatmentPlans.filter(matchesScope);
  //   const list = scoped.length > 0 ? scoped : initialTreatmentPlans;

  //   const statusRank: Record<TreatmentPlan["status"], number> = {
  //     in_progress: 0,
  //     planning: 1,
  //     completed: 2,
  //     cancelled: 3,
  //   };

  //   return [...list].sort((a, b) => {
  //     const ra = statusRank[a.status] ?? 99;
  //     const rb = statusRank[b.status] ?? 99;
  //     if (ra !== rb) return ra - rb;
  //     return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  //   });
  // }, [scopeNameKeywords]);

  // const [historyQuery, setHistoryQuery] = useState("");
  // const [historyFromDate, setHistoryFromDate] = useState("");
  // const [historyToDate, setHistoryToDate] = useState("");
  // const [historyDetailPlan, setHistoryDetailPlan] =
  //   useState<TreatmentPlan | null>(null);

  // const getTreatmentIntensityConfig = (intensity: string) => {
  //   switch (intensity) {
  //     case "light":
  //       return { label: "Nhẹ", color: "bg-blue-500" };
  //     case "medium":
  //       return { label: "Trung bình", color: "bg-yellow-500" };
  //     case "deep":
  //       return { label: "Sâu", color: "bg-red-500" };
  //     default:
  //       return { label: "Không xác định", color: "bg-gray-500" };
  //   }
  // };

  // const getTreatmentStatusConfig = (status: string) => {
  //   switch (status) {
  //     case "planning":
  //       return { label: "Đang lập", color: "bg-blue-500" };
  //     case "in_progress":
  //       return { label: "Đang thực hiện", color: "bg-green-500" };
  //     case "completed":
  //       return { label: "Hoàn thành", color: "bg-gray-500" };
  //     case "cancelled":
  //       return { label: "Đã hủy", color: "bg-red-500" };
  //     default:
  //       return { label: "Không xác định", color: "bg-gray-500" };
  //   }
  // };

  // const filteredHistoryPlans = useMemo(() => {
  //   const parseDate = (value: string) => {
  //     const d = new Date(value);
  //     return Number.isFinite(d.getTime()) ? d : null;
  //   };

  //   const query = historyQuery.trim().toLowerCase();
  //   const rangeStart = historyFromDate ? parseDate(historyFromDate) : null;
  //   const rangeEnd = historyToDate ? parseDate(historyToDate) : null;
  //   const endInclusive = rangeEnd ? new Date(rangeEnd.getTime()) : null;
  //   if (endInclusive) endInclusive.setHours(23, 59, 59, 999);

  //   return relevantTreatments.filter((t) => {
  //     if (query) {
  //       const hay =
  //         `${t.code} ${t.name} ${t.zone} ${t.soilIssue}`.toLowerCase();
  //       if (!hay.includes(query)) return false;
  //     }

  //     const planStart = parseDate(t.startDate) || new Date(0);
  //     const planEnd = parseDate(t.endDate) || planStart;

  //     // Filter by explicit date range if provided (overlap with the range).
  //     if (rangeStart || endInclusive) {
  //       const s = rangeStart || new Date(-8640000000000000);
  //       const e = endInclusive || new Date(8640000000000000);
  //       if (planStart > e || planEnd < s) return false;
  //     }

  //     return true;
  //   });
  // }, [relevantTreatments, historyQuery, historyFromDate, historyToDate]);

  // const historyGroups = useMemo(() => {
  //   const parseDate = (value: string) => {
  //     const d = new Date(value);
  //     return Number.isFinite(d.getTime()) ? d : null;
  //   };

  //   const groupMap = new Map<
  //     string,
  //     { key: string; label: string; sortKey: number; items: TreatmentPlan[] }
  //   >();

  //   for (const t of filteredHistoryPlans) {
  //     const d = parseDate(t.startDate) || new Date(0);
  //     const year = d.getFullYear();
  //     const month = d.getMonth() + 1;
  //     const key = `${year}-${String(month).padStart(2, "0")}`;
  //     const label = `${String(month).padStart(2, "0")}/${year}`;
  //     const sortKey = year * 12 + month;

  //     const g = groupMap.get(key);
  //     if (g) {
  //       g.items.push(t);
  //     } else {
  //       groupMap.set(key, { key, label, sortKey, items: [t] });
  //     }
  //   }

  //   const groups = Array.from(groupMap.values()).sort(
  //     (a, b) => b.sortKey - a.sortKey,
  //   );
  //   for (const g of groups) {
  //     g.items.sort(
  //       (a, b) =>
  //         new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
  //     );
  //   }

  //   return groups;
  // }, [filteredHistoryPlans]);

  if (!area || !details) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Target className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy vùng canh tác
        </h2>
        <Button variant="ghost" className="mt-4" onClick={handleBack}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <Tabs defaultValue="overview" className="space-y-6 mt-6">
      <TabsList className="grid w-full grid-cols-7 overflow-x-auto">
        <TabsTrigger value="overview">Thông tin</TabsTrigger>
        <TabsTrigger value="crops">Cây trồng</TabsTrigger>
        <TabsTrigger value="staff">Nhân viên</TabsTrigger>
        <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
        <TabsTrigger value="plans">Kế hoạch & Công việc</TabsTrigger>
        {/* <TabsTrigger value="amendment-history">Lịch sử cải tạo đất</TabsTrigger> */}
        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
      </TabsList>

      {/* Overview Tab (Info) */}
      <TabsContent value="overview" className="space-y-4">
        <div className={styles.overviewGrid}>
          {/* Đơn vị sở hữu (Enterprise) */}
          <div className={styles.areaEnterprise}>
            {details.enterprise && (
              <Card className="h-fit overflow-hidden relative shadow-md">
                <div className="h-50 bg-gray-100 flex items-center justify-center relative">
                  <img
                    src={
                      details.enterprise.image ||
                      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80"
                    }
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-0 right-0 z-10">
                    <div
                      className={cn(
                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-lg rounded-bl-xl",
                        details.enterprise.status === "active"
                          ? "bg-green-600"
                          : "bg-gray-500",
                      )}
                    >
                      {details.enterprise.status === "active"
                        ? "Đang hoạt động"
                        : "Dừng hoạt động"}
                    </div>
                  </div>
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto w-20 h-20 -mt-12 rounded-full border-4 border-background bg-white shadow-sm flex items-center justify-center mb-2 overflow-hidden relative">
                    {details.enterprise.image ? (
                      <img
                        src={details.enterprise.image}
                        alt="Logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-primary">
                        {(
                          details.enterprise.brandName ||
                          details.enterprise.name ||
                          "?"
                        ).charAt(0)}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-xl flex items-center justify-center gap-2">
                    {details.enterprise.brandName || details.enterprise.name}
                    {details.enterprise.status === "active" && (
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>{details.enterprise.name}</CardDescription>
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {Array.isArray(details.enterprise.classification) ? (
                      details.enterprise.classification.map((item: string) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="capitalize"
                        >
                          {item === "production"
                            ? "Sản xuất"
                            : item === "processing"
                              ? "Chế biến"
                              : item === "trading"
                                ? "Thương mại"
                                : "Dịch vụ"}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline" className="capitalize">
                        {details.enterprise.classification === "production"
                          ? "Sản xuất"
                          : details.enterprise.classification === "processing"
                            ? "Chế biến"
                            : details.enterprise.classification === "trading"
                              ? "Thương mại"
                              : "Dịch vụ"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <CreditCard className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {details.enterprise.code}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Đại diện:{" "}
                        <span className="font-medium">
                          {details.enterprise.representative || "---"}
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>
                        Thành lập:{" "}
                        {details.enterprise.foundedDate
                          ? new Date(
                              details.enterprise.foundedDate,
                            ).toLocaleDateString("vi-VN")
                          : "---"}
                      </span>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span>
                        {details.enterprise.address}
                        {details.enterprise.ward
                          ? `, ${details.enterprise.ward}`
                          : ""}
                        {details.enterprise.district
                          ? `, ${details.enterprise.district}`
                          : ""}
                        {details.enterprise.province
                          ? `, ${details.enterprise.province}`
                          : ""}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      {details.enterprise.phone ? (
                        <a
                          href={`tel:${details.enterprise.phone}`}
                          className="hover:underline hover:text-primary transition-colors"
                        >
                          {details.enterprise.phone}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">---</span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {details.enterprise.email ? (
                        <a
                          href={`mailto:${details.enterprise.email}`}
                          className="hover:underline hover:text-primary transition-colors"
                        >
                          {details.enterprise.email}
                        </a>
                      ) : (
                        <span className="text-muted-foreground">---</span>
                      )}
                    </div>
                    {details.enterprise.website && (
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-muted-foreground" />
                        <a
                          href={details.enterprise.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline hover:text-primary transition-colors text-blue-600"
                        >
                          {details.enterprise.website}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Phạm vi vùng canh tác (Scope) */}
          <Card
            className={cn(
              styles.areaScope,
              "border-slate-200 shadow-sm overflow-hidden flex flex-col max-h-150",
            )}
          >
            <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between shrink-0">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <span className="text-lg">
                  Phạm vi vùng canh tác ({details.selectedEntities.length} mục)
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1">
              <div className="p-6 flex">
                <div className="space-y-8 flex-4">
                  {Object.values(details.groupedSelections).map(
                    (group: any) => (
                      <div key={group.region.id} className="relative">
                        {/* Region Level */}
                        <button
                          type="button"
                          className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                          onClick={() =>
                            focusScopeMapToCoordinates(
                              group.region?.coordinates,
                            )
                          }
                        >
                          <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                            <MapPin className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                              Vùng trồng
                            </div>
                            <div className="text-sm font-bold text-slate-900">
                              {group.region.name}
                            </div>
                          </div>
                        </button>

                        {/* Area & Plot Level Tree */}
                        {area.scope !== "region" && (
                          <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                            {Object.values(group.areas).map(
                              (areaGroup: any) => (
                                <div
                                  key={areaGroup.area?.id || "none"}
                                  className="relative"
                                >
                                  {/* Horizontal branch from main stem to Area/Entity */}
                                  <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                                  {areaGroup.area ? (
                                    <>
                                      <button
                                        type="button"
                                        className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                        onClick={() =>
                                          focusScopeMapToCoordinates(
                                            areaGroup.area?.coordinates,
                                          )
                                        }
                                      >
                                        <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                          <Layers className="w-4.5 h-4.5" />
                                        </div>
                                        <div>
                                          <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                            Khu vực
                                          </div>
                                          <div className="text-sm font-bold text-slate-900">
                                            {areaGroup.area.name}
                                          </div>
                                        </div>
                                      </button>

                                      {/* Plots under this Area */}
                                      <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                        {(areaGroup.entities || [])
                                          .filter(
                                            (e: any) => e?.typeCode === "plot",
                                          )
                                          .map((plot: any) => (
                                            <button
                                              key={plot.id}
                                              type="button"
                                              className="relative flex items-center gap-3 py-1 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                              onClick={() =>
                                                focusScopeMapToCoordinates(
                                                  plot.coordinates,
                                                )
                                              }
                                            >
                                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                              <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs shrink-0">
                                                <Target className="w-4 h-4" />
                                              </div>
                                              <div className="min-w-0">
                                                <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                                  Lô đất
                                                </div>
                                                <div className="text-xs font-bold text-slate-800 truncate">
                                                  {plot.name}
                                                </div>
                                              </div>
                                            </button>
                                          ))}
                                        {areaGroup.entities.some(
                                          (e: any) => e.typeCode === "area",
                                        ) && (
                                          <div className="flex items-center gap-3 py-1 relative">
                                            <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                            <Badge
                                              variant="outline"
                                              className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                            >
                                              Đã chọn toàn bộ khu vực
                                            </Badge>
                                          </div>
                                        )}
                                      </div>
                                    </>
                                  ) : (
                                    /* No Area (Region or direct Plot) */
                                    <div className="space-y-4">
                                      {areaGroup.entities.map((entity: any) => (
                                        <button
                                          key={entity.id}
                                          type="button"
                                          className="relative flex items-center gap-3 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                          onClick={() =>
                                            focusScopeMapToCoordinates(
                                              entity.coordinates,
                                            )
                                          }
                                        >
                                          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                          <div
                                            className={cn(
                                              "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs",
                                              entity.typeCode === "region"
                                                ? "bg-primary"
                                                : "bg-green-500",
                                            )}
                                          >
                                            {entity.typeCode === "region" ? (
                                              <MapPin className="w-4 h-4" />
                                            ) : (
                                              <Target className="w-4 h-4" />
                                            )}
                                          </div>
                                          <div>
                                            <div
                                              className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
                                                entity.typeCode === "region"
                                                  ? "text-primary"
                                                  : "text-green-600",
                                              )}
                                            >
                                              {entity.type}
                                            </div>
                                            <div className="text-xs font-bold text-slate-800">
                                              {entity.name}
                                            </div>
                                          </div>
                                        </button>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ),
                            )}
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Thông tin chi tiết (Info) */}
          <Card className={cn(styles.areaInfo, "overflow-hidden border")}>
            <CardHeader className="border-b bg-slate-50 py-3 px-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Contact className="w-4 h-4 text-primary" />
                <span className="text-lg">Thông tin chi tiết vùng trồng</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                    <Tag className="w-3.5 h-3.5 text-primary/70" />
                    Tên vùng
                  </div>
                  <div className="font-bold text-slate-900 leading-tight">
                    {area.name}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                    <Hash className="w-3.5 h-3.5 text-blue-500/70" />
                    Mã số ID
                  </div>
                  <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 shadow-sm transition-all hover:bg-blue-100/50">
                    <span className="font-mono text-xs font-bold">
                      {area.id}
                    </span>
                  </div>
                </div>
                {/* <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                    <Maximize2 className="w-3.5 h-3.5 text-blue-600/70" />
                    Tổng diện tích
                  </div>
                  <div className="font-bold text-lg text-blue-600 flex items-baseline gap-1">
                    {details.totalArea}
                    <span className="text-xs font-medium text-muted-foreground">
                      ha
                    </span>
                  </div>
                </div> */}
                <div>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1.5 mb-1.5 uppercase tracking-wider font-bold">
                    <Sprout className="w-3.5 h-3.5 text-green-600/70" />
                    Diện tích canh tác
                  </div>
                  <div className="font-bold text-lg text-green-600 flex items-baseline gap-1">
                    {(details.totalArea * 0.9).toFixed(1)}
                    <span className="text-xs font-medium text-muted-foreground">
                      ha
                    </span>
                  </div>
                </div>
              </div>

              {area.note && (
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="text-sm text-muted-foreground mb-1">
                    Ghi chú
                  </div>
                  <p className="mt-1 text-slate-700 text-sm">{area.note}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bản đồ (Map) */}
          <div
            className={cn(
              styles.areaMap,
              "rounded-xl z-10 min-h-[65vh] h-full w-full overflow-hidden border border-slate-100 bg-slate-50 relative shadow-sm aspect-video",
            )}
          >
            <MapContainer
              ref={scopeMapRef}
              center={[11.53, 106.88]}
              zoom={13}
              bounds={scopeMapBounds ?? undefined}
              boundsOptions={{ padding: [40, 40] }}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
              <ScopeMapPolygons />
            </MapContainer>

            <button
              type="button"
              onClick={() => setIsScopeMapExpanded(true)}
              className="absolute top-3 right-3 z-[1000] p-2.5 rounded-xl bg-white/90 backdrop-blur-md shadow-lg hover:bg-white text-slate-600 transition-all active:scale-95"
              aria-label="Mở rộng bản đồ"
            >
              <Maximize2 size={18} />
            </button>
          </div>

          <Dialog
            open={isScopeMapExpanded}
            onOpenChange={setIsScopeMapExpanded}
          >
            <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-10000">
              <DialogHeader className="sr-only">
                <DialogTitle>Bản đồ phạm vi vùng canh tác</DialogTitle>
              </DialogHeader>
              <div className="flex h-full">
                <div className="flex-1 relative bg-slate-100">
                  <MapContainer
                    ref={expandedScopeMapRef}
                    center={[11.53, 106.88]}
                    zoom={13}
                    bounds={scopeMapBounds ?? undefined}
                    boundsOptions={{ padding: [60, 60] }}
                    style={{ height: "100%", width: "100%" }}
                  >
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    <ScopeMapPolygons />
                  </MapContainer>

                  <button
                    type="button"
                    onClick={() => setIsScopeMapExpanded(false)}
                    className="absolute top-4 right-4 z-[1000] p-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-xl hover:bg-white text-slate-600 transition-all active:scale-95"
                    aria-label="Đóng"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="w-[360px] bg-white border-l border-slate-100 flex flex-col overflow-hidden shrink-0">
                  <div className="px-5 pt-5 pb-4 border-b bg-slate-50/60">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                      <MapPin size={14} className="text-primary" />
                      Phạm vi địa lý
                    </h3>
                    <p className="text-xs text-slate-500 mt-2">
                      Bấm vào từng cấp để tự zoom bản đồ.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto split-scrollbar p-5">
                    <div className="space-y-8">
                      {Object.values(details.groupedSelections).map(
                        (group: any) => (
                          <div key={group.region.id} className="relative">
                            {/* Region Level */}
                            <button
                              type="button"
                              className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                              onClick={() =>
                                focusScopeMapToCoordinates(
                                  group.region?.coordinates,
                                )
                              }
                            >
                              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                                <MapPin className="w-5 h-5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                                  Vùng trồng
                                </div>
                                <div className="text-sm font-bold text-slate-900 truncate">
                                  {group.region.name}
                                </div>
                              </div>
                            </button>

                            {/* Area & Plot Level Tree */}
                            {area.scope !== "region" && (
                              <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                                {Object.values(group.areas).map(
                                  (areaGroup: any) => (
                                    <div
                                      key={areaGroup.area?.id || "none"}
                                      className="relative"
                                    >
                                      <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                                      {areaGroup.area ? (
                                        <>
                                          <button
                                            type="button"
                                            className="flex items-center gap-3 mb-4 relative z-10 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                            onClick={() =>
                                              focusScopeMapToCoordinates(
                                                areaGroup.area?.coordinates,
                                              )
                                            }
                                          >
                                            <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                              <Layers className="w-4.5 h-4.5" />
                                            </div>
                                            <div className="min-w-0">
                                              <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                                Khu vực
                                              </div>
                                              <div className="text-sm font-bold text-slate-900 truncate">
                                                {areaGroup.area.name}
                                              </div>
                                            </div>
                                          </button>

                                          <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                            {(areaGroup.entities || [])
                                              .filter(
                                                (e: any) =>
                                                  e?.typeCode === "plot",
                                              )
                                              .map((plot: any) => (
                                                <button
                                                  type="button"
                                                  key={plot.id}
                                                  className="relative flex items-center gap-3 py-1 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                                  onClick={() =>
                                                    focusScopeMapToCoordinates(
                                                      plot.coordinates,
                                                    )
                                                  }
                                                >
                                                  <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                                  <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs shrink-0">
                                                    <Target className="w-4 h-4" />
                                                  </div>
                                                  <div className="min-w-0">
                                                    <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                                      Lô đất
                                                    </div>
                                                    <div className="text-xs font-bold text-slate-800 truncate">
                                                      {plot.name}
                                                    </div>
                                                  </div>
                                                </button>
                                              ))}

                                            {(areaGroup.entities || []).some(
                                              (e: any) =>
                                                e?.typeCode === "area",
                                            ) && (
                                              <div className="flex items-center gap-3 py-1 relative">
                                                <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                                <Badge
                                                  variant="outline"
                                                  className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                                >
                                                  Đã chọn toàn bộ khu vực
                                                </Badge>
                                              </div>
                                            )}
                                          </div>
                                        </>
                                      ) : (
                                        <div className="space-y-4">
                                          {(areaGroup.entities || []).map(
                                            (entity: any) => (
                                              <button
                                                type="button"
                                                key={entity.id}
                                                className="relative flex items-center gap-3 w-full text-left rounded-lg p-2 -m-2 hover:bg-slate-50 transition-colors"
                                                onClick={() =>
                                                  focusScopeMapToCoordinates(
                                                    entity.coordinates,
                                                  )
                                                }
                                              >
                                                <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                                <div
                                                  className={cn(
                                                    "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs shrink-0",
                                                    entity.typeCode === "region"
                                                      ? "bg-primary"
                                                      : "bg-green-500",
                                                  )}
                                                >
                                                  {entity.typeCode ===
                                                  "region" ? (
                                                    <MapPin className="w-4 h-4" />
                                                  ) : (
                                                    <Target className="w-4 h-4" />
                                                  )}
                                                </div>
                                                <div className="min-w-0">
                                                  <div
                                                    className={cn(
                                                      "text-[10px] font-bold uppercase tracking-wider leading-none mb-1",
                                                      entity.typeCode ===
                                                        "region"
                                                        ? "text-primary"
                                                        : "text-green-600",
                                                    )}
                                                  >
                                                    {entity.type}
                                                  </div>
                                                  <div className="text-xs font-bold text-slate-800 truncate">
                                                    {entity.name}
                                                  </div>
                                                </div>
                                              </button>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ),
                                )}
                              </div>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </TabsContent>

      {/* Crops & Configurations Tab */}
      <TabsContent value="crops" className="space-y-6">
        <Card className="overflow-hidden border-slate-200 shadow-sm">
          <CardHeader className="bg-slate-50 border-b py-4 px-6 flex flex-row items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-slate-900">
                Cấu hình kỹ thuật & Cây trồng
              </CardTitle>
              <div className="text-xs text-muted-foreground">
                Quy chuẩn kỹ thuật áp dụng thống nhất cho toàn bộ vùng canh tác
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* Region-Level Crop Health Overview */}
            <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
                Tổng quan tình trạng cây trồng (Toàn vùng)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      Tổng số cây
                    </div>
                    <div className="text-3xl font-black text-slate-800 tabular-nums mb-1">
                      {details?.regionStats.total.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">
                      Toàn bộ diện tích canh tác
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Số cây khỏe
                    </div>
                    <div className="text-3xl font-black text-green-600 tabular-nums mb-1">
                      {details?.regionStats.healthy.toLocaleString()}
                    </div>
                    <Badge className="bg-green-50 text-green-600 border-green-100 text-[9px] font-black h-4 px-1.5">
                      {details &&
                        Math.round(
                          (details.regionStats.healthy /
                            details.regionStats.total) *
                            100,
                        )}
                      %
                    </Badge>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Beaker className="w-3.5 h-3.5" />
                      Đang chữa trị
                    </div>
                    <div className="text-3xl font-black text-blue-500 tabular-nums mb-1">
                      {details?.regionStats.treating.toLocaleString()}
                    </div>
                    <div className="text-[9px] text-slate-400 font-medium">
                      Theo dõi phục hồi
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                  <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
                  <div className="relative z-10">
                    <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Số cây bệnh
                    </div>
                    <div className="text-3xl font-black text-orange-600 tabular-nums mb-1">
                      {details?.regionStats.diseased.toLocaleString()}
                    </div>
                    <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-black h-4 px-1.5">
                      Cảnh báo
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Technical Configs */}
              <div className="lg:col-span-3 space-y-6">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-primary" />
                  Cấu hình kỹ thuật
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl border bg-blue-50/30 border-blue-100 shadow-sm transition-all hover:shadow-md">
                    <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Droplets className="w-3.5 h-3.5" />
                      Hệ thống tưới tiêu
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                        <Droplets className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {details.technicalConfig.irrigationMethod?.name ||
                            "Chưa thiết lập"}
                        </div>
                        <div className="text-[10px] text-blue-600/70 font-medium">
                          Tiêu chuẩn hệ thống
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl border bg-orange-50/30 border-orange-100 shadow-sm transition-all hover:shadow-md">
                    <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sprout className="w-3.5 h-3.5" />
                      Phương pháp canh tác
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                        <Leaf className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-base">
                          {details.technicalConfig.farmingMethod?.name ||
                            "Chưa thiết lập"}
                        </div>
                        <div className="text-[10px] text-orange-600/70 font-medium">
                          Quy trình canh tác
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Selected Crops */}
              <div className="lg:col-span-9 space-y-8">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  Danh sách giống cây trồng & Hạt giống (
                  {details.technicalConfig.crops.length})
                </div>

                {Object.entries(groupedCrops).map(([cropName, crops]) => (
                  <div key={cropName} className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                        {cropName}
                      </div>
                      <div className="h-px flex-1 bg-slate-100" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                      {crops.map((crop) => (
                        <div key={crop.id} className="relative group">
                          <div className="flex flex-col border rounded-2xl bg-white hover:border-primary/40 hover:bg-slate-50/50 transition-all shadow-sm hover:shadow-md overflow-hidden">
                            <div className="flex items-start gap-4 p-4 relative">
                              <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border relative">
                                {crop.illustration ? (
                                  <img
                                    src={crop.illustration as string}
                                    alt={crop.varietyName}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Leaf className="w-6 h-6 text-slate-300 m-auto absolute inset-0" />
                                )}
                              </div>
                              <div className="flex-1 pt-1">
                                <div className="flex justify-between items-start">
                                  <div className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                                    {crop.varietyName}
                                  </div>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-400 hover:text-primary -mt-1 -mr-1"
                                    onClick={() =>
                                      window.open(
                                        `/variety/${crop.id}`,
                                        "_blank",
                                      )
                                    }
                                  >
                                    <Maximize2 className="w-4 h-4" />
                                  </Button>
                                </div>
                                <div className="flex items-center gap-2">
                                  {crop.seedType && (
                                    <Badge
                                      variant="outline"
                                      className="text-[9px] px-1.5 py-0 h-4 border-primary/20 text-primary font-medium"
                                    >
                                      {crop.seedType}
                                    </Badge>
                                  )}
                                  <span className="text-[10px] text-muted-foreground italic">
                                    Mã: {crop.varietyCode || crop.id}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {crop.selectedSeeds &&
                              crop.selectedSeeds.length > 0 && (
                                <div className="bg-slate-50/80 border-t border-slate-100 p-4 space-y-3">
                                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Layers className="w-3 h-3 text-primary" />
                                    Hạt giống sử dụng
                                  </div>
                                  <div className="space-y-2">
                                    {crop.selectedSeeds.map((seed: any) => (
                                      <div
                                        key={seed.id}
                                        className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-100 group/seed hover:border-primary/30 transition-all cursor-pointer"
                                        onClick={() =>
                                          window.open(
                                            `/seed/${seed.id}`,
                                            "_blank",
                                          )
                                        }
                                      >
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                        <div className="flex-1">
                                          <div className="text-xs font-bold text-slate-800 group-hover/seed:text-primary transition-colors">
                                            {seed.varietyName}
                                          </div>
                                          {seed.origin && (
                                            <div className="text-[9px] text-muted-foreground">
                                              Nguồn gốc: {seed.origin}
                                            </div>
                                          )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="secondary"
                                            className="text-[8px] bg-slate-50 border h-4 px-1 text-slate-500"
                                          >
                                            Chi tiết
                                          </Badge>
                                          <ChevronRight className="w-3 h-3 text-slate-300 group-hover/seed:text-primary transition-colors" />
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {details.technicalConfig.crops.length === 0 && (
                  <div className="py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-3xl bg-slate-50/50">
                    Chưa chọn giống cây trồng cho vùng này
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Staff Tab */}
      <TabsContent value="staff" className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Column - Management & List (6/10) */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="overflow-hidden border shadow-sm">
              <CardHeader className="border-b bg-slate-50/50 py-4 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <Contact className="w-4 h-4 text-primary" />
                    Danh sách nhân viên
                  </CardTitle>
                  <CardDescription className="text-xs mt-0.5">
                    Chọn nhân viên để xem chi tiết thông tin
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mt-4">
                  <HorizontalPersonnelList
                    personnel={details.managers}
                    onSelect={(p) => {
                      setSelectedStaffId(p.id);
                    }}
                    className="mb-4"
                  />

                  <DataTable
                    columns={staffColumns}
                    data={personnel.filter(
                      (p: Personnel) =>
                        !details.managers.some((m) => m.id === p.id),
                    )}
                    onView={(item) => setSelectedStaffId(item.id)}
                    searchPlaceholder="Tìm kiếm nhân viên..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Details (4/10) */}
          <div className="lg:col-span-4">
            <div className="sticky top-1">
              {selectedStaffId ? (
                (() => {
                  const staff = personnel.find(
                    (p: Personnel) => p.id === selectedStaffId,
                  );
                  if (!staff) return null;
                  return (
                    <Card>
                      <div className="p-6 border-b bg-slate-50/30 relative">
                        <div className="flex items-center gap-5">
                          {/* Avatar */}
                          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 shrink-0">
                            <div className="w-full h-full rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl select-none">
                              {staff.avatar ? (
                                <img
                                  src={staff.avatar}
                                  alt={staff.fullName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                staff.fullName.charAt(0)
                              )}
                            </div>
                          </div>

                          {/* Name & Title */}
                          <div>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
                              {staff.fullName}
                            </h3>
                            <div className="flex items-center gap-1.5 text-primary font-bold text-[10px] tracking-widest uppercase mt-1">
                              <Badge className="bg-primary/10 text-primary border-none text-[9px] px-2 py-0 h-4 font-black">
                                {staff.position}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <CardContent className="p-8 space-y-8">
                        {/* Info Sections */}
                        <div className="grid gap-7">
                          {/* Unit Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                              <Layers className="w-3 h-3" />
                              Đơn vị công tác
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-primary/20">
                                <span className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">
                                  Bộ phận
                                </span>
                                <span className="text-sm font-bold text-slate-800 tracking-tight">
                                  {staff.department}
                                </span>
                              </div>
                              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-primary/20">
                                <span className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">
                                  Tổ đội
                                </span>
                                <span className="text-sm font-bold text-slate-800 tracking-tight">
                                  {staff.team}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Contact Info */}
                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                              <Contact className="w-3 h-3" />
                              Thông tin liên hệ
                            </div>
                            <div className="space-y-3">
                              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                                  <Phone className="w-4.5 h-4.5" />
                                </div>
                                <div>
                                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-tight">
                                    Số điện thoại
                                  </span>
                                  <span className="text-[15px] font-bold text-slate-800 tracking-tight select-all">
                                    {staff.phone}
                                  </span>
                                </div>
                              </div>
                              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform">
                                  <Mail className="w-4.5 h-4.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-tight">
                                    Địa chỉ Email
                                  </span>
                                  <span className="text-[15px] font-bold text-slate-800 truncate block tracking-tight select-all">
                                    {staff.email}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Address */}
                          <div className="space-y-3">
                            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
                              <MapPin className="w-3 h-3" />
                              Địa chỉ thường trú
                            </div>
                            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 text-slate-600 leading-relaxed text-sm font-medium">
                              <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
                              <span className="text-slate-700">
                                {staff.address}, {staff.district},{" "}
                                {staff.province}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })()
              ) : (
                <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 h-125 flex flex-col items-center justify-center p-12 text-center group">
                  <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 scale-150" />
                    <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-slate-200 relative z-10 border border-slate-100 shadow-xl group-hover:scale-110 transition-all duration-500">
                      <User className="w-12 h-12 text-slate-100" />
                    </div>
                  </div>
                  <div className="relative z-10 space-y-3 max-w-70">
                    <h4 className="font-black text-xl text-slate-300 tracking-tight">
                      HỒ SƠ NHÂN SỰ
                    </h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">
                      Thông tin chi tiết của nhân viên sẽ được hiển thị tại đây
                      khi bạn chọn từ danh sách bên trái.
                    </p>
                    <div className="pt-4 flex justify-center gap-1.5 opacity-30">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-8 h-1 rounded-full bg-slate-200"
                        />
                      ))}
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </div>
      </TabsContent>

      {/* Certificates Tab */}
      <TabsContent
        value="certificates"
        className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
      >
        <div className="flex items-center justify-between mb-2 px-1">
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Award className="w-7 h-7 text-orange-500" />
              Chứng nhận tiêu chuẩn
              <Badge className="bg-orange-100 text-orange-600 border-orange-200 h-6 px-2 font-black text-xs">
                {details.selectedCerts.length}
              </Badge>
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Các tiêu chuẩn chất lượng và an toàn thực phẩm được áp dụng tại
              vùng trồng này.
            </p>
          </div>
        </div>

        {details.selectedCerts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.selectedCerts.map((cert) => (
              <Card
                key={cert.code}
                className="group overflow-hidden border border-slate-200 hover:border-orange-300 hover:shadow-2xl hover:shadow-orange-100 transition-all duration-500 flex flex-col bg-white rounded-3xl"
              >
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden bg-slate-50">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {cert.imageUrl ? (
                    <img
                      src={cert.imageUrl}
                      alt={cert.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-orange-50/50 text-orange-200">
                      <ImageIcon className="w-16 h-16" />
                    </div>
                  )}

                  {/* Status Overlay */}
                  <div className="absolute top-4 right-4 z-20">
                    <Badge className="bg-white/90 backdrop-blur-md text-green-600 border-none shadow-lg font-black text-[10px] tracking-wider px-3 py-1 uppercase">
                      Đang hiệu lực
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-2 text-[10px] font-black text-orange-500 uppercase tracking-[0.2em] mb-2">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Tiêu chuẩn nông nghiệp
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                      {cert.code}
                    </p>
                  </div>

                  <Separator className="mb-6 opacity-40" />

                  {/* Info Metadata */}
                  <div className="space-y-5 flex-1">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] items-center gap-1.5 uppercase font-black text-slate-400 tracking-wider flex">
                        <Globe className="w-3 h-3" />
                        Tổ chức chứng nhận
                      </Label>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cert.organizations?.length > 0 ? (
                          cert.organizations.map((org: string, idx: number) => (
                            <Badge
                              key={idx}
                              variant="outline"
                              className="bg-slate-50 border-slate-200 text-slate-600 text-[10px] font-bold py-0.5"
                            >
                              {org}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs font-bold text-slate-400">
                            Đang cập nhật...
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-2xl bg-orange-50/30 border border-orange-100/50">
                        <span className="block text-[9px] text-orange-400 font-bold uppercase mb-1 tracking-wider">
                          Ngày cấp
                        </span>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-orange-300" />
                          <span className="text-xs font-black text-slate-700">
                            01/01/2024
                          </span>
                        </div>
                      </div>
                      <div className="p-3 rounded-2xl bg-orange-50/30 border border-orange-100/50">
                        <span className="block text-[9px] text-orange-400 font-bold uppercase mb-1 tracking-wider">
                          Hết hạn
                        </span>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-orange-300" />
                          <span className="text-xs font-black text-slate-700">
                            01/01/2025
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-8 pt-2">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-slate-100 hover:border-orange-200 hover:bg-orange-50 text-slate-600 hover:text-orange-600 font-black text-xs uppercase tracking-widest rounded-2xl transition-all h-11"
                    >
                      Xem tài liệu <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 h-80 flex flex-col items-center justify-center p-12 text-center group rounded-3xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-orange-200/20 rounded-full blur-2xl scale-150" />
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center text-slate-200 relative z-10 border border-slate-100 shadow-xl">
                <Award className="w-10 h-10 text-orange-100" />
              </div>
            </div>
            <div className="relative z-10 space-y-2 max-w-xs">
              <h4 className="font-black text-lg text-slate-400 tracking-tight uppercase">
                Chưa có chứng nhận
              </h4>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                Vùng trồng này hiện chưa cập nhật các chứng nhận tiêu chuẩn kỹ
                thuật.
              </p>
            </div>
          </Card>
        )}
      </TabsContent>

      {/* Plans Tab */}
      <TabsContent value="plans" className="space-y-6 overflow-hidden">
        <Card className="overflow-hidden border shadow-sm">
          <CardHeader className="border-b bg-slate-50/50 py-4">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2 text-lg font-bold">
                <FileText className="w-5 h-5 text-blue-600" />
                Kế hoạch canh tác
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-lg"
                onClick={() => setLocation("/plan")}
              >
                Xem tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 overflow-x-auto no-scrollbar pb-2">
              <Tabs
                value={planFilter}
                onValueChange={(val: any) => setPlanFilter(val)}
                className="w-full"
              >
                <TabsList className="bg-slate-100/50 p-1 rounded-2xl h-auto flex gap-1 w-max min-w-full">
                  <TabsTrigger
                    value="cultivation"
                    className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Canh tác (
                    {
                      baseRelevantPlans.filter(
                        (p) => p.purpose === "cultivation",
                      ).length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="treatment"
                    className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <Bug className="w-3.5 h-3.5" />
                    Điều trị (
                    {
                      baseRelevantPlans.filter((p) => p.purpose === "treatment")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="amendment"
                    className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <Sprout className="w-3.5 h-3.5" />
                    Cải tạo (
                    {
                      baseRelevantPlans.filter((p) => p.purpose === "amendment")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="harvest"
                    className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-indigo-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Thu hoạch (
                    {
                      baseRelevantPlans.filter((p) => p.purpose === "harvest")
                        .length
                    }
                    )
                  </TabsTrigger>
                  <TabsTrigger
                    value="incurred"
                    className="rounded-xl px-4 py-2 font-bold text-[11px] uppercase tracking-wider data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm transition-all whitespace-nowrap flex items-center gap-2"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Phát sinh (
                    {
                      baseRelevantPlans.filter((p) => p.purpose === "incurred")
                        .length
                    }
                    )
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <div className="w-full">
              {planFilter === "incurred" ? (
                <Card className="rounded-3xl border border-slate-100 shadow-sm overflow-hidden bg-white/60 backdrop-blur-sm">
                  <CardHeader className="pb-4 border-b border-slate-50 bg-slate-50/30">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-amber-100 text-amber-600 shadow-sm shadow-amber-200/50">
                          <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-black text-slate-800 tracking-tight">
                            Tổng hợp công việc phát sinh
                          </CardTitle>
                          <CardDescription className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">
                            Dữ liệu nhiệm vụ thực tế từ hệ thống quản lý công
                            việc
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-amber-50 text-amber-700 border-amber-200 font-black px-4 py-1.5 rounded-xl shadow-sm"
                      >
                        {incurredTasks.length} NHIỆM VỤ
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {incurredTasks.length === 0 ? (
                      <div className="py-24 text-center">
                        <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-6 border border-slate-100 shadow-inner">
                          <CheckCircle2 className="w-10 h-10 text-slate-200" />
                        </div>
                        <h4 className="text-lg font-bold text-slate-800 mb-2">
                          Chưa có dữ liệu công việc
                        </h4>
                        <p className="text-sm font-medium text-slate-400 max-w-[300px] mx-auto">
                          Không tìm thấy nhiệm vụ nào được ghi nhận cho các kế
                          hoạch phát sinh trong vùng canh tác này.
                        </p>
                      </div>
                    ) : (
                      <div className="bg-white">
                        <DataTable
                          columns={[
                            { key: "code", label: "Mã" },
                            { key: "name", label: "Tên công việc" },
                            {
                              key: "geographicalSelections",
                              label: "Phạm vi",
                              render: (value: any) => {
                                const geoSummary = getSelectionSummary(value || []);
                                if (geoSummary.length === 0) {
                                  return (
                                    <span className="text-slate-400 italic text-[10px]">
                                      Chưa xác định
                                    </span>
                                  );
                                }
                                return (
                                  <div className="flex flex-wrap gap-1">
                                    {geoSummary.map((group) =>
                                      group.items.map((item, idx) => (
                                        <Badge
                                          key={`${group.regionId}-${idx}`}
                                          variant="outline"
                                          className={cn(
                                            "text-[9px] py-0 h-4 font-bold border-slate-100",
                                            item.type === "region"
                                              ? "bg-emerald-50 text-emerald-600"
                                              : "bg-blue-50 text-blue-600",
                                          )}
                                        >
                                          {item.name}
                                        </Badge>
                                      )),
                                    )}
                                  </div>
                                );
                              },
                            },
                            { key: "plan", label: "Kế hoạch" },
                            { key: "stage", label: "Giai đoạn" },
                            {
                              key: "assignedTo",
                              label: "Phân công",
                              render: (value: any, row: any) => (
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className={cn(
                                      "p-1.5 rounded-lg shrink-0",
                                      row.assignedType === "team"
                                        ? "bg-blue-50 text-blue-600"
                                        : "bg-green-50 text-green-600",
                                    )}
                                  >
                                    <Users className="w-3.5 h-3.5" />
                                  </div>
                                  <span className="text-[11px] font-bold text-slate-600 truncate max-w-[150px]">
                                    {Array.isArray(value)
                                      ? value.join(", ")
                                      : value}
                                  </span>
                                </div>
                              ),
                            },
                            {
                              key: "priority",
                              label: "Ưu tiên",
                              render: (value: any) => (
                                <Badge
                                  variant={
                                    value === "high"
                                      ? "destructive"
                                      : value === "medium"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="text-[10px] px-2.5 py-0.5 border-none font-black tracking-wider shadow-sm"
                                >
                                  {value === "high"
                                    ? "CAO"
                                    : value === "medium"
                                      ? "TRUNG BÌNH"
                                      : "THẤP"}
                                </Badge>
                              ),
                            },
                            {
                              key: "status",
                              label: "Trạng thái",
                              render: (value: any) => {
                                const statusConfig: any = {
                                  completed: {
                                    label: "HOÀN THÀNH",
                                    variant: "secondary",
                                  },
                                  "in-progress": {
                                    label: "ĐANG CHẠY",
                                    variant: "default",
                                  },
                                  overdue: {
                                    label: "QUÁ HẠN",
                                    variant: "destructive",
                                  },
                                  pending: {
                                    label: "CHỜ DUYỆT",
                                    variant: "outline",
                                  },
                                };
                                const config =
                                  statusConfig[value] || statusConfig.pending;
                                return (
                                  <Badge
                                    variant={config.variant}
                                    className="text-[10px] px-2.5 py-0.5 border-none font-black tracking-wider shadow-sm"
                                  >
                                    {config.label}
                                  </Badge>
                                );
                              },
                            },
                            { key: "startDate", label: "Bắt đầu" },
                            { key: "endDate", label: "Kết thúc" },
                          ]}
                          data={incurredTasks}
                          onView={(task) => {
                            setSelectedTask(task);
                            setIsTaskDetailOpen(true);
                          }}
                        />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relevantPlans.length === 0 ? (
                    <div className="text-sm text-muted-foreground italic text-center py-8">
                      Chưa có kế hoạch nào phù hợp với phạm vi vùng canh tác
                      này.
                    </div>
                  ) : (
                    relevantPlans.map((plan) => {
                      const stageOrder =
                        plan.selectedStages && plan.selectedStages.length > 0
                          ? plan.selectedStages
                          : Array.from(
                              new Set([
                                ...(plan.taskAllocations || []).map(
                                  (t: any) => t.stageId || "Khác",
                                ),
                                ...(plan.materialAllocations || []).map(
                                  (m: any) => m.stageId || "Khác",
                                ),
                              ]),
                            );

                      const isCultivation = plan.purpose === "cultivation";
                      const isTreatment = plan.purpose === "treatment";
                      const isAmendment = plan.purpose === "amendment";
                      const isHarvest = plan.purpose === "harvest";
                      const isIncurred = plan.purpose === "incurred";

                      return (
                        <div
                          key={plan.id}
                          className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all duration-300 border-slate-100"
                        >
                          <div className="grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] gap-8">
                            {/* Left Column: Info & Purpose */}
                            <div className="space-y-8">
                              {/* 1. Header with General Info */}
                              <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                                      {plan.name}
                                    </h3>
                                    {planStatusBadge(plan.status)}
                                  </div>
                                  <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-500">
                                    <div className="flex items-center gap-1.5 font-medium">
                                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                        <FileText className="w-3 h-3 text-slate-500" />
                                      </span>
                                      <span className="font-mono">
                                        {plan.code}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                        <Calendar className="w-3 h-3 text-slate-500" />
                                      </span>
                                      <span>{plan.seasonName}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-medium">
                                      <span className="w-5 h-5 rounded-md bg-slate-100 flex items-center justify-center shrink-0">
                                        <Clock className="w-3 h-3 text-slate-500" />
                                      </span>
                                      <span>
                                        {new Date(
                                          plan.startDate,
                                        ).toLocaleDateString("vi-VN")}{" "}
                                        -{" "}
                                        {new Date(
                                          plan.endDate,
                                        ).toLocaleDateString("vi-VN")}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-slate-500 hover:text-primary rounded-xl self-start px-0 h-auto"
                                  onClick={() => {
                                    window.open(`/plan/${plan.id}`, "_blank");
                                  }}
                                >
                                  Xem chi tiết{" "}
                                  <ChevronRight className="w-4 h-4 ml-1" />
                                </Button>
                              </div>

                              {/* 2. Simplified Purpose Display */}
                              <div className="space-y-4">
                                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                  Mục đích kế hoạch
                                </h4>
                                <div className="grid grid-cols-1">
                                  {/* CANH TÁC */}
                                  {isCultivation && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-blue-500 bg-blue-50/50 ring-2 ring-blue-500/5">
                                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white shadow-md shadow-blue-500/20 flex items-center justify-center shrink-0">
                                        <Layers className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                                          CANH TÁC
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                          Áp dụng quy trình sản xuất chuẩn
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" />
                                    </div>
                                  )}

                                  {/* ĐIỀU TRỊ */}
                                  {isTreatment && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-red-500 bg-red-50/50 ring-2 ring-red-500/5">
                                      <div className="w-9 h-9 rounded-lg bg-red-600 text-white shadow-md shadow-red-500/20 flex items-center justify-center shrink-0">
                                        <Bug className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-red-700 uppercase tracking-wider">
                                          ĐIỀU TRỊ
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                          Triển khai phác đồ xử lý sâu bệnh
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-red-500 mr-2" />
                                    </div>
                                  )}

                                  {/* CẢI TẠO ĐẤT */}
                                  {isAmendment && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-emerald-500 bg-emerald-50/50 ring-2 ring-emerald-500/5">
                                      <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white shadow-md shadow-emerald-500/20 flex items-center justify-center shrink-0">
                                        <Sprout className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                                          CẢI TẠO ĐẤT
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                          Quy trình xử lý phục hồi đất đai
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                                    </div>
                                  )}

                                  {/* THU HOẠCH */}
                                  {isHarvest && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-indigo-500 bg-indigo-50/50 ring-2 ring-indigo-500/5">
                                      <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20 flex items-center justify-center shrink-0">
                                        <ShoppingBag className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                                          THU HOẠCH
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                          Triển khai thu hoạch và bảo quản
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2" />
                                    </div>
                                  )}

                                  {/* PHÁT SINH */}
                                  {isIncurred && (
                                    <div className="flex items-center gap-3 p-3 rounded-xl border-2 border-amber-500 bg-amber-50/50 ring-2 ring-amber-500/5">
                                      <div className="w-9 h-9 rounded-lg bg-amber-600 text-white shadow-md shadow-amber-500/20 flex items-center justify-center shrink-0">
                                        <AlertTriangle className="w-5 h-5" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-xs font-bold text-amber-700 uppercase tracking-wider">
                                          PHÁT SINH
                                        </div>
                                        <div className="text-[10px] text-slate-500 font-medium truncate mt-0.5">
                                          Công việc phát sinh ngoài kế hoạch
                                        </div>
                                      </div>
                                      <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Right Column: Detailed Setup View (Enhanced) */}
                            <div className="lg:pl-8 lg:border-l border-slate-100 min-w-0">
                              <div className="flex items-center gap-3 mb-6">
                                <div
                                  className={cn(
                                    "p-2.5 rounded-2xl shadow-sm",
                                    isTreatment && "bg-red-100/50",
                                    isAmendment && "bg-emerald-100/50",
                                    isCultivation && "bg-blue-100/50",
                                    isHarvest && "bg-indigo-100/50",
                                    isIncurred && "bg-amber-100/50",
                                  )}
                                >
                                  {isIncurred ? (
                                    <ClipboardList
                                      className={cn("w-7 h-7 text-amber-600")}
                                    />
                                  ) : (
                                    <Layers
                                      className={cn(
                                        "w-7 h-7",
                                        isTreatment && "text-red-600",
                                        isAmendment && "text-emerald-600",
                                        isCultivation && "text-blue-600",
                                        isHarvest && "text-indigo-600",
                                      )}
                                    />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <h3 className="text-lg font-black text-slate-900 truncate">
                                    {isTreatment
                                      ? "Lộ trình xử lý & Phác đồ"
                                      : isAmendment
                                        ? "Lộ trình cải tạo & Quy trình"
                                        : isHarvest
                                          ? "Lộ trình thu hoạch & Đóng gói"
                                          : isIncurred
                                            ? "Danh sách công việc phát sinh"
                                            : "Lộ trình triển khai & Giai đoạn"}
                                  </h3>
                                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider mt-0.5">
                                    {isHarvest
                                      ? "Chi tiết các giai đoạn thu hoạch sản phẩm"
                                      : isIncurred
                                        ? "Chi tiết các nhiệm vụ và vật tư phát sinh"
                                        : "Chi tiết các hạng mục và kế hoạch hành động"}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-4 max-h-125 overflow-y-auto pr-2 custom-scrollbar">
                                {isIncurred ? (
                                  <Tabs defaultValue="tasks" className="w-full">
                                    <TabsList className="flex items-center justify-start gap-4 p-0 bg-transparent h-auto border-b rounded-none mb-4 no-scrollbar">
                                      <TabsTrigger
                                        value="tasks"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-amber-600 data-[state=active]:text-amber-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                      >
                                        <Users className="w-3.5 h-3.5" />
                                        Nhiệm vụ (
                                        {plan.taskAllocations?.length || 0})
                                      </TabsTrigger>
                                      <TabsTrigger
                                        value="materials"
                                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                      >
                                        <Package className="w-3.5 h-3.5" />
                                        Vật tư (
                                        {plan.materialAllocations?.length || 0})
                                      </TabsTrigger>
                                    </TabsList>

                                <TabsContent
                                  value="tasks"
                                  className="m-0 bg-white anim-fade-in"
                                >
                                  {(!plan.taskAllocations || plan.taskAllocations.length === 0) ? (
                                    <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                      <p className="text-xs text-slate-400 italic">Chưa có nhiệm vụ cụ thể</p>
                                    </div>
                                  ) : (
                                    <div className="overflow-hidden rounded-xl border border-slate-100 shadow-sm bg-white">
                                      <DataTable
                                        columns={[
                                          { key: "code", label: "Mã" },
                                          {
                                            key: "name",
                                            label: "Tên công việc",
                                          },
                                          {
                                            key: "geographicalSelections",
                                            label: "Phạm vi",
                                            render: (value: any) => {
                                              const geoSummary =
                                                getSelectionSummary(
                                                  value || [],
                                                );
                                              if (geoSummary.length === 0) {
                                                return (
                                                  <span className="text-slate-400 italic text-[10px]">
                                                    Toàn bộ kế hoạch
                                                  </span>
                                                );
                                              }
                                              return (
                                                <div className="flex flex-wrap gap-1">
                                                  {geoSummary.map((group) =>
                                                    group.items.map(
                                                      (item, idx) => (
                                                        <Badge
                                                          key={`${group.regionId}-${idx}`}
                                                          variant="outline"
                                                          className={cn(
                                                            "text-[9px] py-0 h-4 font-bold border-slate-100",
                                                            item.type ===
                                                              "region"
                                                              ? "bg-emerald-50 text-emerald-600"
                                                              : "bg-blue-50 text-blue-600",
                                                          )}
                                                        >
                                                          {item.name}
                                                        </Badge>
                                                      ),
                                                    ),
                                                  )}
                                                </div>
                                              );
                                            },
                                          },
                                          {
                                            key: "assignedTo",
                                            label: "Phân công",
                                            render: (value: any, row: any) => (
                                              <div className="flex items-center gap-2.5">
                                                <div
                                                  className={cn(
                                                    "p-1.5 rounded-lg shrink-0",
                                                    row.assignedType === "team"
                                                      ? "bg-blue-50 text-blue-600"
                                                      : "bg-green-50 text-green-600",
                                                  )}
                                                >
                                                  <Users className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="text-[11px] font-bold text-slate-600 truncate max-w-[120px]">
                                                  {Array.isArray(value)
                                                    ? value.join(", ")
                                                    : value}
                                                </span>
                                              </div>
                                            ),
                                          },
                                          {
                                            key: "priority",
                                            label: "Ưu tiên",
                                            render: () => (
                                              <Badge variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-500 font-bold px-2 py-0">
                                                Trung bình
                                              </Badge>
                                            ),
                                          },
                                          {
                                            key: "status",
                                            label: "Trạng thái",
                                            render: () => (
                                              <Badge variant="default" className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0 border-none">
                                                Đang thực hiện
                                              </Badge>
                                            ),
                                          },
                                          {
                                            key: "startDate",
                                            label: "Bắt đầu",
                                          },
                                          {
                                            key: "endDate",
                                            label: "Kết thúc",
                                          },
                                        ]}
                                        data={plan.taskAllocations?.map((task: any) => ({
                                          ...task,
                                          code: `${plan.code}-${task.id}`,
                                          startDate: new Date(plan.startDate).toLocaleDateString("vi-VN"),
                                          endDate: new Date(plan.endDate).toLocaleDateString("vi-VN"),
                                        })) || []}
                                      />
                                    </div>
                                  )}
                                </TabsContent>

                                    <TabsContent
                                      value="materials"
                                      className="m-0 bg-white anim-fade-in"
                                    >
                                      {!plan.materialAllocations ||
                                      plan.materialAllocations.length === 0 ? (
                                        <div className="py-12 text-center border-2 border-dashed border-slate-100 rounded-3xl bg-slate-50/30">
                                          <p className="text-xs text-slate-400 italic">
                                            Không sử dụng vật tư
                                          </p>
                                        </div>
                                      ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                          {plan.materialAllocations.map(
                                            (mat) => (
                                              <div
                                                key={mat.id}
                                                className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow-md"
                                              >
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                  <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 shrink-0">
                                                    <Package className="w-4 h-4 text-emerald-600" />
                                                  </div>
                                                  <div className="min-w-0">
                                                    <p className="font-extrabold text-xs truncate text-slate-800">
                                                      {mat.materialName}
                                                    </p>
                                                    <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-tighter">
                                                      {mat.materialType}
                                                    </p>
                                                  </div>
                                                </div>
                                                <div className="text-right pl-2">
                                                  <div className="flex items-baseline gap-0.5">
                                                    <span className="text-sm font-black text-slate-900">
                                                      {mat.quantity}
                                                    </span>
                                                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                                                      {mat.unit}
                                                    </span>
                                                  </div>
                                                </div>
                                              </div>
                                            ),
                                          )}
                                        </div>
                                      )}
                                    </TabsContent>
                                  </Tabs>
                                ) : (
                                  (plan.selectedStages &&
                                  plan.selectedStages.length > 0
                                    ? plan.selectedStages
                                    : stageOrder
                                  ).map((stageKey, index) => {
                                    const [cycleId, stageName] =
                                      stageKey.includes(":")
                                        ? stageKey.split(":")
                                        : [null, stageKey];
                                    const cycle = cycleId
                                      ? growthCycles.find(
                                          (c) => c.id === cycleId,
                                        )
                                      : null;

                                    // Filter allocations for this stage
                                    const stageMaterials = (
                                      plan.materialAllocations || []
                                    ).filter((m) => m.stageId === stageKey);
                                    const stageTasks =
                                      plan.taskAllocations?.filter(
                                        (t) => t.stageId === stageKey,
                                      ) || [];

                                    return (
                                      <Card
                                        key={stageKey}
                                        className="overflow-hidden border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl"
                                      >
                                        <div className="bg-slate-50/80 px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-4">
                                          <div className="flex items-center gap-4 min-w-0">
                                            <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center font-black text-sm text-slate-700 shrink-0">
                                              {index + 1}
                                            </div>
                                            <div className="min-w-0">
                                              <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-base text-slate-900 truncate">
                                                  {stageName}
                                                </h4>
                                                {cycle && (
                                                  <Badge
                                                    variant="outline"
                                                    className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 font-normal py-0 px-2 h-4 shrink-0"
                                                  >
                                                    {cycle.name}
                                                  </Badge>
                                                )}
                                              </div>
                                              {plan.purpose !==
                                                "cultivation" && (
                                                <p
                                                  className={cn(
                                                    "text-[10px] font-bold uppercase tracking-wider",
                                                    isAmendment
                                                      ? "text-emerald-600"
                                                      : "text-red-600",
                                                  )}
                                                >
                                                  {isAmendment
                                                    ? "Hoạt động cải tạo đất"
                                                    : "Hoạt động điều trị bệnh"}
                                                </p>
                                              )}
                                            </div>
                                          </div>
                                          <div className="flex gap-2 shrink-0">
                                            <Badge
                                              variant="outline"
                                              className="bg-white hover:bg-green-50 transition-colors px-2 py-0.5"
                                            >
                                              <Leaf className="w-3 h-3 mr-1 text-green-600" />
                                              {stageMaterials.length}
                                            </Badge>
                                            <Badge
                                              variant="outline"
                                              className="bg-white hover:bg-blue-50 transition-colors px-2 py-0.5"
                                            >
                                              <Users className="w-3 h-3 mr-1 text-blue-600" />
                                              {stageTasks.length}
                                            </Badge>
                                          </div>
                                        </div>

                                        <CardContent className="p-0">
                                          {stageMaterials.length === 0 &&
                                          stageTasks.length === 0 ? (
                                            <div className="p-8 text-center text-muted-foreground italic text-sm">
                                              Chưa có chi tiết nào được lên kế
                                              hoạch.
                                            </div>
                                          ) : (
                                            <Tabs
                                              defaultValue="tasks"
                                              className="w-full"
                                            >
                                              <TabsList className="flex items-center justify-start gap-4 p-0 bg-transparent h-auto border-b rounded-none mb-4 no-scrollbar">
                                                <TabsTrigger
                                                  value="tasks"
                                                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                                >
                                                  <Users className="w-3.5 h-3.5" />
                                                  Công việc ({stageTasks.length}
                                                  )
                                                </TabsTrigger>
                                                <TabsTrigger
                                                  value="materials"
                                                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-emerald-600 data-[state=active]:text-emerald-700 py-3 font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all"
                                                >
                                                  <Package className="w-3.5 h-3.5" />
                                                  Vật tư (
                                                  {stageMaterials.length})
                                                </TabsTrigger>
                                              </TabsList>

                                          <TabsContent
                                            value="tasks"
                                            className="m-0 bg-white anim-fade-in"
                                          >
                                            {stageTasks.length === 0 ? (
                                              <div className="text-center py-10 border border-dashed rounded-2xl bg-slate-50/50">
                                                <Wrench className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                <p className="text-sm text-slate-500 font-medium">
                                                  Chưa có công việc phân bổ
                                                </p>
                                              </div>
                                            ) : (
                                              <div className="overflow-x-auto rounded-xl border border-slate-100 shadow-sm">
                                                <table className="w-full text-left border-collapse min-w-[600px]">
                                                  <thead>
                                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                        Nội dung
                                                      </th>
                                                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                        Phạm vi
                                                      </th>
                                                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                                                        Nhân sự
                                                      </th>
                                                      <th className="px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap text-right">
                                                        Thời gian
                                                      </th>
                                                    </tr>
                                                  </thead>
                                                  <tbody className="divide-y divide-slate-50">
                                                    {stageTasks.map((task) => {
                                                      const geoSummary = getSelectionSummary(task.geographicalSelections || []);
                                                      return (
                                                        <tr
                                                          key={task.id}
                                                          className="hover:bg-blue-50/30 transition-colors group"
                                                        >
                                                          <td className="px-4 py-3">
                                                            <div className="flex items-center gap-3">
                                                              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100 group-hover:bg-white transition-colors">
                                                                <CheckCircle2 className="w-4 h-4" />
                                                              </div>
                                                              <div className="min-w-0">
                                                                <p className="font-bold text-slate-800 text-xs lines-1">
                                                                  {task.name}
                                                                </p>
                                                                <p className="text-[10px] text-slate-400 italic truncate max-w-[200px]">
                                                                  {task.description ||
                                                                    "Máy móc & Thiết bị..."}
                                                                </p>
                                                              </div>
                                                            </div>
                                                          </td>
                                                          <td className="px-4 py-3">
                                                            <div className="flex flex-wrap gap-1">
                                                              {geoSummary.length >
                                                              0 ? (
                                                                geoSummary.map(
                                                                  (group) =>
                                                                    group.items.map(
                                                                      (
                                                                        item,
                                                                        idx,
                                                                      ) => (
                                                                        <Badge
                                                                          key={`${group.regionId}-${idx}`}
                                                                          variant="outline"
                                                                          className={cn(
                                                                            "text-[9px] py-0 h-4 font-bold border-slate-100",
                                                                            item.type ===
                                                                              "region"
                                                                              ? "bg-emerald-50 text-emerald-600"
                                                                              : "bg-blue-50 text-blue-600",
                                                                          )}
                                                                        >
                                                                          {
                                                                            item.name
                                                                          }
                                                                        </Badge>
                                                                      ),
                                                                    ),
                                                                )
                                                              ) : (
                                                                <span className="text-slate-400 italic text-[10px]">
                                                                  Toàn vùng
                                                                </span>
                                                              )}
                                                            </div>
                                                          </td>
                                                          <td className="px-4 py-3">
                                                            <div className="flex items-center gap-1.5 whitespace-nowrap">
                                                              <Users className="w-3 h-3 text-slate-400" />
                                                              <span className="text-xs font-bold text-slate-600">
                                                                {task.labor ||
                                                                  "Đội ngũ"}
                                                              </span>
                                                            </div>
                                                          </td>
                                                          <td className="px-4 py-3 text-right">
                                                            <Badge
                                                              variant="outline"
                                                              className="text-[10px] bg-white border-slate-200 text-slate-500 font-bold px-2 py-0"
                                                            >
                                                              {task.duration}
                                                            </Badge>
                                                          </td>
                                                        </tr>
                                                      );
                                                    })}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                          </TabsContent>

                                              <TabsContent
                                                value="materials"
                                                className="m-0 bg-white anim-fade-in"
                                              >
                                                {stageMaterials.length === 0 ? (
                                                  <div className="text-center py-10 border border-dashed rounded-2xl bg-slate-50/50">
                                                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                                    <p className="text-sm text-slate-500 font-medium">
                                                      Chưa có vật tư phân bổ
                                                    </p>
                                                  </div>
                                                ) : (
                                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2">
                                                    {stageMaterials.map(
                                                      (mat) => (
                                                        <div
                                                          key={mat.id}
                                                          className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-white hover:bg-emerald-50/30 transition-all shadow-sm hover:shadow-md"
                                                        >
                                                          <div className="flex items-center gap-3 overflow-hidden">
                                                            <div className="bg-emerald-50 p-2.5 rounded-xl shadow-sm border border-emerald-100 shrink-0">
                                                              <Package className="w-4 h-4 text-emerald-600" />
                                                            </div>
                                                            <div className="min-w-0 text-left">
                                                              <p className="font-extrabold text-xs truncate text-slate-800">
                                                                {
                                                                  mat.materialName
                                                                }
                                                              </p>
                                                              <p className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-tighter">
                                                                {
                                                                  mat.materialType
                                                                }
                                                              </p>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      ),
                                                    )}
                                                  </div>
                                                )}
                                              </TabsContent>
                                            </Tabs>
                                          )}
                                        </CardContent>
                                      </Card>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Soil Amendment History Tab */}
      {/* <TabsContent value="amendment-history" className="space-y-6">
        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Lịch sử canh tác
                </CardTitle>
                <CardDescription>
                  Danh sách lịch sử theo tháng/năm, có tìm kiếm và lọc theo thời
                  gian
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/soil-amendment-treatment")}
              >
                Xem tất cả
              </Button>
            </div>

            <div className="mt-4 flex lg:flex-row gap-4">
              <div className="flex-1 min-w-0">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Tìm kiếm
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      placeholder="Mã, tên, khu vực, vấn đề đất..."
                      value={historyQuery}
                      onChange={(e) => setHistoryQuery(e.target.value)}
                      className="pl-9 h-9 text-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="lg:w-48 shrink-0">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Từ ngày
                  </Label>
                  <Input
                    type="date"
                    value={historyFromDate}
                    onChange={(e) => setHistoryFromDate(e.target.value)}
                    className="h-9 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="lg:w-48 shrink-0">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Đến ngày
                  </Label>
                  <Input
                    type="date"
                    value={historyToDate}
                    onChange={(e) => setHistoryToDate(e.target.value)}
                    className="h-9 text-sm bg-white"
                  />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {historyGroups.length === 0 ? (
              <div className="text-sm text-muted-foreground italic">
                Không có lịch sử phù hợp với bộ lọc hiện tại.
              </div>
            ) : (
              <div className="space-y-10">
                {historyGroups.map((g) => (
                  <div key={g.key} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                        Tháng {g.label}
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {g.items.length} mục
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {g.items.map((t) => {
                        const statusCfg = getTreatmentStatusConfig(t.status);
                        const intensityCfg = getTreatmentIntensityConfig(
                          t.intensity,
                        );
                        const methods = mockMethods.filter((m) =>
                          (t.selectedMethods || []).includes(m.id),
                        );

                        const typeLabels = Array.from(
                          new Set(
                            methods
                              .map((m) => {
                                switch (m.type) {
                                  case "biological":
                                    return "Vi sinh";
                                  case "chemical":
                                    return "Hóa học";
                                  case "physical":
                                    return "Vật lý";
                                  case "integrated":
                                    return "Tổng hợp";
                                  default:
                                    return "";
                                }
                              })
                              .filter(Boolean),
                          ),
                        );

                        const timeRange = `${new Date(
                          t.startDate,
                        ).toLocaleDateString(
                          "vi-VN",
                        )} - ${new Date(t.endDate).toLocaleDateString("vi-VN")}`;

                        return (
                          <div
                            key={t.id}
                            className="border border-slate-200 rounded-xl p-4 bg-white hover:shadow-sm transition-shadow"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-mono text-xs font-bold text-slate-500">
                                    {t.code}
                                  </span>
                                  <div
                                    className={cn(
                                      "w-2 h-2 rounded-full",
                                      statusCfg.color,
                                    )}
                                    title={statusCfg.label}
                                  />
                                  <Badge
                                    className={`${intensityCfg.color} text-white text-[10px] px-2 py-0.5`}
                                  >
                                    {intensityCfg.label}
                                  </Badge>
                                </div>

                                <div className="font-bold text-slate-900 mt-1">
                                  {t.name}
                                </div>

                                <div className="text-xs text-slate-600 mt-2 space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                      Thời gian:{" "}
                                      <span className="font-semibold">
                                        {timeRange}
                                      </span>
                                    </span>
                                    <span className="text-slate-400">•</span>
                                    <span className="flex items-center gap-1.5">
                                      <Clock className="w-3.5 h-3.5" />
                                      Diễn ra:{" "}
                                      <span className="font-semibold">
                                        {t.duration}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <MapPin className="w-3.5 h-3.5" />
                                    <span className="truncate">
                                      Đơn vị:{" "}
                                      <span className="font-semibold">
                                        {t.zone}
                                      </span>
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-2 flex-wrap">
                                    <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>
                                      {typeLabels.length > 0
                                        ? `Cải tạo bằng: ${typeLabels.join(", ")}`
                                        : "Cải tạo đất"}
                                      {t.soilIssue
                                        ? `, ${t.soilIssue.toLowerCase()}`
                                        : ""}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex flex-wrap gap-2 mt-3">
                                  {methods.slice(0, 4).map((m) => (
                                    <Badge
                                      key={m.id}
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      {m.icon} {m.name}
                                    </Badge>
                                  ))}
                                  {methods.length > 4 && (
                                    <Badge
                                      variant="outline"
                                      className="text-[10px]"
                                    >
                                      +{methods.length - 4} phương pháp
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              <div className="shrink-0">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setHistoryDetailPlan(t)}
                                >
                                  Xem chi tiết
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog
          open={!!historyDetailPlan}
          onOpenChange={(open) => {
            if (!open) setHistoryDetailPlan(null);
          }}
        >
          <DialogContent className="max-w-5xl p-0 overflow-hidden">
            <DialogHeader className="px-6 pt-6">
              <DialogTitle>Chi tiết phác đồ cải tạo đất</DialogTitle>
            </DialogHeader>

            {historyDetailPlan && (
              <div className="max-h-[80vh] overflow-y-auto">
                <div className="relative h-48 bg-gradient-to-r from-green-600 to-emerald-500 overflow-hidden">
                  {historyDetailPlan.coverImage && (
                    <img
                      src={historyDetailPlan.coverImage}
                      alt={historyDetailPlan.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-sm font-medium bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">
                        {historyDetailPlan.code}
                      </span>
                      {(() => {
                        const config = getTreatmentIntensityConfig(
                          historyDetailPlan.intensity,
                        );
                        return (
                          <Badge className={`${config.color} text-white`}>
                            {config.label}
                          </Badge>
                        );
                      })()}
                      {(() => {
                        const config = getTreatmentStatusConfig(
                          historyDetailPlan.status,
                        );
                        return (
                          <Badge className={`${config.color} text-white`}>
                            {config.label}
                          </Badge>
                        );
                      })()}
                    </div>
                    <h2 className="text-2xl font-bold mb-2">
                      {historyDetailPlan.name}
                    </h2>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {historyDetailPlan.zone}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Sprout className="w-4 h-4" />
                        {historyDetailPlan.cropType}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {historyDetailPlan.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="procedures" className="p-6">
                  <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="procedures">
                      <ListChecks className="w-4 h-4 mr-2" />
                      Quy trình & Các bước
                    </TabsTrigger>
                    <TabsTrigger value="methods">
                      <Beaker className="w-4 h-4 mr-2" />
                      Phương pháp
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="procedures" className="space-y-6">
                    {historyDetailPlan.procedures.length > 0 ? (
                      <div className="space-y-6">
                        {historyDetailPlan.procedures.map((procedure) => (
                          <div
                            key={procedure.id}
                            className="relative pl-8 pb-8 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                          >
                            <div className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />

                            <Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                              <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                                      <Badge className="bg-green-600 text-white text-xs font-bold">
                                        Bước {procedure.stepNumber}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        <Clock className="w-3 h-3 mr-1" />
                                        {procedure.timing}
                                      </Badge>
                                      {procedure.estimatedDays && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs"
                                        >
                                          {procedure.estimatedDays} ngày
                                        </Badge>
                                      )}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                                      {procedure.name}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                      {procedure.description}
                                    </p>
                                  </div>
                                </div>

                                {procedure.images &&
                                  procedure.images.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                        <ImageIcon className="w-4 h-4 text-blue-600" />
                                        Hình ảnh minh họa
                                      </div>
                                      <div className="grid grid-cols-2 gap-3">
                                        {procedure.images.map((img, idx) => (
                                          <div
                                            key={idx}
                                            className="relative rounded-lg overflow-hidden border border-gray-200 aspect-video bg-gray-100"
                                          >
                                            <img
                                              src={img}
                                              alt={`Bước ${procedure.stepNumber} - Ảnh ${idx + 1}`}
                                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                            />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                {procedure.videoUrl && (
                                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                                        <Play className="w-5 h-5 text-white" />
                                      </div>
                                      <div className="flex-1">
                                        <p className="text-sm font-semibold text-blue-900">
                                          Video hướng dẫn chi tiết
                                        </p>
                                        <p className="text-xs text-blue-700">
                                          Xem video để hiểu rõ hơn về kỹ thuật
                                          thực hiện
                                        </p>
                                      </div>
                                      <Button
                                        size="sm"
                                        className="bg-blue-600 hover:bg-blue-700"
                                      >
                                        <Video className="w-4 h-4 mr-1" />
                                        Xem
                                      </Button>
                                    </div>
                                  </div>
                                )}

                                {procedure.detailedInstructions && (
                                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-gray-600" />
                                      Hướng dẫn chi tiết
                                    </h4>
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                      {procedure.detailedInstructions}
                                    </p>
                                  </div>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                  {procedure.dosage && (
                                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-amber-900 mb-1">
                                        Liều lượng
                                      </p>
                                      <p className="text-sm font-bold text-amber-700">
                                        {procedure.dosage}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.technique && (
                                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-purple-900 mb-1">
                                        Kỹ thuật
                                      </p>
                                      <p className="text-sm font-bold text-purple-700">
                                        {procedure.technique}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.weatherRequirements && (
                                    <div className="bg-sky-50 border border-sky-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-sky-900 mb-1 flex items-center gap-1">
                                        <Wind className="w-3 h-3" />
                                        Điều kiện thời tiết
                                      </p>
                                      <p className="text-sm font-bold text-sky-700">
                                        {procedure.weatherRequirements}
                                      </p>
                                    </div>
                                  )}
                                  {procedure.laborRequired && (
                                    <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                                      <p className="text-xs font-medium text-indigo-900 mb-1">
                                        Nhân công
                                      </p>
                                      <p className="text-sm font-bold text-indigo-700">
                                        {procedure.laborRequired} người
                                      </p>
                                    </div>
                                  )}
                                  {procedure.estimatedCost && (
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 col-span-2">
                                      <p className="text-xs font-medium text-green-900 mb-1">
                                        Chi phí ước tính
                                      </p>
                                      <p className="text-lg font-bold text-green-700">
                                        {procedure.estimatedCost} triệu đồng
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {procedure.warnings &&
                                  procedure.warnings.length > 0 && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                                      <div className="flex items-start gap-3">
                                        <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <h4 className="text-sm font-bold text-red-900 mb-2">
                                            ⚠️ Lưu ý quan trọng
                                          </h4>
                                          <ul className="space-y-1.5">
                                            {procedure.warnings.map(
                                              (warning, idx) => (
                                                <li
                                                  key={idx}
                                                  className="text-sm text-red-800 flex items-start gap-2"
                                                >
                                                  <span className="text-red-500 font-bold mt-0.5">
                                                    •
                                                  </span>
                                                  <span>{warning}</span>
                                                </li>
                                              ),
                                            )}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {procedure.tips &&
                                  procedure.tips.length > 0 && (
                                    <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                      <div className="flex items-start gap-3">
                                        <Lightbulb className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                                        <div className="flex-1">
                                          <h4 className="text-sm font-bold text-yellow-900 mb-2">
                                            💡 Mẹo hữu ích
                                          </h4>
                                          <ul className="space-y-1.5">
                                            {procedure.tips.map((tip, idx) => (
                                              <li
                                                key={idx}
                                                className="text-sm text-yellow-800 flex items-start gap-2"
                                              >
                                                <span className="text-yellow-500 font-bold mt-0.5">
                                                  ✓
                                                </span>
                                                <span>{tip}</span>
                                              </li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                {procedure.expectedOutcome && (
                                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                    <div className="flex items-start gap-2">
                                      <Target className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                                      <div>
                                        <p className="text-xs font-medium text-green-900 mb-1">
                                          Kết quả mong đợi
                                        </p>
                                        <p className="text-sm text-green-700">
                                          {procedure.expectedOutcome}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {procedure.qualityCheckpoints &&
                                  procedure.qualityCheckpoints.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                      <h4 className="text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Điểm kiểm tra chất lượng
                                      </h4>
                                      <div className="space-y-2">
                                        {procedure.qualityCheckpoints.map(
                                          (checkpoint, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-start gap-2"
                                            >
                                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle2 className="w-3 h-3 text-white" />
                                              </div>
                                              <p className="text-sm text-blue-800 flex-1">
                                                {checkpoint}
                                              </p>
                                            </div>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}

                                <div className="grid grid-cols-2 gap-3">
                                  {procedure.materials &&
                                    procedure.materials.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                          Vật tư cần thiết
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {procedure.materials.map(
                                            (material, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-green-100 text-green-800"
                                              >
                                                {material}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  {procedure.equipment &&
                                    procedure.equipment.length > 0 && (
                                      <div>
                                        <p className="text-xs font-semibold text-gray-700 mb-2">
                                          Thiết bị
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                          {procedure.equipment.map(
                                            (equip, idx) => (
                                              <Badge
                                                key={idx}
                                                variant="secondary"
                                                className="text-xs bg-blue-100 text-blue-800"
                                              >
                                                {equip}
                                              </Badge>
                                            ),
                                          )}
                                        </div>
                                      </div>
                                    )}
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 text-gray-400">
                        <ListChecks className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Chưa có quy trình chi tiết</p>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="methods" className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {mockMethods
                        .filter((m) =>
                          historyDetailPlan.selectedMethods.includes(m.id),
                        )
                        .map((method) => (
                          <Card key={method.id} className="border-gray-200">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <span className="text-2xl">{method.icon}</span>
                                <div className="flex-1">
                                  <h4 className="font-medium text-sm">
                                    {method.name}
                                  </h4>
                                  <p className="text-xs text-gray-500 mt-1">
                                    {method.description}
                                  </p>
                                  <Badge
                                    variant="outline"
                                    className="mt-2 text-xs"
                                  >
                                    {method.type === "physical" && "Vật lý"}
                                    {method.type === "chemical" && "Hóa học"}
                                    {method.type === "biological" && "Sinh học"}
                                    {method.type === "integrated" && "Tổng hợp"}
                                  </Badge>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </TabsContent> */}

      {/* Statistics Tab */}
      <TabsContent value="statistics" className="space-y-6 overflow-hidden">
        {details ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-blue-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                      <ShoppingBag className="w-6 h-6" />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">
                      Tổng SL thu hoạch
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {details.harvestStats.totalVolume.toLocaleString()}
                      </div>
                      <span className="text-sm font-bold text-slate-400">
                        kg
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Toàn vùng canh tác
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-green-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-green-50 text-green-600 rounded-xl">
                      <ArrowUpRight className="w-6 h-6" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                      {details.harvestStats.lastChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">
                      SL thu hoạch gần nhất
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {details.harvestStats.lastVolume.toLocaleString()}
                      </div>
                      <span className="text-sm font-bold text-slate-400">
                        kg
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      {details.harvestStats.lastChange >= 0
                        ? "Tăng"
                        : "Giảm"}{" "}
                      {details.harvestStats.lastChange}% so với đợt trước
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 bg-orange-500/5 rounded-full group-hover:scale-110 transition-transform duration-500" />
                <CardContent className="pt-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2.5 bg-orange-50 text-orange-600 rounded-xl">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-none px-2 py-0.5 rounded-lg flex items-center gap-1">
                      {details.harvestStats.avgChange >= 0 ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                    </Badge>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-500 mb-1">
                      SL trung bình mỗi đợt
                    </div>
                    <div className="flex items-baseline gap-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        {details.harvestStats.avgVolume.toLocaleString()}
                      </div>
                      <span className="text-sm font-bold text-slate-400">
                        kg
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-orange-600 uppercase tracking-wider">
                      <TrendingUp className="w-3 h-3" />
                      {details.harvestStats.avgChange >= 0
                        ? "Tăng"
                        : "Giảm"}{" "}
                      {Math.abs(details.harvestStats.avgChange)}% so với trung
                      bình
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart & Table */}
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        Biểu đồ năng suất thu hoạch
                      </CardTitle>
                      <CardDescription>
                        Theo dõi biến động sản lượng qua các đợt thu hoạch
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        Năm 2024
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-8 pb-6">
                  <div className="h-80 w-full px-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={details.harvestBatches
                          .slice()
                          .reverse()
                          .map((batch) => ({
                            batch: `Batch ${batch.id.slice(-3)}`,
                            date: new Date(batch.date).toLocaleDateString(
                              "vi-VN",
                              { month: "numeric", day: "numeric" },
                            ),
                            volume: batch.volume,
                          }))}
                        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="hsl(140, 15%, 88%)"
                          vertical={false}
                        />
                        <XAxis
                          dataKey="date"
                          stroke="hsl(140, 10%, 45%)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          dy={10}
                        />
                        <YAxis
                          stroke="hsl(140, 10%, 45%)"
                          fontSize={11}
                          tickLine={false}
                          axisLine={false}
                          dx={-10}
                        />
                        <ChartTooltip
                          contentStyle={{
                            backgroundColor: "hsl(0, 0%, 100%)",
                            border: "1px solid hsl(140, 15%, 88%)",
                            borderRadius: "12px",
                            fontSize: "12px",
                            boxShadow:
                              "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
                          }}
                          itemStyle={{ fontWeight: "bold" }}
                        />
                        <Line
                          type="monotone"
                          dataKey="volume"
                          name="Sản lượng"
                          stroke="hsl(142, 70%, 45%)"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "white",
                            strokeWidth: 2,
                            stroke: "hsl(142, 70%, 45%)",
                          }}
                          activeDot={{
                            r: 6,
                            fill: "hsl(142, 70%, 45%)",
                            strokeWidth: 0,
                          }}
                          animationDuration={1500}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg font-bold">
                        Danh sách các đợt thu hoạch
                      </CardTitle>
                      <CardDescription>
                        Chi tiết các lần thu hoạch thành phẩm
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <DataTable
                    columns={[
                      {
                        key: "date",
                        label: "Ngày thu hoạch",
                        render: (val: string) => (
                          <div className="flex items-center gap-2 font-medium text-slate-700">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(val).toLocaleDateString("vi-VN")}
                          </div>
                        ),
                      },
                      {
                        key: "volume",
                        label: "Sản lượng",
                        render: (val: number) => (
                          <div className="flex items-baseline gap-1">
                            <span className="font-bold text-slate-900">
                              {val.toLocaleString()}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">
                              kg
                            </span>
                          </div>
                        ),
                      },
                      {
                        key: "quality",
                        label: "Chất lượng",
                        render: (val: string) => (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "font-bold text-[10px] px-2 py-0 h-5 border-none",
                              val === "Loại A"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-orange-50 text-orange-600",
                            )}
                          >
                            {val}
                          </Badge>
                        ),
                      },
                      {
                        key: "staff",
                        label: "Người phụ trách",
                        render: (val: string) => (
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                              {val.charAt(0)}
                            </div>
                            <span className="text-sm text-slate-600">
                              {val}
                            </span>
                          </div>
                        ),
                      },
                      {
                        key: "notes",
                        label: "Ghi chú",
                        render: (val: string) => (
                          <span className="text-xs text-slate-400 truncate max-w-50 block">
                            {val || "-"}
                          </span>
                        ),
                      },
                    ]}
                    data={details.harvestBatches}
                  />
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <div className="p-8 text-center text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            Không có dữ liệu thống kê
          </div>
        )}
      </TabsContent>

      <TaskDetailDialog
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        task={selectedTask}
      />
    </Tabs>
  );
};
