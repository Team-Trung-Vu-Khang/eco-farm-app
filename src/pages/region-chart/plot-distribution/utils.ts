import L from "leaflet";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";

export type PlotCoordinate = {
  lat: number;
  lng: number;
};

export type PointWarning = {
  index: number;
  invalidLatLng: L.LatLng;
  suggestedLatLng: L.LatLng;
};

type LineFeatureLike = {
  geometry: {
    coordinates: [number, number][];
  };
};

type PointFeatureLike = {
  geometry: {
    coordinates: [number, number];
  };
};

export const formatLatLng = (latlng: L.LatLng) =>
  `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

export const toTurfPolygonFromCoords = (coords?: PlotCoordinate[]) => {
  if (!coords || coords.length < 3) return null;
  const lngLat = coords.map((coordinate) => [coordinate.lng, coordinate.lat]);
  const first = lngLat[0];
  const closed = [...lngLat, first];
  return polygon([closed]);
};

export const getNearestPointOnPolygonBoundary = (
  polyFeature: ReturnType<typeof polygon> | null,
  latlng: L.LatLng,
) => {
  if (!polyFeature) return null;
  const lineFeature = polygonToLine(polyFeature);
  const line = Array.isArray((lineFeature as { features?: unknown[] }).features)
    ? ((lineFeature as { features: LineFeatureLike[] }).features[0] ?? null)
    : (lineFeature as LineFeatureLike | null);

  if (!line) return null;

  const snapped = nearestPointOnLine(line, point([latlng.lng, latlng.lat])) as
    | PointFeatureLike
    | null;

  if (!snapped) return null;

  return L.latLng(
    snapped.geometry.coordinates[1],
    snapped.geometry.coordinates[0],
  );
};

export const getBoundsFromPoints = (points: L.LatLng[]): L.LatLngBounds => {
  if (points.length === 0) return L.latLngBounds([0, 0], [0, 0]);
  return L.latLngBounds(points);
};
