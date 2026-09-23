import { useRegions } from "@/features/farm/hooks/useRegions";
import {
  describeWeatherCode,
  useWeatherForecast,
} from "@/features/weather/weather";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import {
  Droplet,
  Droplets,
  Loader2,
  MapPin,
  MapPinOff,
  Umbrella,
  Wind,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Coords = { latitude: number; longitude: number };

const WEEKDAY_LABELS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

/**
 * Vị trí lấy thời tiết: GPS điện thoại; nếu bị từ chối / không hỗ trợ thì dùng
 * tâm của vùng canh tác đầu tiên.
 */
function useWeatherLocation() {
  const [gpsCoords, setGpsCoords] = useState<Coords | null>(null);
  const [gpsFailed, setGpsFailed] = useState(
    () => typeof navigator === "undefined" || !navigator.geolocation,
  );

  useEffect(() => {
    if (gpsFailed) return;
    navigator.geolocation.getCurrentPosition(
      (position) =>
        setGpsCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }),
      () => setGpsFailed(true),
      { timeout: 10000, maximumAge: 10 * 60 * 1000 },
    );
  }, [gpsFailed]);

  const { items: regions, isPending: isLoadingRegions } = useRegions({
    params: { page: 0, size: 20, domainCode: "CROP" },
    enabled: gpsFailed,
  });
  const regionWithCenter = regions.find(
    (region) =>
      typeof region.centerPoint?.latitude === "number" &&
      typeof region.centerPoint?.longitude === "number",
  );

  return useMemo(() => {
    if (gpsCoords) {
      return { coords: gpsCoords, label: "Vị trí hiện tại", isResolving: false };
    }
    if (gpsFailed && regionWithCenter?.centerPoint) {
      return {
        coords: {
          latitude: regionWithCenter.centerPoint.latitude,
          longitude: regionWithCenter.centerPoint.longitude,
        },
        label: regionWithCenter.name || "Vùng canh tác",
        isResolving: false,
      };
    }
    return {
      coords: null,
      label: "",
      isResolving: !gpsFailed || isLoadingRegions,
    };
  }, [gpsCoords, gpsFailed, regionWithCenter, isLoadingRegions]);
}

const CARD_CLASS = "rounded-2xl border border-slate-200 bg-white shadow-sm";

const StatTile = ({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-2 rounded-xl bg-slate-50 px-2.5 py-2">
    <Icon className="h-4 w-4 shrink-0 text-slate-400" />
    <div className="min-w-0">
      <p className="text-[10px] leading-tight text-slate-500">{label}</p>
      <p className="truncate text-sm font-semibold text-slate-900">{value}</p>
    </div>
  </div>
);

export function WeatherCard() {
  const { coords, label, isResolving } = useWeatherLocation();
  const { data, isLoading, isError, dataUpdatedAt } = useWeatherForecast(coords);

  if (!coords && !isResolving) {
    return (
      <section className={cn(CARD_CLASS, "flex items-start gap-3 p-4")}>
        <MapPinOff className="mt-0.5 h-5 w-5 shrink-0 text-slate-400" />
        <p className="text-sm text-slate-500">
          Chưa xác định được vị trí. Hãy cho phép truy cập vị trí hoặc thêm tọa
          độ cho vùng canh tác.
        </p>
      </section>
    );
  }

  if (!coords || isLoading) {
    return (
      <section
        className={cn(
          CARD_CLASS,
          "flex h-40 items-center justify-center gap-2 text-sm text-slate-500",
        )}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        Đang tải thời tiết...
      </section>
    );
  }

  if (isError || !data) {
    return (
      <section className={cn(CARD_CLASS, "p-4 text-center text-sm text-slate-500")}>
        Không tải được dữ liệu thời tiết
      </section>
    );
  }

  const current = describeWeatherCode(data.current.weatherCode);
  const CurrentIcon = current.icon;
  const today = data.daily[0];

  return (
    <section className={cn(CARD_CLASS, "overflow-hidden")}>
      <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3">
        <div className="min-w-0">
          <h2 className="text-sm font-bold leading-tight text-slate-900">
            Thời tiết
          </h2>
          {dataUpdatedAt > 0 && (
            <p className="text-[10px] text-slate-400">
              Cập nhật lúc {dayjs(dataUpdatedAt).format("HH:mm")}
            </p>
          )}
        </div>
        <span className="flex min-w-0 items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{label}</span>
        </span>
      </div>

      <div className="space-y-4 p-4">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
              current.tone.bg,
            )}
          >
            <CurrentIcon className={cn("h-9 w-9", current.tone.icon)} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold leading-none text-slate-900">
                {Math.round(data.current.temperature)}
              </span>
              <span className="text-lg font-semibold text-slate-400">°C</span>
            </div>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {current.label}
            </p>
            {today && (
              <p className="text-xs text-slate-500">
                Cao {Math.round(today.tempMax)}° · Thấp{" "}
                {Math.round(today.tempMin)}°
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <StatTile
            icon={Droplets}
            label="Độ ẩm"
            value={`${data.current.humidity}%`}
          />
          <StatTile
            icon={Wind}
            label="Gió"
            value={`${Math.round(data.current.windSpeed)} km/h`}
          />
          <StatTile
            icon={Umbrella}
            label="Lượng mưa"
            value={`${data.current.precipitation} mm`}
          />
        </div>

        <div>
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Dự báo 5 ngày
          </p>
          <div className="grid grid-cols-5 divide-x divide-slate-100 rounded-xl border border-slate-100">
            {data.daily.map((day, index) => {
              const { icon: DayIcon, label: dayLabel, tone } =
                describeWeatherCode(day.weatherCode);
              const rainChance = day.precipitationProbability ?? 0;
              return (
                <div
                  key={day.date}
                  className={cn(
                    "flex flex-col items-center gap-1 py-2.5",
                    index === 0 && "bg-primary/5",
                  )}
                  title={dayLabel}
                >
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      index === 0 ? "text-primary" : "text-slate-500",
                    )}
                  >
                    {index === 0
                      ? "Hôm nay"
                      : WEEKDAY_LABELS[new Date(`${day.date}T00:00:00`).getDay()]}
                  </span>
                  <DayIcon className={cn("h-5 w-5", tone.icon)} />
                  <span className="text-xs font-semibold text-slate-900">
                    {Math.round(day.tempMax)}°
                    <span className="font-normal text-slate-400">
                      /{Math.round(day.tempMin)}°
                    </span>
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[10px]",
                      rainChance > 0 ? "text-sky-600" : "text-slate-300",
                    )}
                  >
                    <Droplet className="h-2.5 w-2.5" />
                    {rainChance}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
