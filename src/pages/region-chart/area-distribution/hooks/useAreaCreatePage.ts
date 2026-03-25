import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import useRegionStore from "../../../../stores/useRegionStore";
import useTerrainStore from "@/stores/useTerrainStore";
import useLandStore from "@/stores/useLandStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { type Plot, type SubArea as Area } from "../../constants";
import {
  createLatLngPoints,
  DEFAULT_AREA_POINT_TUPLES,
  formatLatLng,
  getBoundsFromPoints,
  getNearestPointOnPolygonBoundary,
  type PointWarning,
  toTurfPolygonFromCoords,
} from "../utils/map";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

export function useAreaCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/area-distribution/edit/:id");
  const isEditMode = match && !!params?.id;
  const { lands } = useLandStore();
  const { terrains } = useTerrainStore();
  const { enterprises } = useEnterpriseStore();

  const [selectEnterpriseId, setSelectEnterpriseId] = useState<number | null>(null);
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
    getBoundsFromPoints(createLatLngPoints(DEFAULT_AREA_POINT_TUPLES)).getCenter(),
  );
  const [plotMapCenter, setPlotMapCenter] = useState<L.LatLng>(() =>
    getBoundsFromPoints(createLatLngPoints(DEFAULT_AREA_POINT_TUPLES)).getCenter(),
  );
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [areaPointWarnings, setAreaPointWarnings] = useState<Record<number, PointWarning>>({});
  const [activeAreaDragWarning, setActiveAreaDragWarning] = useState<PointWarning | null>(null);
  const [isDraggingAreaPoint, setIsDraggingAreaPoint] = useState(false);

  const [plotPoints, setPlotPoints] = useState<L.LatLng[]>([]);
  const [editingPlot, setEditingPlot] = useState<Partial<Plot> | null>(null);
  const [activePlotPointIndex, setActivePlotPointIndex] = useState<number | null>(null);
  const [plotPointWarnings, setPlotPointWarnings] = useState<Record<number, PointWarning>>({});
  const [activeDragWarning, setActiveDragWarning] = useState<PointWarning | null>(null);
  const [isDraggingPlotPoint, setIsDraggingPlotPoint] = useState(false);

  const { regions, upsertSubArea, getAreaById } = useRegionStore();
  const hasInitializedEditData = useRef(false);

  const syncMapCenters = useCallback((points: L.LatLng[]) => {
    if (!points || points.length === 0) {
      return;
    }
    const nextCenter = getBoundsFromPoints(points).getCenter();
    setAreaMapCenter(nextCenter);
    setPlotMapCenter(nextCenter);
  }, []);

  const currentRegion = useMemo(
    () => regions.find((region) => region.id === selectedRegionId),
    [regions, selectedRegionId],
  );

  const areaPolygonFeature = useMemo(() => {
    if (areaPoints.length < 3) {
      return null;
    }
    const coordinates = areaPoints.map((pointItem) => [pointItem.lng, pointItem.lat]);
    return polygon([[...coordinates, coordinates[0]]]);
  }, [areaPoints]);

  const regionPolygonFeature = useMemo(() => {
    if (!selectedRegionId) {
      return null;
    }
    const region = regions.find((item) => item.id === selectedRegionId);
    if (!region || !region.coordinates || region.coordinates.length < 3) {
      return null;
    }
    const coordinates = region.coordinates.map((coord) => [coord.lng, coord.lat]);
    return polygon([[...coordinates, coordinates[0]]]);
  }, [regions, selectedRegionId]);

  const activePersistentPlotWarning = useMemo(() => {
    if (activePlotPointIndex === null) {
      return null;
    }
    return plotPointWarnings[activePlotPointIndex] ?? null;
  }, [activePlotPointIndex, plotPointWarnings]);

  const activePersistentAreaWarning = useMemo(() => {
    if (activePointIndex === null) {
      return null;
    }
    return areaPointWarnings[activePointIndex] ?? null;
  }, [activePointIndex, areaPointWarnings]);

  const blockingAreaPolygons = useMemo(() => {
    if (!currentRegion?.subAreas) {
      return [];
    }
    return currentRegion.subAreas
      .filter((area) => {
        if (!area.coordinates || area.coordinates.length < 3) {
          return false;
        }
        if (isEditMode && params?.id && area.id === params.id) {
          return false;
        }
        return true;
      })
      .map((area) => {
        const poly = toTurfPolygonFromCoords(area.coordinates as { lat: number; lng: number }[]);
        return poly ? { id: area.id, polygon: poly } : null;
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [currentRegion, isEditMode, params?.id]);

  const blockingPlotPolygons = useMemo(() => {
    if (!formData.plots || formData.plots.length === 0) {
      return [];
    }
    return (formData.plots as Plot[])
      .filter((plot) => {
        if (!plot.coordinates || plot.coordinates.length < 3) {
          return false;
        }
        if (editingPlot && plot.id === editingPlot.id) {
          return false;
        }
        return true;
      })
      .map((plot) => {
        const poly = toTurfPolygonFromCoords(plot.coordinates);
        return poly ? { id: plot.id, polygon: poly } : null;
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [editingPlot, formData.plots]);

  useEffect(() => {
    hasInitializedEditData.current = false;
  }, [params?.id]);

  useEffect(() => {
    if (!isEditMode || !params?.id) {
      hasInitializedEditData.current = false;
      return;
    }
    if (hasInitializedEditData.current) {
      return;
    }

    const found = getAreaById(String(params.id));
    if (!found) {
      return;
    }

    hasInitializedEditData.current = true;
    const area = found.area;
    setFormData(area);
    setSelectedRegionId(area.regionId);

    if (area.coordinates && area.coordinates.length >= 3) {
      const loadedPoints = area.coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
      setAreaPoints(loadedPoints);
      syncMapCenters(loadedPoints);
    }

    setAreaPointWarnings({});
    setActiveAreaDragWarning(null);
    setIsDraggingAreaPoint(false);
    setActivePointIndex(null);
  }, [getAreaById, isEditMode, params?.id, syncMapCenters]);

  useEffect(() => {
    if (!selectedRegionId) {
      return;
    }

    const region = regions.find((item) => item.id === selectedRegionId);
    if (!region) {
      return;
    }

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

    if (!isEditMode && region.coordinates && region.coordinates.length > 0) {
      const points = region.coordinates.map((coord: any) => L.latLng(coord.lat, coord.lng));
      const center = L.latLngBounds(points).getCenter();
      const defaultTriangle = [
        L.latLng(center.lat - 0.005, center.lng - 0.005),
        L.latLng(center.lat + 0.005, center.lng),
        L.latLng(center.lat - 0.005, center.lng + 0.005),
      ];
      setAreaPoints(defaultTriangle);
      syncMapCenters(defaultTriangle);
      setAreaPointWarnings({});
      setActiveAreaDragWarning(null);
      setIsDraggingAreaPoint(false);
      setActivePointIndex(null);
    }
  }, [isEditMode, regions, selectedRegionId, syncMapCenters]);

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
    if (!regionPolygonFeature) {
      return null;
    }
    const polygonLine = polygonToLine(regionPolygonFeature);
    const lineFeature = Array.isArray((polygonLine as any).features)
      ? (polygonLine as any).features[0]
      : polygonLine;
    if (!lineFeature) {
      return null;
    }
    const snapped = nearestPointOnLine(lineFeature as any, point([latlng.lng, latlng.lat]));
    if (!snapped) {
      return null;
    }
    return L.latLng(snapped.geometry.coordinates[1], snapped.geometry.coordinates[0]);
  };

  const updateAreaWarningForIndex = (index: number, warning: PointWarning | null) => {
    setAreaPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) {
          return prev;
        }
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftAreaWarningsAfterRemoval = (removedIndex: number) => {
    setAreaPointWarnings((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }
      const next: Record<number, PointWarning> = {};
      Object.entries(prev).forEach(([idxStr, warning]) => {
        const idx = Number(idxStr);
        if (idx === removedIndex) {
          return;
        }
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
        setActiveAreaDragWarning((prev) => (prev?.index === index ? null : prev));
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);
    let violationType: "outsideRegion" | "overlapsArea" | null = null;
    let overlapPolygon: any | null = null;

    if (regionPolygonFeature) {
      const insideRegion = booleanPointInPolygon(pointFeature, regionPolygonFeature);
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

    const nearestValid =
      violationType === "outsideRegion"
        ? getNearestValidAreaPosition(latlng)
        : overlapPolygon
          ? getNearestPointOnPolygonBoundary(overlapPolygon, latlng)
          : null;

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
    if (!activePersistentAreaWarning) {
      return;
    }
    const { index, suggestedLatLng } = activePersistentAreaWarning;
    setAreaPointWithValidation(index, suggestedLatLng, { persist: true, preview: false });
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

  const areaWarningForDisplay = activeAreaDragWarning ?? activePersistentAreaWarning;

  const removePoint = (index: number) => {
    if (areaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    setActivePointIndex(null);
    setAreaPoints((prev) => prev.filter((_, pointIndex) => pointIndex !== index));
    shiftAreaWarningsAfterRemoval(index);
    setActiveAreaDragWarning(null);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (Number.isNaN(val)) {
      return;
    }
    const currentPoint = areaPoints[index];
    if (!currentPoint) {
      return;
    }
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setAreaPointWithValidation(index, updated, { persist: true, preview: false });
    setActivePointIndex(index);
    setActiveAreaDragWarning(null);
  };

  const handleAddPoint = () => {
    const center = getBoundsFromPoints(areaPoints).getCenter();
    const nextIndex = areaPoints.length;
    const newLatLng = L.latLng(center.lat + 0.002, center.lng + 0.002);
    setAreaPointWithValidation(nextIndex, newLatLng, { persist: true, preview: false });
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

    const finalAreaId =
      isEditMode && params?.id ? String(params.id) : `sub-${selectedRegionId}-${Date.now()}`;

    const areaData: Area = {
      id: finalAreaId,
      code: formData.code || "",
      name: formData.name || "",
      regionId: selectedRegionId,
      area: formData.area || 0,
      landType: formData.landType || "",
      terrain: formData.terrain || "",
      status: (formData.status as "active" | "inactive") || "active",
      plots: (formData.plots as Plot[]) || [],
      coordinates: areaPoints.map((pointItem) => ({
        lat: pointItem.lat,
        lng: pointItem.lng,
      })),
      createdAt:
        isEditMode && formData.createdAt ? formData.createdAt : new Date().toISOString(),
    };

    upsertSubArea(selectedRegionId, areaData);
    toast({
      title: "Thành công",
      description: isEditMode ? "Cập nhật khu vực thành công" : "Tạo khu vực mới thành công",
    });

    setTimeout(() => {
      setLocation("/area-distribution");
    }, 150);
  };

  const getNearestValidPlotPosition = (latlng: L.LatLng) => {
    if (!areaPolygonFeature) {
      return null;
    }
    const polygonLine = polygonToLine(areaPolygonFeature);
    const lineFeature = Array.isArray((polygonLine as any).features)
      ? (polygonLine as any).features[0]
      : polygonLine;
    if (!lineFeature) {
      return null;
    }
    const snapped = nearestPointOnLine(lineFeature as any, point([latlng.lng, latlng.lat]));
    if (!snapped) {
      return null;
    }
    return L.latLng(snapped.geometry.coordinates[1], snapped.geometry.coordinates[0]);
  };

  const updateWarningForIndex = (index: number, warning: PointWarning | null) => {
    setPlotPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) {
          return prev;
        }
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftWarningsAfterRemoval = (removedIndex: number) => {
    setPlotPointWarnings((prev) => {
      if (Object.keys(prev).length === 0) {
        return prev;
      }
      const next: Record<number, PointWarning> = {};
      Object.entries(prev).forEach(([idxStr, warning]) => {
        const idx = Number(idxStr);
        if (idx === removedIndex) {
          return;
        }
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
      const insideArea = booleanPointInPolygon(pointFeature, areaPolygonFeature);
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

    const nearestValid =
      violationType === "outsideArea"
        ? getNearestValidPlotPosition(latlng)
        : overlapPolygon
          ? getNearestPointOnPolygonBoundary(overlapPolygon, latlng)
          : null;

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
    if (!activePersistentPlotWarning) {
      return;
    }
    const { index, suggestedLatLng } = activePersistentPlotWarning;
    setPlotPointWithValidation(index, suggestedLatLng, { persist: true, preview: false });
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

  const plotWarningForDisplay = activeDragWarning ?? activePersistentPlotWarning;

  const handleAddPlotPoint = () => {
    const center = getBoundsFromPoints(plotPoints).getCenter();
    const nextIndex = plotPoints.length;
    setPlotPoints((prev) => [...prev, L.latLng(center.lat + 0.002, center.lng + 0.002)]);
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
    setPlotPoints((prev) => prev.filter((_, pointIndex) => pointIndex !== index));
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
    if (Number.isNaN(val)) {
      return;
    }
    const currentPoint = plotPoints[index];
    if (!currentPoint) {
      return;
    }
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setPlotPointWithValidation(index, updated, { persist: true, preview: false });
    setActivePlotPointIndex(index);
    setActiveDragWarning(null);
  };

  const addPlot = () => {
    const newPlot: Plot = {
      id: `plot-${Date.now()}`,
      code: "",
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
    if (!editingPlot) {
      return;
    }
    if (plotPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Lô cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    if (!editingPlot.code || !editingPlot.name) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập đầy đủ mã lô và tên lô",
        variant: "destructive",
      });
      return;
    }

    const updatedPlot = {
      ...editingPlot,
      coordinates: plotPoints.map((plotPoint) => ({
        lat: plotPoint.lat,
        lng: plotPoint.lng,
      })),
    } as Plot;

    const currentPlots = formData.plots || [];
    const index = currentPlots.findIndex((plot) => plot.id === updatedPlot.id);
    const nextPlots =
      index >= 0
        ? currentPlots.map((plot, plotIndex) => (plotIndex === index ? updatedPlot : plot))
        : [...currentPlots, updatedPlot];

    setFormData((prev) => ({ ...prev, plots: nextPlots }));
    setEditingPlot(null);
  };

  const removePlot = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      plots: (prev.plots || []).filter((plot) => plot.id !== id),
    }));
  };

  return {
    setLocation,
    isEditMode,
    editAreaId: params?.id ? String(params.id) : undefined,
    lands,
    terrains,
    enterprises,
    regions,
    selectEnterpriseId,
    setSelectEnterpriseId,
    selectedRegionId,
    setSelectedRegionId,
    formData,
    setFormData,
    areaPoints,
    areaMapCenter,
    plotMapCenter,
    currentRegion,
    activePointIndex,
    setActivePointIndex,
    areaPointWarnings,
    areaWarningForDisplay,
    activePersistentAreaWarning,
    isDraggingAreaPoint,
    setIsDraggingAreaPoint,
    plotPoints,
    setPlotPoints,
    editingPlot,
    setEditingPlot,
    activePlotPointIndex,
    setActivePlotPointIndex,
    plotPointWarnings,
    plotWarningForDisplay,
    activePersistentPlotWarning,
    isDraggingPlotPoint,
    setIsDraggingPlotPoint,
    customIcon,
    activeIcon,
    invalidIcon,
    formatLatLng,
    setAreaPointWithValidation,
    handlePointDrag: handleAreaPointDrag,
    applySuggestedAreaPoint,
    removePoint,
    handlePointInputChange,
    handleAddPoint,
    setPlotPointWithValidation,
    handlePlotPointDrag,
    applySuggestedPlotPoint,
    handleAddPlotPoint,
    removePlotPoint,
    handlePlotPointInputChange,
    addPlot,
    savePlot,
    removePlot,
    handleSubmit,
  };
}
