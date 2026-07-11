import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
  Position,
} from "geojson";
import type { SelectedEntity } from "../types/types";
import areaData from "../../../../assets/map/area.json";
import plotData from "../../../../assets/map/plot.json";
import zoneData from "../../../../assets/map/zone.json";

type GeoFeature = Feature<Geometry, GeoJsonProperties>;
type GeoCollection = FeatureCollection<Geometry, GeoJsonProperties>;

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
  const findContainer = (data: GeoCollection) => {
    return data.features.find((feature) => {
      if (feature.geometry.type === "Polygon") {
        return isPointInPolygon([lng, lat], feature.geometry.coordinates[0]);
      }
      if (feature.geometry.type === "MultiPolygon") {
        return feature.geometry.coordinates.some((polygon) =>
          isPointInPolygon([lng, lat], polygon[0]),
        );
      }
      return false;
    });
  };

  const zone = findContainer(zoneData as GeoCollection);
  const area = findContainer(areaData as GeoCollection);
  const plot = findContainer(plotData as GeoCollection);

  return {
    zoneName: zone?.properties?.name,
    areaName: area?.properties?.name,
    plotName: plot?.properties?.name,
  };
};

export const getPolygonCenter = (
  feature: GeoFeature | null | undefined,
): { lat: number; lng: number } | null => {
  if (!feature.geometry) return null;

  try {
    let coordinates: Position[] = [];
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
      coordinates.forEach((c) => {
        if (c && c.length >= 2) {
          minLng = Math.min(minLng, c[0] ?? minLng);
          maxLng = Math.max(maxLng, c[0] ?? maxLng);
          minLat = Math.min(minLat, c[1] ?? minLat);
          maxLat = Math.max(maxLat, c[1] ?? maxLat);
        }
      });
      return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
    }
  } catch (e) {
    console.error("Error calculating center for feature:", feature, e);
  }
  return null;
};

export const convertGeoJsonToPath = (
  geometry: Geometry | null | undefined,
) => {
  if (!geometry) return [];
  if (geometry.type === "Polygon") {
    return (
      geometry.coordinates?.[0]?.map((c) => ({
        lat: c[1],
        lng: c[0],
      })) || []
    );
  }
  if (geometry.type === "MultiPolygon") {
    return (
      geometry.coordinates?.[0]?.[0]?.map((c) => ({
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
