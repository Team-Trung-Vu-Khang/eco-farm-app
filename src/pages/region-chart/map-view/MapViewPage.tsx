import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { AdminLayout, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MFMap, MFMarker, MFPolygon } from "react-map4d-map";
import type { GeoJsonObject } from "geojson";
import { Maximize2, Minimize2 } from "lucide-react";
import Tree from "@/assets/tree.webp";
import zoneData from "../../../assets/map/zone.json";
import areaData from "../../../assets/map/area.json";
import plotData from "../../../assets/map/plot.json";
import plantData from "../../../assets/map/plant.json";

import type {
  SelectedEntityStats,
  SelectedEntity,
  LayerVisibility,
  SoilData,
} from "./types/types";
import {
  isPointInPolygon,
  getPolygonCenter,
  convertGeoJsonToPath,
} from "./utils/utils";
import { SidebarFilter } from "./components/SidebarFilter";
import { SidebarDetail } from "./components/SidebarDetail";
import { SoilEditDialog } from "./components/SoilEditDialog";
import { MapLegend } from "./components/MapLegend";

const getSafeString = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const isNonEmptyString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0;

const isValidLatLng = (value: unknown) =>
  typeof value === "number" && !Number.isNaN(value) && Number.isFinite(value);

const isValidPointFeature = (feature: any) => {
  const coords = feature?.geometry?.coordinates;
  return (
    feature?.type === "Feature" &&
    feature?.geometry?.type === "Point" &&
    Array.isArray(coords) &&
    coords.length >= 2 &&
    coords[0] != null &&
    coords[1] != null &&
    !Number.isNaN(Number(coords[0])) &&
    !Number.isNaN(Number(coords[1]))
  );
};

const getSafePolygonPath = (geometry: any) => {
  const path = convertGeoJsonToPath(geometry);
  return Array.isArray(path) && path.length > 0 ? path : null;
};

const getSafeFeatureName = (feature: any, fallback: string) => {
  const name = getSafeString(feature?.properties?.name);
  return name || fallback;
};

const getFeatureProperty = (feature: any, key: string) => {
  const value = feature?.properties?.[key];
  if (value == null) return "";
  return String(value).trim();
};

const getAreaToken = (feature: any) => {
  const explicitAreaId = getFeatureProperty(feature, "areaId");
  if (explicitAreaId) return explicitAreaId.toUpperCase();

  const name = getSafeFeatureName(feature, "");
  const match = name.match(/\b([A-Z])\b/u);
  return match?.[1]?.toUpperCase() ?? "";
};

const MAX_VISIBLE_MARKERS = 200;
const PLANT_ZOOM_THRESHOLD = 18;
const VIEWPORT_PADDING = 0.003;

const MAP_LABEL = new Map([
  ["healthy", "Khoẻ mạnh"],
  ["diseased", "Bệnh"],
  ["harvesting", "Đang thu hoạch"],
]);

