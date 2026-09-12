import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import { ChevronLeft, Edit } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";

import { getMarkerIcon } from "@/pages/animal-husbandry-zone/animal-husbandry-region/components/mapUtils";
import { RegionChartStatusBadge } from "../components/RegionChartStatusBadge";
import { LAND_TYPES } from "../constants";
import { useRegionDetailPage } from "../hooks/useRegionDetailPage";

const mapContainerStyle = { width: "100%", height: "100%" };

const closePath = (points: { lat: number; lng: number }[]) => {
  if (!points || points.length < 3) return [];
  const path = points.map((p) => ({ lat: p.lat, lng: p.lng }));
  const first = path[0];
  const last = path[path.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    path.push({ lat: first.lat, lng: first.lng });
  }
  return path;
};

const getBoundsFromPolygons = (polygons: { lat: number; lng: number }[][]) => {
  const points = polygons.flat();
  return points.length > 0
    ? L.latLngBounds(points.map((p) => L.latLng(p.lat, p.lng)))
    : null;
};

const centroidOf = (points: { lat: number; lng: number }[]) => {
  if (points.length === 0) return { lat: 0, lng: 0 };
  const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
  const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
  return { lat, lng };
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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

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

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !bounds || !bounds.isValid()) return;
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    mapRef.current.fitBounds(
      { south: sw.lat, west: sw.lng, north: ne.lat, east: ne.lng },
      24,
    );
  }, [isLoaded, bounds]);

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
                {isLoaded ? (
                  <GoogleMap
                    mapContainerStyle={mapContainerStyle}
                    center={
                      center
                        ? { lat: center[0], lng: center[1] }
                        : { lat: 0, lng: 0 }
                    }
                    zoom={14}
                    options={{ zoomControl: false }}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                  >
                    {region.coordinates && region.coordinates.length > 0 && (
                      <>
                        <Polygon
                          paths={regionPath}
                          options={{
                            strokeColor: "#2563eb",
                            strokeWeight: 2,
                            fillColor: "#2563eb",
                            fillOpacity: 0.1,
                          }}
                          onMouseOver={() => setHoveredPolygon("region")}
                          onMouseOut={() =>
                            setHoveredPolygon((current) =>
                              current === "region" ? null : current,
                            )
                          }
                        />
                        {hoveredPolygon === "region" && (
                          <InfoWindow
                            position={centroidOf(regionPath)}
                            options={{ disableAutoPan: true }}
                            onCloseClick={() => setHoveredPolygon(null)}
                          >
                            <div className="text-xs">{region.name}</div>
                          </InfoWindow>
                        )}
                      </>
                    )}

                    {region.centerPoint?.latitude !== undefined &&
                      region.centerPoint?.longitude !== undefined && (
                        <Marker
                          position={{
                            lat: region.centerPoint.latitude,
                            lng: region.centerPoint.longitude,
                          }}
                          icon={getMarkerIcon("blue")}
                          title={region.name}
                        />
                      )}

                    {region.subAreas?.map((sub) => {
                      if (!sub.coordinates || sub.coordinates.length < 3) {
                        return null;
                      }
                      const subPath = closePath(sub.coordinates);

                      return (
                        <div key={sub.id}>
                          <Polygon
                            paths={subPath}
                            options={{
                              strokeColor: "#16a34a",
                              strokeWeight: 2,
                              fillColor: "#16a34a",
                              fillOpacity: 0.08,
                            }}
                            onMouseOver={() =>
                              setHoveredPolygon(`sub-${sub.id}`)
                            }
                            onMouseOut={() =>
                              setHoveredPolygon((current) =>
                                current === `sub-${sub.id}` ? null : current,
                              )
                            }
                          />
                          {hoveredPolygon === `sub-${sub.id}` && (
                            <InfoWindow
                              position={centroidOf(subPath)}
                              options={{ disableAutoPan: true }}
                              onCloseClick={() => setHoveredPolygon(null)}
                            >
                              <div className="text-xs">{sub.name}</div>
                            </InfoWindow>
                          )}
                        </div>
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

export default RegionDetailPage;
