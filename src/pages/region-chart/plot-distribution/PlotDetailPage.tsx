import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@tankhang1/eco-shared-ui";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { MapContainer, TileLayer, Rectangle, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { MOCK_PLOTS, MOCK_AREAS, MOCK_REGIONS } from "../constants";
import { MapController } from "../components/DraggableRectangle";

const PlotDetailPage = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/plot-distribution/detail/:id");
  const id = match && params?.id ? params.id : null;

  const plotData = MOCK_PLOTS.find((p) => p.id === id);
  // Find Area that contains this plot - for mock data we might need a reverse lookup or just find area that has this plot
  // Since MOCK_PLOTS is specific, we might not have the link back to Area easily unless we search.
  // In `MOCK_AREAS` (constants.ts), areas have `plots: Plot[]`.
  const parentArea = MOCK_AREAS.find((a) => a.plots?.some((p) => p.id === id));
  const parentRegion = parentArea
    ? MOCK_REGIONS.find((r) => r.id === parentArea.regionId)
    : null;

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
  if (plotData.coordinates && plotData.coordinates.length >= 2) {
    const lats = plotData.coordinates.map((c) => c.lat);
    const lngs = plotData.coordinates.map((c) => c.lng);
    bounds = L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
    );
  } else if (
    parentArea &&
    parentArea.coordinates &&
    parentArea.coordinates.length >= 2
  ) {
    const lats = parentArea.coordinates.map((c) => c.lat);
    const lngs = parentArea.coordinates.map((c) => c.lng);
    bounds = L.latLngBounds(
      [Math.min(...lats), Math.min(...lngs)],
      [Math.max(...lats), Math.max(...lngs)],
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
                  parentArea.coordinates.length >= 2 && (
                    <Rectangle
                      bounds={
                        [
                          [
                            Math.min(
                              ...parentArea.coordinates.map((c) => c.lat),
                            ),
                            Math.min(
                              ...parentArea.coordinates.map((c) => c.lng),
                            ),
                          ],
                          [
                            Math.max(
                              ...parentArea.coordinates.map((c) => c.lat),
                            ),
                            Math.max(
                              ...parentArea.coordinates.map((c) => c.lng),
                            ),
                          ],
                        ] as any
                      }
                      pathOptions={{
                        color: "blue",
                        fill: false,
                        dashArray: "5, 5",
                        opacity: 0.5,
                      }}
                    >
                      <Tooltip direction="top">{parentArea.name}</Tooltip>
                    </Rectangle>
                  )}

                {/* Plot Boundary */}
                {plotData.coordinates && plotData.coordinates.length >= 2 && (
                  <Rectangle
                    bounds={
                      [
                        [
                          Math.min(...plotData.coordinates.map((c) => c.lat)),
                          Math.min(...plotData.coordinates.map((c) => c.lng)),
                        ],
                        [
                          Math.max(...plotData.coordinates.map((c) => c.lat)),
                          Math.max(...plotData.coordinates.map((c) => c.lng)),
                        ],
                      ] as any
                    }
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
                  </Rectangle>
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
