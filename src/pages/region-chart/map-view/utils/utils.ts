import type { SelectedEntity } from "../types/types";
import areaData from "../../../../assets/map/area.json";
import plotData from "../../../../assets/map/plot.json";
import zoneData from "../../../../assets/map/zone.json";

export const isPointInPolygon = (point: [number, number], vs: [number, number][]) => {
  if (!point || !vs || !Array.isArray(vs) || vs.length === 0) return false;
  // ray-casting algorithm
  const x = point[0],
    y = point[1];
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i]?.[0] ?? 0,
      yi = vs[i]?.[1] ?? 0;
    const xj = vs[j]?.[0] ?? 0,
      yj = vs[j]?.[1] ?? 0;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const getLocationInfo = (lng: number, lat: number) => {
  const findContainer = (data: { features?: unknown[] }) => {
    return data.features?.find((f: any) => {
      if (f.geometry.type === "Polygon") {
        return isPointInPolygon([lng, lat], f.geometry.coordinates[0]);
      }
      if (f.geometry.type === "MultiPolygon") {
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getPolygonCenter = (
  feature: any,
): { lat: number; lng: number } | null => {
  if (!feature.geometry) return null;

  try {
    let coordinates: any[] = [];
    if (feature.geometry.type === "Polygon") {
      coordinates = feature.geometry.coordinates?.[0] || [];
    } else if (feature.geometry.type === "MultiPolygon") {
      coordinates = feature.geometry.coordinates?.[0]?.[0] || [];
    }

    if (Array.isArray(coordinates) && coordinates.length > 0) {
      let minLat = 90,
        maxLat = -90,
        minLng = 180,
        maxLng = -180;
      coordinates.forEach((c: any) => {
        if (c && c.length >= 2) {
          minLng = Math.min(minLng, c[0]);
          maxLng = Math.max(maxLng, c[0]);
          minLat = Math.min(minLat, c[1]);
          maxLat = Math.max(maxLat, c[1]);
        }
      });
      return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
    }
  } catch (e) {
    console.error("Error calculating center for feature:", feature, e);
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertGeoJsonToPath = (geometry: any) => {
  if (!geometry) return [];
  if (geometry.type === "Polygon") {
    return (
      geometry.coordinates?.[0]?.map((c: any) => ({
        lat: c[1],
        lng: c[0],
      })) || []
    );
  }
  if (geometry.type === "MultiPolygon") {
    return (
      geometry.coordinates?.[0]?.[0]?.map((c: any) => ({
        lat: c[1],
        lng: c[0],
      })) || []
    );
  }
  return [];
};

export const getCenterFromCoordinates = (
  coordinates: { lat: number; lng: number }[],
) => {
  if (coordinates.length === 0) return null;

  const total = coordinates.reduce(
    (acc, coord) => {
      acc.lat += coord.lat;
      acc.lng += coord.lng;
      return acc;
    },
    { lat: 0, lng: 0 },
  );

  return [total.lat / coordinates.length, total.lng / coordinates.length] as [
    number,
    number,
  ];
};

export const buildGoogleMapsUrl = (entity: SelectedEntity | null) => {
  if (!entity) return "https://www.google.com/maps";

  if (entity.center) {
    return `https://www.google.com/maps/search/?api=1&query=${entity.center[0]},${entity.center[1]}`;
  }

  const query = [
    entity.properties?.name,
    entity.locationInfo?.plotName,
    entity.locationInfo?.areaName,
    entity.locationInfo?.zoneName,
  ]
    .filter(Boolean)
    .join(", ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query || "farm")}`;
};
