import React from "react";
import {
  Button,
  Card,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers } from "lucide-react";
import {
  MapContainer,
  Polygon,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface EnterpriseMapSectionProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  visiblePolygons: any[];
  isDetailOpen: boolean;
}

const MapControls = ({ isDetailOpen }: { isDetailOpen: boolean }) => {
  const map = useMap();
  return (
    <div className={cn("absolute bottom-6 right-6 z-20 flex flex-col gap-2 transition-all duration-300")}>
      <Button
        variant="secondary"
        size="icon"
        className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
        onClick={() => map.setZoom(map.getZoom() + 1)}
      >
        <span className="text-xl font-bold text-slate-700 group-hover:text-primary">+</span>
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="w-10 h-10 rounded-md bg-white shadow-xl border border-slate-200 hover:bg-slate-50 transition-all group"
        onClick={() => map.setZoom(map.getZoom() - 1)}
      >
        <span className="text-xl font-bold text-slate-700 group-hover:text-primary">-</span>
      </Button>
    </div>
  );
};

export const EnterpriseMapSection: React.FC<EnterpriseMapSectionProps> = ({
  mapRef,
  visiblePolygons,
  isDetailOpen,
}) => {
  return (
    <div className="flex-1 flex flex-col relative bg-slate-100">
      <div className="flex-1 relative">
        <MapContainer
          center={[10.762622, 106.660172]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="z-10"
          ref={(map) => {
            if (map) mapRef.current = map;
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {visiblePolygons.map((poly) => (
            <Polygon
              key={poly.id}
              positions={poly.coordinates}
              pathOptions={{
                fillColor: poly.color,
                fillOpacity: 0.2,
                color: poly.color,
                weight: 2,
                className: "cursor-pointer",
              }}
              eventHandlers={{
                click: () => {
                  const url = `/${poly.type}-distribution/detail/${poly.rawId}`;
                  window.open(url, "_blank");
                },
                mouseover: (e) => {
                  const layer = e.target;
                  layer.setStyle({ fillOpacity: 0.4, weight: 3 });
                },
                mouseout: (e) => {
                  const layer = e.target;
                  layer.setStyle({ fillOpacity: 0.2, weight: 2 });
                },
              }}
            >
              <Tooltip permanent sticky interactive>
                <div
                  className="px-2 py-1 flex flex-col items-center gap-1 cursor-pointer pointer-events-auto"
                  onClick={(e) => {
                    e.stopPropagation();
                    const url = `/${poly.type}-distribution/detail/${poly.rawId}`;
                    window.open(url, "_blank");
                  }}
                >
                  <span className="font-bold text-slate-800">{poly.name}</span>
                  <span className="text-[10px] text-primary font-medium animate-pulse">
                    Click xem chi tiết
                  </span>
                </div>
              </Tooltip>
            </Polygon>
          ))}
          <MapControls isDetailOpen={isDetailOpen} />
        </MapContainer>

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
