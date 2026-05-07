import React, { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { IoTDevice } from "../../types";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Battery, Wifi, Activity } from "lucide-react";

// Fix for default Leaflet icons in Vite/React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface DeviceInteractiveMapProps {
  devices: IoTDevice[];
  center: [number, number];
  zoom?: number;
}

function ChangeView({
  center,
  zoom,
}: {
  center: [number, number];
  zoom: number;
}) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export function DeviceInteractiveMap({
  devices,
  center,
  zoom = 13,
}: DeviceInteractiveMapProps) {
  return (
    <div className="w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        {devices.map((device) => (
          <Marker key={device.id} position={[device.lat, device.lng]}>
            <Popup className="device-popup">
              <div className="w-64 p-2">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-slate-900">
                    {device.name}
                  </h3>
                  <div
                    className={cn(
                      "w-2 h-2 rounded-full",
                      device.status === "online"
                        ? "bg-emerald-500"
                        : "bg-rose-500",
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <Battery className="w-3 h-3" /> Pin
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {device.batteryLevel}%
                    </p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight flex items-center gap-1">
                      <Wifi className="w-3 h-3" /> Tín hiệu
                    </p>
                    <p className="text-xs font-bold text-slate-700">
                      {device.rssi} dBm
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">Loại:</span>
                    <span className="text-slate-700 font-bold">
                      {device.type}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px]">
                    <span className="text-slate-400 font-medium">IMEI:</span>
                    <span className="text-slate-700 font-mono font-bold">
                      {device.imei}
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    className="w-full bg-primary text-white text-[10px] font-bold py-2 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    onClick={() => {
                      // Logic to navigate or open detail can be added here
                      console.log("View details for", device.id);
                    }}
                  >
                    <Activity className="w-3 h-3" /> Xem dữ liệu chi tiết
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map Style Overrides */}
      <style>{`
        .leaflet-popup-content-wrapper {
          border-radius: 16px;
          padding: 0;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
        }
        .leaflet-popup-content {
          margin: 0;
          width: auto !important;
        }
        .leaflet-container {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}
