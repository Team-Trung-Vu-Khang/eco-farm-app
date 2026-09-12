import React from "react";
import { Button, Card, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
import { GoogleMap, InfoWindow, Marker, Polygon, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = { width: "100%", height: "100%" };

interface EnterpriseMapSectionProps {
  mapRef: React.MutableRefObject<any>;
  mapRenderKey: number;
  mapCurrentCenter: { lat: number; lng: number };
  visiblePolygons: any[];
  enterpriseMarkers: Array<{
    id: number;
    name: string;
    code: string;
    type: "enterprise" | "farm" | "cooperative";
    image: string;
    lat: number;
    lng: number;
  }>;
  regionLogoMarkers: Array<{
    id: string;
    enterpriseId: number;
    name: string;
    image: string;
    lat: number;
    lng: number;
  }>;
  selectedEnterpriseId: number | null;
  isDetailOpen: boolean;
  onSelectEnterprise: (enterpriseId: number) => void;
}

const getEnterpriseTypeLabel = (type: "enterprise" | "farm" | "cooperative") => {
  if (type === "enterprise") return "Doanh nghiệp";
  if (type === "cooperative") return "Hợp tác xã";
  return "Nông hộ";
};

const toClosedPath = (coords: [number, number][]) => {
  if (!coords || coords.length < 3) return [];
  const path = coords.map(([lat, lng]) => ({ lat, lng }));
  const first = path[0];
  const last = path[path.length - 1];
  if (first.lat !== last.lat || first.lng !== last.lng) {
    path.push(first);
  }
  return path;
};

const makeImageIcon = (image: string, size: number) => ({
  url: image,
  scaledSize: new google.maps.Size(size, size),
  anchor: new google.maps.Point(size / 2, size / 2),
});

const MapControls = ({ mapRef }: { mapRef: React.MutableRefObject<google.maps.Map | null> }) => {
  return (
    <div
      className={cn(
        "absolute bottom-6 right-6 z-20 flex flex-col gap-2 transition-all duration-300",
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
        onClick={() => {
          const map = mapRef.current;
          if (!map) return;
          const zoom = map.getZoom() ?? 13;
          map.setZoom(zoom + 1);
        }}
      >
        <span className="text-xl font-bold text-slate-700 group-hover:text-primary">
          +
        </span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
        onClick={() => {
          const map = mapRef.current;
          if (!map) return;
          const zoom = map.getZoom() ?? 13;
          map.setZoom(zoom - 1);
        }}
      >
        <span className="text-xl font-bold text-slate-700 group-hover:text-primary">
          -
        </span>
      </Button>
    </div>
  );
};

export const EnterpriseMapSection: React.FC<EnterpriseMapSectionProps> = ({
  mapRef,
  mapRenderKey,
  mapCurrentCenter,
  visiblePolygons,
  enterpriseMarkers,
  regionLogoMarkers,
  isDetailOpen,
  onSelectEnterprise,
}) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const [hoveredMarkerId, setHoveredMarkerId] = React.useState<number | null>(null);

  return (
    <div className="flex-1 flex flex-col relative bg-slate-100 z-1">
      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap
            key={mapRenderKey}
            mapContainerStyle={mapContainerStyle}
            center={mapCurrentCenter}
            zoom={9}
            options={{ zoomControl: false }}
            onLoad={(map) => {
              (map as any)._loaded = true;
              mapRef.current = map;
            }}
            onUnmount={() => {
              mapRef.current = null;
            }}
          >
            {visiblePolygons.map((poly) => {
              const path = toClosedPath(poly.coordinates);
              if (path.length === 0) return null;

              return (
                <Polygon
                  key={poly.id}
                  paths={path}
                  options={{
                    strokeColor: poly.color,
                    strokeWeight: 2,
                    fillColor: poly.color,
                    fillOpacity: 0.2,
                  }}
                  onClick={() => {
                    const url = `/${poly.type}-distribution/detail/${poly.rawId}`;
                    window.open(url, "_blank");
                  }}
                />
              );
            })}

            {enterpriseMarkers.map((marker) => (
              <Marker
                key={`enterprise-marker-${marker.id}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={marker.image ? makeImageIcon(marker.image, 34) : undefined}
                title={`${marker.code} - ${marker.name}`}
                onMouseOver={() => setHoveredMarkerId(marker.id)}
                onMouseOut={() =>
                  setHoveredMarkerId((current) => (current === marker.id ? null : current))
                }
                onClick={() => onSelectEnterprise(marker.id)}
              >
                {hoveredMarkerId === marker.id && (
                  <InfoWindow
                    position={{ lat: marker.lat, lng: marker.lng }}
                    options={{ disableAutoPan: true }}
                    onCloseClick={() => setHoveredMarkerId(null)}
                  >
                    <div className="min-w-[180px] rounded-md bg-slate-900 px-3 py-2">
                      <div className="text-xs font-semibold text-white line-clamp-2">
                        {marker.name}
                      </div>
                      <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-300">
                        {getEnterpriseTypeLabel(marker.type)}
                      </div>
                    </div>
                  </InfoWindow>
                )}
              </Marker>
            ))}

            {regionLogoMarkers.map((marker) => (
              <Marker
                key={`enterprise-region-logo-${marker.id}`}
                position={{ lat: marker.lat, lng: marker.lng }}
                icon={marker.image ? makeImageIcon(marker.image, 30) : undefined}
                title={marker.name}
              />
            ))}

            <MapControls mapRef={mapRef} />
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}

        {!isDetailOpen && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-1000 w-max max-w-[90%]">
            <Card className="bg-white/95 backdrop-blur shadow-xl border rounded-md overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4 border-b border-slate-100 bg-slate-100/30">
                <Layers className="text-primary animate-pulse" size={24} />
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight text-sm">
                    Vùng canh tác các đơn vị
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                    Vui lòng chọn một đơn vị để định vị vị trí trên bản đồ
                  </p>
                </div>
              </div>
              <div className="px-6 py-2 bg-white flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-600">
                    Marker đơn vị
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-600">
                    Vùng trồng
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-600">
                    Khu vực
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shadow-sm" />
                  <span className="text-[10px] font-bold text-slate-600">
                    Lô canh tác
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
