import React, { useEffect } from "react";
import { Button, Card, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  Marker,
  Polygon,
  Tooltip,
  TileLayer,
  useMap,
} from "react-leaflet";

import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

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

type LeafletMapLike = L.Map & {
  setCenter?: (center: { lat: number; lng: number }) => void;
};

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const makeImageIcon = (image: string, size: number) =>
  L.icon({
    iconUrl: image,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
    className: "rounded-full border border-white shadow-lg",
  });

const getEnterpriseTypeLabel = (type: "enterprise" | "farm" | "cooperative") => {
  if (type === "enterprise") return "Doanh nghiệp";
  if (type === "cooperative") return "Hợp tác xã";
  return "Nông hộ";
};

const toClosedPath = (coords: [number, number][]) => {
  if (!coords || coords.length < 3) return [];
  const path = coords.map(([lat, lng]) => [lat, lng] as [number, number]);
  const [firstLat, firstLng] = path[0];
  const [lastLat, lastLng] = path[path.length - 1];
  if (firstLat !== lastLat || firstLng !== lastLng) {
    path.push([firstLat, firstLng]);
  }
  return path;
};

const MapSynchronizer = ({
  mapRef,
  center,
}: {
  mapRef: React.MutableRefObject<any>;
  center: { lat: number; lng: number };
}) => {
  const map = useMap();

  useEffect(() => {
    const leafletMap = map as LeafletMapLike;

    const registerMap = () => {
      if (!leafletMap.setCenter) {
        leafletMap.setCenter = ({ lat, lng }) => {
          leafletMap.setView([lat, lng], leafletMap.getZoom());
        };
      }

      if (!mapRef.current || mapRef.current !== leafletMap) {
        mapRef.current = leafletMap;
      }
    };

    if ((leafletMap as L.Map & { _loaded?: boolean })._loaded) {
      registerMap();
    } else {
      leafletMap.whenReady(registerMap);
    }

    return () => {
      if (mapRef.current === leafletMap) {
        mapRef.current = null;
      }
    };
  }, [map, mapRef]);

  useEffect(() => {
    map.setView([center.lat, center.lng], map.getZoom(), {
      animate: true,
    });
  }, [center, map]);

  return null;
};

const MapControls = ({ mapRef }: { mapRef: React.MutableRefObject<any> }) => {
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
          const map = mapRef.current as LeafletMapLike | null;
          if (!map) return;
          const zoom = typeof map.getZoom === "function" ? map.getZoom() : 13;
          if (typeof map.setZoom === "function") map.setZoom(zoom + 1);
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
          const map = mapRef.current as LeafletMapLike | null;
          if (!map) return;
          const zoom = typeof map.getZoom === "function" ? map.getZoom() : 13;
          if (typeof map.setZoom === "function") map.setZoom(zoom - 1);
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
  return (
    <div className="flex-1 flex flex-col relative bg-slate-100">
      <div className="flex-1 relative">
        <MapContainer
          key={mapRenderKey}
          center={[mapCurrentCenter.lat, mapCurrentCenter.lng]}
          zoom={9}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapSynchronizer mapRef={mapRef} center={mapCurrentCenter} />

          {visiblePolygons.map((poly) => {
            const path = toClosedPath(poly.coordinates);
            if (path.length === 0) return null;

            return (
              <Polygon
                key={poly.id}
                positions={path}
                pathOptions={{
                  color: poly.color,
                  weight: 2,
                  fillColor: poly.color,
                  fillOpacity: 0.2,
                }}
                eventHandlers={{
                  click: () => {
                    const url = `/${poly.type}-distribution/detail/${poly.rawId}`;
                    window.open(url, "_blank");
                  },
                }}
              />
            );
          })}

          {enterpriseMarkers.map((marker) => (
            <Marker
              key={`enterprise-marker-${marker.id}`}
              position={[marker.lat, marker.lng]}
              icon={
                marker.image
                  ? makeImageIcon(marker.image, 34)
                  : defaultLeafletIcon
              }
              title={`${marker.code} - ${marker.name}`}
              eventHandlers={{
                click: () => onSelectEnterprise(marker.id),
              }}
            >
              <Tooltip
                direction="top"
                offset={[0, -18]}
                opacity={1}
                sticky={false}
                className="enterprise-tooltip"
              >
                <div className="min-w-[180px] rounded-md bg-slate-900 px-3 py-2 shadow-xl">
                  <div className="text-xs font-semibold text-white line-clamp-2">
                    {marker.name}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-300">
                    {getEnterpriseTypeLabel(marker.type)}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          ))}

          {regionLogoMarkers.map((marker) => (
            <Marker
              key={`enterprise-region-logo-${marker.id}`}
              position={[marker.lat, marker.lng]}
              icon={
                marker.image
                  ? makeImageIcon(marker.image, 30)
                  : defaultLeafletIcon
              }
              title={marker.name}
            />
          ))}

          <MapControls mapRef={mapRef} />
        </MapContainer>

        <style>{`
          .leaflet-container {
            height: 100%;
            width: 100%;
            font-family: inherit;
            background: #e2e8f0;
          }
          .enterprise-tooltip.leaflet-tooltip {
            background: transparent;
            border: none;
            box-shadow: none;
            padding: 0;
          }
          .enterprise-tooltip.leaflet-tooltip::before {
            border-top-color: #0f172a;
          }
          .leaflet-pane,
          .leaflet-tile,
          .leaflet-marker-icon,
          .leaflet-marker-shadow {
            image-rendering: auto;
          }
        `}</style>

        {!isDetailOpen && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-max max-w-[90%]">
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
