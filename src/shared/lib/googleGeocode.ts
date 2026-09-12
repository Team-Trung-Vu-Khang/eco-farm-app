export interface GeocodeResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

export interface GoogleAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GoogleGeocodeResult {
  place_id: string;
  formatted_address: string;
  geometry: { location: { lat: number; lng: number } };
  address_components: GoogleAddressComponent[];
}

interface GoogleGeocodeResponse {
  status: string;
  results: GoogleGeocodeResult[];
}

const getApiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";

export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const apiKey = getApiKey();
  if (!apiKey) return [];

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("address", query);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "vi");
  url.searchParams.set("region", "vn");

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;
  if (data.status !== "OK") return [];

  return data.results.map((result) => ({
    place_id: result.place_id,
    display_name: result.formatted_address,
    lat: String(result.geometry.location.lat),
    lon: String(result.geometry.location.lng),
  }));
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{
  display_name: string;
  address_components: GoogleAddressComponent[];
} | null> {
  const apiKey = getApiKey();
  if (!apiKey) return null;

  const url = new URL("https://maps.googleapis.com/maps/api/geocode/json");
  url.searchParams.set("latlng", `${lat},${lng}`);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "vi");

  const response = await fetch(url);
  const data = (await response.json()) as GoogleGeocodeResponse;
  if (data.status !== "OK" || data.results.length === 0) return null;

  return {
    display_name: data.results[0].formatted_address,
    address_components: data.results[0].address_components,
  };
}

export function findAddressComponent(
  components: GoogleAddressComponent[],
  types: string[],
): string {
  for (const type of types) {
    const match = components.find((component) => component.types.includes(type));
    if (match) return match.long_name;
  }
  return "";
}
