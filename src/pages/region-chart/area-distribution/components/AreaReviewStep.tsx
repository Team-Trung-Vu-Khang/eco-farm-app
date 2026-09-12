import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin, Check, Layers, AlertCircle } from "lucide-react";
import type { AreaFormValues } from "../data/area-form.schema";
import { useRegionById, useRegions } from "@/features/farm/hooks/useRegions";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useOrganizationById } from "@/features/organization/hooks/useOrganizationById";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { GoogleMap, InfoWindow, Polygon, useJsApiLoader } from "@react-google-maps/api";
import L from "leaflet";
import { getBoundsFromPoints } from "../utils/map";

const mapContainerStyle = { width: "100%", height: "100%" };

interface AreaReviewStepProps {
  showEnterprise?: boolean;
}

export function AreaReviewStep({ showEnterprise = false }: AreaReviewStepProps = {}) {
  const { watch } = useFormContext<AreaFormValues>();
  const formData = watch();

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

  const { data: regionsData } = useRegions({
    params: { size: 100 },
  });
  const regions = regionsData?.content || [];
  const selectedRegionId = Number(formData.regionId);
  const { data: selectedRegionDetail } = useRegionById(selectedRegionId, {
    enabled: Number.isFinite(selectedRegionId) && selectedRegionId > 0,
  });

  const { data: soilTypesData } = useCatalog("soil-types");
  const soilTypes = soilTypesData?.content || [];

  const { data: terrainFeaturesData } = useCatalog("terrain-features");
  const terrainFeatures = terrainFeaturesData?.content || [];

  const region =
    selectedRegionDetail ??
    regions.find((item) => item.id === formData.regionId);
  const soilType = soilTypes.find((s) => s.id.toString() === formData.soilType);
  const terrainFeature = terrainFeatures.find(
    (t) => t.id.toString() === formData.terrainFeature,
  );

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  const { item: selectedOrganization, loading: isLoadingSelected } =
    useOrganizationById(
      formData.enterpriseId || "",
      parsedWorkspaceId ?? "missing",
      { enabled: parsedWorkspaceId !== undefined && !!formData.enterpriseId },
    );

  const areaPoints = useMemo(
    () =>
      (formData.coordinates || []).map((coordinate) =>
        L.latLng(coordinate.lat, coordinate.lng),
      ),
    [formData.coordinates],
  );
  const regionPoints = useMemo(
    () =>
      (region?.boundary || [])
        .filter(
          (coordinate) =>
            coordinate.latitude !== undefined && coordinate.longitude !== undefined,
        )
        .map((coordinate) => L.latLng(coordinate.latitude!, coordinate.longitude!)),
    [region?.boundary],
  );
  const plotPolygons = useMemo(
    () =>
      (formData.plots || []).map((plot) => ({
        id: plot.id || plot.code || plot.name,
        name: plot.name || "Lô đất",
        points: (plot.coordinates || []).map((coordinate) =>
          L.latLng(coordinate.lat, coordinate.lng),
        ),
      })),
    [formData.plots],
  );
  const mapBounds = useMemo(() => {
    const previewPoints = [
      ...areaPoints,
      ...regionPoints,
      ...plotPolygons.flatMap((plot) => plot.points),
    ];
    return previewPoints.length > 0
      ? getBoundsFromPoints(previewPoints).pad(0.12)
      : null;
  }, [areaPoints, plotPolygons, regionPoints]);

  useEffect(() => {
    if (!isLoaded || !mapRef.current || !mapBounds) return;
    const sw = mapBounds.getSouthWest();
    const ne = mapBounds.getNorthEast();
    mapRef.current.fitBounds({
      south: sw.lat,
      west: sw.lng,
      north: ne.lat,
      east: ne.lng,
    });
  }, [isLoaded, mapBounds]);

  const centroidOf = (points: L.LatLng[]) => {
    if (points.length === 0) return { lat: 0, lng: 0 };
    const lat = points.reduce((sum, p) => sum + p.lat, 0) / points.length;
    const lng = points.reduce((sum, p) => sum + p.lng, 0) / points.length;
    return { lat, lng };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Check className="w-5 h-5 text-green-500" />
            Thông tin chung
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground mb-1">Tên khu vực</p>
            <p className="font-medium">{formData.name || "—"}</p>
          </div>
          {showEnterprise && (
            <div>
              <p className="text-muted-foreground mb-1">Đơn vị sở hữu</p>
              <p className="font-medium">
                {isLoadingSelected
                  ? "Đang tải..."
                  : selectedOrganization?.name || formData.enterpriseId || "—"}
              </p>
            </div>
          )}
          <div>
            <p className="text-muted-foreground mb-1">Thuộc vùng</p>
            <p className="font-medium">{region?.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Diện tích</p>
            <p className="font-medium">
              {formData.acreage ? `${formData.acreage} ha` : "—"}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Loại đất</p>
            <p className="font-medium">{soilType?.name || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Địa hình</p>
            <p className="font-medium">{terrainFeature?.name || "—"}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-500" />
            Bản đồ khu vực
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm">
            <div className="p-3 bg-blue-50 rounded-lg text-blue-700">
              <span className="font-semibold text-lg">
                {formData.coordinates?.length || 0}
              </span>{" "}
              điểm
            </div>
            {formData.coordinates && formData.coordinates.length < 3 ? (
              <p className="text-red-500 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                Khu vực cần ít nhất 3 điểm
              </p>
            ) : (
              <p className="text-muted-foreground">
                Đã xác định tọa độ khu vực
              </p>
            )}
          </div>
          {mapBounds && areaPoints.length >= 3 && (
            <div className="relative mt-5 h-[320px] overflow-hidden rounded-lg border">
              {isLoaded ? (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={centroidOf(areaPoints)}
                  zoom={14}
                  options={{
                    zoomControl: false,
                    draggable: false,
                    scrollwheel: false,
                    disableDoubleClickZoom: true,
                    keyboardShortcuts: false,
                  }}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {regionPoints.length >= 3 && (
                    <>
                      <Polygon
                        paths={regionPoints}
                        options={{
                          strokeColor: "#10b981",
                          fillOpacity: 0,
                          strokeWeight: 2,
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
                          position={centroidOf(regionPoints)}
                          options={{ disableAutoPan: true }}
                          onCloseClick={() => setHoveredPolygon(null)}
                        >
                          <div className="text-xs">
                            Vùng trồng: {region?.name}
                          </div>
                        </InfoWindow>
                      )}
                    </>
                  )}
                  <Polygon
                    paths={areaPoints}
                    options={{
                      strokeColor: "#2563eb",
                      fillColor: "#2563eb",
                      fillOpacity: 0.18,
                      strokeWeight: 2.5,
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
                      position={centroidOf(areaPoints)}
                      options={{ disableAutoPan: true }}
                      onCloseClick={() => setHoveredPolygon(null)}
                    >
                      <div className="text-xs">Khu vực đang tạo</div>
                    </InfoWindow>
                  )}
                  {plotPolygons.map(
                    (plot, index) =>
                      plot.points.length >= 3 && (
                        <div key={plot.id || index}>
                          <Polygon
                            paths={plot.points}
                            options={{
                              strokeColor: "#f59e0b",
                              fillColor: "#f59e0b",
                              fillOpacity: 0.24,
                              strokeWeight: 2,
                            }}
                            onMouseOver={() =>
                              setHoveredPolygon(`plot-${plot.id || index}`)
                            }
                            onMouseOut={() =>
                              setHoveredPolygon((current) =>
                                current === `plot-${plot.id || index}`
                                  ? null
                                  : current,
                              )
                            }
                          />
                          {hoveredPolygon === `plot-${plot.id || index}` && (
                            <InfoWindow
                              position={centroidOf(plot.points)}
                              options={{ disableAutoPan: true }}
                              onCloseClick={() => setHoveredPolygon(null)}
                            >
                              <div className="text-xs">{plot.name}</div>
                            </InfoWindow>
                          )}
                        </div>
                      ),
                  )}
                </GoogleMap>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                  Đang tải bản đồ...
                </div>
              )}
              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border bg-white/90 px-3 py-2 text-xs shadow-sm backdrop-blur-sm">
                <div className="flex items-center gap-2"><span className="h-3 w-4 rounded-sm border-2 border-blue-600 bg-blue-500/20" />Khu vực đang tạo</div>
                {regionPoints.length >= 3 && <div className="mt-1 flex items-center gap-2"><span className="w-4 border-t-2 border-dashed border-emerald-500" />Ranh giới vùng trồng</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Danh sách Lô ({formData.plots?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {formData.plots && formData.plots.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {formData.plots.map((plot, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-lg bg-slate-50"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-slate-800">
                        {plot.name}
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Diện tích: {plot.acreage ? `${plot.acreage} ha` : "—"}
                      {plot.elevation !== undefined &&
                        ` | Độ cao: ${plot.elevation}m`}
                      {plot.contourInterval !== undefined &&
                        ` | Bình độ: ${plot.contourInterval}`}
                    </p>
                  </div>
                  <div className="text-xs font-mono text-slate-500">
                    {plot.coordinates?.length || 0} điểm
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Chưa có lô nào được tạo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
