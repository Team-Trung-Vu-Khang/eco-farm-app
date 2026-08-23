import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft, Edit } from "lucide-react";
import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";

import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { LAND_TYPES } from "../constants";
import { useRegionDetailPage } from "../hooks/useRegionDetailPage";

const closePath = (points: { lat: number; lng: number }[]) => {
  if (!points || points.length < 3) return [];
  const path = points.map((p) => [p.lat, p.lng] as [number, number]);
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];
  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }
  return path;
};

const getBoundsFromPolygons = (polygons: [number, number][][]) => {
  const points = polygons.flat();
  return points.length > 0 ? L.latLngBounds(points) : null;
};

const FitBounds = ({ bounds }: { bounds: L.LatLngBounds | null }) => {
  const map = useMap();

  useEffect(() => {
    if (bounds && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24] });
    }
  }, [bounds, map]);

  return null;
};

const RegionDetailPage = () => {
  const {
    setLocation,
    region,
    center,
    provinceName,
    districtName,
    landTypeName,
    terrainName,
    isLoading,
    navigateToDetail,
    crops,
  } = useRegionDetailPage();

  const mainCropsText = (crops || [])
    .filter((c) => c.role === "MAIN")
    .map((c) => c.crop?.name || "")
    .filter(Boolean)
    .join(", ");

  const regionPath = region?.coordinates ? closePath(region.coordinates) : [];
  const subAreaPaths =
    region?.subAreas?.flatMap((sub) =>
      sub.coordinates && sub.coordinates.length >= 3
        ? [closePath(sub.coordinates)]
        : [],
    ) ?? [];
  const bounds = getBoundsFromPolygons(
    [regionPath, ...subAreaPaths].filter((path) => path.length > 0),
  );

  if (isLoading) {
    return (
      <PageWrapper title="Đang tải...">
        <div className="flex flex-col items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-muted-foreground">
            Đang tải thông tin vùng trồng...
          </p>
        </div>
      </PageWrapper>
    );
  }

  if (!region) {
    return (
      <PageWrapper title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-xl mb-4">Vùng trồng không tồn tại</p>
          <Button onClick={() => setLocation("/region-distribution")}>
            Quay lại danh sách
          </Button>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Chi tiết: ${region.name}`}
      description={`Mã vùng: ${region.code}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/region-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(`/region-distribution/edit/${region.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="col-span-2">
                  <RegionChartStatusBadge status={region.status} />
                </span>
              </div>
              {/* <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Đơn vị sở hữu</span>
                <span className="col-span-2 font-medium">{enterpriseName}</span>
              </div> */}
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Địa chỉ</span>
                <span className="col-span-2">
                  {region.address}
                  <br />
                  {districtName}, {provinceName}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Diện tích</span>
                <span className="col-span-2 font-medium">{region.area} ha</span>
              </div>
              {/* <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Cây trồng chính</span>
                <span className="col-span-2 font-medium">
                  {mainCropsText || (
                    <span className="italic text-muted-foreground">
                      Chưa chọn
                    </span>
                  )}
                </span>
              </div> */}
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Loại đất</span>
                <span className="col-span-2">{landTypeName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Địa hình</span>
                <span className="col-span-2">{terrainName}</span>
              </div>
              {region?.centerPoint && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Tọa độ trung tâm
                  </span>
                  <p className="font-medium mt-1 font-mono text-xs">
                    Vĩ độ: {region.centerPoint.latitude}, Kinh độ:{" "}
                    {region.centerPoint.longitude}
                  </p>
                </div>
              )}

              {region?.metadataJson?.address ? (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Địa chỉ định vị
                  </span>
                  <p className="font-medium mt-1 text-sm text-slate-700">
                    {region.metadataJson.address as string}
                  </p>
                </div>
              ) : (
                <></>
              )}
              <div className="grid grid-cols-3 gap-2 py-1">
                <span className="text-muted-foreground">Ghi chú</span>
                <span className="col-span-2 italic text-muted-foreground">
                  {region.note || "Không có"}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách khu vực ({region.subAreas?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!region.subAreas || region.subAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có khu vực nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {region.subAreas.map((sub) => (
                    <div
                      key={sub.id}
                      onClick={() => navigateToDetail(sub.id)}
                      className="border p-3 rounded-md text-sm cursor-pointer"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold">{sub.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <span>DT: {sub.area} ha</span>
                        <span>
                          {LAND_TYPES.find((l) => l.id === sub.landType)?.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="flex h-full min-h-[500px] flex-col">
            <CardHeader>
              <CardTitle>Bản đồ phân bố</CardTitle>
            </CardHeader>
            <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
              <div className="h-[600px] w-full">
                <MapContainer
                  center={center}
                  zoom={14}
                  className="h-full w-full"
                  zoomControl={false}
                  scrollWheelZoom
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  {bounds && <FitBounds bounds={bounds} />}

                  {region.coordinates && region.coordinates.length > 0 && (
                    <Polygon
                      positions={regionPath}
                      pathOptions={{
                        color: "#2563eb",
                        weight: 2,
                        fillColor: "#2563eb",
                        fillOpacity: 0.1,
                      }}
                    >
                      <Tooltip direction="right">{region.name}</Tooltip>
                    </Polygon>
                  )}

                  {region.centerPoint?.latitude !== undefined &&
                    region.centerPoint?.longitude !== undefined && (
                      <Marker
                        position={[
                          region.centerPoint.latitude,
                          region.centerPoint.longitude,
                        ]}
                        icon={getMarkerIcon("blue")}
                      >
                        <Tooltip direction="top">{region.name}</Tooltip>
                      </Marker>
                    )}

                  {region.subAreas?.map((sub) => {
                    if (!sub.coordinates || sub.coordinates.length < 3) {
                      return null;
                    }

                    return (
                      <Polygon
                        key={sub.id}
                        positions={closePath(sub.coordinates)}
                        pathOptions={{
                          color: "#16a34a",
                          weight: 2,
                          fillColor: "#16a34a",
                          fillOpacity: 0.08,
                        }}
                      >
                        <Tooltip direction="right">{sub.name}</Tooltip>
                      </Polygon>
                    );
                  })}
                </MapContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default RegionDetailPage;
