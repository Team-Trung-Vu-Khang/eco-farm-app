import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import L from "leaflet";
import type { RegionFormValues } from "../data/region-form.schema";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useCrops } from "@/features/foundation/hooks/useCrops";
import { useOrganizationById } from "@/features/organization/hooks/useOrganizationById";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useFormContext } from "react-hook-form";
import { useMemo } from "react";

const mapContainerStyle = { width: "100%", height: "100%" };

const centroidOf = (points: L.LatLng[]) => {
  if (points.length === 0) return { lat: 0, lng: 0 };
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
};

interface RegionReviewStepProps {
  showEnterprise?: boolean;
}

export const RegionReviewStep = ({
  showEnterprise = false,
}: RegionReviewStepProps = {}) => {
  const { watch } = useFormContext<RegionFormValues>();
  const formData = watch();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const { items: lands } = useCatalog("soil-types");
  const { items: terrains } = useCatalog("terrain-features");
  const { data: cropsData } = useCrops({ params: { size: 100 } });

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { item: selectedOrganization } = useOrganizationById(
    formData.enterpriseId || "",
    parsedWorkspaceId ?? "missing",
    {
      enabled: parsedWorkspaceId !== undefined && !!formData.enterpriseId,
    },
  );

  const subAreas = formData.subAreas || [];
  const { provinces, wards } = useAddressOptions(formData.provinceId);

  const regionPoints = useMemo(() => {
    const coordinates = formData.coordinates || [];
    return coordinates.map((c) => L.latLng(c.lat, c.lng));
  }, [formData.coordinates]);

  const cropIds = formData.cropIds;
  const selectedCropsText = useMemo(() => {
    if (!cropIds || cropIds.length === 0) return "";
    const cropsList = cropsData?.content || [];
    return cropIds
      .map((id) => cropsList.find((c) => c.id.toString() === id)?.name)
      .filter(Boolean)
      .join(", ");
  }, [cropIds, cropsData?.content]);

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-blue-100 bg-blue-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4M12 8h.01" />
              </svg>
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Thông tin chung
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {showEnterprise && (
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Đơn vị sở hữu
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedOrganization?.name || (
                    <span className="italic text-slate-300">Chưa chọn</span>
                  )}
                </p>
              </div>
            )}

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tên vùng
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {formData.name || (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>

            {/* <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Cây trồng chính
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {selectedCropsText || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div> */}

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Diện tích
              </p>
              <p className="text-sm font-bold text-blue-600">
                {formData.area ? (
                  `${formData.area} ha`
                ) : (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tỉnh / Thành phố
              </p>
              <p className="text-sm text-slate-700">
                {provinces.find(
                  (province) => province.code === formData.provinceId,
                )?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Phường / Xã
              </p>
              <p className="text-sm text-slate-700">
                {wards.find((ward) => ward.code === formData.wardId)?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5 md:col-span-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Địa chỉ chi tiết
              </p>
              <p className="text-sm text-slate-700">
                {formData.address || (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Loại đất
              </p>
              <p className="text-sm text-slate-700">
                {lands.find(
                  (land) =>
                    String(land.id || land.code) === String(formData.landType),
                )?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Địa hình
              </p>
              <p className="text-sm text-slate-700">
                {terrains.find(
                  (terrain) =>
                    String(terrain.id || terrain.code) ===
                    String(formData.terrain),
                )?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>

            {formData.note && (
              <div className="space-y-0.5 md:col-span-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Ghi chú
                </p>
                <p className="text-sm italic text-slate-600">{formData.note}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
              </div>
              <CardTitle className="text-base font-bold text-slate-800">
                Bản đồ vùng trồng
              </CardTitle>
            </div>
            {regionPoints.length >= 3 && (
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                {regionPoints.length} điểm ranh giới
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {regionPoints.length >= 3 ? (
            <div className="relative h-[300px] w-full overflow-hidden">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={centroidOf(regionPoints)}
                  zoom={15}
                  mapTypeId="satellite"
                  options={{
                    zoomControl: false,
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                    keyboardShortcuts: false,
                    gestureHandling: "none",
                  }}
                  onLoad={(map) => {
                    const bounds = new google.maps.LatLngBounds();
                    regionPoints.forEach((p) =>
                      bounds.extend({ lat: p.lat, lng: p.lng }),
                    );
                    map.fitBounds(bounds, 20);
                  }}
                >
                  <Polygon
                    paths={regionPoints}
                    options={{
                      strokeColor: "#10b981",
                      fillColor: "#10b981",
                      fillOpacity: 0.15,
                      strokeWeight: 2.5,
                    }}
                  />

                  {subAreas
                    .filter(
                      (subArea) =>
                        subArea.coordinates && subArea.coordinates.length >= 3,
                    )
                    .map((subArea, index) => {
                      const subAreaPoints = subArea.coordinates!.map(
                        (coordinate) => L.latLng(coordinate.lat, coordinate.lng),
                      );
                      return (
                        <div key={subArea.id || index}>
                          <Polygon
                            paths={subAreaPoints}
                            options={{
                              strokeColor: "#f59e0b",
                              fillColor: "#f59e0b",
                              fillOpacity: 0.25,
                              strokeWeight: 2,
                            }}
                          />
                          <Marker
                            position={centroidOf(subAreaPoints)}
                            label={{
                              text: subArea.name || `Khu ${index + 1}`,
                              fontSize: "10px",
                              fontWeight: "bold",
                            }}
                            icon={{
                              url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
                              scaledSize: new google.maps.Size(1, 1),
                            }}
                          />
                        </div>
                      );
                    })}
                </GoogleMap>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Đang tải bản đồ...
                </div>
              )}

              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-white/90 px-3 py-2 text-[11px] font-semibold shadow-md backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <svg width="16" height="8">
                    <line
                      x1="0"
                      y1="4"
                      x2="16"
                      y2="4"
                      stroke="#10b981"
                      strokeWidth="2"
                      strokeDasharray="4 3"
                    />
                  </svg>
                  <span className="text-slate-600">Ranh giới vùng trồng</span>
                </div>
                {subAreas.filter(
                  (subArea) =>
                    subArea.coordinates && subArea.coordinates.length >= 3,
                ).length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-4 rounded-sm border border-amber-400 bg-amber-400/30" />
                    <span className="text-slate-600">Khu vực con</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-slate-50 py-10 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-slate-200"
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              <p className="text-sm font-semibold text-amber-600">
                Chưa xác định ranh giới
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Quay lại bước 2 để vẽ vùng trồng trên bản đồ
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-amber-100 bg-amber-50/70 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="7" height="7" x="3" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="3" rx="1" />
                  <rect width="7" height="7" x="14" y="14" rx="1" />
                  <rect width="7" height="7" x="3" y="14" rx="1" />
                </svg>
              </div>
              <CardTitle className="text-base font-bold text-slate-800">
                Phân chia khu vực con
              </CardTitle>
            </div>
            <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
              {subAreas.length} khu vực
            </span>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          {subAreas.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {subAreas.map((subArea, index) => (
                <div
                  key={subArea.id || index}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-extrabold text-amber-700">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-700">
                        {subArea.name || `Khu ${index + 1}`}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {lands.find(
                          (land) =>
                            String(land.id || land.code) ===
                            String(subArea.landType),
                        )?.name || "Chưa chọn loại đất"}
                        {subArea.plots && subArea.plots.length > 0 &&
                          ` · ${subArea.plots.length} lô`}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg border border-slate-100 bg-white px-2 py-0.5 text-xs font-bold text-slate-400">
                    {subArea.area ?? 0} ha
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mb-2 text-slate-200"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              <p className="text-sm italic text-slate-400">
                Chưa có khu vực con nào được tạo
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
