import { useState, useMemo, useEffect } from "react";
import {
  AdminLayout,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
  Dialog,
  DialogContent,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  LayersControl,
  LayerGroup,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { GeoJsonObject, Feature } from "geojson";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Search,
  AlertTriangle,
  Sprout,
  Maximize2,
  Minimize2,
} from "lucide-react";

import { MOCK_REGIONS, MOCK_AREAS } from "../constants";

// Import GeoJSON data directly
import zoneData from "../../../assets/map/zone.json";
import areaData from "../../../assets/map/area.json";
import plotData from "../../../assets/map/plot.json";
import plantData from "../../../assets/map/plant.json";

// --- Helpers ---

const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
  // ray-casting algorithm
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][0],
      yi = vs[i][1];
    const xj = vs[j][0],
      yj = vs[j][1];
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPolygonCenter = (feature: any): L.LatLng | null => {
  if (!feature.geometry) return null;

  try {
    let layer;
    if (feature.geometry.type === "Polygon") {
      // Flip coordinates from GeoJSON [lng, lat] to Leaflet [lat, lng]
      const latlngs = feature.geometry.coordinates[0].map((c: any) => [
        c[1],
        c[0],
      ]);
      layer = L.polygon(latlngs);
    } else if (feature.geometry.type === "MultiPolygon") {
      // Take the first polygon for simplicity or calculate true center
      const latlngs = feature.geometry.coordinates[0][0].map((c: any) => [
        c[1],
        c[0],
      ]);
      layer = L.polygon(latlngs);
    }

    if (layer) {
      return layer.getBounds().getCenter();
    }
  } catch (e) {
    console.error("Error calculating center for feature:", feature, e);
  }
  return null;
};

const getLocationInfo = (lng: number, lat: number) => {
  // Helper to find container
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const findContainer = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.features.find((f: any) => {
      if (f.geometry.type === "Polygon") {
        return isPointInPolygon([lng, lat], f.geometry.coordinates[0]);
      }
      if (f.geometry.type === "MultiPolygon") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return f.geometry.coordinates.some((poly: any[]) =>
          isPointInPolygon([lng, lat], poly[0]),
        );
      }
      return false;
    });
  };

  const zone = findContainer(zoneData);
  const area = findContainer(areaData);
  const plot = findContainer(plotData);

  return {
    zoneName: zone?.properties?.name,
    areaName: area?.properties?.name,
    plotName: plot?.properties?.name,
  };
};

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

// ZoomListener Component to track map zoom changes
const ZoomListener = ({ onChange }: { onChange: (zoom: number) => void }) => {
  const map = useMapEvents({
    zoomend: () => {
      onChange(map.getZoom());
    },
  });
  return null;
};

interface SelectedEntityStats {
  total: number;
  healthy: number;
  diseased: number;
  harvesting: number;
  types: Record<string, number>;
}

