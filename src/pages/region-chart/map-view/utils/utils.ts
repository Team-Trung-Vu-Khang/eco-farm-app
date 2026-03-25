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
