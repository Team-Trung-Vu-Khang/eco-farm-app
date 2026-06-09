import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  useToast,
  StepperForm,
  type Step,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point, polygon } from "@turf/helpers";
import { ChevronLeft } from "lucide-react";

import { type Region, type SubArea } from "../constants";
import useRegionStore from "../../../stores/useRegionStore";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";
import useLandStore from "../../../stores/useLandStore";
import useTerrainStore from "../../../stores/useTerrainStore";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { RegionInfoStep } from "./components/RegionInfoStep";
import { RegionMapEditor } from "./components/RegionMapEditor";
import { RegionReviewStep } from "./components/RegionReviewStep";
import { RegionSubAreaStep } from "./components/RegionSubAreaStep";
import {
  getBoundsFromPoints,
  getNearestPointOnPolygonBoundary,
  toTurfPolygonFromCoords,
  type PointWarning,
} from "./utils";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

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

  const { regions, addRegion, updateRegion, getRegionById } = useRegionStore();
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

  const generateNextRegionCode = useCallback(() => {
    const maxCodeNumber = (Array.isArray(regions) ? regions : []).reduce(
      (max, region) => {
        const match = /^REG-(\d+)$/i.exec(region.code || "");
        if (!match) return max;
        const current = Number(match[1]);
        return Number.isNaN(current) ? max : Math.max(max, current);
      },
      0,
    );

    return `REG-${String(maxCodeNumber + 1).padStart(3, "0")}`;
  }, [regions]);

  const generateNextSubAreaCode = useCallback(() => {
    const allSubAreaCodes = [
      ...(regions || []).flatMap((region) =>
        (region.subAreas || []).map((sub) => sub.code),
      ),
      ...((formData.subAreas as SubArea[] | undefined) || []).map(
        (sub) => sub.code,
      ),
    ]
      .map((code) => String(code || "").trim())
      .filter(Boolean);

    const maxCodeNumber = allSubAreaCodes.reduce((max, code) => {
      const match = /^AREA-(\d+)$/i.exec(code);
      if (!match) return max;
      const current = Number(match[1]);
      return Number.isNaN(current) ? max : Math.max(max, current);
    }, 0);

    return `AREA-${String(maxCodeNumber + 1).padStart(3, "0")}`;
  }, [regions, formData.subAreas]);

  useEffect(() => {
    if (isEditMode) return;

    setFormData((prev) => {
      if ((prev.code || "").trim()) return prev;
      return { ...prev, code: generateNextRegionCode() };
    });
  }, [isEditMode, generateNextRegionCode]);

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
      .filter(
        (
          item,
        ): item is {
          id: string;
          polygon: NonNullable<ReturnType<typeof toTurfPolygonFromCoords>>;
        } => item !== null,
      );
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
      return getNearestPointOnPolygonBoundary(regionPolygonFeature, latlng);
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
        const { [index]: removedWarning, ...rest } = prev;
        void removedWarning;
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
    let overlapPolygon: NonNullable<
      ReturnType<typeof toTurfPolygonFromCoords>
    > | null = null;

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

    const resolvedCode =
      (formData.code || "").trim() || generateNextRegionCode();

    const regionData: Omit<Region, "id"> = {
      code: resolvedCode,
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
      code: generateNextSubAreaCode(),
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
      code:
        (editingSubArea.code || "").toString().trim() ||
        generateNextSubAreaCode(),
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
        <RegionInfoStep
          formData={formData}
          setFormData={setFormData}
          enterprises={enterprises}
          lands={lands}
          terrains={terrains}
        />
      ),
    },
    {
      id: "map",
      title: "Bản đồ vùng trồng",
      description: "Xác định vị trí trên bản đồ",
      content: (
        <RegionMapEditor
          regionPoints={regionPoints}
          defaultPoints={defaultPoints}
          markerIcon={customIcon}
          onMapClick={handleMapClick}
          onPointDrag={handlePointDrag}
          onRemovePoint={removePoint}
          onPointInputChange={handlePointInputChange}
          onAddPoint={handleAddPoint}
        />
      ),
    },
    {
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo khu vực con",
      content: (
        <RegionSubAreaStep
          regionPoints={regionPoints}
          subAreas={(formData.subAreas as SubArea[]) || []}
          editingSubArea={editingSubArea}
          setEditingSubArea={setEditingSubArea}
          subAreaPoints={subAreaPoints}
          activeSubAreaPointIndex={activeSubAreaPointIndex}
          subAreaPointWarnings={subAreaPointWarnings}
          activePersistentSubAreaWarning={activePersistentSubAreaWarning}
          subAreaWarningForDisplay={subAreaWarningForDisplay}
          isDraggingSubAreaPoint={isDraggingSubAreaPoint}
          lands={lands}
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
          onAddSubArea={addSubArea}
          onSaveSubArea={saveSubArea}
          onRemoveSubArea={removeSubArea}
          onLoadSubAreaForEdit={(subArea) => {
            setEditingSubArea(subArea);
            if (subArea.coordinates && subArea.coordinates.length >= 3) {
              setSubAreaPoints(
                subArea.coordinates.map((coordinate) =>
                  L.latLng(coordinate.lat, coordinate.lng),
                ),
              );
            }
          }}
          onSetEditingSubArea={(subArea) => setEditingSubArea(subArea)}
          onRemoveSubAreaPoint={removeSubAreaPoint}
          onSubAreaPointInputChange={handleSubAreaPointInputChange}
          onAddSubAreaPoint={handleAddSubAreaPoint}
          onSubAreaPointSelect={(index, point) => {
            setActiveSubAreaPointIndex(index);
            setSubAreaPointWithValidation(index, point, {
              persist: true,
              preview: false,
            });
          }}
          onSubAreaPointDrag={(index, latlng, options) => {
            setActiveSubAreaPointIndex(index);
            setIsDraggingSubAreaPoint(!(options?.finalize ?? false));
            handleSubAreaPointDrag(index, latlng, options);
          }}
          onApplySuggestedSubAreaPoint={applySuggestedSubAreaPoint}
        />
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <RegionReviewStep
          formData={formData}
          regionPoints={regionPoints}
          enterprises={enterprises}
          lands={lands}
          terrains={terrains}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
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
