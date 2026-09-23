import { useQuery } from "@tanstack/react-query";
import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  CloudSun,
  Sun,
  type LucideIcon,
} from "lucide-react";

/** Open-Meteo: miễn phí, không cần API key — https://open-meteo.com */
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export interface WeatherForecast {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    weatherCode: number;
  };
  daily: {
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationProbability: number | null;
  }[];
}

interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    wind_speed_10m: number;
    precipitation: number;
    weather_code: number;
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_probability_max: (number | null)[];
  };
}

export async function fetchWeatherForecast(
  latitude: number,
  longitude: number,
): Promise<WeatherForecast> {
  const url = new URL(OPEN_METEO_URL);
  url.searchParams.set("latitude", String(latitude));
  url.searchParams.set("longitude", String(longitude));
  url.searchParams.set(
    "current",
    "temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation,weather_code",
  );
  url.searchParams.set(
    "daily",
    "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max",
  );
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "5");

  const response = await fetch(url);
  if (!response.ok) throw new Error("Không tải được dữ liệu thời tiết");
  const data = (await response.json()) as OpenMeteoResponse;

  return {
    current: {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      precipitation: data.current.precipitation,
      weatherCode: data.current.weather_code,
    },
    daily: data.daily.time.map((date, index) => ({
      date,
      weatherCode: data.daily.weather_code[index],
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      precipitationProbability:
        data.daily.precipitation_probability_max[index] ?? null,
    })),
  };
}

export function useWeatherForecast(
  coords: { latitude: number; longitude: number } | null,
) {
  return useQuery({
    // Làm tròn để các vị trí rất gần nhau dùng chung cache
    queryKey: [
      "weather-forecast",
      coords ? coords.latitude.toFixed(2) : null,
      coords ? coords.longitude.toFixed(2) : null,
    ],
    queryFn: () => fetchWeatherForecast(coords!.latitude, coords!.longitude),
    enabled: !!coords,
    staleTime: 15 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export interface WeatherDescription {
  label: string;
  icon: LucideIcon;
  /** Màu icon + nền nhạt theo nhóm thời tiết */
  tone: { icon: string; bg: string };
}

const TONES = {
  sunny: { icon: "text-amber-500", bg: "bg-amber-50" },
  cloudy: { icon: "text-slate-500", bg: "bg-slate-100" },
  rainy: { icon: "text-sky-600", bg: "bg-sky-50" },
  storm: { icon: "text-indigo-600", bg: "bg-indigo-50" },
};

/** Mã thời tiết WMO → nhãn tiếng Việt + icon + màu */
export function describeWeatherCode(code: number): WeatherDescription {
  if (code === 0) return { label: "Trời quang", icon: Sun, tone: TONES.sunny };
  if (code <= 2) return { label: "Ít mây", icon: CloudSun, tone: TONES.sunny };
  if (code === 3) return { label: "Nhiều mây", icon: Cloud, tone: TONES.cloudy };
  if (code === 45 || code === 48)
    return { label: "Sương mù", icon: CloudFog, tone: TONES.cloudy };
  if (code >= 51 && code <= 57)
    return { label: "Mưa phùn", icon: CloudDrizzle, tone: TONES.rainy };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { label: "Mưa", icon: CloudRain, tone: TONES.rainy };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return { label: "Tuyết", icon: CloudSnow, tone: TONES.cloudy };
  if (code >= 95)
    return { label: "Dông", icon: CloudLightning, tone: TONES.storm };
  return { label: "Không xác định", icon: Cloud, tone: TONES.cloudy };
}
