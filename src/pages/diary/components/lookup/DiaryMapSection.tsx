import { useEffect, useRef, useState } from "react";
import { Card } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from "@react-google-maps/api";

import { WORK_TYPE_CONFIG } from "../../constants/lookup.constants";
import type { DiaryEntry } from "../../types/lookup.types";

const mapContainerStyle = { width: "100%", height: "100%" };

const DEFAULT_CENTER = { lat: 11.05, lng: 107.15 };

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
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() ?? "",
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const [hoveredEntryId, setHoveredEntryId] = useState<number | null>(null);

  const center = selectedEntry?.location ?? DEFAULT_CENTER;
  const zoom = selectedEntry ? 14 : 10;

  useEffect(() => {
    if (!mapRef.current) return;
    mapRef.current.panTo(center);
    mapRef.current.setZoom(zoom);
  }, [center.lat, center.lng, zoom]);

  return (
    <div className="flex-1 flex flex-col relative bg-slate-100">
      <div className="flex-1 relative">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={zoom}
            options={{ zoomControl: false }}
            onLoad={(map) => {
              mapRef.current = map;
            }}
          >
            {entries.map((entry) => {
              const workType = WORK_TYPE_CONFIG[entry.workType];
              const isSelected = selectedEntry?.id === entry.id;
              const isHovered = hoveredEntryId === entry.id;
              return (
                <Marker
                  key={entry.id}
                  position={{ lat: entry.location.lat, lng: entry.location.lng }}
                  title={entry.name}
                  opacity={isSelected ? 1 : 0.75}
                  onMouseOver={() => setHoveredEntryId(entry.id)}
                  onMouseOut={() =>
                    setHoveredEntryId((current) => (current === entry.id ? null : current))
                  }
                  onClick={() => onSelectEntry(entry.id)}
                >
                  {(isHovered || isSelected) && (
                    <InfoWindow
                      position={{ lat: entry.location.lat, lng: entry.location.lng }}
                      options={{ disableAutoPan: true }}
                      onCloseClick={() => setHoveredEntryId(null)}
                    >
                      <div className="min-w-[180px] rounded-md bg-slate-900 px-3 py-2">
                        <div className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                          {workType.label}
                        </div>
                        <div className="text-xs font-semibold text-white line-clamp-2 mt-0.5">
                          {entry.name}
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Marker>
              );
            })}
          </GoogleMap>
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            Đang tải bản đồ...
          </div>
        )}

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
