import type { FarmRegionResponse } from "@/features/farm/types/farm.type";
import { Badge, ScrollArea, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { ChevronRight, Layers, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type LatLng = { lat: number; lng: number };

interface CertificateRegionScopeMapProps {
  regions: FarmRegionResponse[];
  selectedIds: string[];
}

const mapContainerStyle = { width: "100%", height: "100%" };

const DEFAULT_CENTER: LatLng = { lat: 11.53, lng: 106.88 };

const toPolygon = (boundary?: FarmRegionResponse["boundary"]) =>
  (boundary || [])
    .map((point) => {
      if (
        point.latitude === undefined ||
        point.longitude === undefined ||
        point.latitude === null ||
        point.longitude === null
      ) {
        return null;
      }

      return { lat: point.latitude, lng: point.longitude } as LatLng;
    })
    .filter((point): point is LatLng => Boolean(point));

const getCenterFromPoints = (points: LatLng[]) => {
  if (points.length === 0) return DEFAULT_CENTER;

  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
  return { lat, lng } as LatLng;
};

export function CertificateRegionScopeMap({
  regions,
  selectedIds,
}: CertificateRegionScopeMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);

  const regionItems = useMemo(
    () =>
      regions.map((region) => {
        const boundary = toPolygon(region.boundary);

        return {
          id: String(region.id),
          code: region.code || String(region.id),
          name: region.name || region.code || String(region.id),
          acreage: region.acreage,
          status: region.status,
          boundary,
          selected: selectedIds.includes(String(region.id)),
        };
      }),
    [regions, selectedIds],
  );

  const initialActiveId = useMemo(() => {
    const selected = regionItems.find((item) => item.selected && item.boundary);
    if (selected) return selected.id;

    const firstWithBoundary = regionItems.find((item) => item.boundary.length);
    return firstWithBoundary?.id ?? regionItems[0]?.id ?? null;
  }, [regionItems]);

  const [manualActiveRegionId, setManualActiveRegionId] = useState<
    string | null
  >(initialActiveId);

  const activeRegionId =
    manualActiveRegionId &&
    regionItems.some((item) => item.id === manualActiveRegionId)
      ? manualActiveRegionId
      : initialActiveId;

  const activeRegion =
    regionItems.find((item) => item.id === activeRegionId) ??
    regionItems.find((item) => item.boundary.length > 0) ??
    regionItems[0] ??
    null;
  const selectedRegionItems = regionItems.filter((item) => item.selected);

  const mapCenter =
    activeRegion?.boundary.length >= 3
      ? getCenterFromPoints(activeRegion.boundary)
      : DEFAULT_CENTER;

  useEffect(() => {
    const map = mapRef.current;
    const boundary = activeRegion?.boundary;
    if (!map || !boundary || boundary.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    boundary.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, 36);
  }, [activeRegion, isLoaded]);

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="relative overflow-hidden rounded-3xl -z-0 h-[34rem] w-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={mapCenter}
            zoom={13}
            options={{ zoomControl: false }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {activeRegion?.boundary.length >= 3 ? (
              <Polygon
                key={activeRegion.id}
                paths={activeRegion.boundary}
                options={{
                  strokeColor: "#10b981",
                  strokeWeight: 3,
                  fillColor: "#10b981",
                  fillOpacity: 0.24,
                }}
                onClick={() => setManualActiveRegionId(activeRegion.id)}
              />
            ) : null}
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] text-slate-600">
            <MapPin className="h-3.5 w-3.5 text-emerald-600" />
            Danh sách vùng trồng
          </div>
          <div className="inline-flex shrink-0 min-w-max whitespace-nowrap rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
            {selectedIds.length} đã chọn
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-xl font-bold leading-tight text-slate-900">
            {activeRegion?.name || "Chưa có vùng trồng"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Chọn một vùng bên dưới để bản đồ tự bay tới vị trí đó.
          </p>
        </div>

        <ScrollArea className="h-[23rem] mt-2">
          <div className="space-y-2.5">
            {selectedRegionItems.length > 0 ? (
              selectedRegionItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setManualActiveRegionId(item.id)}
                  className={cn(
                    "w-full rounded-2xl border p-3 text-left transition-all",
                    activeRegionId === item.id
                      ? "border-emerald-200 bg-white shadow-sm ring-1 ring-emerald-100"
                      : "border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm",
                        activeRegionId === item.id
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-slate-100 bg-slate-50 text-slate-400",
                      )}
                    >
                      <Layers className="h-4 w-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-1.5">
                        <Badge
                          variant="secondary"
                          className="h-5 rounded-full px-2 py-0 text-[10px] font-mono"
                        >
                          {item.code}
                        </Badge>
                        {item.selected ? (
                          <Badge
                            variant="outline"
                            className="h-5 rounded-full px-2 py-0 text-[10px] text-emerald-600"
                          >
                            Đã chọn
                          </Badge>
                        ) : null}
                      </div>
                      <div className="truncate text-sm font-semibold leading-tight text-slate-900">
                        {item.name}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {typeof item.acreage === "number"
                          ? `${item.acreage} ha`
                          : "Chưa có diện tích"}
                      </div>
                    </div>

                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform",
                        activeRegionId === item.id
                          ? "rotate-90 text-emerald-600"
                          : "text-slate-300",
                      )}
                    />
                  </div>
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-12 text-center text-slate-500">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin className="h-5 w-5 text-slate-300" />
                </div>
                <div className="text-sm">Chưa có vùng trồng nào được chọn</div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
