import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StepperForm,
  type Step,
  Button,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Polyline,
  Tooltip,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";
import { Plus, Edit, Trash2, ChevronLeft, X } from "lucide-react";

import { type Region, type SubArea } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import useLandStore from "../../../stores/useLandStore";
import useTerrainStore from "../../../stores/useTerrainStore";
import { PROVINCES } from "@/constants/province";
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

const RegionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [match, params] = useRoute("/region-distribution/edit/:id");
  const isEditMode = match && !!params?.id;

  // Form State
  const defaultPoints = [
    L.latLng(11.53, 106.88),
    L.latLng(11.55, 106.88),
    L.latLng(11.55, 106.91),
    L.latLng(11.53, 106.91),
  ];

  const [formData, setFormData] = useState<Partial<Region>>({
    code: "",
    name: "",
    status: "active",
    subAreas: [],
    coordinates: [],
    provinceId: "",
    districtId: "",
    address: "",
    enterpriseId: "",
    area: 0,
    landType: "",
    terrain: "",
    note: "",
  });

  const [regionPoints, setRegionPoints] = useState<L.LatLng[]>(defaultPoints);

  const { addRegion, updateRegion, getRegionById } = useRegionStore();
  const { enterprises } = useEnterpriseStore();
  const { lands } = useLandStore();
  const { terrains } = useTerrainStore();

  useEffect(() => {
    if (isEditMode && params?.id) {
      const regionId = parseInt(params.id);
      const found = getRegionById(regionId);
      if (found) {
        setFormData(found);
        if (found.coordinates && found.coordinates.length >= 3) {
          setRegionPoints(found.coordinates.map((c) => L.latLng(c.lat, c.lng)));
        }
      }
    }
  }, [isEditMode, params?.id, getRegionById]);

  const resolveRegionId = useCallback(() => {
    if (formData.id) return formData.id;

    if (params?.id) {
      const parsed = parseInt(params.id, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
  }, [formData.id, params?.id]);

  // Sub-area State
  const [editingSubArea, setEditingSubArea] = useState<Partial<SubArea> | null>(
    null,
  );

  const getBoundsFromPoints = (points: L.LatLng[]) => {
    if (points.length === 0) return L.latLngBounds(defaultPoints);
    return L.latLngBounds(points);
  };

  const [subAreaPoints, setSubAreaPoints] = useState<L.LatLng[]>([]);
  const [activeSubAreaPointIndex, setActiveSubAreaPointIndex] = useState<
    number | null
  >(null);
  const [subAreaPointWarnings, setSubAreaPointWarnings] = useState<
    Record<number, PointWarning>
  >({});
  const [activeSubAreaDragWarning, setActiveSubAreaDragWarning] =
    useState<PointWarning | null>(null);
  const [isDraggingSubAreaPoint, setIsDraggingSubAreaPoint] = useState(false);

  const regionPolygonFeature = useMemo(() => {
    if (regionPoints.length < 3) return null;
    const coordinates = regionPoints.map((p) => [p.lng, p.lat]);
    const first = coordinates[0];
    const closed = [...coordinates, first];
    return polygon([closed]);
  }, [regionPoints]);

  const blockingSubAreaPolygons = useMemo(() => {
    if (!formData.subAreas || formData.subAreas.length === 0) return [];
    return (formData.subAreas as SubArea[])
      .filter((sub) => {
        if (!sub.coordinates || sub.coordinates.length < 3) return false;
        if (editingSubArea && sub.id === editingSubArea.id) return false;
        return true;
      })
      .map((sub) => {
        const poly = toTurfPolygonFromCoords(sub.coordinates);
        if (!poly) return null;
        return { id: sub.id, polygon: poly };
      })
      .filter((item): item is { id: string; polygon: any } => item !== null);
  }, [formData.subAreas, editingSubArea]);

  const activePersistentSubAreaWarning = useMemo(() => {
    if (activeSubAreaPointIndex === null) return null;
    return subAreaPointWarnings[activeSubAreaPointIndex] ?? null;
  }, [activeSubAreaPointIndex, subAreaPointWarnings]);

  useEffect(() => {
    setSubAreaPointWarnings({});
    setActiveSubAreaPointIndex(null);
    setActiveSubAreaDragWarning(null);
    setIsDraggingSubAreaPoint(false);
  }, [editingSubArea]);

  const getNearestValidSubAreaPosition = useCallback(
    (latlng: L.LatLng) => {
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
    },
    [regionPolygonFeature],
  );

  const updateSubAreaWarningForIndex = (
    index: number,
    warning: PointWarning | null,
  ) => {
    setSubAreaPointWarnings((prev) => {
      if (!warning) {
        if (!(index in prev)) return prev;
        const { [index]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [index]: warning };
    });
  };

  const shiftSubAreaWarningsAfterRemoval = (removedIndex: number) => {
    setSubAreaPointWarnings((prev) => {
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

  const setSubAreaPointWithValidation = (
    index: number,
    latlng: L.LatLng,
    options?: { persist?: boolean; preview?: boolean },
  ) => {
    const { persist = true, preview = false } = options || {};

    setSubAreaPoints((prev) => {
      const next = [...prev];
      next[index] = latlng;
      return next;
    });

    const clearPreview = () => {
      if (preview) {
        setActiveSubAreaDragWarning((prev) =>
          prev?.index === index ? null : prev,
        );
      }
    };

    const pointFeature = point([latlng.lng, latlng.lat]);

    let violationType: "outsideRegion" | "overlapsSubArea" | null = null;
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

    if (!violationType && blockingSubAreaPolygons.length > 0) {
      const overlapping = blockingSubAreaPolygons.find((subPoly) =>
        booleanPointInPolygon(pointFeature, subPoly.polygon),
      );
      if (overlapping) {
        violationType = "overlapsSubArea";
        overlapPolygon = overlapping.polygon;
      }
    }

    if (!violationType) {
      if (persist) {
        updateSubAreaWarningForIndex(index, null);
      }
      clearPreview();
      return;
    }

    let nearestValid: L.LatLng | null = null;
    if (violationType === "outsideRegion") {
      nearestValid = getNearestValidSubAreaPosition(latlng);
    } else if (violationType === "overlapsSubArea" && overlapPolygon) {
      nearestValid = getNearestPointOnPolygonBoundary(overlapPolygon, latlng);
    }

    if (!nearestValid) {
      clearPreview();
      if (persist) {
        updateSubAreaWarningForIndex(index, null);
      }
      return;
    }

    const warningData: PointWarning = {
      index,
      invalidLatLng: latlng,
      suggestedLatLng: nearestValid,
    };

    if (preview) {
      setActiveSubAreaDragWarning(warningData);
    }

    if (persist) {
      updateSubAreaWarningForIndex(index, warningData);
    }
  };

  const applySuggestedSubAreaPoint = () => {
    if (!activePersistentSubAreaWarning) return;
    const { index, suggestedLatLng } = activePersistentSubAreaWarning;
    setSubAreaPointWithValidation(index, suggestedLatLng, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(index);
    updateSubAreaWarningForIndex(index, null);
    setActiveSubAreaDragWarning(null);
  };

  // --- Handlers ---

  const handlePointDrag = (index: number, latlng: L.LatLng) => {
    const newPoints = [...regionPoints];
    newPoints[index] = latlng;
    setRegionPoints(newPoints);
  };

  const handleSubAreaPointDrag = (
    index: number,
    latlng: L.LatLng,
    options?: { finalize?: boolean },
  ) => {
    setActiveSubAreaPointIndex(index);
    setSubAreaPointWithValidation(index, latlng, {
      persist: options?.finalize ?? false,
      preview: !(options?.finalize ?? false),
    });
    if (options?.finalize) {
      setActiveSubAreaDragWarning(null);
    }
  };

  const subAreaWarningForDisplay =
    activeSubAreaDragWarning ?? activePersistentSubAreaWarning;

  const handleAddPoint = () => {
    const center = getBoundsFromPoints(regionPoints).getCenter();
    setRegionPoints([
      ...regionPoints,
      L.latLng(center.lat + 0.005, center.lng + 0.005),
    ]);
  };

  const handleAddSubAreaPoint = () => {
    const center = getBoundsFromPoints(subAreaPoints).getCenter();
    const nextIndex = subAreaPoints.length;
    const newLatLng = L.latLng(center.lat + 0.002, center.lng + 0.002);
    setSubAreaPointWithValidation(nextIndex, newLatLng, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(nextIndex);
    setActiveSubAreaDragWarning(null);
  };

  const handleMapClick = (latlng: L.LatLng) => {
    setRegionPoints([...regionPoints, latlng]);
  };

  const removePoint = (index: number) => {
    if (regionPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Vùng trồng cần ít nhất 3 điểm để tạo thành hình",
        variant: "destructive",
      });
      return;
    }
    const newPoints = regionPoints.filter((_, i) => i !== index);
    setRegionPoints(newPoints);
  };

  const removeSubAreaPoint = (index: number) => {
    if (subAreaPoints.length <= 3) {
      toast({
        title: "Không thể xóa",
        description: "Khu vực cần ít nhất 3 điểm",
        variant: "destructive",
      });
      return;
    }
    const newPoints = subAreaPoints.filter((_, i) => i !== index);
    setSubAreaPoints(newPoints);
    setActiveSubAreaPointIndex(null);
    setActiveSubAreaDragWarning(null);
    shiftSubAreaWarningsAfterRemoval(index);
  };

  const handlePointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const newPoints = [...regionPoints];
    const currentPoint = newPoints[index];
    newPoints[index] = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setRegionPoints(newPoints);
  };

  const handleSubAreaPointInputChange = (
    index: number,
    field: "lat" | "lng",
    value: string,
  ) => {
    const val = parseFloat(value);
    if (isNaN(val)) return;

    const currentPoint = subAreaPoints[index];
    if (!currentPoint) return;
    const updated = L.latLng(
      field === "lat" ? val : currentPoint.lat,
      field === "lng" ? val : currentPoint.lng,
    );
    setSubAreaPointWithValidation(index, updated, {
      persist: true,
      preview: false,
    });
    setActiveSubAreaPointIndex(index);
    setActiveSubAreaDragWarning(null);
  };

  const handleSubmit = () => {
    if (regionPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho vùng trồng",
        variant: "destructive",
      });
      return;
    }

    const regionData: Omit<Region, "id"> = {
      code: formData.code || "",
      name: formData.name || "",
      provinceId: formData.provinceId || "",
      districtId: formData.districtId || "",
      address: formData.address || "",
      enterpriseId: formData.enterpriseId || "",
      area: formData.area || 0,
      landType: formData.landType || "",
      terrain: formData.terrain || "",
      note: formData.note || "",
      status: (formData.status as "active" | "inactive") || "active",
      subAreas: (formData.subAreas as SubArea[]) || [],
      coordinates: regionPoints.map((p) => ({ lat: p.lat, lng: p.lng })),
      createdAt:
        isEditMode && formData.createdAt
          ? formData.createdAt
          : new Date().toISOString(),
    };

    if (isEditMode && params?.id) {
      updateRegion(parseInt(params.id), regionData);
    } else {
      addRegion(regionData);
    }

    toast({
      title: "Thành công",
      description: isEditMode
        ? "Cập nhật vùng trồng thành công"
        : "Đã tạo mới vùng trồng thành công",
    });
    setLocation("/region-distribution");
  };

  const addSubArea = () => {
    const regionIdForSub = resolveRegionId() ?? 0;
    const newSub: SubArea = {
      area: 0,
      code: "",
      plots: [],
      landType: "",
      coordinates: [],
      status: "active",
      name: "Khu vực mới",
      id: `sub-${Date.now()}`,
      terrain: formData.terrain || "",
      regionId: regionIdForSub as number,
      createdAt: new Date().toISOString(),
    };

    setEditingSubArea(newSub);
    const center = getBoundsFromPoints(regionPoints).getCenter();
    setSubAreaPoints([
      L.latLng(center.lat - 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng - 0.002),
      L.latLng(center.lat + 0.002, center.lng + 0.002),
      L.latLng(center.lat - 0.002, center.lng + 0.002),
    ]);
  };

  const saveSubArea = () => {
    if (!editingSubArea) return;

    if (subAreaPoints.length < 3) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn ít nhất 3 điểm cho khu vực",
        variant: "destructive",
      });
      return;
    }

    const fullCoords = subAreaPoints.map((p) => ({ lat: p.lat, lng: p.lng }));

    const regionIdForSub = editingSubArea.regionId ?? resolveRegionId() ?? 0;

    const updatedSub = {
      ...editingSubArea,
      regionId: regionIdForSub,
      coordinates: fullCoords,
    } as SubArea;

    const currentSubs = formData.subAreas || [];
    const index = currentSubs.findIndex((s) => s.id === updatedSub.id);

    let newSubs;
    if (index >= 0) {
      newSubs = [...currentSubs];
      newSubs[index] = updatedSub;
    } else {
      newSubs = [...currentSubs, updatedSub];
    }

    setFormData({ ...formData, subAreas: newSubs });
    setEditingSubArea(null);
  };

  const removeSubArea = (id: string) => {
    setFormData({
      ...formData,
      subAreas: (formData.subAreas || []).filter((s) => s.id !== id),
    });
  };

  // --- Render Steps ---
  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Mã, tên, địa chỉ vùng",
      isValid: !!formData.code && !!formData.name,
      content: (
        <Card>
          <CardHeader>
            <CardTitle>Thông tin cơ bản</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>
                  Mã vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.code || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  placeholder="VD: REG-001"
                />
              </div>
              <div className="space-y-2">
                <Label>
                  Tên vùng <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Tên vùng trồng"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-3">
                <Label className="text-sm font-medium">
                  Doanh nghiệp (Enterprise){" "}
                  <span className="text-red-500">*</span>
                </Label>
                <EnterpriseSelector
                  selectedId={formData.enterpriseId || ""}
                  onSelect={(v) => {
                    const selectedEnt = enterprises.find(
                      (e) => e.id.toString() === v,
                    );
                    if (selectedEnt) {
                      const normalize = (s: string) =>
                        s
                          .toLowerCase()
                          .replace(/^(tỉnh|thành phố|tp\.)\s+/i, "")
                          .trim();

                      const province = PROVINCES.find(
                        (p) =>
                          normalize(p.name) ===
                          normalize(selectedEnt.province || ""),
                      );
                      const district = province?.districts.find(
                        (d) =>
                          normalize(d.name) ===
                          normalize(selectedEnt.district || ""),
                      );

                      setFormData({
                        ...formData,
                        enterpriseId: v,
                        provinceId: province?.code || formData.provinceId,
                        districtId: district?.code || formData.districtId,
                        address: selectedEnt.address || formData.address,
                      });
                    } else {
                      setFormData({ ...formData, enterpriseId: v });
                    }
                  }}
                />
              </div>
              <div className="space-y-3">
                <Label className="text-sm font-medium">Diện tích (ha)</Label>
                <Input
                  type="number"
                  className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
                  value={formData.area || ""}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      area: parseFloat(e.target.value),
                    })
                  }
                  placeholder="Nhập diện tích"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tỉnh / Thành Phố</Label>
                <Select
                  value={formData.provinceId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, provinceId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh / Thành Phố" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.map((p) => (
                      <SelectItem key={p.code} value={p.code}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Phường/Xã</Label>
                <Select
                  value={formData.districtId}
                  onValueChange={(v) =>
                    setFormData({ ...formData, districtId: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường / Xã" />
                  </SelectTrigger>
                  <SelectContent>
                    {PROVINCES.find(
                      (p) => p.code === formData.provinceId,
                    )?.districts.map((d) => (
                      <SelectItem key={d.code} value={d.code}>
                        {d.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Địa chỉ chi tiết</Label>
              <Input
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại đất</Label>
                <Select
                  value={formData.landType}
                  onValueChange={(v) =>
                    setFormData({ ...formData, landType: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại đất" />
                  </SelectTrigger>
                  <SelectContent>
                    {lands.map((l) => (
                      <SelectItem key={l.id} value={l.id.toString()}>
                        {l.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Địa hình</Label>
                <Select
                  value={formData.terrain}
                  onValueChange={(v) =>
                    setFormData({ ...formData, terrain: v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn địa hình" />
                  </SelectTrigger>
                  <SelectContent>
                    {terrains.map((t) => (
                      <SelectItem key={t.id} value={t.id.toString()}>
                        {t.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Ghi chú</Label>
              <Textarea
                value={formData.note || ""}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ),
    },
    {
      id: "map",
      title: "Bản đồ vùng trồng",
      description: "Xác định vị trí trên bản đồ",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Bản đồ vị trí</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden flex gap-4">
            <div className="flex-1 h-full rounded-lg border overflow-hidden relative z-0">
              <MapContainer
                center={[
                  getBoundsFromPoints(regionPoints).getCenter().lat,
                  getBoundsFromPoints(regionPoints).getCenter().lng,
                ]}
                zoom={14}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onClick={handleMapClick} />

                <Polygon
                  positions={regionPoints}
                  pathOptions={{ color: "blue", fillOpacity: 0.1 }}
                />

                {regionPoints.map((point, idx) => (
                  <Marker
                    key={`point-${idx}`}
                    position={point}
                    draggable={true}
                    icon={customIcon}
                    eventHandlers={{
                      drag: (e) => {
                        handlePointDrag(idx, e.target.getLatLng());
                      },
                    }}
                  />
                ))}
              </MapContainer>
            </div>

            <div className="w-[300px] flex flex-col h-full bg-slate-50 border rounded-lg overflow-hidden">
              <div className="p-3 border-b bg-white">
                <h4 className="font-semibold text-sm">Danh sách toạ độ</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Kéo thả điểm trên bản đồ hoặc click để thêm điểm mới.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {regionPoints.map((p, i) => (
                  <div
                    key={i}
                    className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                  >
                    <div className="absolute top-2 right-2 flex gap-1">
                      {regionPoints.length > 3 && (
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
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo khu vực con",
      content: (
        <Card className="h-[750px] flex flex-col">
          <CardHeader>
            <CardTitle>Phân chia khu vực con</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-4 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
              <div className="lg:col-span-3 h-full rounded-lg border overflow-hidden relative">
                <MapContainer
                  center={[
                    getBoundsFromPoints(regionPoints).getCenter().lat,
                    getBoundsFromPoints(regionPoints).getCenter().lng,
                  ]}
                  zoom={14}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Main Region Boundary (Dynamic Polygon) */}
                  <Polygon
                    positions={regionPoints}
                    pathOptions={{
                      color: "blue",
                      fill: false,
                      dashArray: "5, 5",
                    }}
                  />

                  {/* Existing Sub Areas (Static) */}
                  {formData.subAreas?.map((sub) => {
                    // Don't show the one currently being edited as a static poly
                    if (editingSubArea && sub.id === editingSubArea.id)
                      return null;

                    if (!sub.coordinates || sub.coordinates.length < 3)
                      return null;

                    const positions = sub.coordinates.map((c) =>
                      L.latLng(c.lat, c.lng),
                    );

                    return (
                      <Polygon
                        key={sub.id}
                        positions={positions}
                        pathOptions={{ color: "green", weight: 2 }}
                        eventHandlers={{
                          click: () => {
                            setEditingSubArea(sub);
                            if (
                              sub.coordinates &&
                              sub.coordinates.length >= 3
                            ) {
                              setSubAreaPoints(
                                sub.coordinates.map((c) =>
                                  L.latLng(c.lat, c.lng),
                                ),
                              );
                            }
                          },
                        }}
                      />
                    );
                  })}

                  {/* Editing Sub Area (Dynamic) */}
                  {editingSubArea && (
                    <>
                      <Polygon
                        positions={subAreaPoints}
                        pathOptions={{
                          color: "#22c55e",
                          weight: 2,
                          fillOpacity: 0.2,
                        }}
                      />
                      {subAreaPoints.map((point, idx) => {
                        const isActive = activeSubAreaPointIndex === idx;
                        const isInvalid = !!subAreaPointWarnings[idx];
                        const markerIcon = isInvalid
                          ? invalidIcon
                          : isActive
                            ? activeIcon
                            : customIcon;
                        return (
                          <Marker
                            key={`sub-point-${idx}`}
                            position={point}
                            draggable={true}
                            icon={markerIcon}
                            eventHandlers={{
                              click: () => {
                                setActiveSubAreaPointIndex(idx);
                                setSubAreaPointWithValidation(idx, point, {
                                  persist: true,
                                  preview: false,
                                });
                              },
                              dragstart: (e) => {
                                setActiveSubAreaPointIndex(idx);
                                setIsDraggingSubAreaPoint(true);
                                handleSubAreaPointDrag(
                                  idx,
                                  e.target.getLatLng(),
                                  {
                                    finalize: false,
                                  },
                                );
                              },
                              drag: (e) =>
                                handleSubAreaPointDrag(
                                  idx,
                                  e.target.getLatLng(),
                                  {
                                    finalize: false,
                                  },
                                ),
                              dragend: (e) => {
                                setIsDraggingSubAreaPoint(false);
                                handleSubAreaPointDrag(
                                  idx,
                                  e.target.getLatLng(),
                                  {
                                    finalize: true,
                                  },
                                );
                              },
                            }}
                          >
                            <Tooltip sticky direction="top" className="z-1000">
                              Điểm {idx + 1}
                            </Tooltip>
                          </Marker>
                        );
                      })}
                      {subAreaWarningForDisplay && (
                        <Polyline
                          positions={[
                            subAreaWarningForDisplay.invalidLatLng,
                            subAreaWarningForDisplay.suggestedLatLng,
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
                </MapContainer>
                {activePersistentSubAreaWarning &&
                  editingSubArea &&
                  !isDraggingSubAreaPoint && (
                    <div className="pointer-events-none absolute inset-x-0 top-4 z-1000 flex justify-center">
                      <div className="pointer-events-auto w-[320px] rounded-lg border border-red-200 bg-white/95 p-4 text-xs shadow-lg">
                        <p className="text-sm font-semibold text-red-600">
                          Vị trí{" "}
                          <span className="font-bold border rounded-md border-red-200 p-0.5">
                            điểm {activePersistentSubAreaWarning.index + 1}
                          </span>{" "}
                          không hợp lệ
                        </p>
                        <p className="mt-2 text-xs text-muted-foreground">
                          Toạ độ hiện tại:{" "}
                          <span className="font-medium text-gray-900">
                            {formatLatLng(
                              activePersistentSubAreaWarning.invalidLatLng,
                            )}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Gợi ý hợp lệ:{" "}
                          <span className="font-medium text-gray-900">
                            {formatLatLng(
                              activePersistentSubAreaWarning.suggestedLatLng,
                            )}
                          </span>
                        </p>
                        <Button
                          size="sm"
                          className="mt-3 w-full"
                          onClick={applySuggestedSubAreaPoint}
                        >
                          Áp dụng toạ độ hợp lệ
                        </Button>
                      </div>
                    </div>
                  )}
              </div>

              <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
                {editingSubArea ? (
                  // EDIT MODE
                  <div className="flex flex-col h-full gap-4 overflow-y-auto pr-2">
                    <div className="flex items-center justify-between border-b pb-2">
                      <h4 className="font-semibold">
                        {editingSubArea.id?.startsWith("sub-")
                          ? "Thêm khu vực mới"
                          : "Chỉnh sửa khu vực"}
                      </h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSubArea(null)}
                      >
                        Hủy
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label>Tên khu vực</Label>
                        <Input
                          value={editingSubArea.name || ""}
                          onChange={(e) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1">
                        <Label>Diện tích (ha)</Label>
                        <Input
                          type="number"
                          value={editingSubArea.area || ""}
                          onChange={(e) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              area: parseFloat(e.target.value),
                            })
                          }
                        />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label>Loại đất</Label>
                        <Select
                          value={editingSubArea.landType || formData.landType}
                          onValueChange={(v) =>
                            setEditingSubArea({
                              ...editingSubArea,
                              landType: v,
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại đất" />
                          </SelectTrigger>
                          <SelectContent>
                            {lands.map((l) => (
                              <SelectItem key={l.id} value={l.id.toString()}>
                                {l.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* MANUAL COORDINATES INPUTS */}
                    <div className="w-full flex flex-col bg-slate-50 border rounded-lg overflow-hidden mt-2">
                      <div className="p-3 border-b bg-white">
                        <h4 className="font-semibold text-sm">
                          Danh sách toạ độ
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          Chọn marker để đổi màu xanh rồi kéo thả hoặc dùng nút
                          Thêm điểm. Nếu ra khỏi vùng hoặc chồng lên khu vực
                          khác điểm sẽ đổi đỏ và hiển thị gợi ý hợp lệ.
                        </p>
                      </div>
                      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
                        {subAreaPoints.map((p, i) => (
                          <div
                            key={i}
                            className="flex flex-col gap-2 p-2 bg-white rounded border text-xs relative"
                          >
                            <div className="absolute top-2 right-2 flex gap-1">
                              {subAreaPoints.length > 3 && (
                                <button
                                  onClick={() => removeSubAreaPoint(i)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                            <span className="font-semibold">Điểm {i + 1}</span>
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
                                    handleSubAreaPointInputChange(
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
                                    handleSubAreaPointInputChange(
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
                          onClick={handleAddSubAreaPoint}
                        >
                          <Plus className="w-4 h-4 mr-2" /> Thêm điểm
                        </Button>
                      </div>
                    </div>

                    {/* Actions */}
                    <Button className="w-full mt-4" onClick={saveSubArea}>
                      Lưu và Đóng
                    </Button>
                  </div>
                ) : (
                  // LIST MODE
                  <div className="flex flex-col h-full bg-slate-50 border rounded-lg">
                    <div className="flex items-center justify-between p-3 border-b bg-white">
                      <h4 className="font-semibold text-sm">
                        Danh sách khu vực
                      </h4>
                      <Button size="sm" onClick={addSubArea}>
                        <Plus className="w-4 h-4 mr-2" />
                        Thêm khu vực
                      </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-3">
                      {!formData.subAreas || formData.subAreas.length === 0 ? (
                        <div className="text-center text-muted-foreground py-8">
                          Chưa có khu vực con nào được tạo.
                        </div>
                      ) : (
                        formData.subAreas.map((sub) => (
                          <div
                            key={sub.id}
                            className="bg-white p-3 rounded-lg border shadow-sm group hover:border-blue-300 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h5 className="font-medium text-sm text-blue-700">
                                  {sub.name}
                                </h5>
                                <div className="text-xs text-muted-foreground mt-1">
                                  {sub.area} ha •{" "}
                                  {
                                    lands.find(
                                      (l) => l.id.toString() === sub.landType,
                                    )?.name
                                  }
                                </div>
                              </div>
                              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7"
                                  onClick={() => {
                                    setEditingSubArea(sub);
                                    if (
                                      sub.coordinates &&
                                      sub.coordinates.length >= 3
                                    ) {
                                      setSubAreaPoints(
                                        sub.coordinates.map((c) =>
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
                                  onClick={() => removeSubArea(sub.id)}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                              <div className="bg-slate-50 p-1 rounded">
                                {sub.coordinates?.length || 0} điểm toạ độ
                              </div>
                              {sub.coordinates &&
                                sub.coordinates.length > 0 && (
                                  <div className="bg-slate-50 p-1 rounded truncate">
                                    {sub.coordinates[0].lat.toFixed(4)},{" "}
                                    {sub.coordinates[0].lng.toFixed(4)}
                                  </div>
                                )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                </div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Thông tin chung
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Đơn vị sở hữu</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {enterprises.find((e) => String(e.id) === String(formData.enterpriseId))?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Mã vùng</p>
                  <p className="text-sm font-semibold text-slate-700 font-mono">
                    {formData.code || <span className="text-slate-300 italic">Chưa nhập</span>}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Tên vùng</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {formData.name || <span className="text-slate-300 italic">Chưa nhập</span>}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Diện tích</p>
                  <p className="text-sm font-bold text-blue-600">
                    {formData.area ? `${formData.area} ha` : <span className="text-slate-300 italic">Chưa nhập</span>}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Tỉnh / Thành phố</p>
                  <p className="text-sm text-slate-700">
                    {PROVINCES.find((p) => p.code === formData.provinceId)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Phường / Xã</p>
                  <p className="text-sm text-slate-700">
                    {PROVINCES.find((p) => p.code === formData.provinceId)
                      ?.districts.find((d) => d.code === formData.districtId)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                <div className="space-y-0.5 md:col-span-2">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Địa chỉ chi tiết</p>
                  <p className="text-sm text-slate-700">
                    {formData.address || <span className="text-slate-300 italic">Chưa nhập</span>}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Loại đất</p>
                  <p className="text-sm text-slate-700">
                    {lands.find((l) => l.code === formData.landType)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                <div className="space-y-0.5">
                  <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Địa hình</p>
                  <p className="text-sm text-slate-700">
                    {terrains.find((t) => t.code === formData.terrain)?.name || (
                      <span className="text-slate-300 italic">Chưa chọn</span>
                    )}
                  </p>
                </div>

                {formData.note && (
                  <div className="space-y-0.5 md:col-span-3">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-slate-400">Ghi chú</p>
                    <p className="text-sm text-slate-600 italic">{formData.note}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Bước 2: Bản đồ */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-emerald-50/70 border-b border-emerald-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Bản đồ vùng trồng
                  </CardTitle>
                </div>
                {regionPoints.length >= 3 && (
                  <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                    {regionPoints.length} điểm ranh giới
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {regionPoints.length >= 3 ? (
                <div className="h-[300px] w-full relative overflow-hidden">
                  <MapContainer
                    bounds={getBoundsFromPoints(regionPoints).pad(0.15)}
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
                    {/* Region polygon */}
                    <Polygon
                      positions={regionPoints.map((p) => [p.lat, p.lng] as [number, number])}
                      pathOptions={{
                        color: "#10b981",
                        fillColor: "#10b981",
                        fillOpacity: 0.15,
                        weight: 2.5,
                        dashArray: "6 4",
                      }}
                    />
                    {/* Sub-area polygons */}
                    {formData.subAreas
                      ?.filter((sub) => sub.coordinates && sub.coordinates.length >= 3)
                      .map((sub, idx) => (
                        <Polygon
                          key={sub.id || idx}
                          positions={sub.coordinates!.map(
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
                            {sub.name || `Khu ${idx + 1}`}
                          </Tooltip>
                        </Polygon>
                      ))}
                  </MapContainer>
                  {/* Legend */}
                  <div className="absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-md border border-slate-100 text-[11px] font-semibold pointer-events-none">
                    <div className="flex items-center gap-1.5">
                      <svg width="16" height="8">
                        <line x1="0" y1="4" x2="16" y2="4" stroke="#10b981" strokeWidth="2" strokeDasharray="4 3" />
                      </svg>
                      <span className="text-slate-600">Ranh giới vùng trồng</span>
                    </div>
                    {(formData.subAreas?.filter(
                      (sub) => sub.coordinates && sub.coordinates.length >= 3,
                    ).length ?? 0) > 0 && (
                      <div className="flex items-center gap-1.5">
                        <span className="w-4 h-3 bg-amber-400/30 border border-amber-400 rounded-sm inline-block" />
                        <span className="text-slate-600">Khu vực con</span>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center bg-slate-50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-slate-200"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>
                  <p className="text-sm font-semibold text-amber-600">Chưa xác định ranh giới</p>
                  <p className="text-xs text-slate-400 mt-0.5">Quay lại bước 2 để vẽ vùng trồng trên bản đồ</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Bước 3: Khu vực con */}
          <Card className="overflow-hidden border-none shadow-sm">
            <CardHeader className="bg-amber-50/70 border-b border-amber-100 py-3 px-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-800">
                    Phân chia khu vực con
                  </CardTitle>
                </div>
                <span className="text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                  {formData.subAreas?.length || 0} khu vực
                </span>
              </div>
            </CardHeader>
            <CardContent className="py-5 px-5">
              {formData.subAreas && formData.subAreas.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {formData.subAreas.map((sub, idx) => (
                    <div
                      key={sub.id || idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-[11px] font-extrabold w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{sub.name || `Khu ${idx + 1}`}</p>
                          {sub.plots && sub.plots.length > 0 && (
                            <p className="text-[11px] text-slate-400">{sub.plots.length} lô</p>
                          )}
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-white border border-slate-100 px-2 py-0.5 rounded-lg">
                        {sub.area ?? 0} ha
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mb-2 text-slate-200"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
                  <p className="text-sm italic text-slate-400">Chưa có khu vực con nào được tạo</p>
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
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng trồng"
          : "Tạo vùng trồng mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/region-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto pb-10">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => setLocation("/region-distribution")}
          completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
        />
      </div>
    </AdminLayout>
  );
};

export default RegionCreatePage;
