import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { InfoWindow, Polygon } from "@react-google-maps/api";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { useState } from "react";
import { RegionChartMapCard } from "../components/RegionChartMapCard";
import { usePlotDetailPage } from "../hooks/usePlotDetailPage";

const PlotDetailPage = () => {
  const { setLocation, plot, area, region, center, isLoading } =
    usePlotDetailPage();
  const [hoveredPolygon, setHoveredPolygon] = useState<
    "area" | "plot" | null
  >(null);

  const centroidOf = (points: { lat: number; lng: number }[]) => {
    if (points.length === 0) return { lat: 0, lng: 0 };
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  if (isLoading) {
    return (
      <PageWrapper title="Chi tiết lô" description="Đang tải dữ liệu...">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!plot) {
    return (
      <PageWrapper
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Chi tiết lô: ${plot.name}`}
      description={`Mã lô: ${plot.id}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/plot-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() => setLocation(`/plot-distribution/edit/${plot.id}`)}
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
              <>
                <Polygon
                  paths={area.coordinates.map((c: any) => ({
                    lat: c.lat,
                    lng: c.lng,
                  }))}
                  options={{
                    strokeColor: "blue",
                    strokeOpacity: 0.5,
                    fillColor: "#2563eb",
                    fillOpacity: 0.1,
                  }}
                  onMouseOver={() => setHoveredPolygon("area")}
                  onMouseOut={() =>
                    setHoveredPolygon((current) =>
                      current === "area" ? null : current,
                    )
                  }
                />
                {hoveredPolygon === "area" && (
                  <InfoWindow
                    position={centroidOf(
                      area.coordinates.map((c: any) => ({
                        lat: c.lat,
                        lng: c.lng,
                      })),
                    )}
                    options={{ disableAutoPan: true }}
                    onCloseClick={() => setHoveredPolygon(null)}
                  >
                    <div className="text-xs">{area.name}</div>
                  </InfoWindow>
                )}
              </>
            )}

            {plot.coordinates && plot.coordinates.length >= 3 && (
              <>
                <Polygon
                  paths={plot.coordinates.map((c: any) => ({
                    lat: c.lat,
                    lng: c.lng,
                  }))}
                  options={{
                    strokeColor: "orange",
                    fillColor: "orange",
                    fillOpacity: 0.3,
                    strokeWeight: 2,
                  }}
                  onMouseOver={() => setHoveredPolygon("plot")}
                  onMouseOut={() =>
                    setHoveredPolygon((current) =>
                      current === "plot" ? null : current,
                    )
                  }
                />
                {hoveredPolygon === "plot" && (
                  <InfoWindow
                    position={centroidOf(
                      plot.coordinates.map((c: any) => ({
                        lat: c.lat,
                        lng: c.lng,
                      })),
                    )}
                    options={{ disableAutoPan: true }}
                    onCloseClick={() => setHoveredPolygon(null)}
                  >
                    <div className="text-xs">
                      {plot.name} ({plot.area} ha)
                    </div>
                  </InfoWindow>
                )}
              </>
            )}
          </RegionChartMapCard>
        </div>
      </div>
    </PageWrapper>
  );
};
export default PlotDetailPage;
