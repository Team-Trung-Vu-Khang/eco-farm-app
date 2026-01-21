import { useRoute, useLocation } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
  Badge,
} from "@tankhang1/eco-shared-ui";
import { MapContainer, TileLayer, Rectangle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft, Edit } from "lucide-react";

import {
  MOCK_REGIONS,
  PROVINCES,
  DISTRICTS,
  ENTERPRISES,
  LAND_TYPES,
  TERRAIN_TYPES,
} from "../constants";
import { MapController } from "../components/DraggableRectangle";

const RegionDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/region-distribution/detail/:id");

  if (!match || !params?.id) {
    return <div>Không tìm thấy trang</div>;
  }

  const regionId = parseInt(params.id);
  const region = MOCK_REGIONS.find((r) => r.id === regionId);

  if (!region) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center p-8">
          <p className="text-xl mb-4">Vùng trồng không tồn tại</p>
          <Button onClick={() => setLocation("/region-distribution")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  // Calculate Bounds
  let bounds = L.latLngBounds([11.53, 106.88], [11.55, 106.91]);
  if (region.coordinates && region.coordinates.length >= 2) {
    const lats = region.coordinates.map((c) => c.lat);
    const lngs = region.coordinates.map((c) => c.lng);
    bounds = L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    );
  }

  const provinceName =
    PROVINCES.find((p) => p.id === region.provinceId)?.name ||
    region.provinceId;
  const districtName =
    DISTRICTS.find((d) => d.id === region.districtId)?.name ||
    region.districtId;
  const enterpriseName =
    ENTERPRISES.find((e) => e.id === region.enterpriseId)?.name ||
    region.enterpriseId;
  const landTypeName =
    LAND_TYPES.find((l) => l.id === region.landType)?.name || region.landType;
  const terrainName =
    TERRAIN_TYPES.find((t) => t.id === region.terrain)?.name || region.terrain;

  return (
    <AdminLayout
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
        {/* Left Col: Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Trạng thái</span>
                <span className="col-span-2">
                  <Badge
                    variant={
                      region.status === "active" ? "default" : "secondary"
                    }
                  >
                    {region.status === "active" ? "Hoạt động" : "Ngưng"}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Doanh nghiệp</span>
                <span className="col-span-2 font-medium">{enterpriseName}</span>
              </div>
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
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Loại đất</span>
                <span className="col-span-2">{landTypeName}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-1 border-b">
                <span className="text-muted-foreground">Địa hình</span>
                <span className="col-span-2">{terrainName}</span>
              </div>
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
                Danh sách tiểu vùng ({region.subAreas?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!region.subAreas || region.subAreas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Chưa có tiểu vùng nào.
                </p>
              ) : (
                <div className="space-y-2">
                  {region.subAreas.map((sub) => (
                    <div key={sub.id} className="border p-3 rounded-md text-sm">
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

        {/* Right Col: Map */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle>Bản đồ phân bố</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative rounded-b-lg">
              <MapContainer
                center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                zoom={14}
                className="h-[600px] w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Rectangle
                  bounds={bounds}
                  pathOptions={{
                    color: "blue",
                    fill: false,
                    dashArray: "5, 5",
                  }}
                />
                {region.subAreas?.map((sub) => {
                  if (!sub.coordinates || sub.coordinates.length < 2)
                    return null;
                  const lats = sub.coordinates.map((c) => c.lat);
                  const lngs = sub.coordinates.map((c) => c.lng);
                  const b = [
                    [Math.min(...lats), Math.min(...lngs)],
                    [Math.max(...lats), Math.max(...lngs)],
                  ];
                  return (
                    <Rectangle
                      key={sub.id}
                      bounds={b as any}
                      pathOptions={{ color: "green", weight: 2 }}
                    ></Rectangle>
                  );
                })}
                <MapController
                  center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                />
              </MapContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default RegionDetailPage;
