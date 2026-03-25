import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Region, SubArea } from "../../constants";
import { PROVINCES } from "@/constants/province";
import { getBoundsFromPoints } from "../utils";

type EnterpriseOption = {
  id: string | number;
  name: string;
};

type LookupOption = {
  id?: string | number;
  code?: string | number;
  name: string;
};

interface RegionReviewStepProps {
  formData: Partial<Region>;
  regionPoints: L.LatLng[];
  enterprises: EnterpriseOption[];
  lands: LookupOption[];
  terrains: LookupOption[];
}

export const RegionReviewStep = ({
  formData,
  regionPoints,
  enterprises,
  lands,
  terrains,
}: RegionReviewStepProps) => {
  const subAreas = (formData.subAreas as SubArea[] | undefined) || [];

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
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Đơn vị sở hữu
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {enterprises.find(
                  (enterprise) =>
                    String(enterprise.id) === String(formData.enterpriseId),
                )?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mã vùng
              </p>
              <p className="font-mono text-sm font-semibold text-slate-700">
                {formData.code || (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>

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
                {PROVINCES.find((province) => province.code === formData.provinceId)
                  ?.name || <span className="italic text-slate-300">Chưa chọn</span>}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Phường / Xã
              </p>
              <p className="text-sm text-slate-700">
                {PROVINCES.find((province) => province.code === formData.provinceId)
                  ?.districts.find((district) => district.code === formData.districtId)
                  ?.name || <span className="italic text-slate-300">Chưa chọn</span>}
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
                )?.name || <span className="italic text-slate-300">Chưa chọn</span>}
              </p>
            </div>

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Địa hình
              </p>
              <p className="text-sm text-slate-700">
                {terrains.find(
                  (terrain) =>
                    String(terrain.id || terrain.code) === String(formData.terrain),
                )?.name || <span className="italic text-slate-300">Chưa chọn</span>}
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
              <MapContainer
                bounds={getBoundsFromPoints(regionPoints).pad(0.15)}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                keyboard={false}
                attributionControl={false}
              >
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

                <Polygon
                  positions={regionPoints.map((point) => [
                    point.lat,
                    point.lng,
                  ] as [number, number])}
                  pathOptions={{
                    color: "#10b981",
                    fillColor: "#10b981",
                    fillOpacity: 0.15,
                    weight: 2.5,
                    dashArray: "6 4",
                  }}
                />

                {subAreas
                  .filter((subArea) => subArea.coordinates && subArea.coordinates.length >= 3)
                  .map((subArea, index) => (
                    <Polygon
                      key={subArea.id || index}
                      positions={subArea.coordinates!.map((coordinate) => [
                        coordinate.lat,
                        coordinate.lng,
                      ] as [number, number])}
                      pathOptions={{
                        color: "#f59e0b",
                        fillColor: "#f59e0b",
                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                    >
                      <Tooltip permanent direction="center" className="text-[10px] font-bold">
                        {subArea.name || `Khu ${index + 1}`}
                      </Tooltip>
                    </Polygon>
                  ))}
              </MapContainer>

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
                  (subArea) => subArea.coordinates && subArea.coordinates.length >= 3,
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
                      {subArea.plots && subArea.plots.length > 0 && (
                        <p className="text-[11px] text-slate-400">
                          {subArea.plots.length} lô
                        </p>
                      )}
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
