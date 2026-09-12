import { Data, GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { useCallback, useEffect, useMemo, useRef } from "react";
import type { SelectedSoilFeature, SoilFeatureProperties, SoilGeoCollection, SoilMetric } from "../types";
import {
  createFeatureStyle,
  createSelectedFeature,
  createTooltipHtml,
  METRIC_CONFIG,
} from "../utils";

const mapContainerStyle = { width: "100%", height: "100%" };

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

const getPropertiesFromDataFeature = (
  feature: google.maps.Data.Feature,
): SoilFeatureProperties => {
  const properties: SoilFeatureProperties = {};
  feature.forEachProperty((value, key) => {
    properties[key] = value;
  });
  return properties;
};

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
  const mapRef = useRef<google.maps.Map | null>(null);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    mapRef.current.panTo({
      lat: mapViewState.center[0],
      lng: mapViewState.center[1],
    });
    mapRef.current.setZoom(mapViewState.zoom);
  }, [isLoaded, mapViewState.center, mapViewState.zoom]);

  useEffect(() => {
    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }
  }, []);

  const applyDataLayer = useCallback(
    (data: google.maps.Data, collection: SoilGeoCollection) => {
      data.forEach((feature) => data.remove(feature));
      data.addGeoJson(collection as unknown as object);

      data.setStyle((feature) => {
        const properties = getPropertiesFromDataFeature(feature);
        const pathOptions = createFeatureStyle(
          activeMetric,
          soilDataMap,
          properties,
        );
        return {
          fillColor: pathOptions.fillColor,
          fillOpacity: pathOptions.fillOpacity,
          strokeColor: "white",
          strokeWeight: 1,
          strokeOpacity: 1,
        };
      });
    },
    [activeMetric, soilDataMap],
  );

  const showTooltip = useCallback(
    (event: google.maps.Data.MouseEvent, properties: SoilFeatureProperties) => {
      const featureId = properties.id?.toString();
      const soilData = featureId ? soilDataMap.get(featureId) : undefined;
      if (!soilData || !infoWindowRef.current || !mapRef.current || !event.latLng) {
        return;
      }
      const name =
        typeof properties.name === "string" && properties.name.trim()
          ? properties.name
          : "Khu vực không tên";
      infoWindowRef.current.setContent(
        createTooltipHtml(name, activeMetric, soilData),
      );
      infoWindowRef.current.setPosition(event.latLng);
      infoWindowRef.current.open(mapRef.current);
    },
    [activeMetric, soilDataMap],
  );

  const handleFeatureClick = useCallback(
    (event: google.maps.Data.MouseEvent) => {
      const properties = getPropertiesFromDataFeature(event.feature);
      const featureId = properties.id?.toString();
      if (!featureId) return;
      const data = soilDataMap.get(featureId);
      if (!data) return;
      onFeatureSelect(createSelectedFeature(properties, data));
    },
    [onFeatureSelect, soilDataMap],
  );

  // Each rendered <Data> layer keeps its own instance ref so hover
  // highlighting (overrideStyle/revertStyle) targets the right layer.
  const createLayerHandlers = useCallback(
    (collection: SoilGeoCollection) => {
      const dataRef: { current: google.maps.Data | null } = { current: null };
      return {
        onLoad: (data: google.maps.Data) => {
          dataRef.current = data;
          applyDataLayer(data, collection);
        },
        onMouseOver: (event: google.maps.Data.MouseEvent) => {
          dataRef.current?.overrideStyle(event.feature, {
            strokeColor: "#666",
            strokeWeight: 3,
            fillOpacity: 0.8,
          });
          showTooltip(event, getPropertiesFromDataFeature(event.feature));
        },
        onMouseOut: (event: google.maps.Data.MouseEvent) => {
          dataRef.current?.revertStyle(event.feature);
          infoWindowRef.current?.close();
        },
        onClick: handleFeatureClick,
      };
    },
    [applyDataLayer, handleFeatureClick, showTooltip],
  );

  const zoneHandlers = useMemo(
    () => createLayerHandlers(zoneCollection),
    [createLayerHandlers, zoneCollection],
  );
  const areaHandlers = useMemo(
    () => createLayerHandlers(areaCollection),
    [createLayerHandlers, areaCollection],
  );
  const plotHandlers = useMemo(
    () => createLayerHandlers(plotCollection),
    [createLayerHandlers, plotCollection],
  );

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
    <div className="relative h-full w-full bg-slate-100">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={{ lat: mapViewState.center[0], lng: mapViewState.center[1] }}
          zoom={mapViewState.zoom}
          options={{ mapTypeControl: true }}
          onLoad={(map) => {
            mapRef.current = map;
          }}
          onZoomChanged={() => {
            const zoom = mapRef.current?.getZoom();
            if (typeof zoom === "number") {
              onZoomChange(zoom);
            }
          }}
        >
          {visibleLayers.zone && (
            <Data key={`zone-${activeMetric}`} {...zoneHandlers} />
          )}

          {visibleLayers.area && (
            <Data key={`area-${activeMetric}`} {...areaHandlers} />
          )}

          {visibleLayers.plot && (
            <Data key={`plot-${activeMetric}`} {...plotHandlers} />
          )}
        </GoogleMap>
      ) : (
        <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
          Đang tải bản đồ...
        </div>
      )}

      {renderLegend()}
    </div>
  );
}
