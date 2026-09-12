import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin } from "lucide-react";
import { GoogleMap, InfoWindow, Polygon, useJsApiLoader } from "@react-google-maps/api";
import L from "leaflet";
import type { PlotFormValues } from "../data/plot-form.schema";
import { getBoundsFromPoints } from "../utils";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import useEnterpriseStore from "@/stores/useEnterpriseStore";

const mapContainerStyle = { width: "100%", height: "100%" };

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });
  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredPolygon, setHoveredPolygon] = useState<string | null>(null);

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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 md:grid-cols-3">

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
            {isLoaded ? (
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={centroidOf(
                  currentPoints.length > 0 ? currentPoints : areaPolygon,
                )}
                zoom={16}
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
                {areaPolygon.length > 0 && (
                  <>
                    <Polygon
                      paths={areaPolygon}
                      options={{
                        strokeColor: "blue",
                        fillOpacity: 0,
                        strokeWeight: 2,
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
                        position={centroidOf(areaPolygon)}
                        options={{ disableAutoPan: true }}
                        onCloseClick={() => setHoveredPolygon(null)}
                      >
                        <div className="text-xs">{selectedArea?.name}</div>
                      </InfoWindow>
                    )}
                  </>
                )}
                {currentPoints.length > 0 && (
                  <Polygon
                    paths={currentPoints}
                    options={{
                      strokeColor: "orange",
                      fillColor: "orange",
                      fillOpacity: 0.15,
                    }}
                  />
                )}
              </GoogleMap>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
                Đang tải bản đồ...
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};
