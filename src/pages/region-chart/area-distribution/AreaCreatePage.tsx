import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  StepperForm,
  type Step,
  useToast,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  Badge,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Polyline,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  ChevronLeft,
  Plus,
  Trash2,
  Edit,
  X,
  MapPin,
  Search,
  CheckCircle2,
  Map as MapIcon,
  Layers,
  Info,
} from "lucide-react";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";

import {
  type SubArea as Area,
  type Plot,
  PROVINCES,
  DISTRICTS,
} from "../constants";
import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";
import useTerrainStore from "@/stores/useTerrainStore";
import useLandStore from "@/stores/useLandStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";

const SelectionCard = ({
  regionId,
  regions,
  onRemove,
}: {
  regionId: string;
  regions: any[];
  onRemove: () => void;
}) => {
  const region = regions.find((r) => r.id.toString() === regionId);
  if (!region) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
          <MapPin className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-primary px-1.5 py-0.5 bg-primary/5 rounded">
              Vùng trồng
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              #{region.code}
            </span>
          </div>
          <h4 className="font-bold text-slate-800 truncate leading-tight">
            {region.name}
          </h4>
          <p className="text-[11px] text-slate-500 truncate mt-0.5 italic">
            {region.address}, {region.ward}, {region.districtId},{" "}
            {region.provinceId}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

const RegionSelector = ({
  regions,
  enterpriseId,
  onSelect,
  selectedId,
}: {
  regions: any[];
  enterpriseId: number | null;
  onSelect: (id: string) => void;
  selectedId?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = useMemo(() => {
    return regions.filter(
      (r) =>
        (!enterpriseId || String(r.enterpriseId) === String(enterpriseId)) &&
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [regions, enterpriseId, searchTerm]);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={!enterpriseId}
        className="w-full h-12 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        <Plus className="w-5 h-5" />
        Chọn vùng trồng
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn vùng trồng
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Phần khu vực đang tạo sẽ thuộc về vùng trồng được chọn
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng trồng..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.map((r) => (
                <div
                  key={r.id}
                  onClick={() => {
                    onSelect(r.id.toString());
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-xl border-2 transition-all cursor-pointer",
                    selectedId === r.id.toString()
                      ? "bg-primary/10 border-primary/40"
                      : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-800 text-sm">
                        {r.name}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Vùng trồng
                      </div>
                    </div>
                  </div>
                  {selectedId === r.id.toString() ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                      <Badge
                        variant="secondary"
                        className="text-[10px] bg-primary/10 text-primary border-none"
                      >
                        Đã chọn
                      </Badge>
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded border-2 border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                      <Plus className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}
              {filteredRegions.length === 0 && (
                <div className="text-center py-12">
                  <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                    <Search className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="text-slate-500 font-medium text-sm">
                    Không tìm thấy vùng trồng nào
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const DEFAULT_AREA_POINT_TUPLES: [number, number][] = [
  [11.53, 106.88],
  [11.55, 106.91],
  [11.53, 106.91],
];

const createLatLngPoints = (tuples: [number, number][]) =>
  tuples.map(([lat, lng]) => L.latLng(lat, lng));

const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};

const formatLatLng = (latlng: L.LatLng) =>
  `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

type PointWarning = {
  index: number;
  invalidLatLng: L.LatLng;
  suggestedLatLng: L.LatLng;
};

const toTurfPolygonFromCoords = (coords: { lat: number; lng: number }[]) => {
  if (!coords || coords.length < 3) return null;
  const lngLat = coords.map((c) => [c.lng, c.lat]);
  const first = lngLat[0];
  const closed = [...lngLat, first];
  return polygon([closed]);
};

const getNearestPointOnPolygonBoundary = (
  polyFeature: any,
  latlng: L.LatLng,
) => {
  if (!polyFeature) return null;
  const lineFeature = polygonToLine(polyFeature);
  const line = Array.isArray((lineFeature as any).features)
    ? (lineFeature as any).features[0]
    : lineFeature;
  if (!line) return null;
  const snapped = nearestPointOnLine(
    line as any,
    point([latlng.lng, latlng.lat]),
  );
  if (!snapped) return null;
  return L.latLng(
    snapped.geometry.coordinates[1],
    snapped.geometry.coordinates[0],
  );
};
const AreaCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/area-distribution/edit/:id");
  const isEditMode = match && !!params?.id;
  const { lands } = useLandStore();
  const { terrains } = useTerrainStore();
  const { enterprises } = useEnterpriseStore();
  // States

  const [selectEnterpriseId, setSelectEnterpriseId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<Area>>({
    id: "",
    code: "",
    name: "",
    area: 0,
    landType: "",
    terrain: "",
    status: "active",
    plots: [],
  });

  const [areaPoints, setAreaPoints] = useState<L.LatLng[]>(() =>
    createLatLngPoints(DEFAULT_AREA_POINT_TUPLES),
  );
  const [areaMapCenter, setAreaMapCenter] = useState<L.LatLng>(() =>
    getBoundsFromPoints(
      createLatLngPoints(DEFAULT_AREA_POINT_TUPLES),
    ).getCenter(),
  );
  const [plotMapCenter, setPlotMapCenter] = useState<L.LatLng>(() =>
    getBoundsFromPoints(
      createLatLngPoints(DEFAULT_AREA_POINT_TUPLES),
    ).getCenter(),
  );
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [areaPointWarnings, setAreaPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activeAreaDragWarning, setActiveAreaDragWarning] =
    useState<PointWarning | null>(null);
  const [isDraggingAreaPoint, setIsDraggingAreaPoint] = useState(false);

  // Plot Editing
  const [plotPoints, setPlotPoints] = useState<L.LatLng[]>([]);
  const [editingPlot, setEditingPlot] = useState<Partial<Plot> | null>(null);
  const [activePlotPointIndex, setActivePlotPointIndex] = useState<
    number | null
  >(null);
  const [plotPointWarnings, setPlotPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activeDragWarning, setActiveDragWarning] =
    useState<PointWarning | null>(null);
  const [isDraggingPlotPoint, setIsDraggingPlotPoint] = useState(false);

  const { regions, upsertSubArea, getAreaById } = useRegionStore();
  const hasInitializedEditData = useRef(false);

  const syncMapCenters = useCallback(
    (points: L.LatLng[]) => {
      if (!points || points.length === 0) return;
      const nextCenter = getBoundsFromPoints(points).getCenter();
      setAreaMapCenter(nextCenter);
      setPlotMapCenter(nextCenter);
    },
    [setAreaMapCenter, setPlotMapCenter],
  );

  const currentRegion = React.useMemo(() => {
    return regions.find((r) => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  const areaPolygonFeature = React.useMemo(() => {
    if (areaPoints.length < 3) return null;
    const coordinates = areaPoints.map((p) => [p.lng, p.lat]);
    const first = coordinates[0];
    const closed = [...coordinates, first];
    return polygon([closed]);
  }, [areaPoints]);

  const regionPolygonFeature = React.useMemo(() => {
    if (!selectedRegionId) return null;
    const region = regions.find((r) => r.id === selectedRegionId);
    if (!region || !region.coordinates || region.coordinates.length < 3)
      return null;
    const coordinates = region.coordinates.map((c: any) => [c.lng, c.lat]);
    const first = coordinates[0];
    const closed = [...coordinates, first];
    return polygon([closed]);
  }, [selectedRegionId, regions]);

  const activePersistentPlotWarning = React.useMemo(() => {
    if (activePlotPointIndex === null) return null;
    return plotPointWarnings[activePlotPointIndex] ?? null;
  }, [activePlotPointIndex, plotPointWarnings]);

  const activePersistentAreaWarning = React.useMemo(() => {
    if (activePointIndex === null) return null;
    return areaPointWarnings[activePointIndex] ?? null;
  }, [activePointIndex, areaPointWarnings]);

  const blockingAreaPolygons = React.useMemo(() => {
    if (!currentRegion?.subAreas) return [];
    return currentRegion.subAreas
      .filter((area) => {
        if (!area.coordinates || area.coordinates.length < 3) return false;
        if (isEditMode && params?.id && area.id === params.id) return false;
        return true;
      })
      .map((area) => {
        const poly = toTurfPolygonFromCoords(
          area.coordinates as { lat: number; lng: number }[],
        );
        if (!poly) return null;
        return { id: area.id, polygon: poly };
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [currentRegion, isEditMode, params?.id]);

  const blockingPlotPolygons = React.useMemo(() => {
    if (!formData.plots || formData.plots.length === 0) return [];
    return (formData.plots as Plot[])
      .filter((plot) => {
        if (!plot.coordinates || plot.coordinates.length < 3) return false;
        if (editingPlot && plot.id === editingPlot.id) return false;
        return true;
      })
      .map((plot) => {
        const poly = toTurfPolygonFromCoords(plot.coordinates);
        if (!poly) return null;
        return { id: plot.id, polygon: poly };
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [formData.plots, editingPlot]);

  useEffect(() => {
    hasInitializedEditData.current = false;
  }, [params?.id]);

  useEffect(() => {
    if (!isEditMode || !params?.id) {
      hasInitializedEditData.current = false;
      return;
    }
    if (hasInitializedEditData.current) return;

    const found = getAreaById(String(params.id));

    console.log(found);

    if (!found) return;

    hasInitializedEditData.current = true;
    const area = found.area;
    setFormData(area);
    setSelectedRegionId(area.regionId);
    if (area.coordinates && area.coordinates.length >= 3) {
      const loadedPoints = area.coordinates.map((c: any) =>
        L.latLng(c.lat, c.lng),
      );
      setAreaPoints(loadedPoints);
      syncMapCenters(loadedPoints);
    }
    setAreaPointWarnings({});
    setActiveAreaDragWarning(null);
    setIsDraggingAreaPoint(false);
    setActivePointIndex(null);
  }, [
    isEditMode,
    params?.id,
    getAreaById,
    syncMapCenters,
    regions,
    hasInitializedEditData,
  ]);

  // When region changes, update bounds and auto-fill details
  useEffect(() => {
    if (selectedRegionId) {
      const region = regions.find((r) => r.id === selectedRegionId);
      if (region) {
        setFormData((prev) => {
          const isSameRegion = prev.regionId === region.id;
          const shouldUseRegionDefaults =
            !isEditMode || !isSameRegion || !prev.landType || !prev.terrain;
          return {
            ...prev,
            regionId: region.id,
            landType: shouldUseRegionDefaults ? region.landType : prev.landType,
            terrain: shouldUseRegionDefaults ? region.terrain : prev.terrain,
          };
        });

        // If creating new area and region has coords, use region center
        if (
          !isEditMode &&
          region.coordinates &&
          region.coordinates.length > 0
        ) {
          const points = region.coordinates.map((c: any) =>
            L.latLng(c.lat, c.lng),
          );
          const center = L.latLngBounds(points).getCenter();
          const defaultTriangle = [
            L.latLng(center.lat - 0.005, center.lng - 0.005),
            L.latLng(center.lat + 0.005, center.lng),
            L.latLng(center.lat - 0.005, center.lng + 0.005),
          ];
          // Default triangle at center
          setAreaPoints(defaultTriangle);
          syncMapCenters(defaultTriangle);
          setAreaPointWarnings({});
          setActiveAreaDragWarning(null);
          setIsDraggingAreaPoint(false);
          setActivePointIndex(null);
        }
      }
    }
  }, [selectedRegionId, regions, isEditMode, syncMapCenters]);

  useEffect(() => {
    if (!selectedRegionId) {
      setAreaPointWarnings({});
      setActiveAreaDragWarning(null);
      setIsDraggingAreaPoint(false);
      setActivePointIndex(null);
    }
  }, [selectedRegionId]);

  useEffect(() => {
    setPlotPointWarnings({});
    setActivePlotPointIndex(null);
    setActiveDragWarning(null);
    setIsDraggingPlotPoint(false);
  }, [editingPlot]);

  const getNearestValidAreaPosition = (latlng: L.LatLng) => {
    if (!regionPolygonFeature) return null;
    const polygonLine = polygonToLine(regionPolygonFeature);
    const lineFeature = Array.isArray((polygonLine as any).features)
      ? (polygonLine as any).features[0]
      : polygonLine;
    if (!lineFeature) return null;
    const snapped = nearestPointOnLine(
      lineFeature as any,
      point([latlng.lng, latlng.lat]),
    );
    if (!snapped) return null;
    return L.latLng(
      snapped.geometry.coordinates[1],
      snapped.geometry.coordinates[0],
    );
  };

  const updateAreaWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setAreaPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftAreaWarningsAfterRemoval = (removedIndex: number) => {
    setAreaPointWarnings((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const next: Record<number, PointWarning> = {};
      Object.entries(prev).forEach(([idxStr, warning]) => {
        const idx = Number(idxStr);
        if (idx === removedIndex) return;
        const newIndex = idx > removedIndex ? idx - 1 : idx;
        next[newIndex] = { ...warning, index: newIndex };
      });
      return next;
    });
  };

  const setAreaPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setAreaPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const clearPreview = () => {
      if (preview) {
        setActiveAreaDragWarning((prev) =>
          prev?.index === index ? null : prev,
        );
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);

    let violationType: "outsideRegion" | "overlapsArea" | null = null;
    let overlapPolygon: any | null = null;

    if (regionPolygonFeature) {
      const insideRegion = booleanPointInPolygon(
        pointFeature,
        regionPolygonFeature,
      );
      if (!insideRegion) {
        violationType = "outsideRegion";
      }
    }

    if (!violationType && blockingAreaPolygons.length > 0) {
      const overlapping = blockingAreaPolygons.find((areaPoly) =>
        booleanPointInPolygon(pointFeature, areaPoly.polygon),
      );
      if (overlapping) {
        violationType = "overlapsArea";
        overlapPolygon = overlapping.polygon;
      }
    }

    if (!violationType) {
      if (persist) {
        updateAreaWarningForIndex(index, null);
      }
      clearPreview();
      return;
    }

    let nearestValid: L.LatLng | null = null;
    if (violationType === "outsideRegion") {
      nearestValid = getNearestValidAreaPosition(latlng);
    } else if (violationType === "overlapsArea" && overlapPolygon) {
      nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
    }

    if (!nearestValid) {
      clearPreview();
      if (persist) {
        updateAreaWarningForIndex(index, null);
      }
      return;
    }

    const warningData: PointWarning = {
      index,
      invalidLatLng: latlng,
      suggestedLatLng: nearestValid,
    };

    if (preview) {
      setActiveAreaDragWarning(warningData);
    }

    if (persist) {
      updateAreaWarningForIndex(index, warningData);
    }
  };

  const applySuggestedAreaPoint = () => {
    if (!activePersistentAreaWarning) return;
    const { index, suggestedLatLng } = activePersistentAreaWarning;
    setAreaPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(index);
    updateAreaWarningForIndex(index, null);
    setActiveAreaDragWarning(null);
  };

  const handleAreaPointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActivePointIndex(index);
    setAreaPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActiveAreaDragWarning(null);
    }
  };

  const areaWarningForDisplay =
    activeAreaDragWarning ?? activePersistentAreaWarning;

  // --- Handlers ---
  const handlePointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    handleAreaPointDrag(index, latlng, options);
  };

  const removePoint = (index: number) => {
    if (areaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = areaPoints.filter((_, i) => i !== index);
    setActivePointIndex(null);
    setAreaPoints(newPoints);
    shiftAreaWarningsAfterRemoval(index);
    setActiveAreaDragWarning(null);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = areaPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setAreaPointWithValidation(index, updated, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(index);
    setActiveAreaDragWarning(null);
  };

  const handleAddPoint = () => {
    const center = getBoundsFromPoints(areaPoints).getCenter();
    const nextIndex = areaPoints.length;
    const newLatLng = L.latLng(center.lat + 0.002, center.lng + 0.002);
    setAreaPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(nextIndex);
    setActiveAreaDragWarning(null);
  };

  const handleSubmit = () => {
    if (areaPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    if (!selectedRegionId) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn vùng trồng",
        variant: "destructive",
      });
      return;
    }

    const areaData: Omit<Area, "id" | "code"> = {
      name: formData.name || "",
      regionId: selectedRegionId,
      area: formData.area || 0,
      landType: formData.landType || "",
      terrain: formData.terrain || "",
      status: (formData.status as "active" | "inactive") || "active",
      plots: (formData.plots as Plot[]) || [],
      coordinates: areaPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
      createdAt:
        isEditMode && formData.createdAt
          ? formData.createdAt
          : new Date().toISOString(),
    };

    const finalAreaId =
      isEditMode && params?.id
        ? String(params.id)
        : `sub-${selectedRegionId}-${Date.now()}`;

    // Upsert only the current area to the selected region in Region Store
    upsertSubArea(selectedRegionId, {
      ...areaData,
      id: finalAreaId,
    });

    toast({
      title: "Thành công",
      description: isEditMode
        ? "Cập nhật khu vực thành công"
        : "Tạo khu vực mới thành công",
    });
    setLocation("/area-distribution");
  };

  const getNearestValidPlotPosition = (latlng: L.LatLng) => {
    if (!areaPolygonFeature) return null;
    const polygonLine = polygonToLine(areaPolygonFeature);
    const lineFeature = Array.isArray((polygonLine as any).features)
      ? (polygonLine as any).features[0]
      : polygonLine;
    if (!lineFeature) return null;
    const snapped = nearestPointOnLine(
      lineFeature as any,
      point([latlng.lng, latlng.lat]),
    );
    if (!snapped) return null;
    return L.latLng(
      snapped.geometry.coordinates[1],
      snapped.geometry.coordinates[0],
    );
  };

  const updateWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setPlotPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftWarningsAfterRemoval = (removedIndex: number) => {
    setPlotPointWarnings((prev) => {
      if (Object.keys(prev).length === 0) return prev;
      const next: Record<number, PointWarning> = {};
      Object.entries(prev).forEach(([idxStr, warning]) => {
        const idx = Number(idxStr);
        if (idx === removedIndex) return;
        const newIndex = idx > removedIndex ? idx - 1 : idx;
        next[newIndex] = { ...warning, index: newIndex };
      });
      return next;
    });
  };

  const setPlotPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setPlotPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const clearPreview = () => {
      if (preview) {
        setActiveDragWarning((prev) => (prev?.index === index ? null : prev));
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);

    let violationType: "outsideArea" | "overlapsPlot" | null = null;
    let overlapPolygon: any | null = null;

    if (areaPolygonFeature) {
      const insideArea = booleanPointInPolygon(
        pointFeature,
        areaPolygonFeature,
      );
      if (!insideArea) {
        violationType = "outsideArea";
      }
    }

    if (!violationType && blockingPlotPolygons.length > 0) {
      const overlapping = blockingPlotPolygons.find((plotPoly) =>
        booleanPointInPolygon(pointFeature, plotPoly.polygon),
      );
      if (overlapping) {
        violationType = "overlapsPlot";
        overlapPolygon = overlapping.polygon;
      }
    }

    if (!violationType) {
      if (persist) {
        updateWarningForIndex(index, null);
      }
      clearPreview();
      return;
    }

    let nearestValid: L.LatLng | null = null;
    if (violationType === "outsideArea") {
      nearestValid = getNearestValidPlotPosition(latlng);
    } else if (violationType === "overlapsPlot" && overlapPolygon) {
      nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
    }

    if (!nearestValid) {
      clearPreview();
      if (persist) {
        updateWarningForIndex(index, null);
      }
      return;
    }

    const warningData: PointWarning = {
      index,
      invalidLatLng: latlng,
      suggestedLatLng: nearestValid,
    };

    if (preview) {
      setActiveDragWarning(warningData);
    }

    if (persist) {
      updateWarningForIndex(index, warningData);
    }
  };

  const applySuggestedPlotPoint = () => {
    if (activePersistentPlotWarning == null) return;
    const { index, suggestedLatLng } = activePersistentPlotWarning;
    setPlotPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActivePlotPointIndex(index);
    updateWarningForIndex(index, null);
    setActiveDragWarning(null);
  };

  const handlePlotPointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActivePlotPointIndex(index);
    setPlotPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActiveDragWarning(null);
    }
  };

  const plotWarningForDisplay =
    activeDragWarning ?? activePersistentPlotWarning;

  const handleAddPlotPoint = () => {
    const center = getBoundsFromPoints(plotPoints).getCenter();
    const nextIndex = plotPoints.length;
    setPlotPoints((prev) => [
      ...prev,
      L.latLng(center.lat + 0.002, center.lng + 0.002),
    ]);
    setActivePlotPointIndex(nextIndex);
    setActiveDragWarning(null);
  };

  const removePlotPoint = (index: number) => {
    if (plotPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = plotPoints.filter((_, i) => i !== index);
    setPlotPoints(newPoints);
    setActivePlotPointIndex(null);
    setActiveDragWarning(null);
    shiftWarningsAfterRemoval(index);
  };

  const handlePlotPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = plotPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setPlotPointWithValidation(index, updated, {
      persist: true,
      preview: false,
    });
    setActivePlotPointIndex(index);
    setActiveDragWarning(null);
  };

  const addPlot = () => {
    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      name: "Lô mới",
      area: 0,
      coordinates: [],
      contour: "",
      altitude: 0,
    };
    setEditingPlot(newPlot);
    const center = getBoundsFromPoints(areaPoints).getCenter();
    setPlotPoints([
      L.latLng(center.lat - 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng + 0.002),
      L.latLng(center.lat - 0.002, center.lng + 0.002),
    ]);
    setPlotPointWarnings({});
    setActiveDragWarning(null);
    setActivePlotPointIndex(null);
  };

  const savePlot = () => {
    if (!editingPlot) return;

    if (plotPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = plotPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const updatedPlot = { ...editingPlot, coordinates: fullCoords } as Plot;

    const currentPlots = formData.plots || [];
    const index = currentPlots.findIndex((p) => p.id === updatedPlot.id);
    let newPlots;

    if (index >= 0) {
      newPlots = [...currentPlots];
      newPlots[index] = updatedPlot;
    } else {
      newPlots = [...currentPlots, updatedPlot];
    }

    setFormData({ ...formData, plots: newPlots });
    setEditingPlot(null);
  };

  const removePlot = (id: string) => {
    setFormData({
      ...formData,
      plots: (formData.plots || []).filter((p) => p.id !== id),
    });
  };

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Chọn vùng và thông tin cơ bản",
      isValid: !!selectedRegionId && !!formData.id && !!formData.name,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin khu vực</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </Label>
                <EnterpriseSelector
                  selectedId={selectEnterpriseId?.toString() ?? ""}
                  onSelect={(val) => {
                    setSelectEnterpriseId(val ? Number(val) : null);
                    setSelectedRegionId(null);
                    setFormData((prev) => ({
                      ...prev,
                      landType: "",
                      terrain: "",
                    }));
                  }}
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold text-slate-700">
                  Vùng trồng <span className="text-red-500">*</span>
                </Label>

                <RegionSelector
                  regions={regions}
                  enterpriseId={selectEnterpriseId}
                  selectedId={selectedRegionId?.toString()}
                  onSelect={(id) => {
                    const region = regions.find((r) => r.id === Number(id));
                    setSelectedRegionId(Number(id));
                    if (region) {
                      setFormData((prev) => ({
                        ...prev,
                        landType: region.landType || "",
                        terrain: region.terrain || "",
                      }));
                    }
                  }}
                />

                <div className="mt-1">
                  {selectedRegionId ? (
                    <SelectionCard
                      regionId={selectedRegionId.toString()}
                      regions={regions}
                      onRemove={() => {
                        setSelectedRegionId(null);
                        setFormData((prev) => ({
                          ...prev,
                          landType: "",
                          terrain: "",
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-[11px] font-bold text-slate-500">
                        Chưa chọn vùng trồng
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã khu vực <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.id || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, id: e.target.value })
                  }
                  placeholder="VD: KHU-A"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên khu vực <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tên khu vực"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Diện tích (ha)</Label>
                <Input
                  type="number"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Loại đất</Label>
                <Select
                  value={formData.landType || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, landType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((l) => (
                      <SelectItem key={l.code} value={l.code}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select
                  value={formData.terrain || ""}
                  onValueChange={(v) =>
                    setFormData({ ...formData, terrain: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrains.map((t) => (
                      <SelectItem key={t.code} value={t.code}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "map",
      title: "Bản đồ khu vực",
      description: "Xác định vị trí khu vực",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Định vị khu vực trên bản đồ</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative">
              <MapContainer
                center={areaMapCenter}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Region Boundary */}
                {selectedRegionId && (
                  <Polygon
                    positions={
                      regions
                        .find((r) => r.id === selectedRegionId)
                        ?.coordinates.map((c: any) => [c.lat, c.lng]) || []
                    }
                    pathOptions={{
                      color: "green",
                      fill: false,
                      dashArray: "5, 5",
                      weight: 2,
                    }}
                  />
                )}

                {/* Existing Areas from Region Store (Read-only) */}
                {currentRegion?.subAreas
                  .filter((a) => !isEditMode || a.id !== String(params?.id))
                  .map((area) => (
                    <Polygon
                      key={`existing-${area.id}`}
                      positions={area.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "gray",
                        fillColor: "gray",
                        fillOpacity: 0.1,
                        weight: 1,
                      }}
                    >
                      <Tooltip sticky direction="top">
                        {area.name} (Sẵn có)
                      </Tooltip>
                    </Polygon>
                  ))}

                <Polygon
                  positions={areaPoints}
                  pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                />

                {areaPoints.map((point, idx) => {
                  const isActive = activePointIndex === idx;
                  const isInvalid = !!areaPointWarnings[idx];
                  const markerIcon = isInvalid
                    ? invalidIcon
                    : isActive
                      ? activeIcon
                      : customIcon;
                  return (
                    <Marker
                      key={`pt-${idx}`}
                      position={point}
                      draggable={true}
                      icon={markerIcon}
                      eventHandlers={{
                        click: () => {
                          setActivePointIndex(idx);
                          setAreaPointWithValidation(idx, point, {
                            persist: true,
                            preview: false,
                          });
                        },
                        dragstart: (e) => {
                          setActivePointIndex(idx);
                          setIsDraggingAreaPoint(true);
                          handlePointDrag(idx, e.target.getLatLng(), {
                            finalize: false,
                          });
                        },
                        drag: (e) =>
                          handlePointDrag(idx, e.target.getLatLng(), {
                            finalize: false,
                          }),
                        dragend: (e) => {
                          setIsDraggingAreaPoint(false);
                          handlePointDrag(idx, e.target.getLatLng(), {
                            finalize: true,
                          });
                        },
                      }}
                    >
                      <Tooltip sticky direction="top" className="z-1000">
                        Điểm {idx + 1}
                      </Tooltip>
                    </Marker>
                  );
                })}

                {areaWarningForDisplay && (
                  <Polyline
                    positions={[
                      areaWarningForDisplay.invalidLatLng,
                      areaWarningForDisplay.suggestedLatLng,
                    ]}
                    pathOptions={{
                      color: "red",
                      weight: 2,
                      dashArray: "6, 6",
                    }}
                  />
                )}
                <MapController center={areaMapCenter} />
              </MapContainer>

              {activePersistentAreaWarning &&
                !isDraggingAreaPoint &&
                selectedRegionId && (
                  <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                    <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                      <p className="text-sm font-semibold text-red-600">
                        Vị trí{" "}
                        <span className="font-bold border rounded-md border-red-200 p-0.5">
                          điểm {activePersistentAreaWarning.index + 1}
                        </span>{" "}
                        không hợp lệ
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Toạ độ hiện tại:{" "}
                        <span className="font-medium text-gray-900">
                          {formatLatLng(
                            activePersistentAreaWarning.invalidLatLng,
                          )}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gợi ý hợp lệ:{" "}
                        <span className="font-medium text-gray-900">
                          {formatLatLng(
                            activePersistentAreaWarning.suggestedLatLng,
                          )}
                        </span>
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={applySuggestedAreaPoint}
                      >
                        Áp dụng toạ độ hợp lệ
                      </Button>
                    </div>
                  </div>
                )}
            </div>

            <div className="w-[300px] flex flex-col h-full bg-slate-50 border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-white">
                <h4 className="font-semibold text-sm">Danh sách toạ độ</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Chọn marker để đổi màu xanh rồi kéo thả hoặc dùng nút Thêm
                  điểm. Nếu ra khỏi vùng hoặc đè lên khu vực cũ, điểm sẽ đổi đỏ
                  và hiển thị gợi ý hợp lệ khi bấm vào.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {areaPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {areaPoints.length > 3 && (
                        <button
                          onClick={() => removePoint(i)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <span className="font-semibold">Điểm {i + 1}</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-gray-500">Lat</label>
                        <input
                          className="w-full border rounded px-1 py-0.5"
                          type="number"
                          value={p.lat}
                          onChange={(e) =>
                            handlePointInputChange(i, "lat", e.target.value)
                          }
                          step="0.0001"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500">Lng</label>
                        <input
                          className="w-full border rounded px-1 py-0.5"
                          type="number"
                          value={p.lng}
                          onChange={(e) =>
                            handlePointInputChange(i, "lng", e.target.value)
                          }
                          step="0.0001"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={handleAddPoint}
                >
                  <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "plots",
      title: "Phân chia lô",
      description: "Tạo các lô trong khu vực",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Danh sách lô ({formData.plots?.length || 0})</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              <div className="lg:col-span-3 h-full rounded-lg border overflow-hidden relative">
                <MapContainer
                  center={plotMapCenter}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Area Boundary */}
                  <Polygon
                    positions={areaPoints}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />

                  {/* Existing Plots */}
                  {formData.plots?.map((plot) => {
                    // Hide if currently editing
                    if (editingPlot && plot.id === editingPlot.id) return null;
                    if (!plot.coordinates || plot.coordinates.length < 3)
                      return null;

                    const positions = plot.coordinates.map((c) => [
                      c.lat,
                      c.lng,
                    ]);

                    return (
                      <Polygon
                        key={plot.id}
                        positions={positions as any}
                        pathOptions={{ color: "orange", weight: 2 }}
                        eventHandlers={{
                          click: () => {
                            setEditingPlot(plot);
                            if (
                              plot.coordinates &&
                              plot.coordinates.length >= 3
                            ) {
                              setPlotPoints(
                                plot.coordinates.map((c) =>
                                  L.latLng(c.lat, c.lng),
                                ),
                              );
                            }
                          },
                        }}
                      />
                    );
                  })}

                  {/* Editing Plot */}
                  {editingPlot && (
                    <>
                      <Polygon
                        positions={plotPoints}
                        pathOptions={{
                          color: "orange",
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                      {plotPoints.map((point, idx) => {
                        const isActive = activePlotPointIndex === idx;
                        const isInvalid = !!plotPointWarnings[idx];
                        const markerIcon = isInvalid
                          ? invalidIcon
                          : isActive
                            ? activeIcon
                            : customIcon;
                        return (
                          <Marker
                            key={`plot-point-${idx}`}
                            position={point}
                            draggable={true}
                            icon={markerIcon}
                            eventHandlers={{
                              click: () => {
                                setActivePlotPointIndex(idx);
                                setPlotPointWithValidation(idx, point, {
                                  persist: true,
                                  preview: false,
                                });
                              },
                              dragstart: (e) => {
                                setActivePlotPointIndex(idx);
                                setIsDraggingPlotPoint(true);
                                handlePlotPointDrag(idx, e.target.getLatLng(), {
                                  finalize: false,
                                });
                              },
                              drag: (e) =>
                                handlePlotPointDrag(idx, e.target.getLatLng(), {
                                  finalize: false,
                                }),
                              dragend: (e) => {
                                setIsDraggingPlotPoint(false);
                                handlePlotPointDrag(idx, e.target.getLatLng(), {
                                  finalize: true,
                                });
                              },
                            }}
                          >
                            <Tooltip>Điểm {idx + 1}</Tooltip>
                          </Marker>
                        );
                      })}
                      {plotWarningForDisplay && (
                        <Polyline
                          positions={[
                            plotWarningForDisplay.invalidLatLng,
                            plotWarningForDisplay.suggestedLatLng,
                          ]}
                          pathOptions={{
                            color: "red",
                            weight: 2,
                            dashArray: "6, 6",
                          }}
                        />
                      )}
                    </>
                  )}
                  <MapController center={plotMapCenter} />
                </MapContainer>
                {activePersistentPlotWarning &&
                  editingPlot &&
                  !isDraggingPlotPoint && (
                    <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                      <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                        <p className="text-sm font-semibold text-red-600">
                          Vị trí{" "}
                          <span className="font-bold border rounded-md border-red-200 p-0.5">
                            điểm {activePersistentPlotWarning.index + 1}
                          </span>{" "}
                          không hợp lệ
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Toạ độ hiện tại:{" "}
                          <span className="font-medium text-gray-900">
                            {formatLatLng(
                              activePersistentPlotWarning.invalidLatLng,
                            )}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Gợi ý hợp lệ:{" "}
                          <span className="font-medium text-gray-900">
                            {formatLatLng(
                              activePersistentPlotWarning.suggestedLatLng,
                            )}
                          </span>
                        </p>
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          onClick={applySuggestedPlotPoint}
                        >
                          Áp dụng toạ độ hợp lệ
                        </Button>
                      </div>
                    </div>
                  )}
              </div>

              <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                {editingPlot ? (
                  // EDIT MODE
                  <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold">
                        {editingPlot.id?.startsWith("plot-")
                          ? "Thêm lô mới"
                          : "Chỉnh sửa lô"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingPlot(null)}
                      >
                        Hủy
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <Label>Tên lô</Label>
                        <Input
                          value={editingPlot.name || ""}
                          onChange={(e) =>
                            setEditingPlot({
                              ...editingPlot,
                              name: e.target.value,
                            })
                          }
                          placeholder="Nhập tên lô..."
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label>Diện tích (ha)</Label>
                          <Input
                            type="number"
                            value={editingPlot.area || ""}
                            onChange={(e) =>
                              setEditingPlot({
                                ...editingPlot,
                                area: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                        <div className="space-y-1">
                          <Label>Độ cao (m)</Label>
                          <Input
                            type="number"
                            value={editingPlot.altitude || ""}
                            onChange={(e) =>
                              setEditingPlot({
                                ...editingPlot,
                                altitude: parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Label>Đường đồng mức</Label>
                        <Input
                          value={editingPlot.contour || ""}
                          onChange={(e) =>
                            setEditingPlot({
                              ...editingPlot,
                              contour: e.target.value,
                            })
                          }
                          placeholder="VD: 100m"
                        />
                      </div>

                      <div className="w-full flex flex-col bg-slate-50 border rounded-lg overflow-hidden mt-2">
                        <div className="p-3 border-b bg-white">
                          <h4 className="font-semibold text-sm">
                            Danh sách toạ độ
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Chọn marker (đổi màu xanh) rồi kéo thả để điều
                            chỉnh. Nếu ra khỏi khu vực hoặc chồng lên lô đã tồn
                            tại hệ thống sẽ gợi ý toạ độ hợp lệ.
                          </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
                          {plotPoints.map((p, i) => (
                            <div
                              key={i}
                              className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                            >
                              <div className="absolute top-2 right-2 flex gap-1">
                                {plotPoints.length > 3 && (
                                  <button
                                    onClick={() => removePlotPoint(i)}
                                    className="text-red-500 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                )}
                              </div>
                              <span className="font-semibold">
                                Điểm {i + 1}
                              </span>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] text-gray-500">
                                    Lat
                                  </label>
                                  <input
                                    className="w-full border rounded px-1 py-0.5"
                                    type="number"
                                    value={p.lat}
                                    onChange={(e) =>
                                      handlePlotPointInputChange(
                                        i,
                                        "lat",
                                        e.target.value,
                                      )
                                    }
                                    step="0.0001"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] text-gray-500">
                                    Lng
                                  </label>
                                  <input
                                    className="w-full border rounded px-1 py-0.5"
                                    type="number"
                                    value={p.lng}
                                    onChange={(e) =>
                                      handlePlotPointInputChange(
                                        i,
                                        "lng",
                                        e.target.value,
                                      )
                                    }
                                    step="0.0001"
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-dashed"
                            onClick={handleAddPlotPoint}
                          >
                            <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 border-t flex gap-3">
                      <Button className="flex-1" onClick={savePlot}>
                        Lưu lô
                      </Button>
                    </div>
                  </div>
                ) : (
                  // LIST MODE
                  <div className="flex flex-col h-full bg-slate-50 border rounded-lg">
                    <div className="flex items-center justify-between p-3 border-b bg-white">
                      <h4 className="font-semibold text-sm">Danh sách lô</h4>
                      <Button size="sm" onClick={addPlot}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm lô mới
                      </Button>
                    </div>

                    {!formData.plots || formData.plots.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-4 text-center">
                        <p>Danh sách trống.</p>
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-auto space-y-3 p-3">
                        {formData.plots.map((plot) => (
                          <div
                            key={plot.id}
                            className="bg-white p-3 border rounded-lg hover:border-orange-300 transition-colors shadow-sm group"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                                <span className="font-medium">{plot.name}</span>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingPlot(plot);
                                    if (
                                      plot.coordinates &&
                                      plot.coordinates.length >= 3
                                    ) {
                                      setPlotPoints(
                                        plot.coordinates.map((c) =>
                                          L.latLng(c.lat, c.lng),
                                        ),
                                      );
                                    }
                                  }}
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removePlot(plot.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                              <span>DT: {plot.area} ha</span>
                              <span>Độ cao: {plot.altitude}m</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <div className="space-y-5">
          {/* Bước 1: Thông tin chung */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-blue-50/70 border-b border-blue-100 py-3 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-600">
                  <Info className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Thông tin chung
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                {/* Đơn vị sở hữu */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Dơn vị sở hữu
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {enterprises.find((e) => e.id === selectEnterpriseId)
                      ?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                {/* Vùng trồng */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Vùng trồng
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {regions.find((r) => r.id === selectedRegionId)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                {/* Địa chỉ vùng trồng */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Địa chỉ vùng trồng
                  </p>
                  <p className="text-sm text-slate-600">
                    {(() => {
                      const r = regions.find((r) => r.id === selectedRegionId);
                      if (!r)
                        return (
                          <span className="text-slate-300 italic">N/A</span>
                        );
                      const prov =
                        PROVINCES.find((p) => p.id === r.provinceId)?.name ||
                        r.provinceId;
                      const dist =
                        DISTRICTS.find((d) => d.id === r.districtId)?.name ||
                        r.districtId;
                      return `${r.address ? r.address + ", " : ""}${dist}, ${prov}`;
                    })()}
                  </p>
                </div>

                {/* Mã khu vực */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Mã khu vực
                  </p>
                  <p className="text-sm font-semibold text-slate-700 font-mono">
                    {formData.id || (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>

                {/* Tên khu vực */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Tên khu vực
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formData.name || (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>

                {/* Diện tích */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Diện tích
                  </p>
                  <p className="text-sm font-bold text-blue-600">
                    {formData.area ? (
                      `${formData.area} ha`
                    ) : (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>

                {/* Loại đất */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Loại đất
                  </p>
                  <p className="text-sm text-slate-700">
                    {lands.find((l) => l.code === formData.landType)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                {/* Địa hình */}
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Địa hình
                  </p>
                  <p className="text-sm text-slate-700">
                    {terrains.find((t) => t.code === formData.terrain)
                      ?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bước 2: Bản đồ */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-emerald-50/70 border-b border-emerald-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                    <MapIcon className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Bản đồ khu vực
                  </CardTitle>
                </div>
                {areaPoints.length >= 3 && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    {areaPoints.length} điểm ranh giới
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {areaPoints.length >= 3 ? (
                <div className="h-[300px] w-full relative overflow-hidden">
                  <MapContainer
                    bounds={getBoundsFromPoints(areaPoints).pad(0.15)}
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                    dragging={false}
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    touchZoom={false}
                    keyboard={false}
                    attributionControl={false}
                  >
                    <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
                    <Polygon
                      positions={areaPoints.map((p) => [p.lat, p.lng] as [number, number])}
                      pathOptions={{
                        color: "#10b981",
                        fillColor: "#10b981",
                        fillOpacity: 0.15,
                        weight: 2.5,
                        dashArray: "6 4",
                      }}
                    />
                    {formData.plots
                      ?.filter((pl) => pl.coordinates && pl.coordinates.length >= 3)
                      .map((pl, idx) => (
                        <Polygon
                          key={pl.id || idx}
                          positions={pl.coordinates!.map(
                            (c) => [c.lat, c.lng] as [number, number],
                          )}
                          pathOptions={{
                            color: "#f59e0b",
                            fillColor: "#f59e0b",
                            fillOpacity: 0.25,
                            weight: 2,
                          }}
                        >
                          <Tooltip permanent direction="center" className="text-[10px] font-bold">
                            {pl.name || `Lô ${idx + 1}`}
                          </Tooltip>
                        </Polygon>
                      ))}
                  </MapContainer>
                  <div className="absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-100 text-[11px] font-semibold pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <svg width="16" height="8">
                        <line x1="0" y1="4" x2="16" y2="4" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
                      </svg>
                      <span className="text-slate-600">Ranh giới khu vực</span>
                    </div>
                    {(formData.plots?.filter(
                      (pl) => pl.coordinates && pl.coordinates.length >= 3,
                    ).length ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-3 bg-amber-400/30 border border-amber-400 rounded-sm inline-block" />
                        <span className="text-slate-600">Ranh giới lô</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50">
                  <MapIcon className="w-10 h-10 mb-2 text-slate-200" />
                  <p className="text-sm font-semibold text-amber-600">
                    Chưa xác định ranh giới
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quay lại bước 2 để vẽ khu vực trên bản đồ
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bước 3: Cấu hình lô */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-amber-50/70 border-b border-amber-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                    <Layers className="w-4 h-4" />
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Cấu hình lô
                  </CardTitle>
                </div>
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-700 border-none font-bold"
                >
                  {formData.plots?.length || 0} lô
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              {formData.plots && formData.plots.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.plots.map((plot, idx) => (
                    <div
                      key={plot.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-[11px] font-extrabold w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm font-semibold text-slate-700">
                          {plot.name || `Lô ${idx + 1}`}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                        {plot.area ?? 0} ha
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                  <Layers className="w-8 h-8 mb-2 text-slate-200" />
                  <p className="text-sm italic">Chưa có lô nào được cấu hình</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={isEditMode ? "Cập nhật khu vực" : "Thêm mới khu vực"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin khu vực"
          : "Tạo khu vực mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/area-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto pb-10">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => setLocation("/area-distribution")}
          completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo khu vực"}
        />
      </div>
    </AdminLayout>
  );
};

export default AreaCreatePage;
