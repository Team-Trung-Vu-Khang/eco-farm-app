import type { Feature, Geometry } from "geojson";
import L from "leaflet";
import { useEffect } from "react";
import {
  GeoJSON,
  LayersControl,
  MapContainer,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import type { SelectedSoilFeature, SoilGeoCollection, SoilMetric } from "../types";
import {
  createFeatureStyle,
  createSelectedFeature,
  createTooltipHtml,
  METRIC_CONFIG,
} from "../utils";

interface SoilMapCanvasProps {
  activeMetric: SoilMetric;
  areaCollection: SoilGeoCollection;
  mapViewState: { center: [number, number]; zoom: number };
  onFeatureSelect: (selectedFeature: SelectedSoilFeature) => void;
  onZoomChange: (zoom: number) => void;
  plotCollection: SoilGeoCollection;
  soilDataMap: Map<string, SelectedSoilFeature["data"]>;
  visibleLayers: {
    zone: boolean;
    area: boolean;
    plot: boolean;
  };
  zoneCollection: SoilGeoCollection;
}

function MapUpdater({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, map, zoom]);

  return null;
}

function ZoomListener({ onChange }: { onChange: (zoom: number) => void }) {
  useMapEvents({
    zoomend(event) {
      onChange(event.target.getZoom());
    },
  });

  return null;
}

export function SoilMapCanvas({
  activeMetric,
  areaCollection,
  mapViewState,
  onFeatureSelect,
  onZoomChange,
  plotCollection,
  soilDataMap,
  visibleLayers,
  zoneCollection,
}: SoilMapCanvasProps) {
  const onEachFeature = (
    feature: Feature<Geometry> | undefined,
    layer: L.Layer,
  ) => {
    if (!feature) {
      return;
    }

    const properties = feature.properties ?? {};
    const featureId = properties.id?.toString();
    if (!featureId) {
      return;
    }

    const data = soilDataMap.get(featureId);
    if (!data) {
      return;
    }

    const name =
      typeof properties.name === "string" && properties.name.trim()
        ? properties.name
        : "Khu vực không tên";

    layer.bindTooltip(createTooltipHtml(name, activeMetric, data), {
      sticky: true,
      direction: "top",
    });

    layer.on({
      mouseover: (event) => {
        const targetLayer = event.target as L.Path;
        targetLayer.setStyle({
          weight: 3,
          color: "#666",
          dashArray: "",
          fillOpacity: 0.8,
        });
      },
      mouseout: (event) => {
        const targetLayer = event.target as L.Path;
        targetLayer.setStyle({
          weight: 1,
          color: "white",
          dashArray: "3",
          fillOpacity: 0.7,
        });
      },
      click: (event) => {
        L.DomEvent.stopPropagation(event);
        onFeatureSelect(createSelectedFeature(properties, data));
      },
    });
  };

  const renderLegend = () => (
    <div className="absolute bottom-6 right-6 z-[100000] w-48 rounded-lg border border-border bg-white/90 p-3 shadow-lg backdrop-blur">
      <h4 className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        {METRIC_CONFIG[activeMetric].label}
      </h4>
      <p className="mb-2 text-[10px] leading-tight text-muted-foreground">
        {METRIC_CONFIG[activeMetric].description}
      </p>
      <div className="mb-1 flex justify-between text-[10px] font-medium">
        <span>{METRIC_CONFIG[activeMetric].range[0]}</span>
        <span>
          {METRIC_CONFIG[activeMetric].range[1]} {METRIC_CONFIG[activeMetric].unit}
        </span>
      </div>
      <div className="relative h-3 w-full overflow-hidden rounded-full border border-black/5">
        <div
          style={{
            width: "100%",
            height: "100%",
            background: `linear-gradient(to right, ${METRIC_CONFIG[activeMetric].colorScale(METRIC_CONFIG[activeMetric].range[0])}, ${METRIC_CONFIG[activeMetric].colorScale((METRIC_CONFIG[activeMetric].range[0] + METRIC_CONFIG[activeMetric].range[1]) / 2)}, ${METRIC_CONFIG[activeMetric].colorScale(METRIC_CONFIG[activeMetric].range[1])})`,
          }}
        />
      </div>
    </div>
  );

  return (
    <MapContainer
      center={mapViewState.center}
      zoom={mapViewState.zoom}
      className="h-full w-full bg-slate-100"
    >
      <MapUpdater center={mapViewState.center} zoom={mapViewState.zoom} />
      <ZoomListener onChange={onZoomChange} />

      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="Bản đồ chuẩn">
          <TileLayer
            attribution="&copy; Check"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Vệ tinh">
          <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
        </LayersControl.BaseLayer>

        {visibleLayers.zone && (
          <LayersControl.Overlay checked name="Vùng (Zone)">
            <GeoJSON
              key={`zone-${activeMetric}`}
              data={zoneCollection}
              style={(feature) =>
                createFeatureStyle(activeMetric, soilDataMap, feature?.properties)
              }
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        )}

        {visibleLayers.area && (
          <LayersControl.Overlay checked name="Khu vực (Area)">
            <GeoJSON
              key={`area-${activeMetric}`}
              data={areaCollection}
              style={(feature) =>
                createFeatureStyle(activeMetric, soilDataMap, feature?.properties)
              }
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        )}

        {visibleLayers.plot && (
          <LayersControl.Overlay checked name="Lô (Plot)">
            <GeoJSON
              key={`plot-${activeMetric}`}
              data={plotCollection}
              style={(feature) =>
                createFeatureStyle(activeMetric, soilDataMap, feature?.properties)
              }
              onEachFeature={onEachFeature}
            />
          </LayersControl.Overlay>
        )}
      </LayersControl>

      {renderLegend()}
    </MapContainer>
  );
}
