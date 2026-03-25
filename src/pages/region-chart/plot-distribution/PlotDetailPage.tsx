import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { Polygon, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RegionChartMapCard } from "../components/RegionChartMapCard";
import { usePlotDetailPage } from "../hooks/usePlotDetailPage";

const PlotDetailPage = () => {
  const { setLocation, plot, area, region, center } = usePlotDetailPage();

  if (!plot) {
    return (
      <AdminLayout
        title="Chi tiết lô"
        description="Không tìm thấy thông tin lô"
        actions={
          <Button
            variant="outline"
            onClick={() => setLocation("/region-chart/plot-distribution")}
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

  return (
    <AdminLayout
      title={`Chi tiết lô: ${plot.name}`}
      description={`Mã lô: ${plot.id}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/region-chart/plot-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() =>
              setLocation(`/region-chart/plot-distribution/edit/${plot.id}`)
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
                  {region?.name || "Không xác định"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Thuộc khu vực
                </span>
                <p className="font-medium mt-1">
                  {area?.name || "Không xác định"}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Diện tích
                </span>
                <p className="font-medium mt-1">{plot.area} ha</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Đường bình độ
                </span>
                <p className="font-medium mt-1">{plot.contour || "-"}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-muted-foreground">
                  Độ cao
                </span>
                <p className="font-medium mt-1">{plot.altitude || "-"} m</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Map */}
        <div className="lg:col-span-2">
          <RegionChartMapCard
            title={
              <span className="flex items-center gap-2">
                <MapPin className="h-5 w-5" /> Bản đồ lô trồng
              </span>
            }
            center={center}
            zoom={16}
            heightClassName="h-[500px]"
          >
            {area && area.coordinates && area.coordinates.length >= 3 && (
              <Polygon
                positions={area.coordinates.map((c: any) => [c.lat, c.lng])}
                pathOptions={{
                  color: "blue",
                  fill: false,
                  dashArray: "5, 5",
                  opacity: 0.5,
                }}
              >
                <Tooltip direction="top">{area.name}</Tooltip>
              </Polygon>
            )}

            {plot.coordinates && plot.coordinates.length >= 3 && (
              <Polygon
                positions={plot.coordinates.map((c: any) => [c.lat, c.lng])}
                pathOptions={{
                  color: "orange",
                  fillColor: "orange",
                  fillOpacity: 0.3,
                  weight: 2,
                }}
              >
                <Tooltip sticky>
                  {plot.name} ({plot.area} ha)
                </Tooltip>
              </Polygon>
            )}
          </RegionChartMapCard>
        </div>
      </div>
    </AdminLayout>
  );
};
export default PlotDetailPage;
