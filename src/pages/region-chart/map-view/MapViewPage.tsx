import { AdminLayout, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Feature, GeoJsonObject } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  GeoJSON,
  LayerGroup,
  LayersControl,
  MapContainer,
  Marker,
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
  SelectedEntity,
  SelectedEntityStats,
  SoilData,
} from "./types/types";
import {
  getCenterFromCoordinates,
  getLocationInfo,
  getPolygonCenter,
  isPointInPolygon,
} from "./utils/utils";

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
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(
    null,
  );
  const [soilData, setSoilData] = useState<Record<string, SoilData>>(
    createDefaultSoilData,
  );
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [tempSoil, setTempSoil] = useState<SoilData | null>(null);

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (plantData as any).features.map(
      (feature: any, index: number) => {
        const randomStatus = statuses[index % statuses.length];
        return {
          ...feature,
          properties: {
            ...feature.properties,
            status: randomStatus,
          },
        };
      },
    );
    return {
      ...plantData,
      features,
    } as GeoJsonObject;
  }, []);

  const calculateStats = (
    polyCoords: [number, number][],
  ): SelectedEntityStats => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plants = (processedPlantData as any).features.filter((f: any) =>
      isPointInPolygon(f.geometry.coordinates, polyCoords),
    );

    const stats: SelectedEntityStats = {
      total: plants.length,
      healthy: 0,
      diseased: 0,
      harvesting: 0,
      types: {},
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plants.forEach((p: any) => {
      if (p.properties.status === "healthy") stats.healthy++;
      else if (p.properties.status === "diseased") stats.diseased++;
      else if (p.properties.status === "harvesting") stats.harvesting++;

      const name = p.properties.name || "Unknown";
      stats.types[name] = (stats.types[name] || 0) + 1;
    });

    return stats;
  };

  const allPlantData = processedPlantData;

  const regionOptions = useMemo(
    () =>
      MOCK_REGIONS.map((r) => ({
        value: r.id.toString(),
        label: r.code,
      })),
    [],
  );

  const areaOptions = useMemo(
    () =>
      MOCK_AREAS.filter(
        (a) => filterRegion === "all" || a.regionId.toString() === filterRegion,
      ).map((a) => ({
        value: a.id.toString(),
        label: a.code,
      })),
    [filterRegion],
  );

  const mapViewport = useMemo(() => {
    if (filterArea !== "all") {
      const area = MOCK_AREAS.find((a) => a.id.toString() === filterArea);
      if (area?.coordinates.length) {
        const center = getCenterFromCoordinates(area.coordinates);
        if (center) return { center, zoom: 16 };
      }
    }

    if (filterRegion !== "all") {
      const reg = MOCK_REGIONS.find((r) => r.id.toString() === filterRegion);
      if (reg?.coordinates.length) {
        const center = getCenterFromCoordinates(reg.coordinates);
        if (center) return { center, zoom: 14 };
      }
    }

    return { center: [11.558, 107.134] as [number, number], zoom: 15 };
  }, [filterArea, filterRegion]);

  const mapCenter = mapViewport.center;
  const mapZoom = mapViewport.zoom;

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
      fillOpacity: 0.8,
    });
  };

  const onEachFeature = (feature: Feature, layer: L.Layer) => {
    const buildPopupContent = (extraInfo?: string) => {
      let popupContent = `<div class="font-bold">${feature.properties?.name || "Unnamed"}</div>`;
      if (feature.properties?.code)
        popupContent += `<div class="text-xs">Mã: ${feature.properties.code}</div>`;
      if (feature.properties?.status) {
        const labels: Record<string, string> = {
          healthy: "Khỏe mạnh",
          diseased: "Sâu bệnh",
          harvesting: "Đang thu hoạch",
        };
        popupContent += `<div class="text-xs mt-1">Trạng thái: ${labels[feature.properties.status]}</div>`;
      }
      if (extraInfo) popupContent += extraInfo;
      return popupContent;
    };

    if (feature.geometry.type === "Point") {
      layer.bindPopup(buildPopupContent("<i>Đang tải thông tin...</i>"));
      layer.on("click", () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const coords = (feature.geometry as any).coordinates;
        const { zoneName, areaName, plotName } = getLocationInfo(
          coords[0],
          coords[1],
        );
        let extra = `<div class="mt-2 text-xs border-t pt-1 space-y-0.5">`;
        extra += `<div class="text-muted-foreground">📍 ${coords[1].toFixed(6)}, ${coords[0].toFixed(6)}</div>`;
        if (zoneName) extra += `<div>🏠 Vùng: <b>${zoneName}</b></div>`;
        if (areaName) extra += `<div>🌳 Khu vực: <b>${areaName}</b></div>`;
        if (plotName) extra += `<div>🌱 Lô: <b>${plotName}</b></div>`;
        extra += `</div>`;
        layer.setPopupContent(buildPopupContent(extra));
      });
      return;
    }

    layer.bindTooltip(feature.properties?.name, { sticky: true });
    layer.on("click", (e) => {
      L.DomEvent.stopPropagation(e);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let polyCoords = (feature.geometry as any).coordinates[0];
      if (feature.geometry.type === "MultiPolygon") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        polyCoords = (feature.geometry as any).coordinates[0][0];
      }

      const calculatedStats = calculateStats(polyCoords);
      const center = getPolygonCenter(feature);
      const locationInfo = center
        ? getLocationInfo(center.lng, center.lat)
        : undefined;

      setIsSidebarCollapsed(false);
      setIsDetailExpanded(true);
      setSelectedEntity({
        type: feature.properties?.name || "Selected Area",
        properties: feature.properties,
        stats: calculatedStats,
        center: center ? [center.lat, center.lng] : null,
        locationInfo,
      });
    });
  };

  return (
    <>
      <div
        className={cn(
          "flex relative group",
          isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]",
        )}
      >
        {selectedEntity && (
          <div
            className={cn(
              "shrink-0 bg-card flex flex-col h-full overflow-hidden transition-all duration-300",
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
                onClose={() => setSelectedEntity(null)}
                onEditSoil={handleEditSoil}
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
            className={`absolute top-[40dvh] z-[1100] ${isSidebarCollapsed && "-translate-x-1/2"} rounded-r-md border border-slate-200 bg-white px-1.5 py-4 text-slate-700 shadow-md transition-colors hover:bg-slate-50`}
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

        <div className="flex-1 relative bg-slate-100 -z-0">
          <SidebarFilter
            filterRegion={filterRegion}
            setFilterRegion={setFilterRegion}
            filterArea={filterArea}
            setFilterArea={setFilterArea}
            regionOptions={regionOptions}
            areaOptions={areaOptions}
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
              <LayersControl.Overlay
                checked={visibleLayers.zone}
                name="Vùng trồng (Regions)"
              >
                <LayerGroup>
                  {visibleLayers.zone && (
                    <GeoJSON
                      key="layer-zone"
                      data={zoneData as any}
                      style={zoneStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay
                checked={visibleLayers.area}
                name="Khu vực (Areas)"
              >
                <LayerGroup>
                  {visibleLayers.area && (
                    <GeoJSON
                      key="layer-area"
                      data={areaData as any}
                      style={areaStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay
                checked={visibleLayers.plot}
                name="Lô trồng (Plots)"
              >
                <LayerGroup>
                  {visibleLayers.plot && (
                    <GeoJSON
                      key="layer-plot"
                      data={plotData as any}
                      style={plotStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              <LayersControl.Overlay
                checked={visibleLayers.plant}
                name="Cây trồng (Plants)"
              >
                <LayerGroup>
                  {visibleLayers.plant && (
                    <GeoJSON
                      key="layer-plant"
                      data={allPlantData}
                      pointToLayer={pointToLayer}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>

            {visibleLayers.zone &&
              (zoneData as any).features.map((f: any, i: number) => {
                const center = getPolygonCenter(f);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-zone-${i}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-2 h-2 bg-blue-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-blue-800 text-xs font-bold whitespace-nowrap drop-shadow-md mt-0.5">${f.properties.name}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            {visibleLayers.area &&
              (areaData as any).features.map((f: any, i: number) => {
                const center = getPolygonCenter(f);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-area-${i}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-1.5 h-1.5 bg-red-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-red-700 text-[10px] font-bold whitespace-nowrap drop-shadow-md mt-0.5">${f.properties.name}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            {visibleLayers.plot &&
              (plotData as any).features.map((f: any, i: number) => {
                const center = getPolygonCenter(f);
                if (!center) return null;
                return (
                  <Marker
                    key={`label-plot-${i}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-1.5 h-1.5 bg-green-500 rounded-full border border-white shadow-sm"></div>
                          <div class="text-green-900 text-[9px] font-bold whitespace-nowrap drop-shadow-md mt-0.5">${f.properties.name}</div>
                        </div>
                      `,
                      iconSize: [0, 0],
                    })}
                  />
                );
              })}

            <MapLegend visibleLayers={visibleLayers} />
          </MapContainer>

          <div className="absolute top-4 right-16 z-1000">
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
              title={
                isFullScreenParam ? "Thoát toàn màn hình" : "Toàn màn hình"
              }
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
