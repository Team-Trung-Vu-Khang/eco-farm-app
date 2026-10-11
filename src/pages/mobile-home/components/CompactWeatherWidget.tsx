import { useRegions } from "@/features/farm/hooks/useRegions";
import {
  describeWeatherCode,
  useWeatherForecast,
} from "@/features/weather/weather";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import dayjs from "dayjs";
import {
  ChevronRight,
  Droplet,
  Droplets,
  Loader2,
  MapPin,
  MapPinOff,
  Umbrella,
  Wind,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Coords = { latitude: number; longitude: number };
const WEEKDAY_NAMES = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

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
      return {
        coords: gpsCoords,
        label: "Vị trí hiện tại",
        isResolving: false,
      };
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

export function CompactWeatherWidget() {
  const { coords, label, isResolving } = useWeatherLocation();
  const { data, isLoading } = useWeatherForecast(coords);
  const [showDetailSheet, setShowDetailSheet] = useState(false);

  const today = new Date();
  const weekday = WEEKDAY_NAMES[today.getDay()];
  const dateFormatted = dayjs(today).format("DD/MM/YYYY");

  if (!coords && !isResolving) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 flex items-center gap-3 text-slate-500 text-sm shadow-sm">
        <MapPinOff className="h-5 w-5 text-slate-400 shrink-0" />
        <p className="text-xs">Chưa xác định vị trí thời tiết.</p>
      </div>
    );
  }

  if (!coords || isLoading || !data) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-4 flex items-center justify-center gap-2 text-slate-500 text-sm shadow-sm h-24">
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
        <span className="text-xs">Đang tải thời tiết...</span>
      </div>
    );
  }

  const current = describeWeatherCode(data.current.weatherCode);
  const CurrentIcon = current.icon;
  const rainProb = data.daily[0]?.precipitationProbability ?? 0;
  const temp = Math.round(data.current.temperature);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowDetailSheet(true)}
        className="w-full text-left rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm active:scale-[0.99] transition-all group"
      >
        {/* Header Ngày & Tiêu đề */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-100/80">
          <span className="font-bold text-sm text-slate-900">
            Thời tiết hôm nay
          </span>
          <span className="text-xs font-medium text-slate-500">
            {weekday}, {dateFormatted}
          </span>
        </div>

        {/* Nội dung nhiệt độ & tình trạng */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${current.tone.bg}`}
            >
              <CurrentIcon className={`h-7 w-7 ${current.tone.icon}`} />
            </div>

            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900 leading-none">
                  {temp}°C
                </span>
              </div>
              <p className="text-xs font-medium text-slate-600 mt-1">
                {current.label} · Khả năng mưa {rainProb}%
              </p>
            </div>
          </div>

          <div className="flex items-center text-slate-400 group-hover:text-primary transition-colors">
            <ChevronRight className="h-5 w-5" />
          </div>
        </div>
      </button>

      {/* Sheet xem dự báo chi tiết khi chạm vào */}
      <Sheet open={showDetailSheet} onOpenChange={setShowDetailSheet}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto"
        >
          <SheetHeader className="text-left pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-base font-bold text-slate-900">
                Dự báo thời tiết chi tiết
              </SheetTitle>
              {label && (
                <span className="flex items-center gap-1 text-xs text-primary font-medium">
                  <MapPin className="h-3 w-3" />
                  {label}
                </span>
              )}
            </div>
          </SheetHeader>

          <div className="mt-4 space-y-4">
            {/* Chỉ số nhanh */}
            <div className="grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Droplets className="h-4 w-4 mx-auto text-sky-500 mb-1" />
                <p className="text-[11px] text-slate-500">Độ ẩm</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {data.current.humidity}%
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Wind className="h-4 w-4 mx-auto text-emerald-500 mb-1" />
                <p className="text-[11px] text-slate-500">Gió</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {Math.round(data.current.windSpeed)} km/h
                </p>
              </div>
              <div className="rounded-xl bg-slate-50 p-3 text-center">
                <Umbrella className="h-4 w-4 mx-auto text-indigo-500 mb-1" />
                <p className="text-[11px] text-slate-500">Lượng mưa</p>
                <p className="font-bold text-sm text-slate-900 mt-0.5">
                  {data.current.precipitation} mm
                </p>
              </div>
            </div>

            {/* Dự báo 5 ngày */}
            <div>
              <p className="text-xs font-bold text-slate-800 mb-2">
                Dự báo các ngày tới
              </p>
              <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden">
                {data.daily.slice(0, 5).map((day, idx) => {
                  const dayDesc = describeWeatherCode(day.weatherCode);
                  const DayIcon = dayDesc.icon;
                  const dayName =
                    idx === 0
                      ? "Hôm nay"
                      : WEEKDAY_NAMES[
                          new Date(`${day.date}T00:00:00`).getDay()
                        ];

                  return (
                    <div
                      key={day.date}
                      className="flex items-center justify-between p-3 bg-white"
                    >
                      <span className="text-xs font-semibold text-slate-700 w-20">
                        {dayName}
                      </span>
                      <div className="flex items-center gap-2 flex-1 justify-center">
                        <DayIcon className={`h-5 w-5 ${dayDesc.tone.icon}`} />
                        <span className="text-xs text-slate-500 truncate max-w-[100px]">
                          {dayDesc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {Math.round(day.tempMax)}°
                          <span className="text-slate-400 font-normal">
                            /{Math.round(day.tempMin)}°
                          </span>
                        </span>
                        <span className="text-[11px] text-sky-600 flex items-center">
                          <Droplet className="h-3 w-3 mr-0.5" />
                          {day.precipitationProbability ?? 0}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
