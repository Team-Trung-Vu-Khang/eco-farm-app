import { Badge, Card, CardContent, CardHeader, CardTitle } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import { Info, Layers, Map as MapIcon } from "lucide-react";
import type L from "leaflet";
import type { Enterprise } from "@/pages/enterprise/data/constants";
import type { Land } from "@/stores/useLandStore";
import type { Terrain } from "@/stores/useTerrainStore";
import { DISTRICTS, PROVINCES, type Plot, type Region, type SubArea } from "../../constants";
import { getBoundsFromPoints } from "../utils/map";

interface AreaReviewStepProps {
  enterprises: Enterprise[];
  selectEnterpriseId: number | null;
  regions: Region[];
  selectedRegionId: number | null;
  formData: Partial<SubArea>;
  lands: Land[];
  terrains: Terrain[];
  areaPoints: L.LatLng[];
}

export function AreaReviewStep({
  enterprises,
  selectEnterpriseId,
  regions,
  selectedRegionId,
  formData,
  lands,
  terrains,
  areaPoints,
}: AreaReviewStepProps) {
  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-blue-100 bg-blue-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
              <Info className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Thông tin chung
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 px-5 py-5 md:grid-cols-3">
          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Đơn vị sở hữu
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {enterprises.find((enterprise) => enterprise.id === selectEnterpriseId)?.name || (
                <span className="italic text-slate-300">Chưa chọn</span>
              )}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Vùng trồng
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {regions.find((region) => region.id === selectedRegionId)?.name || (
                <span className="italic text-slate-300">Chưa chọn</span>
              )}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Địa chỉ vùng trồng
            </p>
            <p className="text-sm text-slate-600">
              {(() => {
                const region = regions.find((item) => item.id === selectedRegionId);
                if (!region) {
                  return <span className="italic text-slate-300">N/A</span>;
                }
                const province =
                  PROVINCES.find((item) => item.id === region.provinceId)?.name ||
                  region.provinceId;
                const district =
                  DISTRICTS.find((item) => item.id === region.districtId)?.name ||
                  region.districtId;
                return `${region.address ? `${region.address}, ` : ""}${district}, ${province}`;
              })()}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Mã khu vực
            </p>
            <p className="font-mono text-sm font-semibold text-slate-700">
              {formData.code || <span className="italic text-slate-300">Chưa nhập</span>}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Tên khu vực
            </p>
            <p className="text-sm font-semibold text-slate-700">
              {formData.name || <span className="italic text-slate-300">Chưa nhập</span>}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Diện tích
            </p>
            <p className="text-sm font-bold text-blue-600">
              {formData.area ? `${formData.area} ha` : <span className="italic text-slate-300">Chưa nhập</span>}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Loại đất
            </p>
            <p className="text-sm text-slate-700">
              {lands.find((land) => land.code === formData.landType)?.name || (
                <span className="italic text-slate-300">Chưa chọn</span>
              )}
            </p>
          </div>

          <div className="space-y-0.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Địa hình
            </p>
            <p className="text-sm text-slate-700">
              {terrains.find((terrain) => terrain.code === formData.terrain)?.name || (
                <span className="italic text-slate-300">Chưa chọn</span>
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
                <MapIcon className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800">
                Bản đồ khu vực
              </CardTitle>
            </div>
            {areaPoints.length >= 3 && (
              <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                {areaPoints.length} điểm ranh giới
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {areaPoints.length >= 3 ? (
            <div className="relative h-[300px] w-full overflow-hidden">
              <MapContainer
                bounds={getBoundsFromPoints(areaPoints).pad(0.15)}
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
                  positions={areaPoints.map((point) => [point.lat, point.lng] as [number, number])}
                  pathOptions={{
                    color: "#10b981",
                    fillColor: "#10b981",
                    fillOpacity: 0.15,
                    weight: 2.5,
                    dashArray: "6 4",
                  }}
                />
                {formData.plots
                  ?.filter((plot) => plot.coordinates && plot.coordinates.length >= 3)
                  .map((plot: Plot, index) => (
                    <Polygon
                      key={plot.id || index}
                      positions={plot.coordinates.map((coord) => [coord.lat, coord.lng] as [number, number])}
                      pathOptions={{
                        color: "#f59e0b",
                        fillColor: "#f59e0b",
                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                    >
                      <Tooltip permanent direction="center" className="text-[10px] font-bold">
                        {plot.name || `Lô ${index + 1}`}
                      </Tooltip>
                    </Polygon>
                  ))}
              </MapContainer>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-slate-50 py-10 text-center">
              <MapIcon className="mb-2 h-10 w-10 text-slate-200" />
              <p className="text-sm font-semibold text-amber-600">Chưa xác định ranh giới</p>
              <p className="mt-0.5 text-xs text-slate-400">
                Quay lại bước 2 để vẽ khu vực trên bản đồ
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
                <Layers className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-800">
                Cấu hình lô
              </CardTitle>
            </div>
            <Badge
              variant="secondary"
              className="border-none bg-amber-100 font-bold text-amber-700"
            >
              {formData.plots?.length || 0} lô
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          {formData.plots && formData.plots.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {formData.plots.map((plot, index) => (
                <div
                  key={plot.id || index}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 transition-all hover:bg-white hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-extrabold text-amber-700">
                      {index + 1}
                    </div>
                    <div className="flex flex-col">
                      {plot.code && (
                        <span className="mb-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-400">
                          {plot.code}
                        </span>
                      )}
                      <span className="text-sm font-semibold text-slate-700">
                        {plot.name || `Lô ${index + 1}`}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-lg border border-slate-100 bg-white px-2 py-0.5 text-xs font-bold text-slate-400">
                    {plot.area ?? 0} ha
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-100 py-8 text-center text-slate-400">
              <Layers className="mb-2 h-8 w-8 text-slate-200" />
              <p className="text-sm italic">Chưa có lô nào được cấu hình</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
