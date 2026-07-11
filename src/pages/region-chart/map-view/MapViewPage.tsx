import { AdminLayout, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  Feature,
  FeatureCollection,
  GeoJsonObject,
  GeoJsonProperties,
  Geometry,
  Position,
} from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import areaData from "../../../assets/map/area.json";
import plantData from "../../../assets/map/plant.json";
import plotData from "../../../assets/map/plot.json";
import zoneData from "../../../assets/map/zone.json";
import { MOCK_AREAS, MOCK_REGIONS } from "../constants";
import { MapLegend } from "./components/MapLegend";
import { SidebarDetail } from "./components/SidebarDetail";
import { SidebarFilter } from "./components/SidebarFilter";
import { SoilEditDialog } from "./components/SoilEditDialog";
import type {
  DrilldownItem,
  SelectedEntity,
  SelectedEntityStats,
  SoilClusterInfo,
  SoilData,
} from "./types/types";
import {
  getCenterFromCoordinates,
  getLocationInfo,
  getPolygonCenter,
  isPointInPolygon,
} from "./utils/utils";

const DEFAULT_CENTER: [number, number] = [11.558, 107.134];
type GeoFeature = Feature<Geometry, GeoJsonProperties>;
type GeoFeatureCollection = FeatureCollection<Geometry, GeoJsonProperties>;

const MapUpdater = ({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const ZoomListener = ({ onChange }: { onChange: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onChange(map.getZoom());
    },
  });
  return null;
};

