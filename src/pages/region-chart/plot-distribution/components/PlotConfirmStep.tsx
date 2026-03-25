import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin } from "lucide-react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Plot, Region, SubArea } from "../../constants";
import { getBoundsFromPoints } from "../utils";

interface PlotConfirmStepProps {
  regions: Region[];
  selectedRegionId: number | null;
  selectedAreaId: string | null;
  selectedEnterpriseName?: string;
  formData: Partial<Plot>;
  currentPoints: L.LatLng[];
  areaPolygon: L.LatLng[];
}

export const PlotConfirmStep = ({
  regions,
  selectedRegionId,
  selectedAreaId,
  selectedEnterpriseName,
  formData,
  currentPoints,
  areaPolygon,
}: PlotConfirmStepProps) => {
  const confirmRegion = regions.find((region) => region.id === selectedRegionId);
  const confirmArea = confirmRegion?.subAreas?.find(
    (area: SubArea) => String(area.id) === String(selectedAreaId),
  );

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-blue-100 bg-blue-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
              <MapPin className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Vị trí lô
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
                {selectedEnterpriseName || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vùng trồng
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {confirmRegion?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Khu vực
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {confirmArea?.name || (
                  <span className="italic text-slate-300">Chưa chọn</span>
                )}
              </p>
            </div>
            {confirmArea?.area != null && (
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Diện tích khu vực
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {confirmArea.area} ha
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <Layers className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Thông tin lô
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Mã lô
              </p>
              <p className="font-mono text-sm font-semibold text-slate-700">
                {formData.code || (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tên lô
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
              <p className="text-sm font-bold text-emerald-600">
                {formData.area ? (
                  `${formData.area} ha`
                ) : (
                  <span className="italic text-slate-300">Chưa nhập</span>
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Đường bình độ
              </p>
              <p className="text-sm text-slate-700">
                {formData.contour || (
                  <span className="italic text-slate-300">—</span>
                )}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Độ cao
              </p>
              <p className="text-sm text-slate-700">
                {formData.altitude ? (
                  `${formData.altitude} m`
                ) : (
                  <span className="italic text-slate-300">—</span>
                )}
              </p>
            </div>
          </div>
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
                  <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                  <line x1="9" y1="3" x2="9" y2="18" />
                  <line x1="15" y1="6" x2="15" y2="21" />
                </svg>
              </div>
              <CardTitle className="text-base font-bold text-slate-800">
                Bản đồ lô đất
              </CardTitle>
            </div>
            {currentPoints.length >= 3 && (
              <span className="rounded-full border border-amber-100 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-600">
                {currentPoints.length} điểm ranh giới
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {currentPoints.length >= 3 ? (
            <>
              <div className="relative h-[260px] w-full overflow-hidden">
                <MapContainer
                  bounds={getBoundsFromPoints(currentPoints).pad(0.15)}
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
                  {areaPolygon.length >= 3 && (
                    <Polygon
                      positions={areaPolygon}
                      pathOptions={{
                        color: "#3b82f6",
                        fill: false,
                        weight: 1.5,
                        dashArray: "5 4",
                      }}
                    />
                  )}
                  <Polygon
                    positions={currentPoints}
                    pathOptions={{
                      color: "#f59e0b",
                      fillColor: "#f59e0b",
                      fillOpacity: 0.2,
                      weight: 2.5,
                      dashArray: "6 4",
                    }}
                  />
                </MapContainer>

                <div className="pointer-events-none absolute bottom-3 left-3 z-500 flex flex-col gap-1.5 rounded-xl border border-slate-100 bg-white/90 px-3 py-2 text-[11px] font-semibold shadow-md backdrop-blur-sm">
                  <div className="flex items-center gap-1.5">
                    <svg width="16" height="8">
                      <line
                        x1="0"
                        y1="4"
                        x2="16"
                        y2="4"
                        stroke="#f59e0b"
                        strokeWidth="2"
                        strokeDasharray="4 3"
                      />
                    </svg>
                    <span className="text-slate-600">Ranh giới lô</span>
                  </div>
                  {areaPolygon.length >= 3 && (
                    <div className="flex items-center gap-1.5">
                      <svg width="16" height="8">
                        <line
                          x1="0"
                          y1="4"
                          x2="16"
                          y2="4"
                          stroke="#3b82f6"
                          strokeWidth="1.5"
                          strokeDasharray="4 3"
                        />
                      </svg>
                      <span className="text-slate-600">Ranh giới khu vực</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="px-5 py-4">
                <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Danh sách toạ độ
                </p>
                <div className="max-h-44 divide-y divide-slate-50 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50/60">
                  {currentPoints.map((point, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 px-4 py-2.5"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-extrabold text-amber-700">
                        {index + 1}
                      </span>
                      <div className="flex gap-5 text-xs font-mono text-slate-700">
                        <span>
                          <span className="mr-1 font-sans text-[10px] font-bold uppercase text-slate-400">
                            Lat
                          </span>
                          {point.lat.toFixed(6)}
                        </span>
                        <span>
                          <span className="mr-1 font-sans text-[10px] font-bold uppercase text-slate-400">
                            Lng
                          </span>
                          {point.lng.toFixed(6)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
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
                Chưa xác định ranh giới lô
              </p>
              <p className="mt-0.5 text-xs text-slate-400">
                Quay lại bước 3 để vẽ lô trên bản đồ
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
