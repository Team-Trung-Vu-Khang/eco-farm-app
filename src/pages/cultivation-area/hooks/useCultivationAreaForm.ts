import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import L from "leaflet";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import kinks from "@turf/kinks";
import { point, polygon } from "@turf/helpers";
import useCultivationAreaStore from "../../../stores/useCultivationAreaStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useRegionStore from "../../../stores/useRegionStore";
import useSeedStore from "../../../stores/useSeedStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import {
  CULTIVATION_AREA_CONFIG_KEY,
  DEFAULT_MAP_CENTER,
  EMPTY_CULTIVATION_AREA_CONFIG,
} from "../data/constants";
import type {
  CropVariety,
  CultivationAreaConfig,
  CultivationAreaFormMode,
  CultivationAreaPointWarning,
  Region,
  SubArea,
} from "../types/types";

const getBoundsFromPoints = (points: L.LatLng[]) => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};

const toTurfPolygonFromCoords = (coords: { lat: number; lng: number }[]) => {
  if (coords.length < 3) return null;
  const lngLat = coords.map((coordinate) => [coordinate.lng, coordinate.lat]);
  return polygon([[...lngLat, lngLat[0]]]);
};

const getNearestPointOnPolygonBoundary = (
  polygonFeature: ReturnType<typeof toTurfPolygonFromCoords>,
  latlng: L.LatLng,
) => {
  if (!polygonFeature) return null;

  const lineFeature = polygonToLine(polygonFeature);
  const line =
    "features" in lineFeature ? lineFeature.features[0] : lineFeature;

  if (!line) return null;

  const snappedPoint = nearestPointOnLine(line, point([latlng.lng, latlng.lat]));
  return L.latLng(
    snappedPoint.geometry.coordinates[1],
    snappedPoint.geometry.coordinates[0],
  );
};

const getInitialConfigRecord = (
  config?: Record<string, CultivationAreaConfig>,
) => ({
  [CULTIVATION_AREA_CONFIG_KEY]:
    config?.[CULTIVATION_AREA_CONFIG_KEY] || EMPTY_CULTIVATION_AREA_CONFIG,
});

