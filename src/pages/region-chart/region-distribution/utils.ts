import L from "leaflet";
import polygonToLine from "@turf/polygon-to-line";
import nearestPointOnLine from "@turf/nearest-point-on-line";
import { point, polygon } from "@turf/helpers";
import type {
  Feature,
  FeatureCollection,
  LineString,
  MultiLineString,
  Point,
  Polygon,
} from "geojson";

export type RegionCoordinate = {
  lat: number;
  lng: number;
};

export type PointWarning = {
  index: number;
  invalidLatLng: L.LatLng;
  suggestedLatLng: L.LatLng;
};

type TurfPolygonFeature = Feature<Polygon>;
type TurfLineFeature = Feature<LineString | MultiLineString>;
type TurfLineCollection = FeatureCollection<LineString | MultiLineString>;
type TurfPointFeature = Feature<Point>;

export const formatLatLng = (latlng: L.LatLng) =>
  `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`;

export const toTurfPolygonFromCoords = (coords?: RegionCoordinate[]) => {
  if (!coords || coords.length < 3) return null;
  const lngLat = coords.map((coordinate) => [coordinate.lng, coordinate.lat]);
  const first = lngLat[0];
  const closed = [...lngLat, first];
  return polygon([closed]);
};

export const getNearestPointOnPolygonBoundary = (
  polyFeature: TurfPolygonFeature | null,
  latlng: L.LatLng,
) => {
  if (!polyFeature) return null;

  const lineFeature = polygonToLine(polyFeature);
  const line = (
    "features" in lineFeature
      ? (lineFeature as TurfLineCollection).features[0]
      : (lineFeature as TurfLineFeature)
  ) ?? null;

  if (!line) return null;

  const snapped = nearestPointOnLine(
    line,
    point([latlng.lng, latlng.lat]),
  ) as TurfPointFeature | null;

  if (!snapped) return null;

  return L.latLng(
    snapped.geometry.coordinates[1],
    snapped.geometry.coordinates[0],
  );
};

export const getBoundsFromPoints = (
  points: L.LatLng[],
  fallback?: L.LatLng[],
): L.LatLngBounds => {
  if (points.length === 0) {
    if (fallback && fallback.length > 0) {
      return L.latLngBounds(fallback);
    }
    return L.latLngBounds([0, 0], [0, 0]);
  }

  return L.latLngBounds(points);
};
