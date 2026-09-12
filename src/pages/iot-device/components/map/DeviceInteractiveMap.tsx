import React, { useRef, useState } from "react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";
import type { IoTDevice } from "../../types";
import { cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Battery, Wifi, Activity } from "lucide-react";

const mapContainerStyle = { width: "100%", height: "100%" };

interface DeviceInteractiveMapProps {
  devices: IoTDevice[];
  center: [number, number];
  zoom?: number;
}

export function DeviceInteractiveMap({
  devices,
  center,
  zoom = 13,
}: DeviceInteractiveMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [activeDeviceId, setActiveDeviceId] = useState<string | null>(null);

  const mapCenter = { lat: center[0], lng: center[1] };

  React.useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(mapCenter);
    mapRef.current.setZoom(zoom);
  }, [mapCenter.lat, mapCenter.lng, zoom]);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">
        Đang tải bản đồ...
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={(map) => {
          mapRef.current = map;
        }}
      >
        {devices.map((device) => (
          <Marker
            key={device.id}
            position={{ lat: device.lat, lng: device.lng }}
            onClick={() =>
              setActiveDeviceId((current) => (current === device.id ? null : device.id))
            }
          >
            {activeDeviceId === device.id && (
              <InfoWindow onCloseClick={() => setActiveDeviceId(null)}>
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
                      <span className="text-slate-400 font-medium">Nhà sản xuất:</span>
                      <span className="text-slate-700 font-bold">
                        {device.manufacturer}
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
              </InfoWindow>
            )}
          </Marker>
        ))}
      </GoogleMap>
    </div>
  );
}
