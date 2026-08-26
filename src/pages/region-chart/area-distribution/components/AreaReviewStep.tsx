import { useMemo } from "react";
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
import { MapContainer, Polygon, TileLayer, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getBoundsFromPoints } from "../utils/map";

interface AreaReviewStepProps {
  showEnterprise?: boolean;
}

export function AreaReviewStep({ showEnterprise = false }: AreaReviewStepProps = {}) {
  const { watch } = useFormContext<AreaFormValues>();
  const formData = watch();

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
              <MapContainer
                bounds={mapBounds}
                className="h-full w-full"
                zoomControl={false}
                dragging={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
                touchZoom={false}
                keyboard={false}
                attributionControl={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {regionPoints.length >= 3 && (
                  <Polygon
                    positions={regionPoints}
                    pathOptions={{
                      color: "#10b981",
                      fill: false,
                      weight: 2,
                      dashArray: "6, 4",
                    }}
                  >
                    <Tooltip sticky>Vùng trồng: {region?.name}</Tooltip>
                  </Polygon>
                )}
                <Polygon
                  positions={areaPoints}
                  pathOptions={{
                    color: "#2563eb",
                    fillColor: "#2563eb",
                    fillOpacity: 0.18,
                    weight: 2.5,
                  }}
                >
                  <Tooltip sticky>Khu vực đang tạo</Tooltip>
                </Polygon>
                {plotPolygons.map(
                  (plot, index) =>
                    plot.points.length >= 3 && (
                      <Polygon
                        key={plot.id || index}
                        positions={plot.points}
                        pathOptions={{
                          color: "#f59e0b",
                          fillColor: "#f59e0b",
                          fillOpacity: 0.24,
                          weight: 2,
                        }}
                      >
                        <Tooltip sticky>{plot.name}</Tooltip>
                      </Polygon>
                    ),
                )}
              </MapContainer>
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