const createDefaultSoilData = (): Record<string, SoilData> => {
  const defaultValues: SoilData = {
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

  return {
    "PLOT-1-1": { ...defaultValues },
    "PLOT-1-2": { ...defaultValues },
  };
};

const getFeatureLabel = (feature?: GeoFeature | null) =>
  feature?.properties?.name ||
  feature?.properties?.code ||
  feature?.properties?.id ||
  "Không rõ";

const getPolygonCoordinates = (
  feature?: GeoFeature | null,
): [number, number][] => {
  if (!feature?.geometry) return [];

  if (feature.geometry.type === "Polygon") {
    return (feature.geometry.coordinates?.[0] || []).map((coord) =>
      [coord[0] ?? 0, coord[1] ?? 0] as [number, number],
    );
  }

  if (feature.geometry.type === "MultiPolygon") {
    return (feature.geometry.coordinates?.[0]?.[0] || []).map((coord) =>
      [coord[0] ?? 0, coord[1] ?? 0] as [number, number],
    );
  }

  return [];
};

const getPointCoordinates = (
  feature?: GeoFeature | null,
): [number, number] | null => {
  if (!feature?.geometry || feature.geometry.type !== "Point") return null;
  const [lng, lat] = feature.geometry.coordinates as Position;
  if (typeof lng !== "number" || typeof lat !== "number") return null;
  return [lng, lat];
};

const getFeatureCenterPoint = (
  feature?: GeoFeature | null,
): [number, number] | null => {
  if (!feature?.geometry) return null;
  if (feature.geometry.type === "Point") {
    return getPointCoordinates(feature);
  }

  const center = getPolygonCenter(feature);
  return center ? [center.lng, center.lat] : null;
};

const getCollectionFeatures = (
  collection: unknown,
): GeoFeature[] => {
  const typedCollection = collection as GeoFeatureCollection | null | undefined;
  return Array.isArray(typedCollection?.features) ? typedCollection.features : [];
};

const MapContent = () => {
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  const [filterRegion, setFilterRegion] = useState("all");
  const [filterArea, setFilterArea] = useState("all");
  const [visibleLayers, setVisibleLayers] = useState({
    zone: true,
    area: false,
    plot: false,
    plant: false,
  });
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isDetailExpanded, setIsDetailExpanded] = useState(true);
  const [selectionTrail, setSelectionTrail] = useState<SelectedEntity[]>([]);
  const [soilData, setSoilData] = useState<Record<string, SoilData>>(
    createDefaultSoilData,
  );
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [tempSoil, setTempSoil] = useState<SoilData | null>(null);

  const zoneFeatures = useMemo(() => getCollectionFeatures(zoneData), []);
  const areaFeatures = useMemo(() => getCollectionFeatures(areaData), []);
  const plotFeatures = useMemo(() => getCollectionFeatures(plotData), []);

  const processedPlantData = useMemo(() => {
    const statuses = ["healthy", "diseased", "harvesting"];
    const features = getCollectionFeatures(plantData).map((feature, index) => {
      const status = statuses[index % statuses.length];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          status,
        },
      };
    });

    return {
      ...plantData,
      features,
    } as GeoFeatureCollection;
  }, []);

  const plantFeatures = useMemo(
    () => getCollectionFeatures(processedPlantData),
    [processedPlantData],
  );

  const handleEditSoil = () => {
    const currentId = selectedEntity?.id || selectedEntity?.key;
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
    const currentId = selectedEntity?.id || selectedEntity?.key;
    if (!currentId || !tempSoil) return;

    setSoilData((prev) => ({
      ...prev,
      [currentId]: tempSoil,
    }));
    setIsEditingSoil(false);
  };

  const calculateStats = useCallback(
    (polyCoords: [number, number][]): SelectedEntityStats => {
      const plants = plantFeatures.filter((feature: GeoFeature) => {
        const point = getPointCoordinates(feature);
        return point ? isPointInPolygon(point, polyCoords) : false;
      });

      const stats: SelectedEntityStats = {
        total: plants.length,
        healthy: 0,
        diseased: 0,
        harvesting: 0,
        types: {},
      };

      plants.forEach((feature: GeoFeature) => {
        const status = feature.properties?.status;
        if (status === "healthy") stats.healthy += 1;
        else if (status === "diseased") stats.diseased += 1;
        else if (status === "harvesting") stats.harvesting += 1;

        const name = feature.properties?.name || "Unknown";
        stats.types[name] = (stats.types[name] || 0) + 1;
      });

      return stats;
    },
    [plantFeatures],
  );

  const buildSoilClusters = (
    entityId: string,
    baseSoil: SoilData | undefined,
  ): SoilClusterInfo[] => {
    const soil = baseSoil || {
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

    return [
      {
        key: `${entityId}-cluster-a`,
        label: "Vị trí A",
        position: "Phía Bắc",
        deviceCount: 2,
        lastSynced: soil.lastTested,
        metrics: soil,
      },
      {
        key: `${entityId}-cluster-b`,
        label: "Vị trí B",
        position: "Phía Nam",
        deviceCount: 2,
        lastSynced: soil.lastTested,
        metrics: {
          ...soil,
          ph: Number((soil.ph + 0.1).toFixed(1)),
          moisture: Math.min(100, soil.moisture + 2),
          temperature: Number((soil.temperature + 0.5).toFixed(1)),
        },
      },
    ];
  };

  const buildNode = useCallback(
    (level: SelectedEntity["level"], index: number): SelectedEntity | null => {
    const collectionMap: Record<
      Exclude<SelectedEntity["level"], "soil-cluster">,
      GeoFeature[]
    > = {
      zone: zoneFeatures,
      area: areaFeatures,
      plot: plotFeatures,
      plant: plantFeatures,
    };

    if (level === "soil-cluster") return null;

    const feature = collectionMap[level][index];
    if (!feature) return null;

    const center = getFeatureCenterPoint(feature);
    const locationInfo = center
      ? getLocationInfo(center[0], center[1])
      : undefined;

    let children: DrilldownItem[] = [];
    let stats: SelectedEntityStats = {
      total: 0,
      healthy: 0,
      diseased: 0,
      harvesting: 0,
      types: {},
    };

    if (level === "zone") {
      const polygon = getPolygonCoordinates(feature);
      const childItems = areaFeatures
        .map((childFeature: GeoFeature, childIndex: number) => ({
          feature: childFeature,
          index: childIndex,
          center: getFeatureCenterPoint(childFeature),
        }))
        .filter(({ center: childCenter }) =>
          childCenter ? isPointInPolygon(childCenter, polygon) : false,
        );

      children = childItems.map(({ feature: childFeature, index: childIndex, center: childCenter }) => ({
        key: `area-${childIndex}`,
        level: "area",
        title: getFeatureLabel(childFeature),
        subtitle:
          childFeature.properties?.code ||
          `${childFeature.properties?.plots?.length || 0} lô`,
        center: childCenter,
        featureIndex: childIndex,
        source: "geojson",
      }));
      stats = calculateStats(polygon);
    }

    if (level === "area") {
      const polygon = getPolygonCoordinates(feature);
      const childItems = plotFeatures
        .map((childFeature: GeoFeature, childIndex: number) => ({
          feature: childFeature,
          index: childIndex,
          center: getFeatureCenterPoint(childFeature),
        }))
        .filter(({ center: childCenter }) =>
          childCenter ? isPointInPolygon(childCenter, polygon) : false,
        );

      children = childItems.map(({ feature: childFeature, index: childIndex, center: childCenter }) => ({
        key: `plot-${childIndex}`,
        level: "plot",
        title: getFeatureLabel(childFeature),
        subtitle:
          childFeature.properties?.code ||
          `${childFeature.properties?.area || "N/A"} ha`,
        center: childCenter,
        featureIndex: childIndex,
        source: "geojson",
      }));
      stats = calculateStats(polygon);
    }

    if (level === "plot") {
      const polygon = getPolygonCoordinates(feature);
      const childItems = plantFeatures
        .map((childFeature: GeoFeature, childIndex: number) => ({
          feature: childFeature,
          index: childIndex,
          center: getPointCoordinates(childFeature),
        }))
        .filter(({ center: childCenter }) =>
          childCenter ? isPointInPolygon(childCenter, polygon) : false,
        );

      children = childItems.map(({ feature: childFeature, index: childIndex, center: childCenter }) => ({
        key: `plant-${childIndex}`,
        level: "plant",
        title: getFeatureLabel(childFeature),
        subtitle: childFeature.properties?.code || childFeature.properties?.rowId || "",
        center: childCenter,
        featureIndex: childIndex,
        source: "geojson",
      }));
      stats = calculateStats(polygon);
    }

    if (level === "plant") {
      const status = feature.properties?.status;
      stats = {
        total: 1,
        healthy: status === "healthy" ? 1 : 0,
        diseased: status === "diseased" ? 1 : 0,
        harvesting: status === "harvesting" ? 1 : 0,
        types: {
          [feature.properties?.name || "Plant"]: 1,
        },
      };
    }

    const entityId =
      String(feature.properties?.code || feature.properties?.id || `${level}-${index}`);
    const title = getFeatureLabel(feature);
    const soilClusters = buildSoilClusters(
      entityId,
      soilData[entityId],
    );

    return {
      id: entityId,
      key: `${level}-${index}`,
      level,
      type: title,
      properties: feature.properties,
      stats,
      center,
      locationInfo,
      children,
      soilClusters,
      description: feature.properties?.note || feature.properties?.address,
    };
    },
    [
      areaFeatures,
      calculateStats,
      plantFeatures,
      plotFeatures,
      soilData,
      zoneFeatures,
    ],
  );

  const buildTrail = useCallback(
    (
      level: Exclude<SelectedEntity["level"], "soil-cluster">,
      index: number,
    ) => {
    const node = buildNode(level, index);
    if (!node) return [];

    if (level === "zone") return [node];

    if (level === "area") {
      const center = node.center;
      const zoneIndex =
        center && zoneFeatures.length
          ? zoneFeatures.findIndex((feature) => {
              const polygon = getPolygonCoordinates(feature);
              return polygon.length ? isPointInPolygon(center, polygon) : false;
            })
          : -1;
      return zoneIndex >= 0 ? [buildNode("zone", zoneIndex)!, node] : [node];
    }

    if (level === "plot") {
      const center = node.center;
      const areaIndex =
        center && areaFeatures.length
          ? areaFeatures.findIndex((feature) => {
              const polygon = getPolygonCoordinates(feature);
              return polygon.length ? isPointInPolygon(center, polygon) : false;
            })
          : -1;
      const zoneIndex =
        areaIndex >= 0
          ? zoneFeatures.findIndex((feature) => {
              const areaFeature = areaFeatures[areaIndex];
              const areaCenter = areaFeature ? getFeatureCenterPoint(areaFeature) : null;
              const polygon = getPolygonCoordinates(feature);
              return areaCenter && polygon.length
                ? isPointInPolygon(areaCenter, polygon)
                : false;
            })
          : -1;

      const trail = [];
      if (zoneIndex >= 0) trail.push(buildNode("zone", zoneIndex)!);
      if (areaIndex >= 0) trail.push(buildNode("area", areaIndex)!);
      trail.push(node);
      return trail;
    }

    if (level === "plant") {
      const center = node.center;
      const plotIndex =
        center && plotFeatures.length
          ? plotFeatures.findIndex((feature) => {
              const polygon = getPolygonCoordinates(feature);
              return polygon.length ? isPointInPolygon(center, polygon) : false;
            })
          : -1;

      const areaIndex =
        plotIndex >= 0
          ? areaFeatures.findIndex((feature) => {
              const plotFeature = plotFeatures[plotIndex];
              const plotCenter = plotFeature ? getFeatureCenterPoint(plotFeature) : null;
              const polygon = getPolygonCoordinates(feature);
              return plotCenter && polygon.length
                ? isPointInPolygon(plotCenter, polygon)
                : false;
            })
          : -1;

      const zoneIndex =
        areaIndex >= 0
          ? zoneFeatures.findIndex((feature) => {
              const areaFeature = areaFeatures[areaIndex];
              const areaCenter = areaFeature ? getFeatureCenterPoint(areaFeature) : null;
              const polygon = getPolygonCoordinates(feature);
              return areaCenter && polygon.length
                ? isPointInPolygon(areaCenter, polygon)
                : false;
            })
          : -1;

      const trail = [];
      if (zoneIndex >= 0) trail.push(buildNode("zone", zoneIndex)!);
      if (areaIndex >= 0) trail.push(buildNode("area", areaIndex)!);
      if (plotIndex >= 0) trail.push(buildNode("plot", plotIndex)!);
      trail.push(node);
      return trail;
    }

    return [node];
    },
    [areaFeatures, buildNode, plotFeatures, zoneFeatures],
  );

  const finalizeTrail = useCallback(
    (trail: SelectedEntity[]) =>
      trail.map((node, index) => ({
        ...node,
        lineage: trail.slice(0, index + 1).map((trailNode) => trailNode.type),
      })),
    [],
  );

  const selectLevel = (level: Exclude<SelectedEntity["level"], "soil-cluster">, index: number) => {
    const trail = buildTrail(level, index);
    if (!trail.length) return;
    setSelectionTrail(finalizeTrail(trail));
    setIsSidebarCollapsed(false);
    setIsDetailExpanded(true);
  };

  const handleSelectChild = (item: DrilldownItem) => {
    if (item.source === "geojson" && typeof item.featureIndex === "number") {
      selectLevel(item.level as Exclude<SelectedEntity["level"], "soil-cluster">, item.featureIndex);
    }
  };

  const handleSelectSoilCluster = (cluster: SoilClusterInfo) => {
    if (!selectedEntity) return;

    const clusterNode: SelectedEntity = {
      id: cluster.key,
      key: cluster.key,
      level: "soil-cluster",
      type: cluster.label,
      properties: {
        code: cluster.key,
        name: cluster.label,
        position: cluster.position,
        deviceCount: cluster.deviceCount,
      },
      stats: {
        total: cluster.deviceCount,
        healthy: 0,
        diseased: 0,
        harvesting: 0,
        types: {},
      },
      center: selectedEntity.center,
      locationInfo: selectedEntity.locationInfo,
      soilCluster: cluster,
      children: [],
      soilClusters: [cluster],
      description: `${cluster.position} • ${cluster.deviceCount} thiết bị`,
      lineage: [...(selectedEntity.lineage || []), cluster.label],
    };

    setSelectionTrail((prev) => [...prev, clusterNode]);
    setIsDetailExpanded(true);
    setIsSidebarCollapsed(false);
  };

  const handleBack = () => {
    setSelectionTrail((prev) => prev.slice(0, -1));
  };

  const handleCloseSidebar = () => {
    setSelectionTrail([]);
  };

  useEffect(() => {
    if (!selectionTrail.length && zoneFeatures.length > 0) {
      const firstZoneTrail = buildTrail("zone", 0);
      if (firstZoneTrail.length) {
        // Seed the sidebar with the first zone so the user lands on useful context.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectionTrail(finalizeTrail(firstZoneTrail));
      }
    }
  }, [buildTrail, finalizeTrail, selectionTrail.length, zoneFeatures.length]);

  const selectedEntity = selectionTrail[selectionTrail.length - 1] || null;

  const mapViewport = useMemo(() => {
    if (filterArea !== "all") {
      const area = MOCK_AREAS.find((a) => a.id.toString() === filterArea);
      if (area?.coordinates.length) {
        const center = getCenterFromCoordinates(area.coordinates);
        if (center) return { center, zoom: 16 };
      }
    }

    if (filterRegion !== "all") {
      const region = MOCK_REGIONS.find((r) => r.id.toString() === filterRegion);
      if (region?.coordinates.length) {
        const center = getCenterFromCoordinates(region.coordinates);
        if (center) return { center, zoom: 14 };
      }
    }

    return { center: DEFAULT_CENTER, zoom: 15 };
  }, [filterArea, filterRegion]);

  const [mapCenter, mapZoom] = [mapViewport.center, mapViewport.zoom];

  const onZoomChange = (zoom: number) => {
    if (zoom < 14) {
      setVisibleLayers({ zone: true, area: false, plot: false, plant: false });
    } else if (zoom < 16) {
      setVisibleLayers({ zone: false, area: true, plot: false, plant: false });
    } else if (zoom < 18) {
      setVisibleLayers({ zone: false, area: false, plot: true, plant: false });
    } else {
      setVisibleLayers({ zone: true, area: true, plot: true, plant: true });
    }
  };

  const zoneStyle = {
    color: "#2b8cbe",
    weight: 2,
    fillOpacity: 0.2,
    dashArray: "5, 5",
  };
  const areaStyle = { color: "#f03b20", weight: 2, fillOpacity: 0.1 };
  const plotStyle = { color: "#31a354", weight: 2, fillOpacity: 0.2 };

  const pointToLayer = (feature: Feature, latlng: L.LatLng) => {
    const status = feature.properties?.status;
    let color = "#22c55e";
    if (status === "diseased") color = "#ef4444";
    if (status === "harvesting") color = "#eab308";

    return L.circleMarker(latlng, {
      radius: 4,
      fillColor: color,
      color: "white",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.85,
    });
  };

  const createFeatureHandler = (
    level: Exclude<SelectedEntity["level"], "soil-cluster">,
    collection: GeoFeature[],
  ) => {
    return (feature: GeoFeature, layer: L.Layer) => {
      const index = collection.findIndex((item) => item === feature);
      layer.bindTooltip(getFeatureLabel(feature), { sticky: true });

      if (feature.geometry.type === "Point") {
        const point = getPointCoordinates(feature);
        if (point) {
          const [lng, lat] = point;
          const { zoneName, areaName, plotName } = getLocationInfo(lng, lat);
          layer.bindPopup(
            `<div class="font-semibold">${getFeatureLabel(feature)}</div>
             <div class="text-xs text-slate-500">${zoneName || ""}</div>
             <div class="text-xs text-slate-500">${areaName || ""}</div>
             <div class="text-xs text-slate-500">${plotName || ""}</div>`,
          );
        }
      }

      layer.on("click", (event) => {
        L.DomEvent.stopPropagation(event);
        selectLevel(level, index);
      });
    };
  };

  const selectedPath = useMemo(
    () =>
      selectionTrail
        .map((node) => node.center)
        .filter(Boolean) as [number, number][],
    [selectionTrail],
  );

  return (
    <>
      <div
        className={cn(
          "relative flex group",
          isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]",
        )}
      >
        {selectedEntity && (
          <div
            className={cn(
              "shrink-0 flex h-full flex-col overflow-hidden bg-card transition-all duration-300",
              isSidebarCollapsed
                ? "w-0 min-w-0 max-w-0 border-r-0"
                : "w-[380px] min-w-[380px] max-w-[380px] border-r",
            )}
          >
            <div
              className={cn(
                "flex h-full flex-col transition-opacity duration-200",
                isSidebarCollapsed && "pointer-events-none opacity-0",
              )}
            >
              <SidebarDetail
                selectedEntity={selectedEntity}
                soilData={soilData}
                canGoBack={selectionTrail.length > 1}
                onBack={handleBack}
                onClose={handleCloseSidebar}
                onEditSoil={handleEditSoil}
                onSelectChild={handleSelectChild}
                onSelectSoilCluster={handleSelectSoilCluster}
                isDetailExpanded={isDetailExpanded}
                onToggleDetailExpanded={() =>
                  setIsDetailExpanded((prev) => !prev)
                }
              />
            </div>
          </div>
        )}

        {selectedEntity && (
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className={`absolute top-[40dvh] z-[1100] ${isSidebarCollapsed ? "-translate-x-1/2" : ""} rounded-r-md border border-slate-200 bg-white px-1.5 py-4 text-slate-700 shadow-md transition-colors hover:bg-slate-50`}
            style={{ left: isSidebarCollapsed ? 16 : 380 }}
            title={
              isSidebarCollapsed
                ? "Mở bảng điều khiển bên"
                : "Thu gọn bảng điều khiển bên"
            }
            aria-label={
              isSidebarCollapsed
                ? "Mở bảng điều khiển bên"
                : "Thu gọn bảng điều khiển bên"
            }
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        )}

        <div className="relative -z-0 flex-1 bg-slate-100">
          <SidebarFilter
            filterRegion={filterRegion}
            setFilterRegion={setFilterRegion}
            filterArea={filterArea}
            setFilterArea={setFilterArea}
            regionOptions={MOCK_REGIONS.map((region) => ({
              value: region.id.toString(),
              label: region.code,
            }))}
            areaOptions={MOCK_AREAS.filter(
              (area) =>
                filterRegion === "all" ||
                area.regionId.toString() === filterRegion,
            ).map((area) => ({
              value: area.id.toString(),
              label: area.code,
            }))}
          />

          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="h-full w-full"
            style={{ background: "#f0f0f0" }}
          >
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <ZoomListener onChange={onZoomChange} />
            <LayersControl position="topright">
              <LayersControl.BaseLayer checked name="Bản đồ chuẩn">
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
              </LayersControl.BaseLayer>
              <LayersControl.BaseLayer name="Vệ tinh">
                <TileLayer
                  attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                />
              </LayersControl.BaseLayer>

              <LayersControl.Overlay checked={visibleLayers.zone} name="Vùng trồng">
                <LayerGroup>
                  {visibleLayers.zone && (
                    <GeoJSON
                      key="layer-zone"
                      data={zoneData as GeoJsonObject}
                      style={zoneStyle}
                      onEachFeature={createFeatureHandler("zone", zoneFeatures)}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={visibleLayers.area} name="Khu vực">
                <LayerGroup>
                  {visibleLayers.area && (
                    <GeoJSON
                      key="layer-area"
                      data={areaData as GeoJsonObject}
                      style={areaStyle}
                      onEachFeature={createFeatureHandler("area", areaFeatures)}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={visibleLayers.plot} name="Lô trồng">
                <LayerGroup>
                  {visibleLayers.plot && (
                    <GeoJSON
                      key="layer-plot"
                      data={plotData as GeoJsonObject}
                      style={plotStyle}
                      onEachFeature={createFeatureHandler("plot", plotFeatures)}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay checked={visibleLayers.plant} name="Cây trồng">
                <LayerGroup>
                  {visibleLayers.plant && (
                    <GeoJSON
                      key="layer-plant"
                      data={processedPlantData as GeoJsonObject}
                      pointToLayer={pointToLayer}
                      onEachFeature={createFeatureHandler("plant", plantFeatures)}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>

            {selectedPath.length > 1 && (
              <Polyline
                positions={selectedPath}
                pathOptions={{
                  color: "#0ea5e9",
                  weight: 3,
                  opacity: 0.75,
                  dashArray: "8 6",
                }}
              />
            )}

            {visibleLayers.zone &&
              zoneFeatures.map((feature, index) => {
                const center = getPolygonCenter(feature);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-zone-${index}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-blue-800 text-xs font-bold whitespace-nowrap drop-shadow-md mt-0.5">${getFeatureLabel(feature)}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            {visibleLayers.area &&
              areaFeatures.map((feature, index) => {
                const center = getPolygonCenter(feature);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-area-${index}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-1.5 h-1.5 bg-red-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-red-700 text-[10px] font-bold whitespace-nowrap drop-shadow-md mt-0.5">${getFeatureLabel(feature)}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            {visibleLayers.plot &&
              plotFeatures.map((feature, index) => {
                const center = getPolygonCenter(feature);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-plot-${index}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-1.5 h-1.5 bg-green-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-green-900 text-[9px] font-bold whitespace-nowrap drop-shadow-md mt-0.5">${getFeatureLabel(feature)}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            <MapLegend visibleLayers={visibleLayers} />
          </MapContainer>

          <div className="absolute right-16 top-4 z-[1000]">
            <button
              onClick={() => {
                if (isFullScreenParam) {
                  window.close();
                  return;
                }
                const url = new URL(window.location.href);
                url.searchParams.set("fullscreen", "true");
                window.open(url.toString(), "_blank");
              }}
              className="rounded-md border border-slate-200 bg-white p-2 text-slate-700 shadow-md transition-colors hover:bg-slate-50 hover:text-primary"
              title={isFullScreenParam ? "Thoát toàn màn hình" : "Toàn màn hình"}
            >
              {isFullScreenParam ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
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
      isDev={true}
      title="Bản đồ số nông nghiệp"
      description="Quản lý trực quan vùng trồng và cây trồng"
    >
      <MapContent />
    </AdminLayout>
  );
};

export default MapViewPage;
