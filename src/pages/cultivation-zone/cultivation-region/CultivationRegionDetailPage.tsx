import { useLocation, useParams } from "wouter";
import {
  AdminLayout,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Input,
  Label,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  Edit,
  Award,
  User,
  Globe,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Sprout,
  Droplets,
  Leaf,
  FileText,
  Layers,
  Target,
  CheckCircle,
  MapPin,
  Maximize2,
  X,
  Search,
  Clock,
  Beaker,
  ListChecks,
  Image as ImageIcon,
  Video,
  Play,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Wind,
} from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import useCultivationRegionStore from "../../../stores/useCultivationRegionStore";
import useRegionStore from "../../../stores/useRegionStore";
import { useMemo, useRef, useState } from "react";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useSeedStore from "../../../stores/useSeedStore";
import usePlanStore, { type Plan } from "../../../stores/usePlanStore";
import {
  initialTreatmentPlans,
  mockMethods,
  type TreatmentPlan,
} from "../../soil-amendment/SoilAmendmentTreatmentPage";

export const CultivationRegionDetailView = ({ id }: { id?: string }) => {
  const params = useParams<{ id: string }>();
  const resolvedId = id ?? params?.id;
  const [, setLocation] = useLocation();

  const handleBack = () => {
    setLocation("/cultivation-region");
  };

  const [isScopeMapExpanded, setIsScopeMapExpanded] = useState(false);
  const [expandedTaskKeys, setExpandedTaskKeys] = useState<
    Record<string, boolean>
  >({});
  const [expandedPlanKeys, setExpandedPlanKeys] = useState<
    Record<string, boolean>
  >({});
  const scopeMapRef = useRef<L.Map | null>(null);
  const expandedScopeMapRef = useRef<L.Map | null>(null);

  const getActiveScopeMap = () => {
    if (isScopeMapExpanded) return expandedScopeMapRef.current;
    return scopeMapRef.current;
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

  const toggleTaskExpanded = (key: string) => {
    setExpandedTaskKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const togglePlanExpanded = (key: string) => {
    setExpandedPlanKeys((prev) => ({ ...prev, [key]: !(prev[key] ?? true) }));
  };

  const { getAreaById } = useCultivationRegionStore();
  const { regions } = useRegionStore();
  const { standards } = useEnterpriseCertificateStore();
  const { personnel } = usePersonnelStore();
  const { farmingMethods } = useFarmingMethodStore();

  const { irrigationSystems } = useIrrigationSystemStore();
  const { varieties } = useVarietyStore();
  const { enterprises } = useEnterpriseStore();
  const { plans } = usePlanStore();

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

  const area = useMemo(() => {
    if (!resolvedId) return null;
    return getAreaById(resolvedId);
  }, [resolvedId, getAreaById]);

  const { seeds } = useSeedStore();

  const details = useMemo(() => {
    if (!area) return null;

    const manager = personnel.find((m) => m.id.toString() === area.managerId);

    // Resolve multiple certificates
    const selectedCerts = standards.filter(
      (c) =>
        (area.certificateIds || []).includes(c.code) ||
        (area as any).certificateId === c.code,
    );

    // Flexible entity resolution
    const selectedEntities = area.targetIds
      .map((id) => {
        // Find Region
        const reg = regions.find((r) => r.id.toString() === id);
        if (reg)
          return {
            ...reg,
            type: "Vùng trồng",
            typeCode: "region",
            regionId: reg.id,
          };

        // Find Area
        for (const r of regions) {
          const sa = r.subAreas?.find((a: any) => a.id.toString() === id);
          if (sa)
            return {
              ...sa,
              type: "Khu vực",
              typeCode: "area",
              regionId: r.id,
              areaId: sa.id,
            };
        }

        // Find Plot
        for (const r of regions) {
          for (const sa of r.subAreas || []) {
            const p = sa.plots?.find((p: any) => p.id.toString() === id);
            if (p)
              return {
                ...p,
                type: "Lô đất",
                typeCode: "plot",
                regionId: r.id,
                areaId: sa.id,
                plotId: p.id,
              };
          }
        }
        return null;
      })
      .filter((e): e is any => e !== null);

    const firstEntity = selectedEntities[0];
    const region = firstEntity
      ? regions.find((r) => r.id.toString() === firstEntity.regionId)
      : null;

    const totalAreaValue = selectedEntities.reduce(
      (sum, e) => sum + (e.area || 0),
      0,
    );

    const groupedSelections = selectedEntities.reduce((acc: any, entity) => {
      const rId = entity.regionId.toString();
      const aId = entity.areaId?.toString() || "none";

      if (!acc[rId]) {
        acc[rId] = {
          region: regions.find((r) => r.id.toString() === rId),
          areas: {},
        };
      }

      if (!acc[rId].areas[aId]) {
        const reg = acc[rId].region;
        acc[rId].areas[aId] = {
          area:
            aId === "none"
              ? null
              : reg?.subAreas?.find((sa: any) => sa.id.toString() === aId),
          entities: [],
        };
      }

      acc[rId].areas[aId].entities.push(entity);
      return acc;
    }, {});

    // Unified Configuration (New Model)
    const commonConfig = {
      farmingMethodId: area.farmingMethodId || "",
      irrigationMethodId: area.irrigationMethodId || "",
      selectedCrops: area.selectedCrops || [],
      seedSelections: area.seedSelections || {},
    };

    // Technical Config for display
    const farmingMethod = farmingMethods.find(
      (m) => m.id === commonConfig.farmingMethodId,
    );
    const irrigationMethod = irrigationSystems.find(
      (m) => m.id === commonConfig.irrigationMethodId,
    );
    const commonCrops = varieties
      .filter((v) => commonConfig.selectedCrops?.includes(v.id))
      .map((crop) => ({
        ...crop,
        selectedSeeds: (commonConfig.seedSelections?.[crop.id] || [])
          .map((sid: string) => seeds.find((s) => s.id === sid))
          .filter(Boolean),
      }));

    // Legacy Entity Configurations (Compatibility or fallback)
    const entityConfigs = selectedEntities.map((entity) => {
      // Prioritize area-wide config if available, fallback to legacy per-entity config
      const config =
        commonConfig.farmingMethodId || commonConfig.selectedCrops.length > 0
          ? commonConfig
          : area.configs?.[entity.id] || area.configs?.[entity.plotId];

      return {
        entity,
        farmingMethod: farmingMethods.find(
          (m) => m.id === config?.farmingMethodId,
        ),
        irrigationMethod: irrigationSystems.find(
          (m) => m.id === config?.irrigationMethodId,
        ),
        crops: varieties
          .filter((v) => config?.selectedCrops?.includes(v.id))
          .map((crop) => ({
            ...crop,
            selectedSeeds: (config?.seedSelections?.[crop.id] || [])
              .map((sid: string) => seeds.find((s) => s.id === sid))
              .filter(Boolean),
          })),
      };
    });

    let enterprise = enterprises.find(
      (e) => e.id.toString() === area.enterpriseId,
    );

    return {
      manager,
      selectedCerts,
      region,
      selectedEntities,
      groupedSelections,
      totalArea: totalAreaValue,
      enterprise,
      entityConfigs,
      technicalConfig: {
        farmingMethod,
        irrigationMethod,
        crops: commonCrops,
      },
    };
  }, [
    area,
    regions,
    personnel,
    standards,
    farmingMethods,
    irrigationSystems,
    varieties,
    enterprises,
    seeds,
  ]);

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
              <Tooltip sticky>
                <div className="px-2 py-1 font-bold text-[10px] uppercase tracking-tighter">
                  Vùng: {region.name}
                </div>
              </Tooltip>
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
              <Tooltip sticky>
                <div className="px-2 py-1 font-bold text-[10px] uppercase tracking-tighter">
                  Khu vực: {a.name}
                </div>
              </Tooltip>
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
              <Tooltip sticky>
                <div className="px-2 py-1 font-bold text-[10px] uppercase tracking-tighter">
                  Lô: {plot.name}
                </div>
              </Tooltip>
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

  const relevantPlans = useMemo(() => {
    const intersects = (a: string[] | undefined, b: Set<string>) =>
      (a || []).some((id) => b.has(String(id)));

    const matches = (p: Plan) =>
      intersects(p.selectedPlotIds, scopeTargetIds.plotIds) ||
      intersects(p.selectedZoneIds, scopeTargetIds.areaIds) ||
      intersects(p.selectedRegionIds, scopeTargetIds.regionIds);

    const statusRank: Record<Plan["status"], number> = {
      active: 0,
      draft: 1,
      completed: 2,
      cancelled: 3,
    };

    return plans.filter(matches).sort((a, b) => {
      const ra = statusRank[a.status] ?? 99;
      const rb = statusRank[b.status] ?? 99;
      if (ra !== rb) return ra - rb;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [plans, scopeTargetIds]);

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

  const purposeBadge = (purpose: Plan["purpose"]) => {
    const config: Record<
      Plan["purpose"],
      { label: string; className: string }
    > = {
      cultivation: {
        label: "Canh tác",
        className: "bg-emerald-50 text-emerald-700 border-emerald-200",
      },
      treatment: {
        label: "Xử lý",
        className: "bg-amber-50 text-amber-700 border-amber-200",
      },
      amendment: {
        label: "Cải tạo",
        className: "bg-sky-50 text-sky-700 border-sky-200",
      },
    };
    const c = config[purpose];
    return (
      <Badge variant="outline" className={cn("capitalize", c.className)}>
        {c.label}
      </Badge>
    );
  };

  const scopeNameKeywords = useMemo(() => {
    const keys = new Set<string>();
    if (area?.name) keys.add(area.name);
    for (const r of scopeMapData?.regions || []) keys.add(r.region.name);
    for (const a of scopeMapData?.areas || []) keys.add(a.area.name);
    for (const p of scopeMapData?.plots || []) keys.add(p.plot.name);
    return Array.from(keys)
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
  }, [area?.name, scopeMapData]);

  const relevantTreatments = useMemo(() => {
    const matchesScope = (t: TreatmentPlan) => {
      const hay = `${t.code} ${t.name} ${t.zone}`.toLowerCase();
      return scopeNameKeywords.some((k) => hay.includes(k));
    };

    const scoped = initialTreatmentPlans.filter(matchesScope);
    const list = scoped.length > 0 ? scoped : initialTreatmentPlans;

    const statusRank: Record<TreatmentPlan["status"], number> = {
      in_progress: 0,
      planning: 1,
      completed: 2,
      cancelled: 3,
    };

    return [...list].sort((a, b) => {
      const ra = statusRank[a.status] ?? 99;
      const rb = statusRank[b.status] ?? 99;
      if (ra !== rb) return ra - rb;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    });
  }, [scopeNameKeywords]);

  const [historyQuery, setHistoryQuery] = useState("");
  const [historyMonth, setHistoryMonth] = useState("");
  const [historyFromDate, setHistoryFromDate] = useState("");
  const [historyToDate, setHistoryToDate] = useState("");
  const [historyDetailPlan, setHistoryDetailPlan] =
    useState<TreatmentPlan | null>(null);

  const hasMonthFilter = !!historyMonth;
  const hasRangeFilter = !!historyFromDate || !!historyToDate;

  const getTreatmentIntensityConfig = (intensity: string) => {
    switch (intensity) {
      case "light":
        return { label: "Nhẹ", color: "bg-blue-500" };
      case "medium":
        return { label: "Trung bình", color: "bg-yellow-500" };
      case "deep":
        return { label: "Sâu", color: "bg-red-500" };
      default:
        return { label: "Không xác định", color: "bg-gray-500" };
    }
  };

  const getTreatmentStatusConfig = (status: string) => {
    switch (status) {
      case "planning":
        return { label: "Đang lập", color: "bg-blue-500" };
      case "in_progress":
        return { label: "Đang thực hiện", color: "bg-green-500" };
      case "completed":
        return { label: "Hoàn thành", color: "bg-gray-500" };
      case "cancelled":
        return { label: "Đã hủy", color: "bg-red-500" };
      default:
        return { label: "Không xác định", color: "bg-gray-500" };
    }
  };

  const filteredHistoryPlans = useMemo(() => {
    const parseDate = (value: string) => {
      const d = new Date(value);
      return Number.isFinite(d.getTime()) ? d : null;
    };

    const query = historyQuery.trim().toLowerCase();
    const rangeStart = historyFromDate ? parseDate(historyFromDate) : null;
    const rangeEnd = historyToDate ? parseDate(historyToDate) : null;
    const endInclusive = rangeEnd ? new Date(rangeEnd.getTime()) : null;
    if (endInclusive) endInclusive.setHours(23, 59, 59, 999);

    let monthStart: Date | null = null;
    let monthEnd: Date | null = null;
    if (historyMonth) {
      const [y, m] = historyMonth.split("-").map((v) => Number(v));
      if (Number.isFinite(y) && Number.isFinite(m)) {
        monthStart = new Date(y, m - 1, 1);
        monthEnd = new Date(y, m, 0, 23, 59, 59, 999);
      }
    }

    return relevantTreatments.filter((t) => {
      if (query) {
        const hay =
          `${t.code} ${t.name} ${t.zone} ${t.soilIssue}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }

      const planStart = parseDate(t.startDate) || new Date(0);
      const planEnd = parseDate(t.endDate) || planStart;

      // Filter by month/year if provided (overlap with the month).
      if (monthStart && monthEnd) {
        if (planStart > monthEnd || planEnd < monthStart) return false;
      }

      // Filter by explicit date range if provided (overlap with the range).
      if (rangeStart || endInclusive) {
        const s = rangeStart || new Date(-8640000000000000);
        const e = endInclusive || new Date(8640000000000000);
        if (planStart > e || planEnd < s) return false;
      }

      return true;
    });
  }, [
    relevantTreatments,
    historyQuery,
    historyFromDate,
    historyToDate,
    historyMonth,
  ]);

  const historyGroups = useMemo(() => {
    const parseDate = (value: string) => {
      const d = new Date(value);
      return Number.isFinite(d.getTime()) ? d : null;
    };

    const groupMap = new Map<
      string,
      { key: string; label: string; sortKey: number; items: TreatmentPlan[] }
    >();

    for (const t of filteredHistoryPlans) {
      const d = parseDate(t.startDate) || new Date(0);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const key = `${year}-${String(month).padStart(2, "0")}`;
      const label = `${String(month).padStart(2, "0")}/${year}`;
      const sortKey = year * 12 + month;

      const g = groupMap.get(key);
      if (g) {
        g.items.push(t);
      } else {
        groupMap.set(key, { key, label, sortKey, items: [t] });
      }
    }

    const groups = Array.from(groupMap.values()).sort(
      (a, b) => b.sortKey - a.sortKey,
    );
    for (const g of groups) {
      g.items.sort(
        (a, b) =>
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
      );
    }

    return groups;
  }, [filteredHistoryPlans]);

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
        <TabsTrigger value="plans">Kế hoạch</TabsTrigger>
        <TabsTrigger value="amendment-history">Lịch sử cải tạo đất</TabsTrigger>
        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
      </TabsList>

      {/* Overview Tab (Info) */}
      <TabsContent value="overview" className="space-y-6">
        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-muted-foreground">Tên vùng</div>
                <div className="font-medium mt-1 text-slate-900">
                  {area.name}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Mã số</div>
                <div className="font-mono mt-1 text-slate-900">{area.id}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Địa chỉ</div>
                <div className="font-medium mt-1 text-slate-900">
                  {details.region?.address ||
                    details.enterprise?.address ||
                    "Đang cập nhật"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Phạm vi vùng canh tác
                </div>
                <Badge variant="outline" className="mt-1 capitalize">
                  {area.scope === "region"
                    ? "Vùng trồng"
                    : area.scope === "area"
                      ? "Khu vực"
                      : "Lô đất"}
                </Badge>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Tổng diện tích
                </div>
                <div className="font-medium mt-1 text-lg text-blue-600">
                  {details.totalArea} ha
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">DT canh tác</div>
                <div className="font-medium mt-1 text-lg text-green-600">
                  {/* Mock calculation or same as total if not specified */}
                  {(details.totalArea * 0.9).toFixed(1)} ha
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Cây trồng chính
                </div>
                <div className="font-medium mt-1 text-slate-900">
                  {Array.from(
                    new Set(details.technicalConfig.crops.map((c) => c.crop)),
                  ).join(", ") || "Chưa xác định"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Loại đất</div>
                <div className="font-medium mt-1 text-slate-900">
                  {/* Mock data as it's not in store yet */}
                  Đất đỏ Bazan
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Hệ thống tưới
                </div>
                <div className="font-medium mt-1 text-slate-900">
                  {details.technicalConfig.irrigationMethod?.name ||
                    "Chưa thiết lập"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">
                  Người quản lý
                </div>
                <div className="font-medium mt-1 text-slate-900">
                  {details.manager?.fullName || "Chưa phân công"}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Ngày tạo</div>
                <div className="font-medium mt-1 text-slate-900">
                  {new Date(area.createdAt).toLocaleDateString("vi-VN")}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Trạng thái</div>
                <div className="mt-1">
                  <Badge
                    variant={area.status === "active" ? "default" : "secondary"}
                  >
                    {area.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
                  </Badge>
                </div>
              </div>
            </div>

            {area.note && (
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">Ghi chú</div>
                <p className="mt-1 text-slate-700">{area.note}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Context Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {details.enterprise && (
            <Card className="overflow-hidden relative shadow-md">
              <div className="h-32 bg-gray-100 flex items-center justify-center relative">
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

          {details.selectedEntities.length > 0 && (
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Phạm vi vùng canh tác ({details.selectedEntities.length} mục)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="h-[260px] rounded-xl overflow-hidden border border-slate-100 bg-slate-50 mb-6 relative">
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
                                  <div
                                    key={group.region.id}
                                    className="relative"
                                  >
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
                                                        areaGroup.area
                                                          ?.coordinates,
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
                                                          e?.typeCode ===
                                                          "plot",
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

                                                    {(
                                                      areaGroup.entities || []
                                                    ).some(
                                                      (e: any) =>
                                                        e?.typeCode === "area",
                                                    ) && (
                                                      <div className="flex items-center gap-3 py-1 relative">
                                                        <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                                        <Badge
                                                          variant="outline"
                                                          className="text-[9px] uppercase font-bold border-blue-200 text-blue-600 bg-blue-50/50"
                                                        >
                                                          Đã chọn toàn bộ khu
                                                          vực
                                                        </Badge>
                                                      </div>
                                                    )}
                                                  </div>
                                                </>
                                              ) : (
                                                <div className="space-y-4">
                                                  {(
                                                    areaGroup.entities || []
                                                  ).map((entity: any) => (
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
                                                          entity.typeCode ===
                                                            "region"
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
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>

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
                                        {areaGroup.entities.map(
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
                                                  "w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-xs",
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
              </CardContent>
            </Card>
          )}
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left: Technical Configs */}
              <div className="lg:col-span-4 space-y-6">
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
              <div className="lg:col-span-8">
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-green-500" />
                  Danh sách giống cây trồng & Hạt giống (
                  {details.technicalConfig.crops.length})
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {details.technicalConfig.crops.map((crop) => (
                    <div
                      key={crop.id}
                      className="group flex items-start gap-4 p-4 border rounded-2xl bg-white hover:border-primary/40 hover:bg-slate-50/50 transition-all shadow-sm hover:shadow-md"
                    >
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
                        <div className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                          {crop.varietyName}
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant="secondary"
                            className="text-[9px] px-1.5 py-0 h-4 bg-slate-100 text-slate-600 font-bold uppercase tracking-tight"
                          >
                            {crop.crop}
                          </Badge>
                          {crop.seedType && (
                            <Badge
                              variant="outline"
                              className="text-[9px] px-1.5 py-0 h-4 border-primary/20 text-primary font-medium"
                            >
                              {crop.seedType}
                            </Badge>
                          )}
                        </div>

                        {crop.selectedSeeds &&
                          crop.selectedSeeds.length > 0 && (
                            <div className="mt-2 space-y-1.5">
                              <div className="text-[10px] text-muted-foreground font-semibold italic">
                                Hạt giống sử dụng:
                              </div>
                              <div className="flex flex-wrap gap-1.5">
                                {crop.selectedSeeds.map((seed: any) => (
                                  <Badge
                                    key={seed.id}
                                    variant="secondary"
                                    className="text-[10px] px-2 py-0.5 bg-green-50 text-green-700 border-green-100 font-medium"
                                  >
                                    {seed.varietyName}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>

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
        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Nhân sự quản lý
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {details.manager ? (
              <div className="flex items-start gap-4 p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl">
                  {details.manager.avatar ? (
                    <img
                      src={details.manager.avatar}
                      alt={details.manager.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    details.manager.fullName.charAt(0)
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-bold text-lg text-slate-900">
                    {details.manager.fullName}
                  </div>
                  <div className="text-primary font-medium">
                    {details.manager.position}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {details.manager.department}
                  </div>
                  <div className="flex gap-4 mt-2 text-sm text-slate-600">
                    <span>Phone: {details.manager.phone || "N/A"}</span>
                    <span>Email: {details.manager.email || "N/A"}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                Chưa phân công người quản lý
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="text-base">
              Danh sách nhân viên (Mẫu)
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="divide-y">
              {/* Mock list since we don't have direct relation yet */}
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="py-4 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium">
                        Nhân viên kỹ thuật {i + 1}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Bộ phận Kỹ thuật
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    0987 654 32{i}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Certificates Tab */}
      <TabsContent value="certificates" className="space-y-6">
        <Card className="border overflow-hidden">
          <CardHeader className="border-b bg-slate-50">
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-orange-600" />
              Chứng nhận tiêu chuẩn ({details.selectedCerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {details.selectedCerts.length > 0 ? (
              details.selectedCerts.map((cert) => (
                <div
                  key={cert.code}
                  className="border rounded-xl overflow-hidden"
                >
                  <div className="bg-orange-50 p-4 border-b border-orange-100 flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-orange-900">
                        {cert.name}
                      </h3>
                      <p className="text-orange-700 text-sm">{cert.code}</p>
                    </div>
                    <Badge className="bg-orange-200 text-orange-800 hover:bg-orange-300">
                      Hoạt động
                    </Badge>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Tổ chức cấp
                      </div>
                      <div className="font-medium">
                        {cert.organizations?.join(", ") || "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày cấp
                      </div>
                      <div className="font-medium">01/01/2024</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Ngày hết hạn
                      </div>
                      <div className="font-medium">01/01/2025</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">
                        Trạng thái
                      </div>
                      <div className="font-medium text-green-600">
                        Còn hiệu lực
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Chưa có thông tin chứng nhận
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Plans Tab */}
      <TabsContent value="plans" className="space-y-6 overflow-hidden">
        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-600" />
                Kế hoạch canh tác
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/plan")}
              >
                Xem tất cả
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {relevantPlans.length === 0 ? (
                <div className="text-sm text-muted-foreground italic">
                  Chưa có kế hoạch nào phù hợp với phạm vi vùng canh tác này.
                </div>
              ) : (
                relevantPlans.map((plan) => {
                  const planKey = String(plan.id);
                  const isPlanExpanded = expandedPlanKeys[planKey] ?? true;
                  const materialsByStage = (
                    plan.materialAllocations || []
                  ).reduce((acc: Record<string, any[]>, m) => {
                    const key = m.stageId || "Khác";
                    acc[key] = acc[key] || [];
                    acc[key].push(m);
                    return acc;
                  }, {});

                  const tasksByStage = (plan.taskAllocations || []).reduce(
                    (acc: Record<string, any[]>, t) => {
                      const key = t.stageId || "Khác";
                      acc[key] = acc[key] || [];
                      acc[key].push(t);
                      return acc;
                    },
                    {},
                  );

                  const stageOrder =
                    plan.selectedStages && plan.selectedStages.length > 0
                      ? plan.selectedStages
                      : Array.from(
                          new Set([
                            ...Object.keys(tasksByStage),
                            ...Object.keys(materialsByStage),
                          ]),
                        );

                  const uniqueLabor = Array.from(
                    new Set(
                      (plan.taskAllocations || [])
                        .map((t) => t.labor)
                        .filter(Boolean),
                    ),
                  );

                  return (
                    <div
                      key={plan.id}
                      className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="min-w-0">
                          <div className="flex items-start gap-2">
                            <button
                              type="button"
                              className="mt-0.5 shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
                              onClick={() => togglePlanExpanded(planKey)}
                              aria-label={
                                isPlanExpanded
                                  ? "Thu gọn kế hoạch"
                                  : "Mở rộng kế hoạch"
                              }
                              aria-expanded={isPlanExpanded}
                            >
                              {isPlanExpanded ? (
                                <ChevronDown className="w-4 h-4" />
                              ) : (
                                <ChevronRight className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              className="font-bold text-lg text-slate-900 truncate text-left min-w-0"
                              onClick={() => togglePlanExpanded(planKey)}
                              aria-expanded={isPlanExpanded}
                            >
                              {plan.name}
                            </button>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            <span className="font-mono">{plan.code}</span> •{" "}
                            {plan.seasonName}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            Thời gian:{" "}
                            {new Date(plan.startDate).toLocaleDateString(
                              "vi-VN",
                            )}{" "}
                            -{" "}
                            {new Date(plan.endDate).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            {purposeBadge(plan.purpose)}
                            <Badge variant="outline">{plan.crop}</Badge>
                            {plan.variety && (
                              <Badge variant="outline">{plan.variety}</Badge>
                            )}
                            {plan.expectedYield && (
                              <Badge variant="outline">
                                SL dự kiến: {plan.expectedYield}
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {planStatusBadge(plan.status)}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLocation(`/plan/${plan.id}`);
                            }}
                          >
                            Chi tiết
                          </Button>
                        </div>
                      </div>

                      {isPlanExpanded && (
                        <div className="mt-4 pt-4 border-t space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Người canh tác (ước tính)
                              </div>
                              <div className="text-slate-700">
                                {uniqueLabor.length > 0
                                  ? uniqueLabor.join(", ")
                                  : "Chưa cập nhật"}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                Nội dung cập nhật
                              </div>
                              <div className="text-slate-700">
                                {plan.description || "—"}
                              </div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              Vật tư & Công việc theo giai đoạn
                            </div>

                            <div className="space-y-3">
                              {stageOrder.map((stageName, idx) => {
                                const materials =
                                  materialsByStage[stageName] || [];
                                const tasks = tasksByStage[stageName] || [];
                                return (
                                  <Card
                                    key={`${plan.id}-stage-${stageName}-${idx}`}
                                    className="border-slate-200 shadow-sm"
                                  >
                                    <CardHeader className="py-3 px-4 border-b bg-slate-50/50">
                                      <div className="flex items-center justify-between gap-3">
                                        <CardTitle className="text-sm font-bold">
                                          {idx + 1}. {stageName}
                                        </CardTitle>
                                        <div className="flex items-center gap-2">
                                          <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                          >
                                            {materials.length} vật tư
                                          </Badge>
                                          <Badge
                                            variant="outline"
                                            className="text-[10px]"
                                          >
                                            {tasks.length} công việc
                                          </Badge>
                                        </div>
                                      </div>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-4">
                                      {materials.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="text-xs font-bold text-slate-700">
                                            Vật tư
                                          </div>
                                          <div className="space-y-2">
                                            {materials.map((m: any) => (
                                              <div
                                                key={m.id}
                                                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm border rounded-md p-3 bg-white"
                                              >
                                                <div className="min-w-0">
                                                  <div className="font-semibold text-slate-900 truncate">
                                                    {m.materialName}
                                                  </div>
                                                  <div className="text-xs text-muted-foreground">
                                                    {m.materialCategory} •{" "}
                                                    {m.materialType}
                                                  </div>
                                                </div>
                                                <div className="font-mono font-bold text-slate-800">
                                                  {m.quantity} {m.unit}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {tasks.length > 0 && (
                                        <div className="space-y-2">
                                          <div className="text-xs font-bold text-slate-700">
                                            Công việc
                                          </div>
                                          <div className="space-y-2">
                                            {tasks.map((t: any) => (
                                              <div
                                                key={t.id}
                                                className="border rounded-md p-3 bg-white space-y-1"
                                              >
                                                {(() => {
                                                  const taskKey = `${plan.id}:${stageName}:${t.id}`;
                                                  const isExpanded =
                                                    !!expandedTaskKeys[taskKey];
                                                  return (
                                                    <>
                                                      <button
                                                        type="button"
                                                        className="w-full text-left"
                                                        onClick={() =>
                                                          toggleTaskExpanded(
                                                            taskKey,
                                                          )
                                                        }
                                                        aria-expanded={
                                                          isExpanded
                                                        }
                                                      >
                                                        <div className="flex items-start justify-between gap-3">
                                                          <div className="min-w-0">
                                                            <div className="font-semibold text-slate-900">
                                                              {t.name}
                                                            </div>
                                                            <div className="text-xs font-mono text-slate-700 mt-1">
                                                              {t.labor}
                                                              {t.duration
                                                                ? ` • ${t.duration}`
                                                                : ""}
                                                            </div>
                                                          </div>
                                                          <div className="shrink-0 mt-0.5 text-slate-400">
                                                            {isExpanded ? (
                                                              <ChevronDown className="w-4 h-4" />
                                                            ) : (
                                                              <ChevronRight className="w-4 h-4" />
                                                            )}
                                                          </div>
                                                        </div>
                                                      </button>

                                                      {isExpanded &&
                                                        t.description && (
                                                          <div className="text-sm text-slate-700 mt-2">
                                                            {t.description}
                                                          </div>
                                                        )}
                                                    </>
                                                  );
                                                })()}
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      )}

                                      {materials.length === 0 &&
                                        tasks.length === 0 && (
                                          <div className="text-sm text-muted-foreground italic">
                                            Chưa có dữ liệu vật tư/công việc cho
                                            giai đoạn này.
                                          </div>
                                        )}
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Soil Amendment History Tab */}
      <TabsContent value="amendment-history" className="space-y-6">
        <Card className="overflow-hidden border">
          <CardHeader className="border-b bg-slate-50">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-emerald-600" />
                  Lịch sử cải tạo đất
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

            <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-3">
              <div className="lg:col-span-5">
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

              <div className="lg:col-span-3">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Tháng/Năm
                  </Label>
                  <Input
                    type="month"
                    value={historyMonth}
                    disabled={hasRangeFilter}
                    onChange={(e) => {
                      const next = e.target.value;
                      setHistoryMonth(next);
                      if (next) {
                        setHistoryFromDate("");
                        setHistoryToDate("");
                      }
                    }}
                    className="h-9 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Từ ngày
                  </Label>
                  <Input
                    type="date"
                    value={historyFromDate}
                    disabled={hasMonthFilter}
                    onChange={(e) => {
                      const next = e.target.value;
                      setHistoryFromDate(next);
                      if (next) setHistoryMonth("");
                    }}
                    className="h-9 text-sm bg-white"
                  />
                </div>
              </div>

              <div className="lg:col-span-2">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase tracking-wider text-slate-500">
                    Đến ngày
                  </Label>
                  <Input
                    type="date"
                    value={historyToDate}
                    disabled={hasMonthFilter}
                    onChange={(e) => {
                      const next = e.target.value;
                      setHistoryToDate(next);
                      if (next) setHistoryMonth("");
                    }}
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

                    <div className="space-y-3">
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
                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm" />

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
                                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
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
                                        <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
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
                                        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
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
                                      <Target className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
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
                                              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
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
      </TabsContent>

      {/* Statistics Tab */}
      <TabsContent value="statistics" className="space-y-6 overflow-hidden">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              label: "Tổng diện tích",
              value: `${details.totalArea} ha`,
              icon: Layers,
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              label: "Số lượng thực thể",
              value: details.selectedEntities.length || 1,
              icon: Target,
              color: "text-orange-600",
              bg: "bg-orange-50",
            },
            {
              label: "Giống cây trồng",
              value: Array.from(
                new Set(
                  details.entityConfigs.flatMap((ec) =>
                    ec.crops.map((c) => c.id),
                  ),
                ),
              ).length,
              icon: Sprout,
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              label: "Cấu hình riêng",
              value: Object.keys(area.configs || {}).length,
              icon: FileText,
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">
                      {stat.label}
                    </div>
                    <div className="text-2xl font-bold text-slate-900">
                      {stat.value}
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters & Chart placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <Card>
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <CardTitle>
                    Biểu đồ năng suất thu hoạch (Dữ liệu mẫu)
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm" className="h-8">
                      Last 30 days
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="h-87.5 flex items-end justify-between gap-2 px-2">
                  {[45, 60, 30, 75, 50, 80, 65, 90, 70, 55, 60, 40].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 flex flex-col items-center gap-2 group"
                      >
                        <div
                          className="w-full bg-primary/20 hover:bg-primary/40 transition-all rounded-t relative group-hover:bg-primary/60"
                          style={{ height: `${h}%` }}
                        ></div>
                        <span className="text-xs text-muted-foreground">
                          T{i + 1}
                        </span>
                      </div>
                    ),
                  )}
                </div>
                <div className="text-center text-sm text-muted-foreground mt-4">
                  Dữ liệu thống kê đang được cập nhật cho {area.name}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};

const CultivationRegionDetailPage = () => {
  const { id } = useParams<{ id: string }>();

  const { getAreaById } = useCultivationRegionStore();
  const [, setLocation] = useLocation();

  const area = useMemo(() => {
    if (!id) return null;
    return getAreaById(id);
  }, [id, getAreaById]);

  const handleBack = () => {
    setLocation("/cultivation-region");
  };

  return (
    <AdminLayout
      title={area?.name || "Không tìm thấy"}
      description={
        area
          ? `Mã: ${area.id} • Tạo: ${new Date(area.createdAt).toLocaleDateString("vi-VN")}`
          : "Vùng canh tác không tồn tại"
      }
    >
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex gap-2">
          <Badge
            variant={area?.status === "active" ? "default" : "secondary"}
            className="px-3 py-1"
          >
            <CheckCircle className="w-3 h-3 mr-1" />
            {area?.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
          </Badge>
          <Button
            onClick={() => setLocation(`/cultivation-region/${area?.id}/edit`)}
            className="gap-2"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <CultivationRegionDetailView />
    </AdminLayout>
  );
};

export default CultivationRegionDetailPage;
