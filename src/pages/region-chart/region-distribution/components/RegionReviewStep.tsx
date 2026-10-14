import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useAddressOptions } from "@/features/master-data/hooks/useAddressOptions";
import { useOrganizationById } from "@/features/organization/hooks/useOrganizationById";
import { useSelectedWorkspaceId } from "@/features/workspace";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
} from "react-leaflet";
import type { RegionFormValues } from "../data/region-form.schema";
import { getBoundsFromPoints } from "../utils";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { InvalidateMapSize } from "./InvalidateMapSize";

interface RegionReviewStepProps {
  showEnterprise?: boolean;
  isDetailed?: boolean;
}

export const RegionReviewStep = ({
  showEnterprise = false,
  isDetailed = true,
}: RegionReviewStepProps = {}) => {
  const { watch } = useFormContext<RegionFormValues>();
  const formData = watch();

  const { items: lands } = useCatalog("soil-types", { params: { size: 100 } });
  const { items: terrains } = useCatalog("terrain-features", {
    params: { size: 100 },
  });
  // const { data: cropsData } = useCrops({
  //   params: { size: 100, domainCode: "CROP" },
  // });

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
  const totalSubAreaAcreage = subAreas.reduce(
    (acc, curr) => acc + (curr.area || 0),
    0,
  );
  const regionArea = formData.area || 0;
  const isOverAllocated =
    regionArea > 0 && totalSubAreaAcreage > regionArea + 1e-4;
  const { provinces, wards } = useAddressOptions(formData.provinceId);

  const getLandTypeName = (landTypeId?: string) => {
    if (!landTypeId) return "Chưa chọn loại đất";
    const found = lands.find(
      (land) => String(land.id || land.code) === String(landTypeId),
    );
    return found?.name || landTypeId;
  };

  const rawCoordinates = watch("coordinates");
  const regionPoints = useMemo(() => {
    return (rawCoordinates || []).map((c) => L.latLng(c.lat, c.lng));
  }, [rawCoordinates]);

  // const cropIds = formData.cropIds;
  // const selectedCropsText = useMemo(() => {
  //   if (!cropIds || cropIds.length === 0) return "";
  //   const cropsList = cropsData?.content || [];
  //   return cropIds
  //     .map((id) => cropsList.find((c) => c.id.toString() === id)?.name)
  //     .filter(Boolean)
  //     .join(", ");
  // }, [cropIds, cropsData?.content]);

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
            {isDetailed && regionPoints.length >= 3 ? (
              <Badge
                variant="outline"
                className="bg-primary/10 text-primary border-primary/20 font-medium"
              >
                {regionPoints.length} điểm ranh giới (Polygon)
              </Badge>
            ) : formData.centerPoint?.lat !== undefined &&
              formData.centerPoint?.lng !== undefined ? (
              <Badge variant="secondary" className="font-medium">
                Chế độ cơ bản (Tọa độ tâm)
              </Badge>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isDetailed && regionPoints.length >= 3 ? (
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
                <InvalidateMapSize />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

                <Polygon
                  positions={regionPoints.map(
                    (point) => [point.lat, point.lng] as [number, number],
                  )}
                  pathOptions={{
                    color: "#10b981",
                    fillColor: "#10b981",
                    fillOpacity: 0.15,
                    weight: 2.5,
                    dashArray: "6 4",
                  }}
                />

                {subAreas
                  .filter(
                    (subArea) =>
                      subArea.coordinates && subArea.coordinates.length >= 3,
                  )
                  .map((subArea, index) => (
                    <Polygon
                      key={subArea.id || index}
                      positions={subArea.coordinates!.map(
                        (coordinate) =>
                          [coordinate.lat, coordinate.lng] as [number, number],
                      )}
                      pathOptions={{
                        color: "#f59e0b",
                        fillColor: "#f59e0b",
                        fillOpacity: 0.25,
                        weight: 2,
                      }}
                    >
                      <Tooltip
                        permanent
                        direction="center"
                        className="text-[10px] font-bold"
                      >
                        {subArea.name || `Khu ${index + 1}`}
                        {subArea.landType &&
                          ` (${getLandTypeName(subArea.landType)})`}
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
          ) : formData.centerPoint?.lat !== undefined &&
            formData.centerPoint?.lng !== undefined ? (
            <div className="relative h-[300px] w-full overflow-hidden">
              <MapContainer
                center={[formData.centerPoint.lat, formData.centerPoint.lng]}
                zoom={14}
                style={{ height: "100%", width: "100%" }}
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                keyboard={false}
                attributionControl={false}
              >
                <InvalidateMapSize />
                <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

                <Marker
                  position={[
                    formData.centerPoint.lat,
                    formData.centerPoint.lng,
                  ]}
                  icon={getMarkerIcon("blue")}
                >
                  <Tooltip
                    permanent
                    direction="top"
                    className="text-[11px] font-bold"
                  >
                    {formData.name || "Vùng trồng"} (Tâm)
                  </Tooltip>
                </Marker>

                {subAreas
                  .filter(
                    (sub) =>
                      sub.centerPoint?.lat !== undefined &&
                      sub.centerPoint?.lng !== undefined,
                  )
                  .map((sub, index) => (
                    <Marker
                      key={sub.id || index}
                      position={[sub.centerPoint!.lat, sub.centerPoint!.lng]}
                      icon={getMarkerIcon("amber")}
                    >
                      <Tooltip
                        permanent
                        direction="bottom"
                        className="text-[10px] font-semibold"
                      >
                        {sub.name || `Khu ${index + 1}`}
                      </Tooltip>
                    </Marker>
                  ))}
              </MapContainer>

              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] flex flex-col gap-1.5 rounded-lg border border-border bg-card/90 px-3 py-2 text-[11px] font-semibold text-card-foreground shadow-xs backdrop-blur-sm">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                  <span className="text-muted-foreground font-medium">
                    Tọa độ tâm vùng trồng
                  </span>
                </div>
                {subAreas.filter((s) => s.centerPoint?.lat !== undefined)
                  .length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                    <span className="text-muted-foreground font-medium">
                      Tọa độ khu vực con
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center bg-muted/20 py-10 text-center">
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
                className="mb-2 text-muted-foreground/40"
              >
                <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
                <line x1="9" y1="3" x2="9" y2="18" />
                <line x1="15" y1="6" x2="15" y2="21" />
              </svg>
              <p className="text-sm font-semibold text-primary">
                Chưa xác định vị trí hoặc ranh giới
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Quay lại bước trước để chọn vị trí trên bản đồ
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
            <Badge
              variant="outline"
              className="bg-amber-50 text-amber-700 border-amber-200/60 font-semibold text-[11px]"
            >
              {subAreas.length} khu vực
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5 space-y-4">
          {isOverAllocated && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>Cảnh báo:</strong> Tổng diện tích các khu vực con (
                {totalSubAreaAcreage.toFixed(2)} ha) đang vượt quá diện tích
                vùng trồng ({regionArea} ha).
              </span>
              <Badge
                variant="destructive"
                className="text-[10px] font-semibold"
              >
                Vượt {(totalSubAreaAcreage - regionArea).toFixed(2)} ha
              </Badge>
            </div>
          )}
          {subAreas.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {subAreas.map((subArea, index) => {
                const landTypeName = getLandTypeName(subArea.landType);
                return (
                  <div
                    key={subArea.id || index}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3.5 transition-all hover:bg-white hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-extrabold text-amber-700">
                        {index + 1}
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-slate-800">
                          {subArea.name || `Khu ${index + 1}`}
                        </p>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                          <span className="font-medium text-slate-500">
                            Loại đất:
                          </span>
                          <span className="rounded border border-amber-200/60 bg-amber-50 px-1.5 py-0.5 text-[11px] font-semibold text-amber-800">
                            {landTypeName}
                          </span>
                          {subArea.plots && subArea.plots.length > 0 && (
                            <span className="text-slate-400">
                              · {subArea.plots.length} lô
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="rounded-lg border border-slate-200/60 bg-white px-2.5 py-1 text-xs font-bold text-slate-700">
                      {subArea.area ?? 0} ha
                    </span>
                  </div>
                );
              })}
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
