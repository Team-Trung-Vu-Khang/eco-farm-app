import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GoogleMap, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";
import { ChevronLeft, Edit, MapPin } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";

import type { CoordinatePoint, FarmPlotResponse } from "@/features/farm";
import { getMarkerIcon } from "@/pages/animal-husbandry-zone/animal-husbandry-region/components/mapUtils";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { useAreaDetailPage } from "../hooks/useAreaDetailPage";

const mapContainerStyle = { width: "100%", height: "100%" };

const closePath = (
  points: Array<{
    lat?: number;
    lng?: number;
    latitude?: number;
    longitude?: number;
  }>,
) => {
  if (!points || points.length < 3) return [];
  const path = points.map((p) => {
    const lat = p.lat !== undefined ? p.lat : p.latitude;
    const lng = p.lng !== undefined ? p.lng : p.longitude;
    return { lat: lat || 0, lng: lng || 0 };
  });
  const first = path[0];
  const last = path[path.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    path.push(first);
  }
  return path;
};

const AreaDetailPage = () => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const {
    setLocation,
    area,
    region,
    landTypeName,
    terrainName,
    center,
    coordinates,
    isLoading,
    navigateToDetail,
  } = useAreaDetailPage();

  const areaPath = useMemo(() => {
    return coordinates ? closePath(coordinates) : [];
  }, [coordinates]);

  const plotPaths = useMemo(() => {
    return (area?.plots || []).map((plot: FarmPlotResponse) => {
      const p = plot as FarmPlotResponse & { coordinates?: CoordinatePoint[] };
      return closePath(p.boundary || p.coordinates || []);
    });
  }, [area?.plots]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current) return;
    const polys = [areaPath, ...plotPaths].filter((path) => path.length > 0);
    if (polys.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      polys.flat().forEach((p) => bounds.extend(p));
      mapRef.current.fitBounds(bounds, 24);
      return;
    }
    if (
      area?.centerPoint?.latitude !== undefined &&
      area?.centerPoint?.longitude !== undefined
    ) {
      const lat = area.centerPoint.latitude;
      const lng = area.centerPoint.longitude;
      mapRef.current.fitBounds(
        {
          south: lat - 0.01,
          west: lng - 0.01,
          north: lat + 0.01,
          east: lng + 0.01,
        },
        24,
      );
    }
  }, [isLoaded, areaPath, plotPaths, area]);

  if (isLoading) {
    return (
      <PageWrapper title="Chi tiết khu vực" description="Đang tải...">
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!area) {
    return (
      <PageWrapper
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
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      description={`Mã khu vực: ${area.id}`}
      title={`Chi tiết khu vực: ${area.name}`}
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/area-distribution")}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
          <Button
            onClick={() => setLocation(`/area-distribution/edit/${area.id}`)}
          >
            <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
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
                  <RegionChartStatusBadge
                    subtle
                    activeLabel="Đang hoạt động"
                    inactiveLabel="Ngừng hoạt động"
                    status={area.status as "active" | "inactive" | "archived"}
                  />
                </div>
              </div>

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
                  Diện tích
                </span>
                <p className="font-medium mt-1">{area.acreage} ha</p>
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

              {area?.centerPoint && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Tọa độ trung tâm
                  </span>
                  <p className="font-medium mt-1 font-mono text-xs">
                    Vĩ độ: {area.centerPoint.latitude}, Kinh độ:{" "}
                    {area.centerPoint.longitude}
                  </p>
                </div>
              )}

              {area?.metadataJson?.address ? (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Địa chỉ định vị
                  </span>
                  <p className="font-medium mt-1 text-sm text-slate-700">
                    {area.metadataJson.address as string}
                  </p>
                </div>
              ) : (
                <></>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danh sách lô ({area.plots?.length || 0})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {area.plots && area.plots.length > 0 ? (
                  area.plots.map((plot: FarmPlotResponse) => (
                    <div
                      key={plot.id}
                      onClick={() => navigateToDetail(plot.id)}
                      className="border p-3 rounded-lg text-sm bg-muted/20 cursor-pointer"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-orange-500" />
                          <span className="font-semibold">{plot.name}</span>
                        </div>
                        <span className="text-muted-foreground text-xs font-mono">
                          {plot.acreage || 0} ha
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>Độ cao: {plot.elevation}m</div>
                        <div>Bình độ: {plot.contourInterval || "-"}</div>
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

        <div className="lg:col-span-2">
          <Card className="flex h-full min-h-[500px] flex-col">
            <CardHeader>
              <CardTitle>
                <span className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" /> Bản đồ khu vực & Lô
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="relative flex-1 overflow-hidden rounded-b-lg p-0">
              <div className="h-[600px] w-full">
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={{ lat: center[0], lng: center[1] }}
                    zoom={15}
                    options={{ zoomControl: false }}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                  >
                    {coordinates && coordinates.length >= 3 && (
                      <Polygon
                        paths={areaPath}
                        options={{
                          strokeColor: "#2563eb",
                          strokeWeight: 2,
                          fillColor: "#2563eb",
                          fillOpacity: 0.1,
                        }}
                      />
                    )}

                    {area.centerPoint?.latitude !== undefined &&
                      area.centerPoint?.longitude !== undefined && (
                        <Marker
                          position={{
                            lat: area.centerPoint.latitude,
                            lng: area.centerPoint.longitude,
                          }}
                          icon={getMarkerIcon("blue")}
                          title={area.name}
                        />
                      )}

                    {area.plots?.map((plot: FarmPlotResponse) => {
                      const p = plot as FarmPlotResponse & {
                        coordinates?: CoordinatePoint[];
                      };
                      const points = p.boundary || p.coordinates;
                      if (!points || points.length < 3) {
                        return null;
                      }

                      return (
                        <Polygon
                          key={p.id}
                          paths={closePath(points)}
                          options={{
                            strokeColor: "#f59e0b",
                            strokeWeight: 2,
                            fillColor: "#f59e0b",
                            fillOpacity: 0.3,
                          }}
                        />
                      );
                    })}
                  </GoogleMap>
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                    Đang tải bản đồ...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default AreaDetailPage;
