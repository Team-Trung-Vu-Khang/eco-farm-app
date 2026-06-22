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
  DialogHeader,
  DialogTitle,
  DialogFooter,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
import * as turf from "@turf/turf";
import "leaflet/dist/leaflet.css";
import {
  Search,
  AlertTriangle,
  Sprout,
  Maximize2,
  Minimize2,
  FlaskConical,
  Droplets,
  Thermometer,
  Info,
  Save,
  Activity,
} from "lucide-react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";

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
  varieties: Array<{
    name: string;
    count: number;
  }>;
  plots: Array<{
    id: string;
    name: string;
    status: "healthy" | "diseased" | "harvesting";
    pointCount: number;
  }>;
}

type PlotStatus = "healthy" | "diseased" | "harvesting";

type PlotDefinition = {
  key: string;
  name: string;
  status: PlotStatus;
  pointCount: number;
  varietyName: string;
  center: [number, number] | null;
  coordinates: [number, number][];
};

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

  const [soilData, setSoilData] = useState<Record<string, any>>({});
  const [isEditingSoil, setIsEditingSoil] = useState(false);
  const [tempSoil, setTempSoil] = useState<any>(null);

  const derivePointStatus = (seed: string) => {
    let hash = 0;
    for (let i = 0; i < seed.length; i += 1) {
      hash = (hash * 31 + seed.charCodeAt(i)) % 1000;
    }

    if (hash % 10 < 6) return "healthy" as const;
    if (hash % 10 < 8) return "diseased" as const;
    return "harvesting" as const;
  };

  const normalizeRiceVariety = (name: string) => {
    return name
      .replace(/^Cây\s+Lúa\s+/i, "")
      .replace(/^Lúa\s+/i, "")
      .trim();
  };

  const formatPlotStatusLabel = (status: PlotStatus) => {
    if (status === "diseased") return "Sâu bệnh";
    if (status === "harvesting") return "Đang thu hoạch";
    return "Khỏe mạnh";
  };

  const getPlotStatusBadgeClass = (status: PlotStatus) => {
    if (status === "diseased") return "bg-red-50 text-red-700";
    if (status === "harvesting") return "bg-yellow-50 text-yellow-700";
    return "bg-green-50 text-green-700";
  };

  const getPlotKey = (feature: any, index?: number) => {
    const areaId = String(feature?.properties?.areaId || "area");
    const name = String(feature?.properties?.name || `plot-${index ?? 0}`);
    return `${areaId}:${name}`;
  };

  const buildPlotPopupHtml = (plot: PlotDefinition, feature: any) => {
    const coords = plot.center;
    const locationInfo = coords
      ? getLocationInfo(coords[0], coords[1])
      : {};
    const variety = plot.varietyName || "Không xác định";
    const title = variety !== "Không xác định" ? `Cây Lúa ${variety}` : plot.name;
    const statusLabel = formatPlotStatusLabel(plot.status);
    const badgeClass = getPlotStatusBadgeClass(plot.status);
    const code = feature.properties?.code || plot.key;
    const lat = coords ? coords[1].toFixed(6) : "N/A";
    const lng = coords ? coords[0].toFixed(6) : "N/A";

    return `
      <div class="min-w-[220px] max-w-[240px]">
        <div class="min-w-0">
          <div class="text-[18px] font-bold leading-tight text-slate-900 truncate">${title}</div>
          <div class="text-[13px] text-slate-700 mt-0.5">Mã: <span class="font-medium">${code}</span></div>
          <div class="text-[13px] text-slate-700 mt-0.5">Trạng thái: <span class="font-medium">${statusLabel}</span></div>
        </div>

        <div class="my-2.5 border-t border-slate-200"></div>

        <div class="space-y-1.5 text-[13px] text-slate-700">
          <div class="text-slate-500">📍 ${lat}, ${lng}</div>
          <div>🏠 Vùng: <span class="font-semibold">${locationInfo.zoneName || "Farm"}</span></div>
          <div>🌳 Khu vực: <span class="font-semibold">${locationInfo.areaName || "Chưa xác định"}</span></div>
          <div>🌱 Lô: <span class="font-semibold">${plot.name}</span></div>
        </div>
      </div>
    `;
  };

  // Initialize soil data with 0s if empty
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
    setSoilData((prev) => ({
      ...prev,
      [currentId]: tempSoil,
    }));
    setIsEditingSoil(false);
  };

  const plotDefinitions = useMemo<PlotDefinition[]>(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plots = (plotData as any).features || [];

    return plots.map((plot: any, index: number) => {
      const plotCoords =
        plot.geometry.type === "Polygon"
          ? plot.geometry.coordinates[0]
          : plot.geometry.type === "MultiPolygon"
            ? plot.geometry.coordinates[0][0]
            : [];

      const plotCenterRaw = plot.center || getPolygonCenter(plot);
      const plotCenter = Array.isArray(plotCenterRaw)
        ? plotCenterRaw
        : plotCenterRaw
          ? ([plotCenterRaw.lng, plotCenterRaw.lat] as [number, number])
          : null;

      // Derive the one rice variety represented by this plot from the points it contains.
      // We keep the model to one variety per plot and pick the most common one if data is mixed.
      const varietyCounts: Record<string, number> = {};
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (plantData as any).features.forEach((feature: any) => {
        const coords = feature.geometry?.coordinates as [number, number];
        if (!plotCoords || plotCoords.length < 3) return;
        if (!isPointInPolygon(coords, plotCoords)) return;
        const variety = normalizeRiceVariety(
          String(feature.properties?.name || "Không xác định"),
        );
        varietyCounts[variety] = (varietyCounts[variety] || 0) + 1;
      });

      const varietyName =
        Object.entries(varietyCounts).sort(
          (a, b) => b[1] - a[1] || a[0].localeCompare(b[0]),
        )[0]?.[0] || "Không xác định";

      const status: PlotStatus =
        index % 3 === 0
          ? "healthy"
          : index % 3 === 1
            ? "diseased"
            : "harvesting";

      return {
        key: getPlotKey(plot, index),
        name: plot.properties?.name || "Lô",
        status,
        pointCount: 0,
        varietyName,
        center: plotCenter,
        coordinates: plotCoords as [number, number][],
      };
    });
  }, []);

  // Process point data so each point inherits the status of the plot it belongs to
  const processedPlantData = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (plantData as any).features.map((feature: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const coords = feature.geometry?.coordinates as [number, number];
      const matchedPlot = plotDefinitions.find(
        (plot) => plot.coordinates.length >= 3 && isPointInPolygon(coords, plot.coordinates),
      );
      const seed =
        String(
          feature.properties?.code ||
            feature.properties?.rowId ||
            feature.properties?.id ||
            "",
        );
      const derivedStatus =
        matchedPlot?.status || derivePointStatus(seed);
      return {
        ...feature,
        properties: {
          ...feature.properties,
          status: derivedStatus,
          plotKey: matchedPlot?.key || null,
        },
      };
    });
    return {
      ...plantData,
      features,
    } as GeoJsonObject;
  }, [plotDefinitions]);

  const plotStatusMap = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const points = (processedPlantData as any).features || [];

    return plotDefinitions.map((plot) => {
      const pointsInPlot = points.filter((point: any) => {
        const pointPlotKey = point.properties?.plotKey;
        if (pointPlotKey) return pointPlotKey === plot.key;
        return plot.coordinates.length >= 3
          ? isPointInPolygon(point.geometry.coordinates, plot.coordinates)
          : false;
      });

      return {
        ...plot,
        pointCount: pointsInPlot.length,
      };
    });
  }, [plotDefinitions, processedPlantData]);

  // Helpers for Stats Calculation
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const calculateStats = (feature: any): SelectedEntityStats => {
    const outerPolygon =
      feature.geometry.type === "Polygon"
        ? feature.geometry.coordinates[0]
        : feature.geometry.type === "MultiPolygon"
          ? feature.geometry.coordinates[0][0]
          : [];

    const plotsInScope = plotStatusMap.filter((plot) => {
      if (outerPolygon.length < 3 || !plot.center) return false;
      return isPointInPolygon(plot.center, outerPolygon);
    });

    const stats: SelectedEntityStats = {
      total: plotsInScope.length,
      healthy: 0,
      diseased: 0,
      harvesting: 0,
      varieties: [],
      plots: [],
    };

    plotsInScope.forEach((plot) => {
      stats[plot.status] += 1;
      stats.plots.push({
        id: plot.key,
        name: plot.name,
        status: plot.status,
        pointCount: plot.pointCount,
      });
    });

    stats.varieties = Object.entries(
      plotsInScope.reduce((acc: Record<string, number>, plot) => {
        const variety = plot.varietyName || "Không xác định";
        acc[variety] = (acc[variety] || 0) + 1;
        return acc;
      }, {}),
    )
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));

    return stats;
  };

  // Filter point data based on search and status
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
    const plots = plotStatusMap || [];
    return {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      regions: (zoneData as any).features?.length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      areas: (areaData as any).features?.length || 0,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      plots: (plotData as any).features?.length || 0,
      healthy: plots.filter((plot) => plot.status === "healthy").length,
      diseased: plots.filter((plot) => plot.status === "diseased").length,
      harvesting: plots.filter((plot) => plot.status === "harvesting").length,
    };
  }, [plotStatusMap]);

  const zoneOptions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const features = (zoneData as any).features || [];
    return features
      .map((feature: any, index: number) => {
        const label = String(feature.properties?.name || `Vùng ${index + 1}`);
        const value = String(feature.properties?.id || label);
        const center = getPolygonCenter(feature);
        return {
          value,
          label,
          center: center ? ([center.lat, center.lng] as [number, number]) : null,
        };
      })
      .filter(
        (item, index, self) =>
          self.findIndex((other) => other.value === item.value) === index,
      );
  }, []);

  const areaOptions = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const areas = (areaData as any).features || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const plots = (plotData as any).features || [];

    return areas
      .map((feature: any, index: number) => {
        const label = String(feature.properties?.name || `Khu vực ${index + 1}`);
        const value =
          String(label.match(/Khu vực\s+([A-Z])/i)?.[1] || label.split(" ").pop() || index + 1);
        const center = getPolygonCenter(feature);
        const plotCount = plots.filter(
          (plot: any) => String(plot.properties?.areaId || "") === value,
        ).length;
        return {
          value,
          label: `${label}${plotCount ? ` (${plotCount} lô)` : ""}`,
          center: center ? ([center.lat, center.lng] as [number, number]) : null,
        };
      })
      .filter(
        (item, index, self) =>
          self.findIndex((other) => other.value === item.value) === index,
      );
  }, []);

  const totalAreaHa = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const source = zoneData as any;
    return (turf.area(source) / 10000).toFixed(2);
  }, []);

  // Handle auto-focus using the current GeoJSON data
  useEffect(() => {
    if (filterRegion === "all") return;
    const zone = zoneOptions.find((item) => item.value === filterRegion);
    if (zone?.center) {
      setMapCenter(zone.center);
      setMapZoom(14);
    }
  }, [filterRegion, zoneOptions]);

  useEffect(() => {
    if (filterArea === "all") return;
    const area = areaOptions.find((item) => item.value === filterArea);
    if (area?.center) {
      setMapCenter(area.center);
      setMapZoom(15);
    }
  }, [filterArea, areaOptions]);

  // Handle Zoom Change Logic
  const onZoomChange = (zoom: number) => {
    if (zoom < 14) {
      setVisibleLayers({ zone: true, area: false, plot: false, plant: false });
    } else if (zoom >= 14 && zoom < 16) {
      setVisibleLayers({ zone: false, area: true, plot: false, plant: false });
    } else {
      setVisibleLayers({ zone: false, area: false, plot: true, plant: false });
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
  const getPlotStyle = (feature: Feature) => {
    const key = getPlotKey(feature as any);
    const status =
      plotStatusMap.find((plot) => plot.key === key)?.status || "healthy";

    const styles = {
      healthy: { color: "#22c55e", weight: 2, fillOpacity: 0.22 },
      diseased: { color: "#ef4444", weight: 2, fillOpacity: 0.26 },
      harvesting: { color: "#eab308", weight: 2, fillOpacity: 0.24 },
    } as const;

    return styles[status as keyof typeof styles];
  };

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

        const calculatedStats = calculateStats(feature);
        const plotKey = getPlotKey(feature as any);
        const plotInfo = plotStatusMap.find((plot) => plot.key === plotKey);

        if (feature.properties?.areaId && plotInfo) {
          layer.bindPopup(buildPlotPopupHtml(plotInfo, feature), {
            closeButton: true,
            autoClose: true,
            closeOnClick: true,
            maxWidth: 240,
            className: "plot-popup",
          });
          layer.openPopup(e.latlng);
        }

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
                          Đối tượng giám sát
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {selectedEntity.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Mã lô
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
                    Thống kê lô ruộng
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <Card className="bg-white border-none shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-slate-800">
                          {selectedEntity.stats.total}
                        </div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                          Tổng lô
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-green-600">
                          {selectedEntity.stats.healthy}
                        </div>
                        <div className="text-xs font-medium text-green-700 uppercase tracking-wide mt-1">
                          Lô khỏe
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-red-50 border-red-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-red-600">
                          {selectedEntity.stats.diseased}
                        </div>
                        <div className="text-xs font-medium text-red-700 uppercase tracking-wide mt-1">
                          Lô sâu bệnh
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
                      <CardContent className="p-4 flex flex-col items-center justify-center">
                        <div className="text-3xl font-bold text-yellow-600">
                          {selectedEntity.stats.harvesting}
                        </div>
                        <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mt-1">
                          Lô thu hoạch
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Soil Health Section */}
                <div className="mb-6 px-2">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2 text-sm text-slate-700">
                      <FlaskConical className="w-4 h-4 text-indigo-500" />
                      Chỉ số sức khỏe đất
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary"
                      onClick={handleEditSoil}
                    >
                      <Activity className="w-3 h-3 mr-1" />
                      Cập nhật
                    </Button>
                  </div>

                  <Card className="border-none shadow-sm overflow-hidden bg-white">
                    <CardContent className="p-4">
                      <div className="space-y-4">
                        {(() => {
                          const currentId =
                            selectedEntity?.properties?.code ||
                            selectedEntity?.properties?.id;
                          const currentSoil = soilData[currentId] || {
                            ph: 0,
                            moisture: 0,
                            temperature: 0,
                            compaction: 0,
                            nitrogen: 0,
                            phosphorus: 0,
                            potassium: 0,
                            organicMatter: 0,
                            lastTested: "Chưa có dữ liệu",
                          };
                          return (
                            <>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                    <span className="text-[10px] font-bold uppercase text-indigo-600">
                                      Độ pH
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-indigo-900 leading-none">
                                    {currentSoil.ph}
                                  </div>
                                  <div className="text-[9px] text-indigo-500 mt-1">
                                    Mức:{" "}
                                    {currentSoil.ph === 0
                                      ? "N/A"
                                      : currentSoil.ph > 7
                                        ? "Kiềm"
                                        : currentSoil.ph < 6
                                          ? "Chua"
                                          : "Tối ưu"}
                                  </div>
                                </div>
                                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Droplets className="w-3.5 h-3.5 text-blue-500" />
                                    <span className="text-[10px] font-bold uppercase text-blue-600">
                                      Độ ẩm
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-blue-900 leading-none">
                                    {currentSoil.moisture}%
                                  </div>
                                  <div className="text-[9px] text-blue-500 mt-1">
                                    Trạng thái:{" "}
                                    {currentSoil.moisture === 0 ? "N/A" : "Tốt"}
                                  </div>
                                </div>
                                <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                                    <span className="text-[10px] font-bold uppercase text-orange-600">
                                      Nhiệt độ
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-orange-900 leading-none">
                                    {currentSoil.temperature}°C
                                  </div>
                                  <div className="text-[9px] text-orange-500 mt-1">
                                    {currentSoil.temperature === 0
                                      ? "N/A"
                                      : "Ổn định"}
                                  </div>
                                </div>
                                <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
                                  <div className="flex items-center gap-2 mb-1">
                                    <Activity className="w-3.5 h-3.5 text-emerald-500" />
                                    <span className="text-[10px] font-bold uppercase text-emerald-600">
                                      Độ nén
                                    </span>
                                  </div>
                                  <div className="text-xl font-bold text-emerald-900 leading-none">
                                    {currentSoil.compaction}
                                  </div>
                                  <div className="text-[9px] text-emerald-500 mt-1">
                                    psi (
                                    {currentSoil.compaction === 0
                                      ? "N/A"
                                      : "Tốt"}
                                    )
                                  </div>
                                </div>
                              </div>

                              <div className="grid grid-cols-4 gap-2">
                                <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <div className="text-[9px] font-bold text-slate-400">
                                    N
                                  </div>
                                  <div className="text-xs font-bold text-slate-700">
                                    {currentSoil.nitrogen}
                                  </div>
                                </div>
                                <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <div className="text-[9px] font-bold text-slate-400">
                                    P
                                  </div>
                                  <div className="text-xs font-bold text-slate-700">
                                    {currentSoil.phosphorus}
                                  </div>
                                </div>
                                <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <div className="text-[9px] font-bold text-slate-400">
                                    K
                                  </div>
                                  <div className="text-xs font-bold text-slate-700">
                                    {currentSoil.potassium}
                                  </div>
                                </div>
                                <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                  <div className="text-[9px] font-bold text-slate-400">
                                    OM
                                  </div>
                                  <div className="text-xs font-bold text-slate-700">
                                    {currentSoil.organicMatter}%
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Info className="w-3 h-3" />
                                  Lần đo cuối:
                                </span>
                                <span className="text-xs font-medium text-slate-600">
                                  {currentSoil.lastTested}
                                </span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Plot List */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Search className="w-4 h-4" />
                    Danh sách lô ({selectedEntity.stats.plots.length})
                  </h4>
                  <Card className="border-none shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {selectedEntity.stats.plots.map((plot) => {
                        const statusLabel = {
                          healthy: "Lô khỏe",
                          diseased: "Lô sâu bệnh",
                          harvesting: "Lô thu hoạch",
                        }[plot.status];

                        const statusClass = {
                          healthy: "bg-green-50 text-green-700 border-green-200",
                          diseased: "bg-red-50 text-red-700 border-red-200",
                          harvesting:
                            "bg-yellow-50 text-yellow-700 border-yellow-200",
                        }[plot.status];

                        return (
                          <div
                            key={plot.id}
                            className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-700 truncate">
                                {plot.name}
                              </div>
                            </div>
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full border shrink-0 ${statusClass}`}
                            >
                              {statusLabel}
                            </span>
                          </div>
                        );
                      })}
                      {selectedEntity.stats.plots.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Chưa có lô nào nằm trong phạm vi này.
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
                    <Sprout className="w-4 h-4 text-green-600" />
                    Giống lúa trong lô
                  </h4>
                  <Card className="border-none shadow-sm overflow-hidden">
                    <div className="divide-y">
                      {selectedEntity.stats.varieties.map((variety) => (
                        <div
                          key={variety.name}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                        >
                          <span className="text-sm font-medium text-slate-700 truncate">
                            {variety.name}
                          </span>
                          <span className="text-xs font-bold bg-green-50 text-green-700 px-2 py-1 rounded-full border border-green-200 shrink-0">
                            {variety.count}
                          </span>
                        </div>
                      ))}
                      {selectedEntity.stats.varieties.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Chưa có dữ liệu giống lúa trong lô này.
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
                  <Label>Tìm kiếm lô ruộng</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Tên, mã lô..."
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
                      <SelectTrigger className="w-full pr-2">
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            minWidth: 0,
                            textAlign: "left",
                          }}
                        >
                          <SelectValue placeholder="Tất cả" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {zoneOptions.map((zone) => (
                          <SelectItem key={zone.value} value={zone.value}>
                            {zone.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Khu vực</Label>
                    <Select value={filterArea} onValueChange={setFilterArea}>
                      <SelectTrigger className="w-full pr-2">
                        <span
                          style={{
                            display: "block",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            width: "100%",
                            minWidth: 0,
                            textAlign: "left",
                          }}
                        >
                          <SelectValue placeholder="Tất cả" />
                        </span>
                      </SelectTrigger>
                      <SelectContent className="z-[9999]">
                        <SelectItem value="all">Tất cả</SelectItem>
                        {areaOptions.map((area) => (
                          <SelectItem key={area.value} value={area.value}>
                            {area.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Trạng thái lô</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-full pr-2">
                      <span
                        style={{
                          display: "block",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          width: "100%",
                          minWidth: 0,
                          textAlign: "left",
                        }}
                      >
                        <SelectValue placeholder="Tất cả trạng thái" />
                      </span>
                    </SelectTrigger>
                    <SelectContent className="z-[9999]">
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="healthy">Lô khỏe</SelectItem>
                      <SelectItem value="diseased">Lô sâu bệnh</SelectItem>
                      <SelectItem value="harvesting">Lô thu hoạch</SelectItem>
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
                        <Sprout className="w-3 h-3" /> Lô khỏe
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardContent className="p-3 text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {stats.diseased}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Lô sâu bệnh
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="space-y-4">
                  <div className="text-sm">
                    <div className="flex justify-between py-2 border-b">
                      <span>Tổng diện tích</span>
                      <span className="font-medium">
                        {totalAreaHa} ha
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
                      <span>Số lô</span>
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
                      style={getPlotStyle}
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
                const plotKey = String(
                  getPlotKey(f),
                );
                const plotStatus =
                  plotStatusMap.find((plot) => plot.key === plotKey)?.status ||
                  "healthy";
                const dotClass =
                  plotStatus === "diseased"
                    ? "bg-red-500"
                    : plotStatus === "harvesting"
                      ? "bg-yellow-500"
                      : "bg-green-500";
                const textClass =
                  plotStatus === "diseased"
                    ? "text-red-900"
                    : plotStatus === "harvesting"
                      ? "text-yellow-900"
                      : "text-green-900";
                return (
                  <Marker
                    key={`label-plot-${i}`}
                    position={center}
                    icon={L.divIcon({
                      className: "bg-transparent border-none",
                      html: `
                        <div class="flex flex-col items-center justify-center">
                          <div class="w-1.5 h-1.5 ${dotClass} rounded-full border border-white shadow-sm"></div>
                          <div class="${textClass} text-[9px] font-bold whitespace-nowrap drop-shadow-md mt-0.5">${f.properties.name}</div>
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
                Lô khỏe
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-yellow-500 border border-white shadow-sm"></div>{" "}
                Lô thu hoạch
              </div>
              <div
                className={`flex items-center gap-2 mb-1 ${visibleLayers.plant ? "opacity-100" : "opacity-40"}`}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow-sm"></div>{" "}
                Lô sâu bệnh
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
                          Đối tượng giám sát
                        </div>
                        <div className="text-xl font-bold text-primary">
                          {selectedEntity.type}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Mã lô
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
                    Thống kê lô ruộng
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
                    Phân loại điểm ghi nhận (
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
                              {count} điểm
                            </span>
                          </div>
                        ),
                      )}
                      {Object.keys(selectedEntity.stats.types).length === 0 && (
                        <div className="p-8 text-center text-muted-foreground text-sm">
                          Chưa có dữ liệu ghi nhận trong khu vực này.
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
      <Dialog open={isEditingSoil} onOpenChange={setIsEditingSoil}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-primary" />
              Cập nhật chỉ số thổ nhưỡng
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Độ pH
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={tempSoil?.ph}
                  onChange={(e) =>
                    setTempSoil({ ...tempSoil, ph: parseFloat(e.target.value) })
                  }
                  className="bg-slate-50/50"
                  placeholder="Ví dụ: 6.5"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Độ ẩm (%)
                </Label>
                <Input
                  type="number"
                  value={tempSoil?.moisture}
                  onChange={(e) =>
                    setTempSoil({
                      ...tempSoil,
                      moisture: parseFloat(e.target.value),
                    })
                  }
                  className="bg-slate-50/50"
                  placeholder="Ví dụ: 70"
                />
              </div>
            </div>

            <div className="space-y-3">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Chỉ số NPK (mg/kg)
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-center text-red-500 px-1 border border-red-100 rounded bg-red-50/50">
                    N
                  </div>
                  <Input
                    type="number"
                    value={tempSoil?.nitrogen}
                    onChange={(e) =>
                      setTempSoil({
                        ...tempSoil,
                        nitrogen: parseFloat(e.target.value),
                      })
                    }
                    className="h-9 text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-center text-blue-500 px-1 border border-blue-100 rounded bg-blue-50/50">
                    P
                  </div>
                  <Input
                    type="number"
                    value={tempSoil?.phosphorus}
                    onChange={(e) =>
                      setTempSoil({
                        ...tempSoil,
                        phosphorus: parseFloat(e.target.value),
                      })
                    }
                    className="h-9 text-center"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-center text-orange-500 px-1 border border-orange-100 rounded bg-orange-50/50">
                    K
                  </div>
                  <Input
                    type="number"
                    value={tempSoil?.potassium}
                    onChange={(e) =>
                      setTempSoil({
                        ...tempSoil,
                        potassium: parseFloat(e.target.value),
                      })
                    }
                    className="h-9 text-center"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Hữu cơ (%)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={tempSoil?.organicMatter}
                  onChange={(e) =>
                    setTempSoil({
                      ...tempSoil,
                      organicMatter: parseFloat(e.target.value),
                    })
                  }
                  className="bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  EC (mS/cm)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={tempSoil?.ec}
                  onChange={(e) =>
                    setTempSoil({ ...tempSoil, ec: parseFloat(e.target.value) })
                  }
                  className="bg-slate-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Nhiệt độ (°C)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  value={tempSoil?.temperature}
                  onChange={(e) =>
                    setTempSoil({
                      ...tempSoil,
                      temperature: parseFloat(e.target.value),
                    })
                  }
                  className="bg-slate-50/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase text-slate-500">
                  Độ nén (psi)
                </Label>
                <Input
                  type="number"
                  value={tempSoil?.compaction}
                  onChange={(e) =>
                    setTempSoil({
                      ...tempSoil,
                      compaction: parseFloat(e.target.value),
                    })
                  }
                  className="bg-slate-50/50"
                />
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsEditingSoil(false)}
              className="flex-1 sm:flex-none"
            >
              Hủy bỏ
            </Button>
            <Button
              variant="default"
              onClick={handleSaveSoil}
              className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Lưu thông tin
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
      isRice
      title="Bản đồ số nông nghiệp"
      description="Quản lý trực quan vùng trồng và lô ruộng"
    >
      <MapContent />
    </AdminLayout>
  );
};
export default MapViewPage;
