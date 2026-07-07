import { useMemo } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin } from "lucide-react";
import { MapContainer, Polygon, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { PlotFormValues } from "../data/plot-form.schema";
import { getBoundsFromPoints } from "../utils";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import useEnterpriseStore from "@/stores/useEnterpriseStore";

interface PlotReviewStepProps {
  showEnterprise?: boolean;
}

export const PlotReviewStep = ({ showEnterprise = false }: PlotReviewStepProps = {}) => {
  const { watch } = useFormContext<PlotFormValues>();
  const enterpriseId = watch("enterpriseId");
  const regionId = watch("regionId");
  const areaId = watch("areaId");
  const code = watch("code");
  const name = watch("name");
  const acreage = watch("acreage");
  const contourInterval = watch("contourInterval");
  const elevation = watch("elevation");
  const coordinates = watch("coordinates") || [];

  const { enterprises } = useEnterpriseStore();
  const { data: regionsData } = useRegions({ params: { size: 100 } });
  const regions = regionsData?.content || [];

  const { data: selectedArea } = useAreaById(areaId || 0, {
    enabled: !!areaId,
  });

  const selectedEnterpriseName = useMemo(() => {
    return enterprises.find((e) => e.id === enterpriseId)?.name || "—";
  }, [enterprises, enterpriseId]);

  const selectedRegion = useMemo(() => {
    return regions.find((r) => r.id === regionId);
  }, [regions, regionId]);

  const currentPoints = useMemo(() => {
    return coordinates.map((c) => L.latLng(c.lat, c.lng));
  }, [coordinates]);

  const areaPolygon = useMemo(() => {
    if (!selectedArea || !selectedArea.boundary) return [];
    return selectedArea.boundary.map((b) => L.latLng(b.latitude || 0, b.longitude || 0));
  }, [selectedArea]);

  const mapBounds = useMemo(() => {
    const allPoints = [...areaPolygon, ...currentPoints];
    if (allPoints.length === 0) return null;
    return getBoundsFromPoints(allPoints);
  }, [areaPolygon, currentPoints]);

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-blue-100 bg-blue-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/15 text-blue-600">
              <MapPin className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Vị trí lô
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
            {showEnterprise && (
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Đơn vị sở hữu
                </p>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedEnterpriseName}
                </p>
              </div>
            )}
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Vùng trồng
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {selectedRegion?.name || "—"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Khu vực
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {selectedArea?.name || "—"}
              </p>
            </div>
            {selectedArea?.acreage != null && (
              <div className="space-y-0.5">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Diện tích khu vực
                </p>
                <p className="text-sm font-bold text-blue-600">
                  {selectedArea.acreage} ha
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/70 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600">
              <Layers className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-bold text-slate-800">
              Thông tin lô đất
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="px-5 py-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">

            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Tên lô
              </p>
              <p className="text-sm font-semibold text-slate-700">{name || "—"}</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Diện tích lô
              </p>
              <p className="text-sm font-bold text-emerald-600">
                {acreage != null ? `${acreage} ha` : "—"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Đường bình độ
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {contourInterval || "—"}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Độ cao
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {elevation != null ? `${elevation} m` : "—"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map Preview */}
      {mapBounds && (
        <Card className="overflow-hidden border-none shadow-sm">
          <div className="h-[300px] w-full">
            <MapContainer
              bounds={mapBounds}
              zoomControl={false}
              attributionControl={false}
              className="h-full w-full"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {areaPolygon.length > 0 && (
                <Polygon
                  positions={areaPolygon}
                  pathOptions={{
                    color: "blue",
                    fill: false,
                    dashArray: "4, 4",
                  }}
                />
              )}
              {currentPoints.length > 0 && (
                <Polygon
                  positions={currentPoints}
                  pathOptions={{ color: "orange", fillOpacity: 0.15 }}
                />
              )}
            </MapContainer>
          </div>
        </Card>
      )}
    </div>
  );
};
