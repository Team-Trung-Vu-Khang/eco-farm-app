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

const getApiKey = () => import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "";

let googleMapsScriptPromise: Promise<void> | undefined;
let geocoder: google.maps.Geocoder | undefined;

function isGoogleMapsScriptLoaded(): boolean {
  return Boolean(window.google?.maps?.Geocoder);
}

function loadGoogleMapsSdk(apiKey: string) {
  if (isGoogleMapsScriptLoaded()) return Promise.resolve();
  if (googleMapsScriptPromise) return googleMapsScriptPromise;

  googleMapsScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const url = new URL("https://maps.googleapis.com/maps/api/js");
    url.searchParams.set("key", apiKey);
    url.searchParams.set("libraries", "places");
    url.searchParams.set("language", "vi");
    url.searchParams.set("region", "VN");
    url.searchParams.set("loading", "async");
    script.src = url.toString();
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Không thể tải Google Maps SDK"));
    document.head.appendChild(script);
  });

  return googleMapsScriptPromise;
}

async function getGeocoder() {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  await loadGoogleMapsSdk(apiKey);
  geocoder ??= new google.maps.Geocoder();
  return geocoder;
}

export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  const geocoderInstance = await getGeocoder();
  if (!geocoderInstance) return [];

  const { results } = await geocoderInstance.geocode({
    address: query,
    region: "VN",
  });

  return results.map((result) => ({
    place_id: result.place_id,
    display_name: result.formatted_address,
    lat: String(result.geometry.location.lat()),
    lon: String(result.geometry.location.lng()),
  }));
}

export async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{
  display_name: string;
  address_components: GoogleAddressComponent[];
} | null> {
  const geocoderInstance = await getGeocoder();
  if (!geocoderInstance) return null;

  const { results } = await geocoderInstance.geocode({
    location: { lat, lng },
  });
  if (results.length === 0) return null;

  return {
    display_name: results[0].formatted_address,
    address_components: results[0].address_components,
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
