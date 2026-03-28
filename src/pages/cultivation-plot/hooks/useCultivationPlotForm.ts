import { useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import L from "leaflet";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import area from "@turf/area";
import kinks from "@turf/kinks";
import { point, polygon } from "@turf/helpers";
import useCultivationPlotStore from "../../../stores/useCultivationPlotStore";
import useFarmingMethodStore from "../../../stores/useFarmingMethodStore";
import useIrrigationSystemStore from "../../../stores/useIrrigationSystemStore";
import useRegionStore from "../../../stores/useRegionStore";
import useSeedStore from "../../../stores/useSeedStore";
import useVarietyStore from "../../../stores/useVarietyStore";
import {
  CULTIVATION_PLOT_CONFIG_KEY,
  DEFAULT_PLOT_MAP_CENTER,
  EMPTY_CULTIVATION_PLOT_CONFIG,
} from "../data/constants";
import type {
  CropVariety,
  CultivationPlotConfig,
  CultivationPlotPointWarning,
  Plot,
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
  const line = "features" in lineFeature ? lineFeature.features[0] : lineFeature;
  if (!line) return null;
  const snappedPoint = nearestPointOnLine(line, point([latlng.lng, latlng.lat]));
  return L.latLng(
    snappedPoint.geometry.coordinates[1],
    snappedPoint.geometry.coordinates[0],
  );
};

const getDefaultTriangle = (center: L.LatLng) => [
  L.latLng(center.lat - 0.001, center.lng - 0.001),
  L.latLng(center.lat + 0.001, center.lng),
  L.latLng(center.lat - 0.001, center.lng + 0.001),
];

export const useCultivationPlotForm = () => {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/cultivation-plot/:id/edit");
  const isEdit = Boolean(params?.id);

  const { cultivationPlots, addCultivationPlot, updateCultivationPlot } =
    useCultivationPlotStore();
  const { regions, removePlot, upsertPlot } = useRegionStore();
  const { varieties } = useVarietyStore();
  const { farmingMethods } = useFarmingMethodStore();
  const { irrigationSystems } = useIrrigationSystemStore();
  const { seeds } = useSeedStore();

  const existingPlotConfig = cultivationPlots.find((item) => item.id === params?.id);
  const initialRegion =
    regions.find((region) => region.id.toString() === existingPlotConfig?.regionId) ||
    null;
  const initialArea =
    initialRegion?.subAreas.find(
      (area) => area.id.toString() === existingPlotConfig?.areaId,
    ) || null;
  const initialPlot =
    initialArea?.plots.find((plot) => plot.id === existingPlotConfig?.plotId) || null;
  const initialPoints = initialPlot?.coordinates?.length
    ? initialPlot.coordinates.map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
      )
    : [];
  const initialMapCenter = initialPoints.length
    ? getBoundsFromPoints(initialPoints).getCenter()
    : initialArea?.coordinates?.length
      ? getBoundsFromPoints(
          initialArea.coordinates.map((coordinate) =>
            L.latLng(coordinate.lat, coordinate.lng),
          ),
        ).getCenter()
      : DEFAULT_PLOT_MAP_CENTER;

  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [seedDialogOpen, setSeedDialogOpen] = useState(false);
  const [activeSeedVariety, setActiveSeedVariety] = useState<CropVariety | null>(
    null,
  );

  const [name, setName] = useState(existingPlotConfig?.name || "");
  const [note, setNote] = useState(existingPlotConfig?.note || "");
  const [selectedEnterpriseId, setSelectedEnterpriseId] = useState(
    existingPlotConfig?.enterpriseId || "",
  );
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(initialRegion);
  const [selectedArea, setSelectedArea] = useState<SubArea | null>(initialArea);
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(initialPlot);
  const [internalRegionId, setInternalRegionId] = useState(
    initialRegion?.id.toString() || "",
  );
  const [selectedCertIds, setSelectedCertIds] = useState<string[]>(
    existingPlotConfig?.certificateIds || [],
  );
  const [selectedManagerId, setSelectedManagerId] = useState(
    existingPlotConfig?.managerId || "",
  );
  const [cropSearchTerm, setCropSearchTerm] = useState("");

  const [plotPoints, setPlotPoints] = useState<L.LatLng[]>(initialPoints);
  const [mapCenter, setMapCenter] = useState<L.LatLng>(initialMapCenter);
  const [activePointIndex, setActivePointIndex] = useState<number | null>(null);
  const [pointWarnings, setPointWarnings] = useState<
    Record<number, CultivationPlotPointWarning>
  >({});
  const [activeDragWarning, setActiveDragWarning] =
    useState<CultivationPlotPointWarning | null>(null);

  const [configs, setConfigs] = useState<Record<string, CultivationPlotConfig>>({
    [CULTIVATION_PLOT_CONFIG_KEY]:
      existingPlotConfig?.configs?.[CULTIVATION_PLOT_CONFIG_KEY] ||
      EMPTY_CULTIVATION_PLOT_CONFIG,
  });

  const effectiveConfig =
    configs[CULTIVATION_PLOT_CONFIG_KEY] || EMPTY_CULTIVATION_PLOT_CONFIG;

  const availableCrops = useMemo(() => {
    if (!effectiveConfig.farmingMethodId) return [];
    let list = varieties.filter((variety) => variety.status === "active");
    if (cropSearchTerm) {
      const keyword = cropSearchTerm.toLowerCase();
      list = list.filter(
        (variety) =>
          variety.varietyName.toLowerCase().includes(keyword) ||
          variety.crop.toLowerCase().includes(keyword),
      );
    }
    return list;
  }, [cropSearchTerm, effectiveConfig.farmingMethodId, varieties]);

  const effectiveArea = useMemo(() => {
    if (!selectedArea) return null;
    for (const region of regions) {
      const matchedArea = (region.subAreas || []).find(
        (area) => area.id === selectedArea.id,
      );
      if (matchedArea) return matchedArea;
    }
    return selectedArea;
  }, [regions, selectedArea]);

  const areaPolygonFeature = useMemo(
    () =>
      selectedArea?.coordinates?.length
        ? toTurfPolygonFromCoords(selectedArea.coordinates)
        : null,
    [selectedArea],
  );

  const blockingPlotPolygons = useMemo(
    () =>
      (effectiveArea?.plots || [])
        .filter(
          (plot) =>
            plot.coordinates?.length >= 3 && plot.id !== selectedPlot?.id,
        )
        .map((plot) => ({
          id: plot.id,
          polygon: toTurfPolygonFromCoords(plot.coordinates),
        }))
        .filter((item) => item.polygon !== null),
    [effectiveArea, selectedPlot?.id],
  );

  const calculatedArea = useMemo(() => {
    if (plotPoints.length < 3) return 0;
    const poly = toTurfPolygonFromCoords(
      plotPoints.map((plotPoint) => ({ lat: plotPoint.lat, lng: plotPoint.lng })),
    );
    if (!poly) return 0;
    return Number((area(poly) / 10000).toFixed(4));
  }, [plotPoints]);

  const validatePoint = (latlng: L.LatLng, index: number) => {
    const targetPoint = point([latlng.lng, latlng.lat]);

    if (areaPolygonFeature && !booleanPointInPolygon(targetPoint, areaPolygonFeature)) {
      return {
        type: "outside" as const,
        label: "Ngoài Khu vực",
        suggested: getNearestPointOnPolygonBoundary(areaPolygonFeature, latlng),
      };
    }

    for (const plotItem of blockingPlotPolygons) {
      if (plotItem.polygon && booleanPointInPolygon(targetPoint, plotItem.polygon)) {
        return {
          type: "overlap" as const,
          label: "Trùng lặp với lô khác",
          suggested: getNearestPointOnPolygonBoundary(plotItem.polygon, latlng),
        };
      }
    }

    const tempCoordinates = plotPoints.map((plotPoint, pointIndex) =>
      pointIndex === index
        ? { lat: latlng.lat, lng: latlng.lng }
        : { lat: plotPoint.lat, lng: plotPoint.lng },
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
    setPlotPoints((previous) => {
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

  const handlePlotSelect = (region: Region, area: SubArea, plot: Plot) => {
    setSelectedRegion(region);
    setSelectedArea(area);
    setSelectedPlot(plot);
    setInternalRegionId(region.id.toString());
    if (!name) setName(plot.name);

    if (plot.coordinates?.length >= 3) {
      const points = plot.coordinates.map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
      );
      setPlotPoints(points);
      setMapCenter(getBoundsFromPoints(points).getCenter());
      return;
    }

    const center = area.coordinates?.length
      ? getBoundsFromPoints(
          area.coordinates.map((coordinate) =>
            L.latLng(coordinate.lat, coordinate.lng),
          ),
        ).getCenter()
      : DEFAULT_PLOT_MAP_CENTER;
    setMapCenter(center);
    setPlotPoints(getDefaultTriangle(center));
  };

  return {
    isEdit,
    farmingMethods,
    irrigationSystems,
    varieties,
    seeds,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    setSelectedEnterpriseId,
    selectedRegion,
    setSelectedRegion,
    selectedArea,
    setSelectedArea,
    selectedPlot,
    internalRegionId,
    setInternalRegionId,
    selectedCertIds,
    selectedManagerId,
    setSelectedManagerId,
    cropSearchTerm,
    setCropSearchTerm,
    plotPoints,
    setPlotPoints,
    mapCenter,
    activePointIndex,
    setActivePointIndex,
    pointWarnings,
    activeDragWarning,
    configs,
    setConfigs,
    effectiveConfig,
    availableCrops,
    effectiveArea,
    calculatedArea,
    areaDialogOpen,
    setAreaDialogOpen,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    setActiveSeedVariety,
    handlePointDrag,
    handlePlotSelect,
    toggleCertificate: (id: string) =>
      setSelectedCertIds((previous) =>
        previous.includes(id)
          ? previous.filter((item) => item !== id)
          : [...previous, id],
      ),
    setConfigField: (
      field: keyof CultivationPlotConfig,
      value: CultivationPlotConfig[keyof CultivationPlotConfig],
    ) =>
      setConfigs((previous) => ({
        ...previous,
        [CULTIVATION_PLOT_CONFIG_KEY]: {
          ...effectiveConfig,
          [field]: value,
        },
      })),
    toggleCrop: (crop: CropVariety) => {
      const current = effectiveConfig.selectedCrops || [];
      if (current.includes(crop.id)) {
        const seedSelections = { ...(effectiveConfig.seedSelections || {}) };
        delete seedSelections[crop.id];
        setConfigs((previous) => ({
          ...previous,
          [CULTIVATION_PLOT_CONFIG_KEY]: {
            ...effectiveConfig,
            selectedCrops: current.filter((item) => item !== crop.id),
            seedSelections,
          },
        }));
        return;
      }
      setActiveSeedVariety(crop);
      setSeedDialogOpen(true);
    },
    handleSeedSelection: (ids: string[]) => {
      if (!activeSeedVariety) return;
      const current = effectiveConfig.selectedCrops || [];
      const nextCrops = current.includes(activeSeedVariety.id)
        ? current
        : [...current, activeSeedVariety.id];
      setConfigs((previous) => ({
        ...previous,
        [CULTIVATION_PLOT_CONFIG_KEY]: {
          ...effectiveConfig,
          selectedCrops: nextCrops,
          seedSelections: {
            ...(effectiveConfig.seedSelections || {}),
            [activeSeedVariety.id]: ids,
          },
        },
      }));
    },
    goBack: () => setLocation("/cultivation-plot"),
    handleComplete: () => {
      if (!selectedRegion || !selectedArea) return;

      const payload = {
        name,
        regionId: selectedRegion.id.toString(),
        regionName: selectedRegion.name,
        areaId: selectedArea.id.toString(),
        areaName: selectedArea.name,
        plotId: selectedPlot?.id,
        plotName: selectedPlot?.name,
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

      if (isEdit && existingPlotConfig) {
        updateCultivationPlot(existingPlotConfig.id, payload);
      } else {
        addCultivationPlot(payload);
      }

      const finalPlotId =
        selectedPlot?.id || existingPlotConfig?.plotId || `plot-${selectedArea.id}-${Date.now()}`;

      if (
        isEdit &&
        existingPlotConfig?.plotId &&
        existingPlotConfig.plotId !== finalPlotId
      ) {
        removePlot(existingPlotConfig.plotId);
      }

      upsertPlot(Number(selectedRegion.id), selectedArea.id, {
        id: finalPlotId,
        name,
        area: calculatedArea,
        coordinates: plotPoints.map((plotPoint) => ({
          lat: plotPoint.lat,
          lng: plotPoint.lng,
        })),
      });

      setLocation("/cultivation-plot");
    },
  };
};
