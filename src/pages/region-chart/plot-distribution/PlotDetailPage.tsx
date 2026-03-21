import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Polygon, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MapController } from "../components/DraggableRectangle";
import useRegionStore from "../../../stores/useRegionStore";

const PlotDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/plot-distribution/detail/:id");
  const { getPlotById } = useRegionStore();
  const id = match && params?.id ? String(params.id) : null;

  const context = id ? getPlotById(id) : null;
  const plotData = context?.plot;
  const parentArea = context?.area;
  const parentRegion = context?.region;

  if (!plotData) {
    return (
      <AdminLayout
        title="Chi tiết lô"
        description="Không tìm thấy thông tin lô"
        actions={
          <Button
            variant="outline"
            onClick={() => setLocation("/plot-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
        }
      >
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Lô không tồn tại</p>
        </div>
      </AdminLayout>
    );
  }

  // Calculate bounds
  let bounds = L.latLngBounds([11.53, 106.88], [11.55, 106.91]);
  if (plotData.coordinates && plotData.coordinates.length >= 3) {
    bounds = L.latLngBounds(
      plotData.coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    );
  } else if (
    parentArea &&
    parentArea.coordinates &&
    parentArea.coordinates.length >= 3
  ) {
    bounds = L.latLngBounds(
      parentArea.coordinates.map((c: any) => L.latLng(c.lat, c.lng)),
    );
  }

  return (
    <AdminLayout
      title={`Chi tiết lô: ${plotData.name}`}
      description={`Mã lô: ${plotData.id}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/plot-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(`/plot-distribution/edit/${plotData.id}`)
            }
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Thuộc vùng trồng
                </span>
                <p className="font-medium mt-1">
                  {parentRegion?.name || "Không xác định"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Thuộc khu vực
                </span>
                <p className="font-medium mt-1">
                  {parentArea?.name || "Không xác định"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Diện tích
                </span>
                <p className="font-medium mt-1">{plotData.area} ha</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Đường bình độ
                </span>
                <p className="font-medium mt-1">{plotData.contour || "-"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Độ cao
                </span>
                <p className="font-medium mt-1">{plotData.altitude || "-"} m</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2">
          <Card className="h-full min-h-[500px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" /> Bản đồ lô trồng
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 p-0 overflow-hidden relative rounded-b-lg">
              <MapContainer
                center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                zoom={16}
                className="h-[500px] w-full"
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <MapController
                  center={[bounds.getCenter().lat, bounds.getCenter().lng]}
                />

                {/* Parent Area Boundary (Context) */}
                {parentArea &&
                  parentArea.coordinates &&
                  parentArea.coordinates.length >= 3 && (
                    <Polygon
                      positions={parentArea.coordinates.map((c: any) => [
                        c.lat,
                        c.lng,
                      ])}
                      pathOptions={{
                        color: "blue",
                        fill: false,
                        dashArray: "5, 5",
                        opacity: 0.5,
                      }}
                    >
                      <Tooltip direction="top">{parentArea.name}</Tooltip>
                    </Polygon>
                  )}

                {/* Plot Boundary */}
                {plotData.coordinates && plotData.coordinates.length >= 3 && (
                  <Polygon
                    positions={plotData.coordinates.map((c: any) => [
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
                      {plotData.name} ({plotData.area} ha)
                    </Tooltip>
                  </Polygon>
                )}
              </MapContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PlotDetailPage;
