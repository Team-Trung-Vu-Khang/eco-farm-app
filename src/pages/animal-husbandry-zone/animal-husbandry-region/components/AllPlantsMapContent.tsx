import {
  GoogleMap,
  InfoWindow,
  Marker,
  Polygon,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import * as turf from "@turf/turf";
import { useEffect, useRef, useState } from "react";
import { getMarkerIcon } from "./mapUtils";
import type { PlantEntry } from "./types";

const mapContainerStyle = { width: "100%", height: "100%" };

// ---- Map: multiple markers + all plot boundaries ----
export const AllPlantsMapContent = ({
  activeId,
  onPlantMove,
  onAutoAssign,
  clickable,
  plants,
  geographicalUnits,
  setActiveEntryId,
  suggestedCorrection,
}: {
  activeId: string;
  onPlantMove: (entryId: string, lat: number, lng: number) => void;
  onAutoAssign: (
    entryId: string,
    plotId: string,
    lat: number,
    lng: number,
  ) => void;
  clickable?: boolean;
  plants: PlantEntry[];
  geographicalUnits: any[];
  setActiveEntryId: (id: string) => void;
  suggestedCorrection?: { entryId: string; lat: number; lng: number } | null;
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredUnitId, setHoveredUnitId] = useState<string | null>(null);

  const activePlant = plants.find((p) => p.entryId === activeId);

  // Auto-pan to active plant on tab click
  useEffect(() => {
    if (!activePlant || !mapRef.current) return;
    mapRef.current.panTo({
      lat: activePlant.coordinate.lat,
      lng: activePlant.coordinate.lng,
    });
    const currentZoom = mapRef.current.getZoom() ?? 17;
    if (currentZoom < 17) mapRef.current.setZoom(17);
  }, [activePlant?.coordinate.lat, activePlant?.coordinate.lng]);

  const findCurrentPlot = (lng: number, lat: number) => {
    // Use all geographical units sorted by most specific first (Plot > Area > Region)
    const sorted = [...geographicalUnits].sort((a, b) => a.level - b.level);
    for (const unit of sorted) {
      if (!unit.coordinates || unit.coordinates.length < 3) continue;
      try {
        const pt = turf.point([lng, lat]);
        const polyCoords = [
          ...unit.coordinates.map((c: any) => [c.lng, c.lat]),
          [unit.coordinates[0].lng, unit.coordinates[0].lat],
        ];
        const poly = turf.polygon([polyCoords]);
        if (turf.booleanPointInPolygon(pt, poly)) {
          return unit.id;
        }
      } catch {
        return null;
      }
    }
    return null;
  };

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!clickable || !activeId || !event.latLng) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    // If plant has no plotId: auto-detect which unit was clicked
    if (!activePlant?.plotId) {
      const plotId = findCurrentPlot(lng, lat);
      if (plotId) {
        onAutoAssign(activeId, plotId, lat, lng);
        return;
      }
      // Clicked outside all units — do nothing
      return;
    }

    // Plant already has a plotId — move within boundary
    onPlantMove(activeId, lat, lng);
  };

  // Style helpers per level
  const getBoundaryStyle = (unit: any, isActiveUnit: boolean) => {
    if (isActiveUnit) {
      return {
        strokeColor: "#6366f1",
        strokeWeight: 2.5,
        fillOpacity: 0.18,
      };
    }
    switch (unit.level) {
      case 1: // Plot
        return {
          strokeColor: "#f59e0b",
          strokeWeight: 1.5,
          fillOpacity: 0.06,
        };
      case 2: // Area
        return {
          strokeColor: "#10b981",
          strokeWeight: 2,
          fillOpacity: 0.08,
        };
      case 3: // Region
      default:
        return {
          strokeColor: "#3b82f6",
          strokeWeight: 2.5,
          fillOpacity: 0.05,
        };
    }
  };

  if (!isLoaded) {
    return (
      <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    );
  }

  const initialCenter = activePlant
    ? { lat: activePlant.coordinate.lat, lng: activePlant.coordinate.lng }
    : plants[0]
      ? { lat: plants[0].coordinate.lat, lng: plants[0].coordinate.lng }
      : { lat: 11.558, lng: 107.134 };

  const sortedUnits = [...geographicalUnits].sort(
    (a, b) => b.level - a.level,
  ); // Region first so Plots render on top

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={initialCenter}
      zoom={17}
      options={{ zoomControl: false, mapTypeId: "satellite" }}
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onClick={handleMapClick}
    >
      {/* All geographical boundaries — Region > Area > Plot, rendered outermost first */}
      {sortedUnits.map((unit) => {
        if (!unit.coordinates || unit.coordinates.length < 3) return null;
        const isActiveUnit = activePlant?.plotId === unit.id;
        const style = getBoundaryStyle(unit, isActiveUnit);
        const path = unit.coordinates.map((c: any) => ({
          lat: c.lat,
          lng: c.lng,
        }));
        const center =
          path.reduce(
            (acc: { lat: number; lng: number }, p: { lat: number; lng: number }) => ({
              lat: acc.lat + p.lat / path.length,
              lng: acc.lng + p.lng / path.length,
            }),
            { lat: 0, lng: 0 },
          );

        return (
          <div key={unit.id}>
            <Polygon
              paths={path}
              options={style}
              onMouseOver={() => setHoveredUnitId(unit.id)}
              onMouseOut={() =>
                setHoveredUnitId((current) =>
                  current === unit.id ? null : current,
                )
              }
            />
            {hoveredUnitId === unit.id && (
              <InfoWindow
                position={center}
                options={{ disableAutoPan: true }}
                onCloseClick={() => setHoveredUnitId(null)}
              >
                <div>
                  <div
                    style={{ fontWeight: 600, fontSize: 12, lineHeight: "1.4" }}
                  >
                    {unit.name}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: "#64748b",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {unit.type}
                  </div>
                </div>
              </InfoWindow>
            )}
          </div>
        );
      })}
      {/* All plant markers */}
      {plants.map((p) => {
        const isActive = p.entryId === activeId;

        return (
          <Marker
            key={p.entryId}
            position={{ lat: p.coordinate.lat, lng: p.coordinate.lng }}
            draggable={isActive}
            opacity={isActive ? 1 : 0.6}
            icon={
              !p.plotId
                ? getMarkerIcon("yellow")
                : p.isInvalidBoundary
                  ? getMarkerIcon("red")
                  : getMarkerIcon("green")
            }
            onClick={() => {
              if (!isActive) {
                document.getElementById(`plant-${p.entryId}`)?.scrollIntoView({
                  block: "center",
                  behavior: "smooth",
                });
              }
              mapRef.current?.panTo({
                lat: p.coordinate.lat,
                lng: p.coordinate.lng,
              });
              setActiveEntryId(p.entryId);
            }}
            onDragEnd={(event) => {
              if (!isActive || !event.latLng) return;
              const lat = event.latLng.lat();
              const lng = event.latLng.lng();

              if (!p.plotId) {
                const plotId = findCurrentPlot(lng, lat);
                if (plotId) {
                  onAutoAssign(p.entryId, plotId, lat, lng);
                  return;
                }
              }

              onPlantMove(p.entryId, lat, lng);
            }}
          />
        );
      })}
      {/* Ghost marker for suggested correction */}
      {suggestedCorrection &&
        suggestedCorrection.entryId === activeId &&
        activePlant && (
          <>
            <Polyline
              path={[
                { lat: activePlant.coordinate.lat, lng: activePlant.coordinate.lng },
                { lat: suggestedCorrection.lat, lng: suggestedCorrection.lng },
              ]}
              options={{
                strokeColor: "#ef4444",
                strokeWeight: 2,
                icons: [
                  {
                    icon: { path: "M 0,-1 0,1", strokeOpacity: 1, scale: 3 },
                    offset: "0",
                    repeat: "10px",
                  },
                ],
              }}
            />
            <Marker
              position={{
                lat: suggestedCorrection.lat,
                lng: suggestedCorrection.lng,
              }}
              opacity={0.5}
            />
          </>
        )}
    </GoogleMap>
  );
};