const MapContent = () => {
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedTree, setSelectedTree] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({
    lat: 11.558,
    lng: 107.134,
  });
  const [mapZoom, setMapZoom] = useState(15);
  const [mapBounds, setMapBounds] = useState<{
    north: number;
    south: number;
    east: number;
    west: number;
  } | null>(null);
  const [visibleLayers, setVisibleLayers] = useState<LayerVisibility>({
    zone: true,
    area: false,
    plot: false,
    plant: false,
  });

  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(
    null,
  );

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [soilData, setSoilData] = useState<Record<string, SoilData>>({});
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [tempSoil, setTempSoil] = useState<SoilData | null>(null);

  const zoneFeatures = useMemo(() => {
    return Array.isArray((zoneData as any)?.features)
      ? (zoneData as any).features
      : [];
  }, []);

  const areaFeatures = useMemo(() => {
    return Array.isArray((areaData as any)?.features)
      ? (areaData as any).features
      : [];
  }, []);

  const plotFeatures = useMemo(() => {
    return Array.isArray((plotData as any)?.features)
      ? (plotData as any).features
      : [];
  }, []);

  useEffect(() => {
    if (Object.keys(soilData).length === 0) {
      const defaultValues = {
        ph: 0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        moisture: 0,
        organicMatter: 0,
        ec: 0,
        temperature: 0,
        compaction: 0,
        lastTested: new Date().toISOString().split("T")[0],
      };

      setSoilData({
        "PLOT-1-1": { ...defaultValues },
        "PLOT-1-2": { ...defaultValues },
      });
    }
  }, [soilData]);

  const handleEditSoil = () => {
    const currentId =
      selectedEntity?.properties?.code || selectedEntity?.properties?.id;

    setTempSoil(
      soilData[currentId] || {
        ph: 0,
        nitrogen: 0,
        phosphorus: 0,
        potassium: 0,
        moisture: 0,
        organicMatter: 0,
        ec: 0,
        temperature: 0,
        compaction: 0,
        lastTested: new Date().toISOString().split("T")[0],
      },
    );
    setIsEditingSoil(true);
  };

  const handleSaveSoil = () => {
    const currentId =
      selectedEntity?.properties?.code || selectedEntity?.properties?.id;

    if (!currentId || !tempSoil) return;

    setSoilData((prev) => ({
      ...prev,
      [currentId]: tempSoil,
    }));
    setIsEditingSoil(false);
  };

  const processedPlantData = useMemo(() => {
    const statuses = ["healthy", "diseased", "harvesting"];

    const features = (plantData?.features ?? [])
      .filter((feature: any) => isValidPointFeature(feature))
      .map((feature: any) => {
        const randomStatus =
          statuses[Math.floor(Math.random() * statuses.length)];

        return {
          ...feature,
          properties: {
            ...(feature?.properties || {}),
            name: getSafeString(feature?.properties?.name),
            code: getSafeString(feature?.properties?.code),
            status: randomStatus,
          },
        };
      });

    return {
      type: "FeatureCollection",
      features,
    } as GeoJsonObject;
  }, []);

  const regionOptions = useMemo(() => {
    return zoneFeatures.map((feature: any, index: number) => {
      const value =
        getFeatureProperty(feature, "id") ||
        getFeatureProperty(feature, "code") ||
        `zone-${index + 1}`;

      return {
        value,
        label:
          getSafeFeatureName(feature, "") ||
          getFeatureProperty(feature, "code") ||
          `Vùng ${index + 1}`,
      };
    });
  }, [zoneFeatures]);

  const areaOptions = useMemo(() => {
    return areaFeatures
      .filter((feature: any) => {
        if (filterRegion === "all") return true;
        return getFeatureProperty(feature, "zoneId") === filterRegion;
      })
      .map((feature: any, index: number) => {
        const value =
          getAreaToken(feature) ||
          getFeatureProperty(feature, "id") ||
          `area-${index + 1}`;

        return {
          value,
          label:
            getSafeFeatureName(feature, "") ||
            getFeatureProperty(feature, "code") ||
            `Khu vực ${index + 1}`,
        };
      });
  }, [areaFeatures, filterRegion]);

  const totalArea = useMemo(() => {
    return Number(
      zoneFeatures
        .reduce((sum: number, feature: any) => {
          const areaValue = Number(feature?.properties?.area ?? 0);
          return sum + (Number.isFinite(areaValue) ? areaValue : 0);
        }, 0)
        .toFixed(1),
    );
  }, [zoneFeatures]);

  const filteredPlantData = useMemo(() => {
    const sourceFeatures = (processedPlantData as any)?.features;

    if (!Array.isArray(sourceFeatures)) {
      return {
        type: "FeatureCollection",
        features: [],
      } as GeoJsonObject;
    }

    const keyword = searchTerm.trim().toLowerCase();

    const features = sourceFeatures.filter((item: any) => {
      const name = getSafeString(item?.properties?.name).toLowerCase();
      const code = getSafeString(item?.properties?.code).toLowerCase();
      const areaToken = getSafeString(item?.properties?.code)
        .charAt(0)
        .toUpperCase();

      const nameMatch =
        keyword.length === 0 ||
        name.includes(keyword) ||
        code.includes(keyword);

      const statusMatch =
        filterStatus === "all" || item?.properties?.status === filterStatus;

      const areaMatch = filterArea === "all" || areaToken === filterArea;

      return nameMatch && statusMatch && areaMatch;
    });

    return {
      type: "FeatureCollection",
      features,
    } as GeoJsonObject;
  }, [processedPlantData, searchTerm, filterStatus, filterArea]);

  const filteredZoneFeatures = useMemo(() => {
    return zoneFeatures.filter((feature: any, index: number) => {
      if (filterRegion === "all") return true;

      return (
        getFeatureProperty(feature, "id") === filterRegion ||
        getFeatureProperty(feature, "code") === filterRegion ||
        `zone-${index + 1}` === filterRegion
      );
    });
  }, [zoneFeatures, filterRegion]);

  const filteredAreaFeatures = useMemo(() => {
    return areaFeatures.filter((feature: any) => {
      const regionMatch =
        filterRegion === "all" ||
        getFeatureProperty(feature, "zoneId") === filterRegion;
      const areaMatch =
        filterArea === "all" || getAreaToken(feature) === filterArea;

      return regionMatch && areaMatch;
    });
  }, [areaFeatures, filterRegion, filterArea]);

  const filteredPlotFeatures = useMemo(() => {
    return plotFeatures.filter((feature: any) => {
      if (filterArea === "all") return true;
      return getAreaToken(feature) === filterArea;
    });
  }, [plotFeatures, filterArea]);
  const calculateStats = useCallback(
    (polyCoords: any[]): SelectedEntityStats => {
      const plants = ((processedPlantData as any)?.features || []).filter(
        (item: any) =>
          isValidPointFeature(item) &&
          isPointInPolygon(item.geometry.coordinates, polyCoords),
      );

      const nextStats: SelectedEntityStats = {
        total: plants.length,
        healthy: 0,
        diseased: 0,
        harvesting: 0,
        types: {},
      };

      plants.forEach((item: any) => {
        if (item?.properties?.status === "healthy") nextStats.healthy++;
        else if (item?.properties?.status === "diseased") nextStats.diseased++;
        else if (item?.properties?.status === "harvesting")
          nextStats.harvesting++;

        const name = getSafeString(item?.properties?.name) || "Unknown";
        nextStats.types[name] = (nextStats.types[name] || 0) + 1;
      });

      return nextStats;
    },
    [processedPlantData],
  );

  const stats = useMemo(() => {
    const plants = ((filteredPlantData as any)?.features || []) as any[];

    return {
      regions: filteredZoneFeatures.length,
      areas: filteredAreaFeatures.length,
      plots: filteredPlotFeatures.length,
      plants: plants.length,
      healthy: plants.filter((item) => item?.properties?.status === "healthy")
        .length,
      diseased: plants.filter((item) => item?.properties?.status === "diseased")
        .length,
      harvesting: plants.filter(
        (item) => item?.properties?.status === "harvesting",
      ).length,
    };
  }, [
    filteredPlantData,
    filteredZoneFeatures,
    filteredAreaFeatures,
    filteredPlotFeatures,
  ]);

  const onZoomChange = useCallback((zoom: number) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      let next: LayerVisibility | null = null;

      if (zoom < 14) {
        next = { zone: true, area: false, plot: false, plant: false };
      } else if (zoom >= 14 && zoom < 16) {
        next = { zone: false, area: true, plot: false, plant: false };
      } else if (zoom >= 16 && zoom < 18) {
        next = { zone: false, area: false, plot: true, plant: false };
      } else if (zoom >= 18) {
        next = { zone: false, area: false, plot: true, plant: true };
      }

      if (!next) return;

      setVisibleLayers((prev) => {
        if (
          next.zone !== prev.zone ||
          next.area !== prev.area ||
          next.plot !== prev.plot ||
          next.plant !== prev.plant
        ) {
          return next;
        }

        return prev;
      });
    }, 150);
  }, []);

  useEffect(() => {
    onZoomChange(mapZoom);
  }, [mapZoom, onZoomChange]);

  useEffect(() => {
    if (
      filterArea !== "all" &&
      !areaOptions.some((option: any) => option.value === filterArea)
    ) {
      setFilterArea("all");
    }
  }, [areaOptions, filterArea]);

  useEffect(() => {
    if (filterArea !== "all") {
      const selectedArea = filteredAreaFeatures.find(
        (feature: any) => getAreaToken(feature) === filterArea,
      );
      const center = selectedArea ? getPolygonCenter(selectedArea) : null;

      if (center) {
        setMapCenter(center);
        setMapZoom(16);
      }
      return;
    }

    if (filterRegion === "all") return;

    const selectedRegion = filteredZoneFeatures[0];
    const center = selectedRegion ? getPolygonCenter(selectedRegion) : null;

    if (center) {
      setMapCenter(center);
      setMapZoom(14);
    }
  }, [filterRegion, filterArea, filteredAreaFeatures, filteredZoneFeatures]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleEntityClick = useCallback(
    (feature: any) => {
      let type = "Selected Area";

      if (feature?.properties?.areaId) {
        type = "Lô trồng (Plot)";
      } else if (feature?.properties?.zoneId) {
        type = "Khu vực (Area)";
      } else if (feature?.properties?.id) {
        type = "Vùng trồng (Zone)";
      }

      let polyCoords: any[] = [];

      if (feature?.geometry?.type === "MultiPolygon") {
        polyCoords = feature?.geometry?.coordinates?.[0]?.[0] || [];
      } else if (feature?.geometry?.type === "Polygon") {
        polyCoords = feature?.geometry?.coordinates?.[0] || [];
      }

      const calculatedStats = Array.isArray(polyCoords)
        ? calculateStats(polyCoords)
        : {
            total: 0,
            healthy: 0,
            diseased: 0,
            harvesting: 0,
            types: {},
          };

      setSelectedEntity({
        type: getSafeFeatureName(feature, type),
        properties: feature?.properties || {},
        stats: calculatedStats,
      });
    },
    [calculateStats],
  );

  const zoneLayer = useMemo(() => {
    if (!visibleLayers.zone) return null;

    return filteredZoneFeatures
      .map((item: any, index: number) => {
        const path = getSafePolygonPath(item?.geometry);
        if (!path) return null;

        return (
          <MFPolygon
            key={getSafeString(item?.properties?.code) || `zone-${index}`}
            paths={[path]}
            fillColor="#2b8cbe"
            fillOpacity={0.2}
            strokeColor="#2b8cbe"
            strokeWidth={2}
            onClick={() => handleEntityClick(item)}
            clickable={true}
            visible={true}
          />
        );
      })
      .filter(Boolean);
  }, [visibleLayers.zone, filteredZoneFeatures, handleEntityClick]);

  const areaLayer = useMemo(() => {
    if (!visibleLayers.area) return null;

    return filteredAreaFeatures
      .map((item: any, index: number) => {
        const path = getSafePolygonPath(item?.geometry);
        if (!path) return null;

        return (
          <MFPolygon
            key={getSafeString(item?.properties?.code) || `area-${index}`}
            paths={[path]}
            fillColor="#f03b20"
            fillOpacity={0.1}
            strokeColor="#f03b20"
            strokeWidth={2}
            onClick={() => handleEntityClick(item)}
            clickable={true}
            visible={true}
          />
        );
      })
      .filter(Boolean);
  }, [visibleLayers.area, filteredAreaFeatures, handleEntityClick]);

  const plotLayer = useMemo(() => {
    if (!visibleLayers.plot) return null;

    return filteredPlotFeatures
      .map((item: any, index: number) => {
        const path = getSafePolygonPath(item?.geometry);
        if (!path) return null;

        return (
          <MFPolygon
            key={getSafeString(item?.properties?.code) || `plot-${index}`}
            paths={[path]}
            fillColor="#31a354"
            fillOpacity={0.2}
            strokeColor="#31a354"
            strokeWidth={2}
            onClick={() => handleEntityClick(item)}
            clickable={true}
            visible={true}
          />
        );
      })
      .filter(Boolean);
  }, [visibleLayers.plot, filteredPlotFeatures, handleEntityClick]);
  const normalizedPlantFeatures = useMemo(() => {
    const features = (filteredPlantData as any)?.features;
    if (!Array.isArray(features)) return [];

    return features
      .filter((item: any) => isValidPointFeature(item))
      .map((item: any, index: number) => {
        const lng = Number(item.geometry.coordinates[0]);
        const lat = Number(item.geometry.coordinates[1]);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return {
          feature: item,
          key: getSafeString(item?.properties?.code) || `plant-${index}`,
          lat,
          lng,
          name: getSafeString(item?.properties?.name),
          status: getSafeString(item?.properties?.status),
        };
      })
      .filter(Boolean);
  }, [filteredPlantData]);
  const visiblePlantFeatures = useMemo(() => {
    if (!visibleLayers.plant || mapZoom < PLANT_ZOOM_THRESHOLD) return [];

    const latDelta = Math.max(0.0025, 0.03 / Math.pow(2, mapZoom - 15));
    const lngDelta = Math.max(0.0025, 0.03 / Math.pow(2, mapZoom - 15));

    const minLat = mapCenter.lat - latDelta - VIEWPORT_PADDING;
    const maxLat = mapCenter.lat + latDelta + VIEWPORT_PADDING;
    const minLng = mapCenter.lng - lngDelta - VIEWPORT_PADDING;
    const maxLng = mapCenter.lng + lngDelta + VIEWPORT_PADDING;

    return normalizedPlantFeatures
      .filter((item: any) => {
        return (
          item.lat >= minLat &&
          item.lat <= maxLat &&
          item.lng >= minLng &&
          item.lng <= maxLng
        );
      })
      .slice(0, MAX_VISIBLE_MARKERS);
  }, [visibleLayers.plant, mapZoom, mapCenter, normalizedPlantFeatures]);

  const plantMarkers = useMemo(() => {
    if (!visibleLayers.plant || mapZoom < PLANT_ZOOM_THRESHOLD || !mapBounds) {
      return null;
    }

    return visiblePlantFeatures.map((item: any, index: number) => {
      const code = getSafeString(item?.feature?.properties?.code);
      const name = getSafeString(item?.feature?.properties?.name);

      return (
        <MFMarker
          key={code || `plant-${index}`}
          position={{ lat: item.lat, lng: item.lng }}
          title={name || undefined}
          label={""}
          visible={true}
          icon={{
            url: Tree,
            width: 12,
            height: 12,
          }}
          onClick={() => {
            setSelectedTree(item.feature);
          }}
        />
      );
    });
  }, [visibleLayers.plant, visiblePlantFeatures, mapBounds, mapZoom]);

  const labelMarkers = useMemo(() => {
    const layers = [
      {
        data: filteredZoneFeatures,
        visible: visibleLayers.zone,
        prefix: "zone",
      },
      {
        data: filteredAreaFeatures,
        visible: visibleLayers.area,
        prefix: "area",
      },
      {
        data: filteredPlotFeatures,
        visible: visibleLayers.plot,
        prefix: "plot",
      },
    ];

    return layers.flatMap((layer) => {
      if (!layer.visible) return [];

      return layer.data
        .map((item: any, index: number) => {
          const center = getPolygonCenter(item);
          const name = getSafeString(item?.properties?.name);
          const code = getSafeString(item?.properties?.code);

          if (
            !center ||
            !isValidLatLng(center.lat) ||
            !isValidLatLng(center.lng) ||
            !isNonEmptyString(name) ||
            (mapBounds != null &&
              (center.lat < mapBounds.south ||
                center.lat > mapBounds.north ||
                center.lng < mapBounds.west ||
                center.lng > mapBounds.east))
          ) {
            return null;
          }

          return (
            <MFMarker
              key={`label-${layer.prefix}-${code || index}`}
              position={center}
              title={name}
              label={name}
              visible={true}
            />
          );
        })
        .filter(Boolean);
    });
  }, [
    visibleLayers.zone,
    visibleLayers.area,
    visibleLayers.plot,
    filteredZoneFeatures,
    filteredAreaFeatures,
    filteredPlotFeatures,
    mapBounds,
  ]);

  useEffect(() => {
    const badPolygonFeatures = [
      ...((zoneData as any)?.features || []).map((item: any) => ({
        layer: "zone",
        item,
      })),
      ...((areaData as any)?.features || []).map((item: any) => ({
        layer: "area",
        item,
      })),
      ...((plotData as any)?.features || []).map((item: any) => ({
        layer: "plot",
        item,
      })),
    ].filter(({ item }) => !getSafePolygonPath(item?.geometry));

    const badLabelFeatures = [
      ...((zoneData as any)?.features || []).map((item: any) => ({
        layer: "zone",
        item,
      })),
      ...((areaData as any)?.features || []).map((item: any) => ({
        layer: "area",
        item,
      })),
      ...((plotData as any)?.features || []).map((item: any) => ({
        layer: "plot",
        item,
      })),
    ].filter(({ item }) => {
      const center = getPolygonCenter(item);
      const name = getSafeString(item?.properties?.name);

      return (
        !center ||
        !isValidLatLng(center?.lat) ||
        !isValidLatLng(center?.lng) ||
        !isNonEmptyString(name)
      );
    });

    const badPlantFeatures = ((plantData as any)?.features || []).filter(
      (item: any) => !isValidPointFeature(item),
    );

    if (badPolygonFeatures.length > 0) {
      console.log("badPolygonFeatures", badPolygonFeatures);
    }

    if (badLabelFeatures.length > 0) {
      console.log("badLabelFeatures", badLabelFeatures);
    }

    if (badPlantFeatures.length > 0) {
      console.log("badPlantFeatures", badPlantFeatures);
    }
  }, []);
  return (
    <>
      <div
        className={cn(
          "flex relative group",
          isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]",
        )}
      >
        <div className="shrink-0 border-r bg-card flex flex-col h-full transition-all duration-300">
          {selectedEntity ? (
            <SidebarDetail
              selectedEntity={selectedEntity}
              onClose={() => setSelectedEntity(null)}
              soilData={soilData}
              onEditSoil={handleEditSoil}
            />
          ) : (
            <SidebarFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              filterRegion={filterRegion}
              setFilterRegion={setFilterRegion}
              filterArea={filterArea}
              setFilterArea={setFilterArea}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              stats={stats}
              availablePlants={(filteredPlantData as any)?.features || []}
              regionOptions={regionOptions}
              areaOptions={areaOptions}
              totalArea={totalArea}
              onPlantClick={(lat, lng) => {
                setMapCenter({ lat, lng });
                setMapZoom(20);
              }}
            />
          )}
        </div>

        <div className="flex-1 relative bg-slate-100 -z-0">
          <MFMap
            accessKey="37b541da761a2896d03951cf69bc989e"
            center={mapCenter}
            zoom={mapZoom}
            options={{
              mapType: "raster",
              controlOptions: {},
            }}
            version="2.5"
            onMapReady={(map) => {
              map.addListener("idle", () => {
                const camera = map.getCamera();
                const zoomValue = camera.zoom;
                const target = camera.target;
                const roundedZoom = Math.round(zoomValue);

                setMapZoom((prev) =>
                  Math.round(prev) !== roundedZoom ? roundedZoom : prev,
                );

                setMapCenter((prev) => {
                  if (
                    Math.abs(target.lat - prev.lat) > 0.0001 ||
                    Math.abs(target.lng - prev.lng) > 0.0001
                  ) {
                    return { lat: target.lat, lng: target.lng };
                  }

                  return prev;
                });
                const bounds = map.getBounds();

                if (bounds) {
                  setMapBounds({
                    north: bounds.northeast.lat,
                    east: bounds.northeast.lng,
                    south: bounds.southwest.lat,
                    west: bounds.southwest.lng,
                  });
                }
              });
            }}
          >
            {zoneLayer}
            {areaLayer}
            {plotLayer}
            {plantMarkers}
            {labelMarkers}
            <MapLegend visibleLayers={visibleLayers} />
          </MFMap>

          <div className="absolute top-4 right-16 z-1000">
            <button
              onClick={() => {
                if (isFullScreenParam) {
                  window.close();
                } else {
                  const url = new URL(window.location.href);
                  url.searchParams.set("fullscreen", "true");
                  window.open(url.toString(), "_blank");
                }
              }}
              className="bg-white p-2 rounded-md shadow-md text-slate-700 hover:bg-slate-50 hover:text-primary transition-colors border border-slate-200"
              title={
                isFullScreenParam ? "Thoát toàn màn hình" : "Toàn màn hình"
              }
            >
              {isFullScreenParam ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
        {selectedTree && (
          <div className="absolute top-4 right-4 bg-white p-4 shadow rounded z-50">
            <div className="font-bold">{selectedTree.properties?.name}</div>
            <div>Mã: {selectedTree.properties?.code}</div>
            <div>
              Trạng thái: {MAP_LABEL.get(selectedTree.properties?.status)}
            </div>
          </div>
        )}
      </div>

      <SoilEditDialog
        isOpen={isEditingSoil}
        onOpenChange={setIsEditingSoil}
        tempSoil={tempSoil}
        setTempSoil={setTempSoil}
        onSave={handleSaveSoil}
      />
    </>
  );
};

const MapViewPage = () => {
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  if (isFullScreenParam) {
    return <MapContent />;
  }

  return (
    <AdminLayout
      title="Bản đồ số nông nghiệp"
      description="Quản lý trực quan vùng trồng và cây trồng"
    >
      <MapContent />
    </AdminLayout>
  );
};

export default MapViewPage;
