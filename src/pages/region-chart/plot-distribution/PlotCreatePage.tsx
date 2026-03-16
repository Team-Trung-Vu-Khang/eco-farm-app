import { useState, useEffect, useMemo, useCallback } from "react";
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
  Combobox,
  type ComboboxOption,
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Polyline,
  useMapEvents,
  Tooltip,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";
import {
  ChevronLeft,
  Plus,
  X,
  MapPin,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Layers,
  Search,
  Trash2,
  Target,
} from "lucide-react";

import { type Plot } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";

/* -----------------------------------------------------------------------
 * _LocationSelector — single-select dialog, tree: Region → Area
 * ----------------------------------------------------------------------- */
const _LocationSelector = ({
  regions,
  enterpriseId,
  selectedRegionId,
  selectedAreaId,
  onSelect,
}: {
  regions: any[];
  enterpriseId: number | null;
  selectedRegionId: number | null;
  selectedAreaId: string | null;
  onSelect: (regionId: number, areaId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);
  const [expandedAreas, setExpandedAreas] = useState<string[]>([]);

  const filteredRegions = useMemo(() => {
    const base = enterpriseId
      ? regions.filter((r) => String(r.enterpriseId) === String(enterpriseId))
      : regions;
    if (!searchTerm) return base;
    const q = searchTerm.toLowerCase();
    return base.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.subAreas?.some((a: any) => a.name.toLowerCase().includes(q)),
    );
  }, [regions, enterpriseId, searchTerm]);

  const toggleRegion = (id: string) =>
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  const toggleArea = (id: string) =>
    setExpandedAreas((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  const selectedRegion = regions.find((r) => r.id === selectedRegionId);
  const selectedArea = selectedRegion?.subAreas?.find(
    (a: any) => String(a.id) === String(selectedAreaId),
  );

  const handlePick = (regionId: number, areaId: string) => {
    onSelect(regionId, areaId);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <>
      {/* Trigger */}
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full h-12 cursor-pointer border-2 border-dashed border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 text-primary font-bold gap-2 transition-all rounded-lg shadow-sm hover:shadow-md"
        variant="outline"
      >
        <Plus className="w-5 h-5" />
        {selectedAreaId ? "Thay đổi vị trí" : "Chọn vùng trồng & khu vực"}
      </Button>

      {/* Dialog */}
      <Dialog
        open={isOpen}
        onOpenChange={(o) => {
          setIsOpen(o);
          if (!o) setSearchTerm("");
        }}
      >
        <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Chọn vùng trồng & khu vực
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Mở rộng vùng trồng để chọn khu vực, sau đó chọn lô đất cụ thể
            </p>
          </DialogHeader>

          <div className="px-6 pb-5 border-b shrink-0 bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm kiếm vùng, khu vực, lô..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-4">
              {filteredRegions.map((r) => (
                <div key={r.id} className="space-y-2">
                  {/* Region row */}
                  <div className="flex items-center gap-2 group">
                    <button
                      onClick={() => toggleRegion(r.id.toString())}
                      className="p-1 hover:bg-slate-100 rounded transition-colors"
                    >
                      {expandedRegions.includes(r.id.toString()) ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() => toggleRegion(r.id.toString())}
                      className="flex-1 flex items-center justify-between p-3 rounded-xl border-2 border-slate-100 bg-white hover:border-primary/20 hover:bg-slate-50 cursor-pointer transition-all"
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
                    </div>
                  </div>

                  {/* Areas */}
                  {expandedRegions.includes(r.id.toString()) && (
                    <div className="ml-6 pl-4 border-l-2 border-slate-100 space-y-2 py-1">
                      {(r.subAreas || []).map((area: any) => {
                        const areaSelected =
                          r.id === selectedRegionId &&
                          String(area.id) === String(selectedAreaId);
                        return (
                          <div key={area.id} className="space-y-2">
                            <div className="flex items-center gap-2 group">
                              <button
                                onClick={() => toggleArea(area.id.toString())}
                                className="p-1 hover:bg-slate-100 rounded transition-colors"
                              >
                                {expandedAreas.includes(area.id.toString()) ? (
                                  <ChevronDown className="w-4 h-4 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                )}
                              </button>
                              <div
                                onClick={() =>
                                  handlePick(r.id, String(area.id))
                                }
                                className={cn(
                                  "flex-1 flex items-center justify-between p-2.5 rounded-xl border-2 transition-all cursor-pointer",
                                  areaSelected
                                    ? "bg-primary/10 border-primary/40 opacity-60 cursor-not-allowed"
                                    : "bg-white border-slate-100 hover:border-primary/20 hover:bg-slate-50",
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                                    <Layers className="w-4 h-4" />
                                  </div>
                                  <span className="font-bold text-slate-700 text-xs">
                                    {area.name}
                                  </span>
                                </div>
                                {areaSelected ? (
                                  <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                    <Badge
                                      variant="secondary"
                                      className="text-[9px] bg-primary/10 text-primary border-none h-4 py-0"
                                    >
                                      Đã chọn
                                    </Badge>
                                  </div>
                                ) : (
                                  <div className="w-4 h-4 rounded border border-slate-200 group-hover:border-primary transition-colors flex items-center justify-center">
                                    <Plus className="w-3 h-3 text-slate-300 group-hover:text-primary" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Plots level (read-only preview) */}
                            {expandedAreas.includes(area.id.toString()) && (
                              <div className="ml-5 pl-4 border-l-2 border-slate-50 space-y-1 py-1">
                                {(area.plots || []).map((plot: any) => (
                                  <div
                                    key={plot.id}
                                    className="flex items-center justify-between p-2 rounded-lg border border-slate-100 bg-white"
                                  >
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                                      <span className="font-medium text-slate-600 text-xs">
                                        {plot.name}
                                      </span>
                                    </div>
                                    <span className="text-[10px] text-slate-400">
                                      {plot.area} ha
                                    </span>
                                  </div>
                                ))}
                                {(!area.plots || area.plots.length === 0) && (
                                  <p className="text-xs text-slate-400 italic py-1 pl-2">
                                    Chưa có lô
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {(!r.subAreas || r.subAreas.length === 0) && (
                        <p className="text-xs text-slate-400 italic py-2 pl-2">
                          Chưa có khu vực
                        </p>
                      )}
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
                    Không tìm thấy dữ liệu phù hợp
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const formatLatLng = (latlng: L.LatLng) =>
  `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

type PointWarning = {
  index: number;
  invalidLatLng: L.LatLng;
  suggestedLatLng: L.LatLng;
};

const toTurfPolygonFromCoords = (coords?: { lat: number; lng: number }[]) => {
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

const MapClickHandler = ({
  onClick,
}: {
  onClick: (latlng: L.LatLng) => void;
}) => {
  useMapEvents({
    click(e) {
      onClick(e.latlng);
    },
  });
  return null;
};

const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};

const PlotCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/plot-distribution/edit/:id");
  const isEditMode = match && !!params?.id;

  // Form State
  const { enterprises } = useEnterpriseStore();
  const { regions, getAreaById, upsertPlot } = useRegionStore();
  const [selectEnterpriseId, setSelectEnterpriseId] = useState<number | null>(
    null,
  );
  const [selectedRegionId, setSelectedRegionId] = useState<number | null>(null);
  const [selectedAreaId, setSelectedAreaId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Plot>>({
    code: "",
    name: "",
    area: 0,
    contour: "",
    altitude: 0,
    coordinates: [],
  });

  const [currentPoints, setCurrentPoints] = useState<L.LatLng[]>([]);
  const [areaPolygon, setAreaPolygon] = useState<L.LatLng[]>([]);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [pointWarnings, setPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activeDragWarning, setActiveDragWarning] =
    useState<PointWarning | null>(null);
  const [isDraggingPoint, setIsDraggingPoint] = useState(false);

  const currentRegion = useMemo(() => {
    return regions.find((r) => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  const selectedArea = useMemo(() => {
    if (!selectedAreaId) return null;
    return getAreaById(selectedAreaId)?.area ?? {};
  }, [selectedAreaId, getAreaById]);

  console.log({ areaPolygon, selectedArea });

  const areaPolygonFeature = useMemo(() => {
    if (areaPolygon.length < 3) return null;
    const coordinates = areaPolygon.map((p) => [p.lng, p.lat]);
    const first = coordinates[0];
    const closed = [...coordinates, first];
    return polygon([closed]);
  }, [areaPolygon]);

  const blockingPlotPolygons = useMemo<
    {
      id: string;
      polygon: NonNullable<ReturnType<typeof toTurfPolygonFromCoords>>;
    }[]
  >(() => {
    if (!selectedArea?.plots || selectedArea.plots.length === 0) return [];
    return selectedArea.plots
      .filter((plot: any) => {
        if (!plot.coordinates || plot.coordinates.length < 3) return false;
        if (isEditMode && params?.id && String(plot.id) === String(params.id))
          return false;
        return true;
      })
      .map((plot: any) => {
        const poly = toTurfPolygonFromCoords(plot.coordinates);
        if (!poly) return null;
        return { id: plot.id as string, polygon: poly };
      })
      .filter(
        (
          item: {
            id: string;
            polygon: NonNullable<ReturnType<typeof toTurfPolygonFromCoords>>;
          } | null,
        ): item is {
          id: string;
          polygon: NonNullable<ReturnType<typeof toTurfPolygonFromCoords>>;
        } => item !== null,
      );
  }, [selectedArea?.plots, isEditMode, params?.id]);

  const activePersistentWarning = useMemo(() => {
    if (activePointIndex === null) return null;
    return pointWarnings[activePointIndex] ?? null;
  }, [activePointIndex, pointWarnings]);

  const plotWarningForDisplay = activeDragWarning ?? activePersistentWarning;

  // Handle Edit Mode Data Loading
  useEffect(() => {
    if (isEditMode && params?.id) {
      const plot = regions
        .flatMap((r) => r.subAreas || [])
        .flatMap((a) => a.plots || [])
        .find((p) => String(p.id) === String(params.id));

      if (plot) {
        // Find parent area and region
        const parentArea = regions
          .flatMap((r) => r.subAreas || [])
          .find((a) => a.plots?.some((p) => String(p.id) === String(plot.id)));

        if (parentArea) {
          setSelectedRegionId(parentArea.regionId);
          setSelectedAreaId(String(parentArea.id));
        }

        setFormData({
          code: plot.code,
          name: plot.name,
          area: plot.area,
          contour: plot.contour,
          altitude: plot.altitude,
          coordinates: plot.coordinates,
        });

        if (plot.coordinates && plot.coordinates.length >= 3) {
          setCurrentPoints(
            plot.coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
          );
          setPointWarnings({});
          setActivePointIndex(null);
          setActiveDragWarning(null);
          setIsDraggingPoint(false);
        }
      }
    }
  }, [isEditMode, params?.id, regions]);

  // Handle Region/Area Selection to set bounds (Only if NOT in edit mode initial load, or if user changes area)
  // We need to be careful not to overwrite bounds when loading edit data.
  // But the dependency on `selectedAreaId` will trigger.
  // Creating a flag or checking if bounds are already set might be needed,
  // but for simplicity, let's just let user re-center if they change area.
  // However, we must ensure the `useEffect` above runs AFTER or we handle the conflict.
  // Actually, setting `selectedAreaId` triggers the below effect.
  // We can add a check: if formData has coordinates and we represent the SAME area, maybe don't reset?
  // Or better, just let the below effect run but we guard it.

  useEffect(() => {
    if (!selectedArea || !selectedArea.coordinates) {
      setAreaPolygon([]);
      return;
    }

    console.log("enter");

    if (selectedArea.coordinates.length >= 2) {
      console.log("enter");

      const points = selectedArea.coordinates.map((c: any) =>
        L.latLng(c.lat, c.lng),
      );
      setAreaPolygon(points);
      const bounds = L.latLngBounds(points);

      const shouldInitDefaultPolygon =
        (!formData.coordinates || formData.coordinates.length === 0) &&
        currentPoints.length === 0;

      if (shouldInitDefaultPolygon) {
        const center = bounds.getCenter();
        setCurrentPoints([
          L.latLng(center.lat - 0.001, center.lng - 0.001),
          L.latLng(center.lat + 0.001, center.lng),
          L.latLng(center.lat - 0.001, center.lng + 0.001),
        ]);
      }
    }
  }, [
    selectedArea,
    formData.coordinates,
    currentPoints.length,
    isEditMode,
    params?.id,
  ]);

  const getNearestValidPlotPosition = useCallback(
    (latlng: L.LatLng) => {
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
    },
    [areaPolygonFeature],
  );

  const updateWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftWarningsAfterRemoval = (removedIndex: number) => {
    setPointWarnings((prev) => {
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

  const setPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setCurrentPoints((prev) => {
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

  const applySuggestedPoint = () => {
    if (!activePersistentWarning) return;
    const { index, suggestedLatLng } = activePersistentWarning;
    setPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(index);
    updateWarningForIndex(index, null);
    setActiveDragWarning(null);
  };

  // --- Map Handlers ---
  const handlePointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActivePointIndex(index);
    setPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActiveDragWarning(null);
    }
  };

  const handleMapClick = (latlng: L.LatLng) => {
    if (!selectedAreaId) return;
    const nextIndex = currentPoints.length;
    setActivePointIndex(nextIndex);
    setPointWithValidation(nextIndex, latlng, {
      persist: true,
      preview: false,
    });
    setActiveDragWarning(null);
  };

  const removePoint = (index: number) => {
    if (currentPoints.length <= 3) {
      toast({
        title: "Lỗi",
        description: "Cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    setCurrentPoints(currentPoints.filter((_, i) => i !== index));
    setActivePointIndex(null);
    setActiveDragWarning(null);
    shiftWarningsAfterRemoval(index);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = currentPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setPointWithValidation(index, updated, { persist: true, preview: false });
    setActivePointIndex(index);
    setActiveDragWarning(null);
  };

  const handleAddPoint = () => {
    const basePoints =
      currentPoints.length > 0
        ? currentPoints
        : areaPolygon.length > 0
          ? areaPolygon
          : [L.latLng(0, 0)];
    const center = getBoundsFromPoints(basePoints).getCenter();
    const nextIndex = currentPoints.length;
    const newLatLng = L.latLng(center.lat + 0.001, center.lng + 0.001);
    setPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActivePointIndex(nextIndex);
    setActiveDragWarning(null);
  };

  const handleSubmit = () => {
    // Process coordinates
    if (currentPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }

    const coords = currentPoints.map((p) => ({ lat: p.lat, lng: p.lng }));
    const finalPlotId =
      isEditMode && params?.id
        ? String(params.id)
        : `plot-${selectedAreaId}-${Date.now()}`;

    if (selectedRegionId && selectedAreaId) {
      upsertPlot(selectedRegionId, selectedAreaId, {
        ...formData,
        id: finalPlotId,
        code: formData.code || "",
        coordinates: coords,
      });
    }

    toast({
      title: "Thành công",
      description: isEditMode ? "Đã cập nhật lô" : "Đã tạo lô mới",
    });

    // Short delay to ensure state persists before navigation
    setTimeout(() => {
      setLocation("/plot-distribution");
    }, 150);
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn khu vực",
      description: "Chọn vùng trồng và khu vực",
      isValid:
        !!selectedRegionId &&
        !!selectedAreaId &&
        !!formData.code &&
        !!formData.name &&
        !!formData.area,
      content: (
        <Card className="overflow-hidden shadow-md bg-white">
          <CardHeader>
            <CardTitle>Thông tin lô</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              {/* EnterpriseSelector */}
              <div className="space-y-2 flex-1">
                <Label className="text-sm font-bold text-slate-700">
                  Đơn vị sở hữu <span className="text-red-500">*</span>
                </Label>
                <EnterpriseSelector
                  selectedId={selectEnterpriseId?.toString() ?? ""}
                  onSelect={(val) => {
                    setSelectEnterpriseId(val ? Number(val) : null);
                    setSelectedRegionId(null);
                    setSelectedAreaId(null);
                  }}
                />
              </div>

              <div className="space-y-3 flex-1">
                {/* Location tree dialog */}
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-slate-700">
                    Vùng trồng &amp; Khu vực{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <_LocationSelector
                    regions={regions}
                    enterpriseId={selectEnterpriseId}
                    selectedRegionId={selectedRegionId}
                    selectedAreaId={selectedAreaId}
                    onSelect={(regionId, areaId) => {
                      if (!regionId) {
                        setSelectedRegionId(null);
                        setSelectedAreaId(null);
                      } else {
                        setSelectedRegionId(regionId);
                        setSelectedAreaId(areaId);
                      }
                    }}
                  />
                </div>

                {/* Selection card + map preview */}
                {selectedRegionId &&
                  selectedAreaId &&
                  (() => {
                    const region = regions.find(
                      (r) => r.id === selectedRegionId,
                    );
                    const area = region?.subAreas?.find(
                      (a: any) => String(a.id) === String(selectedAreaId),
                    );
                    return (
                      <div className="space-y-3">
                        {/* SelectionCard */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                          <div className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                                <Layers className="w-5 h-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
                                  >
                                    Khu vực
                                  </Badge>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                                    onClick={() => {
                                      setSelectedRegionId(null);
                                      setSelectedAreaId(null);
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </Button>
                                </div>
                                <div className="font-bold text-slate-900 text-sm mb-1">
                                  {area?.name || "—"}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
                                  ID: {selectedAreaId}
                                </div>
                              </div>
                            </div>

                            {/* Hierarchy tree */}
                            <div className="mt-4 pt-3 border-t border-slate-100">
                              <div className="mt-2 ml-3 relative">
                                <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />
                                <div className="space-y-4">
                                  {/* Region Level */}
                                  <div className="flex items-center gap-3 relative z-10 pl-4">
                                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                                        Vùng trồng
                                      </div>
                                      <div className="text-xs font-bold text-slate-700">
                                        {region?.name}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Area Level */}
                                  <div className="relative pl-4">
                                    <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />
                                    <div className="pl-4">
                                      <div className="flex items-center gap-3 relative z-10 py-1">
                                        <div className="w-8 h-8 rounded-lg border bg-primary/5 border-primary/20 flex items-center justify-center shadow-xs shrink-0">
                                          <Layers className="w-3.5 h-3.5 text-primary" />
                                        </div>
                                        <div>
                                          <div className="text-[10px] text-primary/60 font-bold uppercase tracking-wider leading-none mb-1">
                                            Khu vực
                                          </div>
                                          <div className="text-xs font-bold text-slate-900">
                                            {area?.name}
                                          </div>
                                        </div>
                                        {area?.area != null && (
                                          <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-none text-[10px]">
                                            {area.area} ha
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                {/* Empty state when nothing selected */}
                {!selectedAreaId && (
                  <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-[11px] font-bold text-slate-500">
                      Chưa chọn vùng trồng và khu vực
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã lô <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="Ví dụ: LO-001"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên lô <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Lô Sầu Riêng 1"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>
                  Diện tích (ha) <span className="text-red-500">*</span>
                </Label>
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
                <Label>Đường bình độ</Label>
                <Input
                  value={formData.contour || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, contour: e.target.value })
                  }
                  placeholder="100m"
                />
              </div>
              <div className="space-y-2">
                <Label>Độ cao (m)</Label>
                <Input
                  type="number"
                  value={formData.altitude || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      altitude: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },

    {
      id: "map",
      title: "Bản đồ",
      description: "Xác định vị trí trên bản đồ",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Định vị lô đất</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative">
              <MapContainer
                center={[
                  getBoundsFromPoints(
                    areaPolygon.length ? areaPolygon : currentPoints,
                  ).getCenter().lat,
                  getBoundsFromPoints(
                    areaPolygon.length ? areaPolygon : currentPoints,
                  ).getCenter().lng,
                ]}
                zoom={17}
                className="h-full w-full"
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Parent Area Polygon */}
                {areaPolygon.length > 0 && (
                  <Polygon
                    positions={areaPolygon}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  >
                    <Tooltip sticky direction="top">
                      {selectedArea?.name} (Khu vực)
                    </Tooltip>
                  </Polygon>
                )}

                {/* Existing plots within selected area */}
                {selectedArea?.plots?.map((plot: Plot) => {
                  if (!plot.coordinates || plot.coordinates.length < 3)
                    return null;
                  if (
                    isEditMode &&
                    params?.id &&
                    String(plot.id) === String(params.id)
                  )
                    return null;
                  const positions = plot.coordinates.map((c: any) =>
                    L.latLng(c.lat, c.lng),
                  );
                  return (
                    <Polygon
                      key={`existing-plot-${plot.id}`}
                      positions={positions}
                      pathOptions={{
                        color: "gray",
                        weight: 1,
                        dashArray: "4, 4",
                        fillOpacity: 0,
                      }}
                    >
                      <Tooltip sticky direction="top">
                        {plot.name} (Lô sẵn có)
                      </Tooltip>
                    </Polygon>
                  );
                })}

                {/* Current Plot Polygon */}
                <Polygon
                  positions={currentPoints}
                  pathOptions={{ color: "orange", fillOpacity: 0.2 }}
                />

                {currentPoints.map((point, idx) => {
                  const isActive = activePointIndex === idx;
                  const isInvalid = !!pointWarnings[idx];
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
                          setPointWithValidation(idx, point, {
                            persist: true,
                            preview: false,
                          });
                        },
                        dragstart: (e) => {
                          setActivePointIndex(idx);
                          setIsDraggingPoint(true);
                          handlePointDrag(idx, e.target.getLatLng(), {
                            finalize: false,
                          });
                        },
                        drag: (e) =>
                          handlePointDrag(idx, e.target.getLatLng(), {
                            finalize: false,
                          }),
                        dragend: (e) => {
                          setIsDraggingPoint(false);
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
              </MapContainer>
              {activePersistentWarning &&
                !isDraggingPoint &&
                selectedAreaId && (
                  <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                    <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                      <p className="text-sm font-semibold text-red-600">
                        Vị trí{" "}
                        <span className="font-bold border rounded-md border-red-200 p-0.5">
                          điểm {activePersistentWarning.index + 1}
                        </span>{" "}
                        không hợp lệ
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Toạ độ hiện tại:{" "}
                        <span className="font-medium text-gray-900">
                          {formatLatLng(activePersistentWarning.invalidLatLng)}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Gợi ý hợp lệ:{" "}
                        <span className="font-medium text-gray-900">
                          {formatLatLng(
                            activePersistentWarning.suggestedLatLng,
                          )}
                        </span>
                      </p>
                      <Button
                        size="sm"
                        className="mt-3 w-full"
                        onClick={applySuggestedPoint}
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
                  điểm. Nếu ra khỏi khu vực hoặc đè lên lô sẵn có, điểm sẽ đổi
                  đỏ và hiển thị gợi ý hợp lệ.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {currentPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {currentPoints.length > 3 && (
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
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <div className="space-y-5">
          {/* ── Bước 1: Vị trí lô ── */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-blue-50/70 border-b border-blue-100 py-3 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Vị trí lô
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              {(() => {
                const confirmRegion = regions.find(
                  (r) => r.id === selectedRegionId,
                );
                const confirmArea = confirmRegion?.subAreas?.find(
                  (a: any) => String(a.id) === String(selectedAreaId),
                );
                return (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                    <div className="space-y-0.5">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                        Đơn vị sở hữu
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {(confirmRegion as any)?.enterpriseName || (
                          <span className="text-slate-300 italic">
                            Chưa chọn
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                        Vùng trồng
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {confirmRegion?.name || (
                          <span className="text-slate-300 italic">
                            Chưa chọn
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                        Khu vực
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {confirmArea?.name || (
                          <span className="text-slate-300 italic">
                            Chưa chọn
                          </span>
                        )}
                      </p>
                    </div>
                    {confirmArea?.area != null && (
                      <div className="space-y-0.5">
                        <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                          Diện tích khu vực
                        </p>
                        <p className="text-sm font-bold text-blue-600">
                          {confirmArea.area} ha
                        </p>
                      </div>
                    )}
                  </div>
                );
              })()}
            </CardContent>
          </Card>

          {/* ── Bước 2: Thông tin lô ── */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-emerald-50/70 border-b border-emerald-100 py-3 px-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                  <Layers className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Thông tin lô
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Mã lô
                  </p>
                  <p className="text-sm font-semibold text-slate-700 font-mono">
                    {formData.code || (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Tên lô
                  </p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formData.name || (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Diện tích
                  </p>
                  <p className="text-sm font-bold text-emerald-600">
                    {formData.area ? (
                      `${formData.area} ha`
                    ) : (
                      <span className="text-slate-300 italic">Chưa nhập</span>
                    )}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Đường bình độ
                  </p>
                  <p className="text-sm text-slate-700">
                    {formData.contour || (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </p>
                </div>
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">
                    Độ cao
                  </p>
                  <p className="text-sm text-slate-700">
                    {formData.altitude ? (
                      `${formData.altitude} m`
                    ) : (
                      <span className="text-slate-300 italic">—</span>
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ── Bước 3: Bản đồ & Toạ độ ── */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-amber-50/70 border-b border-amber-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                      <line x1="9" y1="3" x2="9" y2="18" />
                      <line x1="15" y1="6" x2="15" y2="21" />
                    </svg>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Bản đồ lô đất
                  </CardTitle>
                </div>
                {currentPoints.length >= 3 && (
                  <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                    {currentPoints.length} điểm ranh giới
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {currentPoints.length >= 3 ? (
                <>
                  {/* Mini satellite map */}
                  <div className="h-[260px] w-full relative overflow-hidden">
                    <MapContainer
                      bounds={getBoundsFromPoints(currentPoints).pad(0.15)}
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
                      {/* Area boundary */}
                      {areaPolygon.length >= 3 && (
                        <Polygon
                          positions={areaPolygon}
                          pathOptions={{
                            color: "#3b82f6",
                            fill: false,
                            weight: 1.5,
                            dashArray: "5 4",
                          }}
                        />
                      )}
                      {/* Plot polygon */}
                      <Polygon
                        positions={currentPoints}
                        pathOptions={{
                          color: "#f59e0b",
                          fillColor: "#f59e0b",
                          fillOpacity: 0.2,
                          weight: 2.5,
                          dashArray: "6 4",
                        }}
                      />
                    </MapContainer>
                    {/* Legend */}
                    <div className="absolute bottom-3 left-3 z-500 flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-100 text-[11px] font-semibold pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <svg width="16" height="8">
                          <line
                            x1="0"
                            y1="4"
                            x2="16"
                            y2="4"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeDasharray="4 3"
                          />
                        </svg>
                        <span className="text-slate-600">Ranh giới lô</span>
                      </div>
                      {areaPolygon.length >= 3 && (
                        <div className="flex items-center gap-1.5">
                          <svg width="16" height="8">
                            <line
                              x1="0"
                              y1="4"
                              x2="16"
                              y2="4"
                              stroke="#3b82f6"
                              strokeWidth="1.5"
                              strokeDasharray="4 3"
                            />
                          </svg>
                          <span className="text-slate-600">
                            Ranh giới khu vực
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Coordinate list */}
                  <div className="px-5 py-4">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400 mb-3">
                      Danh sách toạ độ
                    </p>
                    <div className="max-h-44 overflow-y-auto rounded-xl border border-slate-100 divide-y divide-slate-50 bg-slate-50/60">
                      {currentPoints.map((p, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 px-4 py-2.5"
                        >
                          <span className="text-[11px] font-extrabold w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                            {i + 1}
                          </span>
                          <div className="flex gap-5 text-xs font-mono text-slate-700">
                            <span>
                              <span className="text-[10px] text-slate-400 mr-1 font-sans font-bold uppercase">
                                Lat
                              </span>
                              {p.lat.toFixed(6)}
                            </span>
                            <span>
                              <span className="text-[10px] text-slate-400 mr-1 font-sans font-bold uppercase">
                                Lng
                              </span>
                              {p.lng.toFixed(6)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mb-2 text-slate-200"
                  >
                    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                    <line x1="9" y1="3" x2="9" y2="18" />
                    <line x1="15" y1="6" x2="15" y2="21" />
                  </svg>
                  <p className="text-sm font-semibold text-amber-600">
                    Chưa xác định ranh giới lô
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Quay lại bước 3 để vẽ lô trên bản đồ
                  </p>
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
      title={isEditMode ? "Chỉnh sửa lô" : "Thêm lô mới"}
      description={
        isEditMode ? "Cập nhật thông tin lô" : "Tạo lô đất mới vào khu vực"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/plot-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <StepperForm
        steps={steps}
        onComplete={handleSubmit}
        completeLabel={isEditMode ? "Cập nhật" : "Tạo mới"}
        onCancel={() => setLocation("/plot-distribution")}
      />
    </AdminLayout>
  );
};
export default PlotCreatePage;
