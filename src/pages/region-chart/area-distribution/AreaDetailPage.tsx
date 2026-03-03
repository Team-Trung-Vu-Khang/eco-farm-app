import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
} from "@tankhang1/eco-shared-ui";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";
import useLandStore from "@/stores/useLandStore";
import useTerrainStore from "@/stores/useTerrainStore";

const AreaDetailPage = () => {
  const [, setLocation] = useLocation();
  const lands = useLandStore((state) => state.lands);
  const terrains = useTerrainStore((state) => state.terrains);
  const [match, params] = useRoute("/area-distribution/detail/:id");
  const { getAreaById, regions } = useRegionStore();
  const id = match && params?.id ? String(params.id) : null;

  const areaData = id ? getAreaById(id)?.area : null;
  const regionData = areaData
    ? regions.find(
        (r) => r.id === areaData.regionId || r.code === areaData.regionId,
      )
    : null;

  if (!areaData) {
    return (
      <AdminLayout
        title="Chi tiết khu vực"
        description="Không tìm thấy thông tin khu vực"
        actions={
          <Button
            variant="outline"
            onClick={() => setLocation("/area-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Khu vực không tồn tại</p>
        </div>
      </AdminLayout>
    );
  }

  // Calculate bounds for map centering
  let bounds = L.latLngBounds([11.53, 106.88], [11.55, 106.91]);
  if (areaData.coordinates && areaData.coordinates.length > 0) {
    const points = areaData.coordinates.map((c: any) => L.latLng(c.lat, c.lng));
    if (points.length >= 1) {
      bounds = L.latLngBounds(points);
    }
  }

  const landTypeName =
    lands.find((l) => l.code === areaData.landType)?.name || areaData?.landType;
  const terrainName =
    terrains.find((t) => t.code === areaData.terrain)?.name ||
    areaData?.terrain;

  return (
    <AdminLayout
      description={`Mã khu vực: ${areaData.id}`}
      title={`Chi tiết khu vực: ${areaData.name}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/area-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(`/area-distribution/edit/${areaData.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Trạng thái
                </span>
                <div className="mt-1">
                  <Badge
                    className={
                      areaData.status === "active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {areaData.status === "active"
                      ? "Đang hoạt động"
                      : "Ngừng hoạt động"}
                  </Badge>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Thuộc vùng trồng
                </span>
                <p className="font-medium mt-1">
                  {regionData?.name || "Không xác định"}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Diện tích
                </span>
                <p className="font-medium mt-1">{areaData?.area} ha</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Loại đất
                </span>
                <p className="font-medium mt-1">{landTypeName}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Địa hình
                </span>
                <p className="font-medium mt-1">{terrainName}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                Danh sách lô ({areaData.plots?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {areaData.plots && areaData.plots.length > 0 ? (
                  areaData.plots.map((plot: any) => (
                    <div
                      key={plot.id}
                      className="border p-3 rounded-lg text-sm bg-muted/20"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                          <span className="font-semibold">{plot.name}</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-mono">
                          {plot.area} ha
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Độ cao: {plot.altitude}m</div>
                        <div>Đồng mức: {plot.contour || "-"}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Chưa có lô nào.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Bản đồ khu vực & Lô
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative rounded-b-lg">
              <MapContainer
                center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                zoom={15}
                className="h-[600px] w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController
                  center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                />

                {/* Area Boundary */}
                {areaData.coordinates && areaData.coordinates.length >= 3 && (
                  <Polygon
                    positions={areaData.coordinates.map((c: any) => [
                      c.lat,
                      c.lng,
                    ])}
                    pathOptions={{
                      color: "blue",
                      fillColor: "blue",
                      fillOpacity: 0.1,
                      weight: 2,
                      dashArray: "5, 5",
                    }}
                  >
                    <Tooltip sticky direction="top">
                      {areaData.name} ({areaData.area} ha)
                    </Tooltip>
                  </Polygon>
                )}

                {/* Plots */}
                {areaData.plots?.map((plot: any) => {
                  if (!plot.coordinates || plot.coordinates.length < 3)
                    return null;

                  return (
                    <Polygon
                      key={plot.id}
                      positions={plot.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "orange",
                        fillColor: "orange",
                        fillOpacity: 0.3,
                        weight: 2,
                      }}
                    >
                      <Tooltip sticky>
                        <div className="text-sm">
                          <strong>{plot.name}</strong>
                          <br />
                          {plot.area} ha
                        </div>
                      </Tooltip>
                    </Polygon>
                  );
                })}
              </MapContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AreaDetailPage;