export const useCultivationAreaForm = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/cultivation-area/:id/edit");

  const isEdit = Boolean(params?.id);
  const mode: CultivationAreaFormMode = isEdit ? "edit" : "create";

  const { cultivationAreas, addCultivationArea, updateCultivationArea } =
    useCultivationAreaStore();
  const { regions, upsertSubArea, removeSubArea } = useRegionStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const existingArea = useMemo(
    () => cultivationAreas.find((item) => item.id === params?.id),
    [cultivationAreas, params?.id],
  );

  const initialRegion =
    regions.find((region) => region.id.toString() === existingArea?.regionId) ||
    null;
  const initialArea =
    initialRegion?.subAreas.find(
      (area) => area.id.toString() === (existingArea?.areaId || "").toString(),
    ) || null;
  const initialAreaPoints = initialArea?.coordinates?.length
    ? initialArea.coordinates.map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
      )
    : [];
  const initialMapCenter = initialAreaPoints.length
    ? getBoundsFromPoints(initialAreaPoints).getCenter()
    : initialRegion?.coordinates?.length
      ? getBoundsFromPoints(
          initialRegion.coordinates.map((coordinate) =>
            L.latLng(coordinate.lat, coordinate.lng),
          ),
        ).getCenter()
      : DEFAULT_MAP_CENTER;

  const [areaSelectorOpen, setAreaSelectorOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] = useState<CropVariety | null>(
    null,
  );

  const [name, setName] = useState(existingArea?.name || "");
  const [note, setNote] = useState(existingArea?.note || "");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(
    existingArea?.enterpriseId || "",
  );
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(
    initialRegion,
  );
  const [selectedArea, setSelectedArea] = useState<SubArea | null>(initialArea);
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    existingArea?.certificateIds || [],
  );
  const [selectedManagerId, setSelectedManagerId] = useState(
    existingArea?.managerId || "",
  );
  const [cropSearchTerm, setCropSearchTerm] = useState("");

  const [areaPoints, setAreaPoints] = useState<L.LatLng[]>(initialAreaPoints);
  const [mapCenter, setMapCenter] = useState<L.LatLng>(initialMapCenter);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [pointWarnings, setPointWarnings] = useState<
    Record<number, CultivationAreaPointWarning>
  >({});
  const [activeDragWarning, setActiveDragWarning] =
    useState<CultivationAreaPointWarning | null>(null);

  const [configs, setConfigs] = useState<Record<string, CultivationAreaConfig>>(
    getInitialConfigRecord(existingArea?.configs),
  );

  const effectiveConfig =
    configs[CULTIVATION_AREA_CONFIG_KEY] || EMPTY_CULTIVATION_AREA_CONFIG;

  const availableCrops = useMemo(() => {
    if (!effectiveConfig.farmingMethodId) return [];

    let items = varieties.filter((variety) => variety.status === "active");
    if (cropSearchTerm) {
      const keyword = cropSearchTerm.toLowerCase();
      items = items.filter(
        (variety) =>
          variety.varietyName.toLowerCase().includes(keyword) ||
          variety.crop.toLowerCase().includes(keyword),
      );
    }
    return items;
  }, [cropSearchTerm, effectiveConfig.farmingMethodId, varieties]);

  const effectiveRegion = useMemo(() => {
    if (!selectedRegion) return null;
    return regions.find((region) => region.id === selectedRegion.id) || selectedRegion;
  }, [regions, selectedRegion]);

  const regionPolygonFeature = useMemo(
    () =>
      selectedRegion?.coordinates?.length
        ? toTurfPolygonFromCoords(selectedRegion.coordinates)
        : null,
    [selectedRegion],
  );

  const blockingAreaPolygons = useMemo(
    () =>
      (selectedRegion?.subAreas || [])
        .filter(
          (area) =>
            area.coordinates?.length >= 3 &&
            area.id.toString() !== selectedArea?.id?.toString(),
        )
        .map((area) => ({
          id: area.id,
          polygon: toTurfPolygonFromCoords(area.coordinates),
        }))
        .filter((item) => item.polygon !== null),
    [selectedArea?.id, selectedRegion],
  );

  const validatePoint = (latlng: L.LatLng, index: number) => {
    const targetPoint = point([latlng.lng, latlng.lat]);

    if (regionPolygonFeature && !booleanPointInPolygon(targetPoint, regionPolygonFeature)) {
      return {
        type: "outside" as const,
        label: "Ngoài Vùng trồng",
        suggested: getNearestPointOnPolygonBoundary(regionPolygonFeature, latlng),
      };
    }

    for (const area of blockingAreaPolygons) {
      if (area.polygon && booleanPointInPolygon(targetPoint, area.polygon)) {
        return {
          type: "overlap" as const,
          label: "Trùng lặp với khu vực khác",
          suggested: getNearestPointOnPolygonBoundary(area.polygon, latlng),
        };
      }
    }

    const tempCoordinates = areaPoints.map((pointItem, pointIndex) =>
      pointIndex === index
        ? { lat: latlng.lat, lng: latlng.lng }
        : { lat: pointItem.lat, lng: pointItem.lng },
    );
    const polygonFeature = toTurfPolygonFromCoords(tempCoordinates);

    if (polygonFeature && kinks(polygonFeature).features.length > 0) {
      return {
        type: "intersect" as const,
        label: "Lỗi tự cắt (Self-intersection)",
        suggested: null,
      };
    }

    return null;
  };

  const handlePointDrag = (
    index: number,
    latlng: L.LatLng,
    finalize = false,
  ) => {
    setAreaPoints((previous) => {
      const next = [...previous];
      next[index] = latlng;
      return next;
    });

    const violation = validatePoint(latlng, index);
    if (finalize) {
      if (violation) {
        setPointWarnings((previous) => ({
          ...previous,
          [index]: { ...violation, index },
        }));
      } else {
        setPointWarnings((previous) => {
          const next = { ...previous };
          delete next[index];
          return next;
        });
      }
      setActiveDragWarning(null);
    } else {
      setActiveDragWarning(violation ? { ...violation, index } : null);
    }

    setActivePointIndex(index);
  };

  const handleAreaSelect = (region: Region, area: SubArea) => {
    setSelectedRegion(region);
    setSelectedArea(area);
    if (!name) setName(area.name);

    if (area.coordinates?.length) {
      const points = area.coordinates.map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
      );
      setAreaPoints(points);
      setMapCenter(points[0]);
      return;
    }

    if (region.coordinates?.length) {
      const center = getBoundsFromPoints(
        region.coordinates.map((coordinate) =>
          L.latLng(coordinate.lat, coordinate.lng),
        ),
      ).getCenter();
      setMapCenter(center);
      setAreaPoints([
        L.latLng(center.lat - 0.005, center.lng - 0.005),
        L.latLng(center.lat + 0.005, center.lng),
        L.latLng(center.lat - 0.005, center.lng + 0.005),
      ]);
    }
  };

  const setConfigField = (
    field: keyof CultivationAreaConfig,
    value: CultivationAreaConfig[keyof CultivationAreaConfig],
  ) =>
    setConfigs((previous) => ({
      ...previous,
      [CULTIVATION_AREA_CONFIG_KEY]: {
        ...effectiveConfig,
        [field]: value,
      },
    }));

  const toggleCertificate = (id: string) =>
    setSelectedCertIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );

  const toggleCrop = (crop: CropVariety) => {
    const currentCrops = effectiveConfig.selectedCrops || [];

    if (currentCrops.includes(crop.id)) {
      const nextSeedSelections = { ...(effectiveConfig.seedSelections || {}) };
      delete nextSeedSelections[crop.id];

      setConfigs((previous) => ({
        ...previous,
        [CULTIVATION_AREA_CONFIG_KEY]: {
          ...effectiveConfig,
          selectedCrops: currentCrops.filter((item) => item !== crop.id),
          seedSelections: nextSeedSelections,
        },
      }));
      return;
    }

    setActiveSeedVariety(crop);
    setSeedDialogOpen(true);
  };

  const handleSeedSelection = (seedIds: string[]) => {
    if (!activeSeedVariety) return;

    const currentCrops = effectiveConfig.selectedCrops || [];
    const nextCrops = currentCrops.includes(activeSeedVariety.id)
      ? currentCrops
      : [...currentCrops, activeSeedVariety.id];

    setConfigs((previous) => ({
      ...previous,
      [CULTIVATION_AREA_CONFIG_KEY]: {
        ...effectiveConfig,
        selectedCrops: nextCrops,
        seedSelections: {
          ...(effectiveConfig.seedSelections || {}),
          [activeSeedVariety.id]: seedIds,
        },
      },
    }));
  };

  const goBack = () => setLocation("/cultivation-area");

  const handleComplete = () => {
    if (!selectedRegion) return;

    const payload = {
      name,
      regionId: selectedRegion.id.toString(),
      regionName: selectedRegion.name,
      areaId: selectedArea?.id,
      areaName: selectedArea?.name,
      enterpriseId: selectedEnterpriseId,
      certificateIds: selectedCertIds,
      managerId: selectedManagerId,
      note,
      farmingMethodId: effectiveConfig.farmingMethodId || "",
      irrigationMethodId: effectiveConfig.irrigationMethodId || "",
      selectedCrops: effectiveConfig.selectedCrops || [],
      seedSelections: effectiveConfig.seedSelections || {},
      configs,
    };

    if (isEdit && existingArea) {
      updateCultivationArea(existingArea.id, payload);
    } else {
      addCultivationArea(payload);
    }

    const finalAreaId =
      selectedArea?.id ||
      existingArea?.areaId ||
      `sub-${selectedRegion.id}-${Date.now()}`;
    const finalAreaCode =
      selectedArea?.code || `AREA-${Date.now().toString().slice(-4)}`;

    if (
      isEdit &&
      existingArea?.areaId &&
      existingArea.areaId.toString() !== finalAreaId.toString()
    ) {
      removeSubArea(existingArea.areaId);
    }

    upsertSubArea(selectedRegion.id, {
      id: finalAreaId,
      name,
      code: finalAreaCode,
      area: selectedArea?.area || 0,
      landType: selectedArea?.landType || selectedRegion.landType,
      terrain: selectedArea?.terrain || selectedRegion.terrain,
      plots: selectedArea?.plots || [],
      coordinates: areaPoints.map((pointItem) => ({
        lat: pointItem.lat,
        lng: pointItem.lng,
      })),
      status: "active",
      createdAt: selectedArea?.createdAt,
    });

    setLocation("/cultivation-area");
  };

  return {
    mode,
    isEdit,
    farmingMethods,
    irrigationSystems,
    seeds,
    regions,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    selectedRegion,
    setSelectedRegion,
    selectedArea,
    selectedCertIds,
    selectedManagerId,
    setSelectedManagerId,
    cropSearchTerm,
    setCropSearchTerm,
    areaPoints,
    setAreaPoints,
    mapCenter,
    setMapCenter,
    activePointIndex,
    setActivePointIndex,
    pointWarnings,
    activeDragWarning,
    configs,
    effectiveConfig,
    availableCrops,
    effectiveRegion,
    areaSelectorOpen,
    setAreaSelectorOpen,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    setActiveSeedVariety,
    handlePointDrag,
    handleAreaSelect,
    setConfigField,
    toggleCertificate,
    toggleCrop,
    handleSeedSelection,
    goBack,
    handleComplete,
  };
};
