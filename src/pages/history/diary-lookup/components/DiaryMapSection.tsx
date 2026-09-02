import { useEffect } from "react";
import { Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapContainer, Marker, TileLayer, Tooltip, useMap } from "react-leaflet";

import defaultMarkerIconUrl from "leaflet/dist/images/marker-icon.png";
import defaultMarkerIcon2xUrl from "leaflet/dist/images/marker-icon-2x.png";
import defaultMarkerShadowUrl from "leaflet/dist/images/marker-shadow.png";

import { WORK_TYPE_CONFIG } from "../constants";
import type { DiaryEntry } from "../types";

const defaultLeafletIcon = L.icon({
  iconUrl: defaultMarkerIconUrl,
  iconRetinaUrl: defaultMarkerIcon2xUrl,
  shadowUrl: defaultMarkerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const DEFAULT_CENTER = { lat: 11.05, lng: 107.15 };

function MapRecenter({ center, zoom }: { center: { lat: number; lng: number }; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface DiaryMapSectionProps {
  entries: DiaryEntry[];
  selectedEntry: DiaryEntry | null;
  onSelectEntry: (id: number) => void;
}

export function DiaryMapSection({
  entries,
  selectedEntry,
  onSelectEntry,
}: DiaryMapSectionProps) {
  const center = selectedEntry?.location ?? DEFAULT_CENTER;
  const zoom = selectedEntry ? 14 : 10;

  return (
    <div className="flex-1 flex flex-col relative bg-slate-100">
      <div className="flex-1 relative">
        <MapContainer
          center={[center.lat, center.lng]}
          zoom={zoom}
          className="h-full w-full"
          zoomControl={false}
          scrollWheelZoom
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapRecenter center={center} zoom={zoom} />

          {entries.map((entry) => {
            const workType = WORK_TYPE_CONFIG[entry.workType];
            const isSelected = selectedEntry?.id === entry.id;
            return (
              <Marker
                key={entry.id}
                position={[entry.location.lat, entry.location.lng]}
                icon={defaultLeafletIcon}
                title={entry.name}
                opacity={isSelected ? 1 : 0.75}
                eventHandlers={{
                  click: () => onSelectEntry(entry.id),
                }}
              >
                <Tooltip direction="top" offset={[0, -34]} opacity={1} className="diary-tooltip">
                  <div className="min-w-[180px] rounded-md bg-slate-900 px-3 py-2 shadow-xl">
                    <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                      {workType.label}
                    </div>
                    <div className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                      {entry.name}
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            );
          })}
        </MapContainer>

        <style>{`
          .leaflet-container {
            height: 100%;
            width: 100%;
            font-family: inherit;
            background: #e2e8f0;
          }
          .diary-tooltip.leaflet-tooltip {
            background: transparent;
            border: none;
            box-shadow: none;
            padding: 0;
          }
          .diary-tooltip.leaflet-tooltip::before {
            border-top-color: #0f172a;
          }
        `}</style>

        {!selectedEntry && (
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-1000 w-max max-w-[90%]">
            <Card className="bg-white/95 backdrop-blur shadow-xl border rounded-md overflow-hidden">
              <div className="px-6 py-4 flex items-center gap-4">
                <MapPin className="text-primary animate-pulse" size={22} />
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight text-sm">
                    Vị trí công việc trên bản đồ
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium tracking-tight">
                    Chọn một nhật ký để định vị vị trí thực hiện
                  </p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
