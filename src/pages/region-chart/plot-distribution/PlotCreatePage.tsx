import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { ChevronLeft, Plus, X } from "lucide-react";

import { type Plot } from "../constants";
import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";

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

  const enterpriseOptions = React.useMemo(() => {
    return enterprises.map((item) => ({
      label: item.name,
      image: item.image,
      value: item.id?.toString(),
    }));
  }, [enterprises]);

  const currentRegion = useMemo(() => {
    return regions.find((r) => r.id === selectedRegionId);
  }, [regions, selectedRegionId]);

  const regionOptions: ComboboxOption[] = useMemo(() => {
    return regions
      .filter(
        (item) => String(item.enterpriseId) === String(selectEnterpriseId),
      )
      .map((r) => ({
        label: r.name,
        value: r.id.toString(),
      }));
  }, [regions, selectEnterpriseId]);

  const areaOptions: ComboboxOption[] = useMemo(() => {
    if (!currentRegion) return [];
    return (currentRegion.subAreas || []).map((a: any) => ({
      label: a.name,
      value: String(a.id),
    }));
  }, [currentRegion]);

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

  const blockingPlotPolygons = useMemo(() => {
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
        return { id: plot.id, polygon: poly };
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
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
        coordinates: coords,
      });
    }

    toast({
      title: "Thành công",
      description: isEditMode ? "Đã cập nhật lô" : "Đã tạo lô mới",
    });
    setLocation("/plot-distribution");
  };

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn khu vực",
      description: "Chọn vùng trồng và khu vực",
      isValid: !!selectedRegionId && !!selectedAreaId,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Vị trí lô</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>
                Chọn đơn vị <span className="text-red-500">*</span>
              </Label>

              <Combobox
                options={enterpriseOptions}
                placeholder="Chọn vùng trồng"
                value={selectEnterpriseId?.toString() ?? ""}
                onChange={(value) => setSelectEnterpriseId(Number(value))}
              />
            </div>

            {/* Region Selection */}
            <div className="space-y-2">
              <Label>
                Chọn vùng trồng <span className="text-red-500">*</span>
              </Label>
              <Combobox
                options={regionOptions}
                placeholder="Chọn vùng trồng"
                disabled={!selectEnterpriseId}
                value={selectedRegionId?.toString() ?? ""}
                onChange={(v) => {
                  setSelectedRegionId(v ? Number(v) : null);
                  setSelectedAreaId(null);
                }}
              />
            </div>

            {/* Area Selection */}
            {selectedRegionId && (
              <div className="space-y-2">
                <Label>
                  Chọn khu vực <span className="text-red-500">*</span>
                </Label>
                <Combobox
                  options={areaOptions}
                  placeholder="Chọn khu vực"
                  value={selectedAreaId ?? ""}
                  onChange={(v) => setSelectedAreaId(v)}
                />
              </div>
            )}

            {selectedAreaId && areaPolygon.length >= 2 && (
              <div className="space-y-2 pt-4 border-t">
                <Label className="text-muted-foreground text-sm">
                  Xem nhanh khu vực đã chọn
                </Label>
                <div className="h-64 rounded-lg border overflow-hidden">
                  <MapContainer
                    center={[
                      getBoundsFromPoints(
                        areaPolygon.length ? areaPolygon : currentPoints,
                      ).getCenter().lat,
                      getBoundsFromPoints(
                        areaPolygon.length ? areaPolygon : currentPoints,
                      ).getCenter().lng,
                    ]}
                    zoom={15}
                    className="h-full w-full"
                    scrollWheelZoom={false}
                    doubleClickZoom={false}
                    dragging={false}
                  >
                    <TileLayer
                      attribution="&copy; OpenStreetMap"
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Polygon
                      positions={areaPolygon}
                      pathOptions={{
                        color: "blue",
                        fill: false,
                        dashArray: "5, 5",
                      }}
                    />
                    {currentPoints.length >= 3 && (
                      <Polygon
                        positions={currentPoints}
                        pathOptions={{
                          color: "orange",
                          weight: 2,
                          fillOpacity: 0.15,
                        }}
                      />
                    )}
                  </MapContainer>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ),
    },
    {
      id: "info",
      title: "Thông tin lô",
      description: "Điền thông tin chi tiết lô",
      isValid: !!formData.name && !!formData.area,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>
                Tên lô <span className="text-red-500">*</span>
              </Label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Ví dụ: Lô Sầu Riêng 1"
              />
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
                {selectedArea?.plots?.map((plot) => {
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
        <Card>
          <CardHeader>
            <CardTitle>Xác nhận thông tin</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Vùng trồng</Label>
                <p className="font-medium">
                  {regions.find((r) => r.id === selectedRegionId)?.name}
                </p>
              </div>
              <div>
                <Label className="text-muted-foreground">Khu vực</Label>
                <p className="font-medium">{selectedArea?.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Tên lô</Label>
                <p className="font-medium">{formData.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Diện tích</Label>
                <p className="font-medium">{formData.area} ha</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Đường bình độ</Label>
                <p className="font-medium">{formData.contour || "-"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Độ cao</Label>
                <p className="font-medium">{formData.altitude || "-"} m</p>
              </div>
            </div>
          </CardContent>
        </Card>
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
