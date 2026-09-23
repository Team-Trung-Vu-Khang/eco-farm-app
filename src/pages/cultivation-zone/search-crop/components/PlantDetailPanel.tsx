import treeMarkerIcon from "@/assets/tree.webp";
import { Badge, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Maximize2, Sprout } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import {
  DEFAULT_CENTER,
  formatAge,
  formatDate,
  getCoordinate,
  getLocationText,
  getPlantCode,
  getPlantedDate,
  getVarietyName,
  type LatLngTuple,
  type PlantItem,
} from "../utils/plant-identification.utils";
import { PlantHealthBadge } from "./PlantHealthBadge";

const cropMarkerIcon = L.icon({
  iconUrl: treeMarkerIcon,
  iconSize: [36, 36],
  iconAnchor: [18, 34],
});

const MapViewSync = ({
  center,
  zoom,
}: {
  center: LatLngTuple;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, map, zoom]);
  return null;
};

// Cột thông tin hẹp → nhãn nằm trên, giá trị bên dưới (tránh xuống dòng lệch)
const InfoRow = ({ label, value }: { label: string; value?: ReactNode }) =>
  value ? (
    <div className="py-2">
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
      <p className="break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  ) : null;

interface PlantDetailPanelProps {
  /** Toàn bộ cây đã tải — hiển thị dạng marker trên bản đồ */
  plants: PlantItem[];
  activePlant: PlantItem | null;
  onSelect: (id: number) => void;
  onOpenDetail: () => void;
}

/** Cột phải: header, bản đồ và thông tin cây đang chọn */
export function PlantDetailPanel({
  plants,
  activePlant,
  onSelect,
  onOpenDetail,
}: PlantDetailPanelProps) {
  if (!activePlant) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center opacity-40">
        <div className="mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-xl">
          <Sprout size={64} className="text-slate-200" />
        </div>
        <h3 className="text-xl font-black uppercase tracking-widest text-slate-400">
          Chọn cây trồng để xem chi tiết
        </h3>
      </div>
    );
  }

  const activeCoordinate = getCoordinate(activePlant);
  const firstCoordinate = plants.map(getCoordinate).find(Boolean) ?? null;
  const mapCenter = activeCoordinate ?? firstCoordinate ?? DEFAULT_CENTER;
  const mapZoom = activeCoordinate ? 17 : 15;
  const zoneName =
    activePlant.productionZone?.name || activePlant.cultivationZone?.name;

  return (
    <>
      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border bg-slate-50">
            <Sprout size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">
              {getPlantCode(activePlant)}
            </h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
              {getVarietyName(activePlant)}
              {zoneName ? ` · ${zoneName}` : ""}
            </p>
          </div>
        </div>
        <PlantHealthBadge status={activePlant.healthStatus} />
      </div>

      <div className="grid h-100 shrink-0 grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="relative overflow-hidden rounded-xl border-4 border-white bg-white shadow-xl lg:col-span-7">
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            className="z-0 h-full w-full"
            zoomControl={false}
            scrollWheelZoom
          >
            <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />
            <MapViewSync center={mapCenter} zoom={mapZoom} />
            {plants.map((plant) => {
              const coordinate = getCoordinate(plant);
              if (!coordinate) return null;
              return (
                <Marker
                  key={plant.id}
                  position={coordinate}
                  icon={cropMarkerIcon}
                  title={plant.code}
                  eventHandlers={{ click: () => onSelect(plant.id) }}
                />
              );
            })}
          </MapContainer>
          {!activeCoordinate && (
            <div className="absolute inset-x-0 bottom-3 z-[400] mx-auto w-max rounded-lg bg-white/90 px-3 py-1.5 text-xs font-medium text-slate-600 shadow">
              Cây này chưa có tọa độ
            </div>
          )}
        </div>

        <div className="flex flex-col overflow-y-auto rounded-xl border-4 border-white bg-white p-5 shadow-xl lg:col-span-5">
          <Badge className="mb-3 self-start bg-primary/10 font-black uppercase text-primary">
            {getPlantCode(activePlant)}
          </Badge>
          <div className="divide-y divide-slate-100">
            <InfoRow
              label="Giống cây"
              value={activePlant.productionSubjectVariant?.name}
            />
            <InfoRow
              label="Hạt giống"
              value={activePlant.subjectVariant?.name}
            />
            <InfoRow label="Vùng canh tác" value={zoneName} />
            <InfoRow label="Vị trí" value={getLocationText(activePlant)} />
            <InfoRow
              label="Ngày trồng"
              value={formatDate(getPlantedDate(activePlant))}
            />
            <InfoRow
              label="Tuổi cây"
              value={formatAge(activePlant.durationDays)}
            />
            <InfoRow
              label="Chiều cao"
              value={
                activePlant.height != null
                  ? `${activePlant.height} m`
                  : undefined
              }
            />
            <InfoRow label="Ghi chú" value={activePlant.notes} />
          </div>
          <Button
            className="mt-auto h-11 gap-2 rounded-xl font-black"
            onClick={onOpenDetail}
          >
            <Maximize2 size={16} />
            Xem chi tiết
          </Button>
        </div>
      </div>
    </>
  );
}
