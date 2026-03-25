import L from "leaflet";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";

export const DEFAULT_AREA_POINT_TUPLES: [number, number][] = [
  [11.53, 106.88],
  [11.55, 106.91],
  [11.53, 106.91],
];

export type PointWarning = {
  index: number;
  invalidLatLng: L.LatLng;
  suggestedLatLng: L.LatLng;
};

export const createLatLngPoints = (tuples: [number, number][]) =>
  tuples.map(([lat, lng]) => L.latLng(lat, lng));

export const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) {
    return L.latLngBounds([0, 0], [0, 0]);
  }

  return L.latLngBounds(points);
};

export const formatLatLng = (latlng: L.LatLng) =>
  `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

export const toTurfPolygonFromCoords = (coords: { lat: number; lng: number }[]) => {
  if (!coords || coords.length < 3) {
    return null;
  }

  const lngLat = coords.map((coord) => [coord.lng, coord.lat]);
  const first = lngLat[0];
  return polygon([[...lngLat, first]]);
};

export const getNearestPointOnPolygonBoundary = (
  polyFeature: any,
  latlng: L.LatLng,
) => {
  if (!polyFeature) {
    return null;
  }

  const lineFeature = polygonToLine(polyFeature);
  const line = Array.isArray((lineFeature as any).features)
    ? (lineFeature as any).features[0]
    : lineFeature;

  if (!line) {
    return null;
  }

  const snapped = nearestPointOnLine(line as any, point([latlng.lng, latlng.lat]));
  if (!snapped) {
    return null;
  }

  return L.latLng(
    snapped.geometry.coordinates[1],
    snapped.geometry.coordinates[0],
  );
};
