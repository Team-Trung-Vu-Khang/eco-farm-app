import React, { useEffect } from "react";
import { Polygon, Marker, Tooltip, useMap } from "react-leaflet";
import { divIcon } from "leaflet";
import type { DashboardZoneNode } from "../hooks/useDashboardData";

export const RedMarker = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 30px; height: 30px; background-color: #ef4444; border-radius: 50%; opacity: 0.3; transform: scale(1.4); animation: pulse 2s infinite;"></div>
        <div style="position: absolute; width: 14px; height: 14px; background-color: #ef4444; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
      <style>
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.5; }
          50% { transform: scale(1.6); opacity: 0; }
          100% { transform: scale(0.95); opacity: 0.5; }
        }
      </style>
    `,
    className: "custom-center-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

export const BlueMarker = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 12px; height: 12px; background-color: #3b82f6; border: 2px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    className: "custom-area-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

export const OrangeMarker = () =>
  divIcon({
    html: `
      <div style="position: relative; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 10px; height: 10px; background-color: #f97316; border: 1.5px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>
      </div>
    `,
    className: "custom-plot-marker",
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

export function MapChildLayers({
  zone,
  onSelectUnit,
}: {
  zone: DashboardZoneNode | null;
  onSelectUnit: (type: "region" | "area" | "plot", data: any) => void;
}) {
  if (!zone) return null;

  const scopesList =
    Array.isArray(zone.scopes) && zone.scopes.length > 0 ? zone.scopes : [];

  return (
    <>
      {scopesList.map((scope: any) => (
        <React.Fragment key={scope.id}>
          {/* Render Scope Region Boundary */}
          {scope.boundary && scope.boundary.length > 0 && (
            <Polygon
              positions={scope.boundary}
              pathOptions={{
                color: "#10b981",
                fillColor: "#10b981",
                fillOpacity: 0.15,
                weight: 2,
              }}
              eventHandlers={{
                click: () => onSelectUnit("region", scope),
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#047857" }}
                >
                  {scope.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Vùng địa lý • {scope.totalAreaHa} ha
                </div>
              </Tooltip>
            </Polygon>
          )}

          {/* Render Scope Region Center Marker */}
          {scope.centerPoint && (
            <Marker
              position={scope.centerPoint}
              icon={RedMarker()}
              eventHandlers={{
                click: () => onSelectUnit("region", scope),
              }}
            >
              <Tooltip sticky direction="top" opacity={0.95}>
                <div
                  style={{ fontWeight: 600, fontSize: 12, color: "#047857" }}
                >
                  {scope.name}
                </div>
                <div style={{ fontSize: 10, color: "#64748b" }}>
                  Tọa độ Vùng địa lý
                </div>
              </Tooltip>
            </Marker>
          )}

          {/* Render Area & Plot Boundaries inside Scope */}
          {scope.areas?.map((area: any) => (
            <React.Fragment key={area.id}>
              {/* Render Area Boundary Polygon */}
              {area.boundary && area.boundary.length > 0 && (
                <Polygon
                  positions={area.boundary}
                  pathOptions={{
                    color: "#3b82f6",
                    fillColor: "#3b82f6",
                    fillOpacity: 0.25,
                    weight: 2,
                  }}
                  eventHandlers={{
                    click: () => onSelectUnit("area", area),
                  }}
                >
                  <Tooltip sticky direction="top" opacity={0.95}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        color: "#1e40af",
                      }}
                    >
                      {area.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>
                      Khu vực • {area.totalAreaHa} ha
                    </div>
                  </Tooltip>
                </Polygon>
              )}

              {/* Render Area Center Marker */}
              {area.centerPoint && (
                <Marker
                  position={area.centerPoint}
                  icon={BlueMarker()}
                  eventHandlers={{
                    click: () => onSelectUnit("area", area),
                  }}
                >
                  <Tooltip sticky direction="top" opacity={0.95}>
                    <div
                      style={{
                        fontWeight: 600,
                        fontSize: 12,
                        color: "#1e40af",
                      }}
                    >
                      {area.name}
                    </div>
                    <div style={{ fontSize: 10, color: "#64748b" }}>
                      Tọa độ Khu vực
                    </div>
                  </Tooltip>
                </Marker>
              )}

              {/* Render Plot Boundaries & Markers */}
              {area.plots?.map((plot: any) => (
                <React.Fragment key={plot.id}>
                  {plot.boundary && plot.boundary.length > 0 && (
                    <Polygon
                      positions={plot.boundary}
                      pathOptions={{
                        color: "#f97316",
                        fillColor: "#f97316",
                        fillOpacity: 0.35,
                        weight: 1.5,
                        dashArray: "4, 4",
                      }}
                      eventHandlers={{
                        click: () => onSelectUnit("plot", plot),
                      }}
                    >
                      <Tooltip sticky direction="top" opacity={0.95}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: "#c2410c",
                          }}
                        >
                          {plot.name}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          Lô/Thửa đất • {plot.areaHa} ha
                        </div>
                      </Tooltip>
                    </Polygon>
                  )}

                  {plot.centerPoint && (
                    <Marker
                      position={plot.centerPoint}
                      icon={OrangeMarker()}
                      eventHandlers={{
                        click: () => onSelectUnit("plot", plot),
                      }}
                    >
                      <Tooltip sticky direction="top" opacity={0.95}>
                        <div
                          style={{
                            fontWeight: 600,
                            fontSize: 12,
                            color: "#c2410c",
                          }}
                        >
                          {plot.name}
                        </div>
                        <div style={{ fontSize: 10, color: "#64748b" }}>
                          Tọa độ Lô/Thửa
                        </div>
                      </Tooltip>
                    </Marker>
                  )}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </>
  );
}

export const MapBoundsSync = ({
  bounds,
  centerPoint,
}: {
  bounds: [number, number][] | null;
  centerPoint: [number, number] | null;
}) => {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [20, 20] });
    } else if (centerPoint) {
      map.setView(centerPoint, 15);
    }
  }, [bounds, centerPoint, map]);
  return null;
};
