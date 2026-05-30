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
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import {
  ChevronLeft,
  MapPin,
  Layers,
  Trash2,
} from "lucide-react";

import { type Plot, type SubArea } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import { PlotLocationSelector } from "./components/PlotLocationSelector";
import { PlotMapEditor } from "./components/PlotMapEditor";
import { PlotConfirmStep } from "./components/PlotConfirmStep";
import {
  getBoundsFromPoints,
  getNearestPointOnPolygonBoundary,
  toTurfPolygonFromCoords,
  type PointWarning,
} from "./utils";
const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const PlotCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [newMatch, newParams] = useRoute(
    "/plot-distribution/edit/:id",
  );
  const [legacyMatch, legacyParams] = useRoute(
    "/region-chart/plot-distribution/edit/:id",
  );
  const editParams = newMatch ? newParams : legacyParams;
  const isEditMode = (newMatch || legacyMatch) && !!editParams?.id;

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

  const selectedArea = useMemo<SubArea | null>(() => {
    if (!selectedAreaId) return null;
    return getAreaById(selectedAreaId)?.area ?? null;
  }, [selectedAreaId, getAreaById]);

  const resolveEnterpriseIdFromRegion = useCallback(
    (regionId: number | null) => {
      if (!regionId) return null;
      const region = regions.find((item) => item.id === regionId);
      if (!region?.enterpriseId) return null;

      const enterpriseKey = String(region.enterpriseId);
      const matchedEnterprise = enterprises.find(
        (enterprise) =>
          String(enterprise.id) === enterpriseKey ||
          String(enterprise.code) === enterpriseKey,
      );
      return matchedEnterprise?.id ?? null;
    },
    [regions, enterprises],
  );

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
      .filter((plot) => {
        if (!plot.coordinates || plot.coordinates.length < 3) return false;
        if (
          isEditMode &&
          editParams?.id &&
          String(plot.id) === String(editParams.id)
        )
          return false;
        return true;
      })
      .map((plot) => {
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
  }, [selectedArea?.plots, isEditMode, editParams?.id]);

  const activePersistentWarning = useMemo(() => {
    if (activePointIndex === null) return null;
    return pointWarnings[activePointIndex] ?? null;
  }, [activePointIndex, pointWarnings]);

  const plotWarningForDisplay = activeDragWarning ?? activePersistentWarning;

  // Handle Edit Mode Data Loading
  useEffect(() => {
    if (isEditMode && editParams?.id) {
      const plot = regions
        .flatMap((r) => r.subAreas || [])
        .flatMap((a) => a.plots || [])
        .find((p) => String(p.id) === String(editParams.id));

      if (plot) {
        // Find parent area and region
        const parentArea = regions
          .flatMap((r) => r.subAreas || [])
          .find((a) => a.plots?.some((p) => String(p.id) === String(plot.id)));

        if (parentArea) {
          setSelectedRegionId(parentArea.regionId);
          setSelectedAreaId(String(parentArea.id));
          setSelectEnterpriseId(resolveEnterpriseIdFromRegion(parentArea.regionId));
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
            plot.coordinates.map((coordinate) =>
              L.latLng(coordinate.lat, coordinate.lng),
            ),
          );
          setPointWarnings({});
          setActivePointIndex(null);
          setActiveDragWarning(null);
          setIsDraggingPoint(false);
        }
      }
    }
  }, [isEditMode, editParams?.id, regions, resolveEnterpriseIdFromRegion]);

  useEffect(() => {
    if (selectEnterpriseId !== null || selectedRegionId === null) return;
    setSelectEnterpriseId(resolveEnterpriseIdFromRegion(selectedRegionId));
  }, [selectEnterpriseId, selectedRegionId, resolveEnterpriseIdFromRegion]);

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

    if (selectedArea.coordinates.length >= 2) {
      const points = selectedArea.coordinates.map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
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
    editParams?.id,
  ]);

  const getNearestValidPlotPosition = useCallback(
    (latlng: L.LatLng) => {
      return getNearestPointOnPolygonBoundary(areaPolygonFeature, latlng);
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
        const { [index]: removedWarning, ...rest } = prev;
        void removedWarning;
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
    let overlapPolygon: NonNullable<
      ReturnType<typeof toTurfPolygonFromCoords>
    > | null = null;

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
      isEditMode && editParams?.id
        ? String(editParams.id)
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
                  <PlotLocationSelector
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
                      (subArea) => String(subArea.id) === String(selectedAreaId),
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
        <PlotMapEditor
          areaPolygon={areaPolygon}
          currentPoints={currentPoints}
          selectedAreaName={selectedArea?.name}
          selectedAreaId={selectedAreaId}
          existingPlots={selectedArea?.plots || []}
          activePointIndex={activePointIndex}
          pointWarnings={pointWarnings}
          activePersistentWarning={activePersistentWarning}
          plotWarningForDisplay={plotWarningForDisplay}
          isDraggingPoint={isDraggingPoint}
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
          isEditMode={isEditMode}
          editingPlotId={editParams?.id}
          onMarkerSelect={(index, point) => {
            setActivePointIndex(index);
            setPointWithValidation(index, point, {
              persist: true,
              preview: false,
            });
          }}
          onPointDrag={(index, latlng, options) => {
            setActivePointIndex(index);
            setIsDraggingPoint(!(options?.finalize ?? false));
            handlePointDrag(index, latlng, options);
          }}
          onMapClick={handleMapClick}
          onApplySuggestedPoint={applySuggestedPoint}
          onRemovePoint={removePoint}
          onPointInputChange={handlePointInputChange}
          onAddPoint={handleAddPoint}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <PlotConfirmStep
          regions={regions}
          selectedRegionId={selectedRegionId}
          selectedAreaId={selectedAreaId}
          selectedEnterpriseName={
            enterprises.find((enterprise) =>
              String(enterprise.id) === String(selectEnterpriseId),
            )?.name
          }
          formData={formData}
          currentPoints={currentPoints}
          areaPolygon={areaPolygon}
        />
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
