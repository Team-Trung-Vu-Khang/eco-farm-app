import L from "leaflet";
import type { Coordinate } from "../constants";

const DEFAULT_SW: [number, number] = [11.53, 106.88];
const DEFAULT_NE: [number, number] = [11.55, 106.91];

export function getDefaultBounds() {
  return L.latLngBounds(DEFAULT_SW, DEFAULT_NE);
}

export function getBoundsFromCoordinates(coordinates?: Coordinate[]) {
  if (!coordinates || coordinates.length === 0) {
    return getDefaultBounds();
  }

  return L.latLngBounds(coordinates.map((point) => L.latLng(point.lat, point.lng)));
}

export function getMapCenter(coordinates?: Coordinate[]): [number, number] {
  const bounds = getBoundsFromCoordinates(coordinates);
  return [bounds.getCenter().lat, bounds.getCenter().lng];
}