const MapContent = () => {
  const isFullScreenParam =
    new URLSearchParams(window.location.search).get("fullscreen") === "true";

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRegion, setFilterRegion] = useState<string>("all");
  const [filterArea, setFilterArea] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const [mapCenter, setMapCenter] = useState<[number, number]>([
    11.558, 107.134,
  ]);
  const [mapZoom, setMapZoom] = useState(15);

  const [visibleLayers, setVisibleLayers] = useState({
    zone: true,
    area: false,
    plot: false,
    plant: false,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [selectedEntity, setSelectedEntity] = useState<{
    type: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    properties: any;
    stats: SelectedEntityStats;
  } | null>(null);

  // Process Plant Data with Random Status
  const processedPlantData = useMemo(() => {
    const statuses = ["healthy", "diseased", "harvesting"];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (plantData as any).features.map((feature: any) => {
      const randomStatus =
        statuses[Math.floor(Math.random() * statuses.length)];
      return {
        ...feature,
        properties: {
          ...feature.properties,
          status: randomStatus,
        },
      };
    });
    return {
      ...plantData,
      features,
    } as GeoJsonObject;
  }, []);

  // Helpers for Stats Calculation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateStats = (polyCoords: any[]): SelectedEntityStats => {
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
      // Status
      if (p.properties.status === "healthy") stats.healthy++;
      else if (p.properties.status === "diseased") stats.diseased++;
      else if (p.properties.status === "harvesting") stats.harvesting++;

      // Type/Name
      const name = p.properties.name || "Unknown";
      stats.types[name] = (stats.types[name] || 0) + 1;
    });

    return stats;
  };

  // Filter Plant Data based on Search and Status
  const filteredPlantData = useMemo(() => {
    if (!processedPlantData || !("features" in processedPlantData)) {
      return { type: "FeatureCollection", features: [] } as GeoJsonObject;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (processedPlantData as any).features.filter((f: any) => {
      const nameMatch =
        f.properties.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.properties.code.toLowerCase().includes(searchTerm.toLowerCase());
      const statusMatch =
        filterStatus === "all" || f.properties.status === filterStatus;
      return nameMatch && statusMatch;
    });

    return {
      ...processedPlantData,
      features,
    } as GeoJsonObject;
  }, [processedPlantData, searchTerm, filterStatus]);

  // Statistics
  const stats = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plants = (processedPlantData as any).features || [];
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      regions: (zoneData as any).features?.length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      areas: (areaData as any).features?.length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plots: (plotData as any).features?.length || 0,
      plants: plants.length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      healthy: plants.filter((p: any) => p.properties.status === "healthy")
        .length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      diseased: plants.filter((p: any) => p.properties.status === "diseased")
        .length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      harvesting: plants.filter(
        (p: any) => p.properties.status === "harvesting",
      ).length,
    };
  }, [processedPlantData]);

  // Handle auto-focus (Using Mocks for consistent ID lookup for now)
  useEffect(() => {
    if (filterRegion !== "all") {
      const reg = MOCK_REGIONS.find((r) => r.id.toString() === filterRegion);
      if (reg && reg.coordinates.length > 0) {
        setMapCenter([reg.coordinates[0].lat, reg.coordinates[0].lng]);
        setMapZoom(14);
      }
    }
  }, [filterRegion]);

  // Handle Zoom Change Logic
  const onZoomChange = (zoom: number) => {
    if (zoom < 14) {
      setVisibleLayers({ zone: true, area: false, plot: false, plant: false });
    } else if (zoom >= 14 && zoom < 16) {
      setVisibleLayers({ zone: false, area: true, plot: false, plant: false });
    } else if (zoom >= 16 && zoom < 18) {
      setVisibleLayers({ zone: false, area: false, plot: true, plant: false });
    } else if (zoom >= 18) {
      setVisibleLayers({ zone: true, area: true, plot: true, plant: true }); // Keep context
    }
  };

  // Styling Functions
  const zoneStyle = {
    color: "#2b8cbe",
    weight: 2,
    fillOpacity: 0.2,
    dashArray: "5, 5",
  };
  const areaStyle = { color: "#f03b20", weight: 2, fillOpacity: 0.1 };
  const plotStyle = { color: "#31a354", weight: 2, fillOpacity: 0.2 };

  const pointToLayer = (feature: Feature, latlng: L.LatLng) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const status = feature.properties?.status;
    let color = "#22c55e"; // healthy
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
      if (extraInfo) {
        popupContent += extraInfo;
      }
      return popupContent;
    };

    if (feature.geometry.type === "Point") {
      // For plants: existing logic
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
    } else {
      // For Polygons (Zone, Area, Plot)
      layer.bindTooltip(feature.properties?.name, { sticky: true });
      layer.on("click", (e) => {
        L.DomEvent.stopPropagation(e); // Stop propagation to avoid map click actions if we had any
        // Identify layer type loosely based on zoom or property structure, or pass context
        let type = "Unknown";
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((feature as any).properties["cropGroupId"]) type = "NotSupported"; // Just safety
        // We can infer type from properties or pass it.
        // But simply, we can guess based on data source structure or just say "Khu vực / Lô"
        // Let's assume based on property availability or just generic "Vùng chọn"
        if (feature.properties?.id && feature.properties?.regionId)
          type = "Khu vực (Area)";
        else if (feature.properties?.id && !feature.properties?.regionId)
          type = "Vùng trồng (Zone)";
        // Actually best to assume based on loop context, but `onEachFeature` doesn't know it easily without currying.
        // We'll settle for Generic Name.

        // Calculate Stats
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let polyCoords = (feature.geometry as any).coordinates[0];
        if (feature.geometry.type === "MultiPolygon")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          polyCoords = (feature.geometry as any).coordinates[0][0];

        const calculatedStats = calculateStats(polyCoords);

        setSelectedEntity({
          type: feature.properties?.name || "Selected Area",
          properties: feature.properties,
          stats: calculatedStats,
        });
      });
    }
  };

  return (
    <>
      <div
        className={cn(
          "flex relative group",
          isFullScreenParam ? "h-screen w-screen" : "h-[calc(100vh-140px)]",
        )}
      >
        {/* Sidebar Controls */}
        <div className="shrink-0 border-r bg-card flex flex-col h-full transition-all duration-300">
          {selectedEntity ? (
            // Detail / Report View
            <div className="flex flex-col h-full animate-in slide-in-from-left-5 fade-in bg-slate-50">
              <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      Chi tiết kỹ thuật
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Báo cáo tổng hợp
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="text-sm p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                >
                  <Search className="w-5 h-5 sr-only" />{" "}
                  {/* Using generic close icon if available, or just text X */}
                  Đóng
                </button>
              </div>

              <ScrollArea className="flex-1 p-2">
                {/* General Info Card */}
                <Card className="border-none shadow-sm mb-6">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Đối tượng
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {selectedEntity.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Mã số
                        </div>
                        <div className="font-mono font-medium bg-slate-100 px-2 py-0.5 rounded text-sm inline-block">
                          {selectedEntity.properties?.code || "N/A"}
                        </div>
                      </div>
                    </div>

                    {selectedEntity.properties?.area && (
                      <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between border border-primary/10">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-primary" />{" "}
                          {/* Area Icon */}
                          Tổng diện tích
                        </span>
                        <span className="font-bold text-lg">
                          {selectedEntity.properties.area}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            ha
                          </span>
                        </span>
                      </div>
                    )}

                    {/* Extra metadata if available */}
                    {selectedEntity.properties?.altitude && (
                      <div className="flex justify-between text-sm py-1 border-b border-dashed">
                        <span className="text-muted-foreground">
                          Độ cao trung bình
                        </span>
                        <span>{selectedEntity.properties.altitude}m</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Statistics Cards */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Sprout className="w-4 h-4" />
                    Thống kê cây trồng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-white border-none shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-slate-800">
                          {selectedEntity.stats.total}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                          Tổng cộng
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-green-600">
                          {selectedEntity.stats.healthy}
                        </div>
                        <div className="text-xs font-medium text-green-700 uppercase tracking-wide mt-1">
                          Khỏe mạnh
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-red-600">
                          {selectedEntity.stats.diseased}
                        </div>
                        <div className="text-xs font-medium text-red-700 uppercase tracking-wide mt-1">
                          Sâu bệnh
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {selectedEntity.stats.harvesting}
                        </div>
                        <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mt-1">
                          Thu hoạch
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Plant Types List */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Search className="w-4 h-4" />
                    Phân loại cây (
                    {Object.keys(selectedEntity.stats.types).length})
                  </h4>
                  <Card className="border-none shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {Object.entries(selectedEntity.stats.types).map(
                        ([name, count]) => (
                          <div
                            key={name}
                            className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {name}
                            </span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              {count} cây
                            </span>
                          </div>
                        ),
                      )}
                      {Object.keys(selectedEntity.stats.types).length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Chưa có dữ liệu cây trồng trong khu vực này.
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          ) : (
            // Standard View
            <>
              <div className="p-4 border-b space-y-4">
                <div>
                  <Label>Tìm kiếm cây trồng</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tên, mã cây..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Note: Filters for Region/Area are visual only now as we load full GeoJSON */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label>Vùng trồng</Label>
                    <Select
                      value={filterRegion}
                      onValueChange={setFilterRegion}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {MOCK_REGIONS.map((r) => (
                          <SelectItem key={r.id} value={r.id.toString()}>
                            {r.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Khu vực</Label>
                    <Select value={filterArea} onValueChange={setFilterArea}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tất cả" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả</SelectItem>
                        {MOCK_AREAS.filter(
                          (a) =>
                            filterRegion === "all" ||
                            a.regionId.toString() === filterRegion,
                        ).map((a) => (
                          <SelectItem key={a.id} value={a.id.toString()}>
                            {a.code}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Trạng thái cây</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tất cả trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="healthy">Khỏe mạnh</SelectItem>
                      <SelectItem value="diseased">Bị bệnh</SelectItem>
                      <SelectItem value="harvesting">Đang thu hoạch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" /> Thống kê nhanh
                </h3>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stats.healthy}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <Sprout className="w-3 h-3" /> Cây khỏe
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.diseased}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Cần xử lý
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span>Tổng diện tích</span>
                      <span className="font-medium">
                        {/* Removed filteredRegions, using MOCK_REGIONS directly for sum */}
                        {MOCK_REGIONS.reduce((acc, r) => acc + r.area, 0)} ha
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Số vùng trồng</span>
                      <span className="font-medium">{stats.regions}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Số khu vực</span>
                      <span className="font-medium">{stats.areas}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b">
                      <span>Số lô trồng</span>
                      <span className="font-medium">{stats.plots}</span>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 relative bg-slate-100 -z-0">
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
              {/* Zone Layer (Regions) */}
              <LayersControl.Overlay
                checked={visibleLayers.zone}
                name="Vùng trồng (Regions)"
              >
                <LayerGroup>
                  {visibleLayers.zone && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <GeoJSON
                      key="layer-zone"
                      data={zoneData as any}
                      style={zoneStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Area Layer */}
              <LayersControl.Overlay
                checked={visibleLayers.area}
                name="Khu vực (Areas)"
              >
                <LayerGroup>
                  {visibleLayers.area && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <GeoJSON
                      key="layer-area"
                      data={areaData as any}
                      style={areaStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Plot Layer */}
              <LayersControl.Overlay
                checked={visibleLayers.plot}
                name="Lô trồng (Plots)"
              >
                <LayerGroup>
                  {visibleLayers.plot && (
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    <GeoJSON
                      key="layer-plot"
                      data={plotData as any}
                      style={plotStyle}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>

              {/* Plant Layer */}
              <LayersControl.Overlay
                checked={visibleLayers.plant}
                name="Cây trồng (Plants)"
              >
                <LayerGroup>
                  {visibleLayers.plant && (
                    <GeoJSON
                      key={`layer-plant-${searchTerm}-${filterStatus}`}
                      data={filteredPlantData}
                      pointToLayer={pointToLayer}
                      onEachFeature={onEachFeature}
                    />
                  )}
                </LayerGroup>
              </LayersControl.Overlay>
            </LayersControl>

            {/* Labels */}
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

            {/* Legend - Updated with Dynamic Status */}
            <div className="absolute bottom-4 left-4 bg-white p-2 rounded shadow-lg z-1000 text-xs text-slate-700">
              <div className="font-semibold mb-2">Chú thích</div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>{" "}
                Khỏe mạnh
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm"></div>{" "}
                Thu hoạch
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>{" "}
                Sâu bệnh
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.zone ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-blue-500 border border-white shadow-sm"></div>
                Vùng
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.area ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>
                Khu vực
              </div>
              <div
                className={`flex items-center gap-2 ${visibleLayers.plot ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
                Lô
              </div>
            </div>
          </MapContainer>

          {/* Full Screen Toggle Button */}
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
      </div>

      {/* <Dialog
        open={isFullScreenParam && !!selectedEntity}
        onOpenChange={(open) => !open && setSelectedEntity(null)}
      >
        <DialogContent className="sm:max-w-[400px] p-0 gap-0 overflow-hidden bg-slate-50 max-h-[90vh] flex flex-col">
          {selectedEntity && (
            <div className="flex flex-col h-full">
              <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
                <div className="flex items-center gap-2">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Search className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg leading-tight">
                      Chi tiết kỹ thuật
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Báo cáo tổng hợp
                    </p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-2">
                <Card className="border-none shadow-sm mb-6">
                  <CardContent className="p-4 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm text-muted-foreground">
                          Đối tượng
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {selectedEntity.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Mã số
                        </div>
                        <div className="font-mono font-medium bg-slate-100 px-2 py-0.5 rounded text-sm inline-block">
                          {selectedEntity.properties?.code || "N/A"}
                        </div>
                      </div>
                    </div>

                    {selectedEntity.properties?.area && (
                      <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between border border-primary/10">
                        <span className="text-sm font-medium flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-primary" />{" "}
                          Tổng diện tích
                        </span>
                        <span className="font-bold text-lg">
                          {selectedEntity.properties.area}{" "}
                          <span className="text-sm font-normal text-muted-foreground">
                            ha
                          </span>
                        </span>
                      </div>
                    )}

                    {selectedEntity.properties?.altitude && (
                      <div className="flex justify-between text-sm py-1 border-b border-dashed">
                        <span className="text-muted-foreground">
                          Độ cao trung bình
                        </span>
                        <span>{selectedEntity.properties.altitude}m</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Sprout className="w-4 h-4" />
                    Thống kê cây trồng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-white border-none shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-slate-800">
                          {selectedEntity.stats.total}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                          Tổng cộng
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-green-600">
                          {selectedEntity.stats.healthy}
                        </div>
                        <div className="text-xs font-medium text-green-700 uppercase tracking-wide mt-1">
                          Khỏe mạnh
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-red-600">
                          {selectedEntity.stats.diseased}
                        </div>
                        <div className="text-xs font-medium text-red-700 uppercase tracking-wide mt-1">
                          Sâu bệnh
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {selectedEntity.stats.harvesting}
                        </div>
                        <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mt-1">
                          Thu hoạch
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Search className="w-4 h-4" />
                    Phân loại cây (
                    {Object.keys(selectedEntity.stats.types).length})
                  </h4>
                  <Card className="border-none shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {Object.entries(selectedEntity.stats.types).map(
                        ([name, count]) => (
                          <div
                            key={name}
                            className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-sm font-medium text-slate-700">
                              {name}
                            </span>
                            <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                              {count} cây
                            </span>
                          </div>
                        ),
                      )}
                      {Object.keys(selectedEntity.stats.types).length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Chưa có dữ liệu cây trồng trong khu vực này.
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </ScrollArea>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
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
