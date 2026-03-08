import React, { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import * as turf from "@turf/turf";
import { getMarkerIcon } from "./mapUtils";
import type { PlantEntry } from "./types";

// Component to recenter map when coordinates change manually
export const RecenterMap = ({ lat, lng }: { lat: number; lng: number }) => {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
};

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
  const map = useMap();
  const activePlant = plants.find((p) => p.entryId === activeId);

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

  // Inner component to handle map clicks
  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        if (!clickable || !activeId) return;
        const { lat, lng } = e.latlng;

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
      },
    });
    return null;
  };

  // Style helpers per level
  const getBoundaryStyle = (unit: any, isActiveUnit: boolean) => {
    if (isActiveUnit) {
      return {
        color: "#6366f1",
        weight: 2.5,
        fillOpacity: 0.18,
        dashArray: undefined,
      };
    }
    switch (unit.level) {
      case 1: // Plot
        return {
          color: "#f59e0b",
          weight: 1.5,
          fillOpacity: 0.06,
          dashArray: "5,4",
        };
      case 2: // Area
        return {
          color: "#10b981",
          weight: 2,
          fillOpacity: 0.08,
          dashArray: "8,4",
        };
      case 3: // Region
      default:
        return {
          color: "#3b82f6",
          weight: 2.5,
          fillOpacity: 0.05,
          dashArray: undefined,
        };
    }
  };

  return (
    <>
      <TileLayer
        url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        attribution="Esri"
      />
      <MapClickHandler />
      {/* Auto-pan to active plant */}
      {activePlant?.plotId && (
        <RecenterMap
          lat={activePlant.coordinate.lat}
          lng={activePlant.coordinate.lng}
        />
      )}
      {/* All geographical boundaries — Region > Area > Plot, rendered outermost first */}
      {[...geographicalUnits]
        .sort((a, b) => b.level - a.level) // Region first so Plots render on top
        .map((unit) => {
          if (!unit.coordinates || unit.coordinates.length < 3) return null;
          const isActiveUnit = activePlant?.plotId === unit.id;
          const style = getBoundaryStyle(unit, isActiveUnit);
          const showTooltip = true; // show name for all units (Region, Area, Plot) on hover
          return (
            <Polygon
              key={unit.id}
              positions={unit.coordinates.map((c: any) => [c.lat, c.lng])}
              pathOptions={style}
            >
              {showTooltip && (
                <Tooltip sticky direction="top" opacity={0.95}>
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
                </Tooltip>
              )}
            </Polygon>
          );
        })}
      {/* All plant markers */}
      {plants.map((p) => {
        // if (!p.plotId) return null;
        const isActive = p.entryId === activeId;

        return (
          <Marker
            key={p.entryId}
            position={[p.coordinate.lat, p.coordinate.lng]}
            draggable={isActive}
            opacity={isActive ? 1 : 0.6}
            icon={
              !p.plotId
                ? getMarkerIcon("yellow")
                : p.isInvalidBoundary
                  ? getMarkerIcon("red")
                  : getMarkerIcon("green")
            }
            eventHandlers={{
              click() {
                if (!isActive) {
                  document
                    .getElementById(`plant-${p.entryId}`)
                    ?.scrollIntoView({
                      block: "center",
                      behavior: "smooth",
                    });
                }
                map.flyTo([p.coordinate.lat, p.coordinate.lng], map.getZoom(), {
                  duration: 0.5,
                });
                setActiveEntryId(p.entryId);
              },
              dragend(e) {
                if (!isActive) return;
                const pos = e.target.getLatLng();

                if (!p.plotId) {
                  const plotId = findCurrentPlot(pos.lng, pos.lat);
                  if (plotId) {
                    onAutoAssign(p.entryId, plotId, pos.lat, pos.lng);
                    return;
                  }
                }

                onPlantMove(p.entryId, pos.lat, pos.lng);
              },
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
              positions={[
                [activePlant.coordinate.lat, activePlant.coordinate.lng],
                [suggestedCorrection.lat, suggestedCorrection.lng],
              ]}
              pathOptions={{ color: "#ef4444", dashArray: "5, 5", weight: 2 }}
            />
            <Marker
              position={[suggestedCorrection.lat, suggestedCorrection.lng]}
              opacity={0.5}
              eventHandlers={{
                click() {
                  // Clicking suggestion might not do anything specific, users use the Apply button
                },
              }}
            />
          </>
        )}
    </>
  );
};
