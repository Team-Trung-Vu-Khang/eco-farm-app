import React from "react";
import {
  Button,
  ScrollArea,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Activity,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  MapPinned,
  Route,
  Share2,
} from "lucide-react";

import type { SelectedEntity, SoilData } from "../types/types";
import { buildGoogleMapsUrl } from "../utils/utils";

interface SidebarDetailProps {
  selectedEntity: SelectedEntity;
  soilData: Record<string, SoilData>;
  onClose: () => void;
  onEditSoil: () => void;
  isDetailExpanded: boolean;
  onToggleDetailExpanded: () => void;
}

const EMPTY_SOIL: SoilData = {
  ph: 0,
  nitrogen: 0,
  phosphorus: 0,
  potassium: 0,
  moisture: 0,
  organicMatter: 0,
  ec: 0,
  temperature: 0,
  compaction: 0,
  lastTested: "Chưa có dữ liệu",
};

const FARM_BANNER_IMAGE =
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80&auto=format&fit=crop";

export const SidebarDetail: React.FC<SidebarDetailProps> = ({
  selectedEntity,
  soilData,
  onClose,
  onEditSoil,
  isDetailExpanded,
  onToggleDetailExpanded,
}) => {
  const currentId =
    selectedEntity.properties?.code || selectedEntity.properties?.id;
  const currentSoil = soilData[currentId] || EMPTY_SOIL;

  const detailTitle =
    selectedEntity.properties?.name ||
    selectedEntity.type ||
    "Thông tin farm";
  const detailSubtitle =
    selectedEntity.locationInfo?.plotName ||
    selectedEntity.locationInfo?.areaName ||
    selectedEntity.locationInfo?.zoneName ||
    selectedEntity.properties?.code ||
    "Bản đồ nông nghiệp";
  const detailAddress =
    selectedEntity.properties?.address ||
    selectedEntity.properties?.note ||
    [
      selectedEntity.locationInfo?.plotName,
      selectedEntity.locationInfo?.areaName,
      selectedEntity.locationInfo?.zoneName,
    ]
      .filter(Boolean)
      .join(" • ") ||
    "Đang cập nhật địa chỉ";
  const detailImage =
    selectedEntity.properties?.image ||
    selectedEntity.properties?.coverImage ||
    FARM_BANNER_IMAGE;
  const detailMapsUrl = buildGoogleMapsUrl(selectedEntity);

  const handleShare = async () => {
    const shareText = `${detailTitle} - ${detailAddress}`;
    if (navigator.share) {
      await navigator.share({
        title: detailTitle,
        text: shareText,
        url: detailMapsUrl,
      });
      return;
    }
    await navigator.clipboard.writeText(`${shareText}\n${detailMapsUrl}`);
  };

  return (
    <div className="flex h-full flex-col animate-in slide-in-from-left-5 fade-in bg-slate-50">
      <div className="flex items-center justify-between border-b bg-white p-4 z-10">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-primary/10 p-2">
            <MapPinned className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold leading-tight">Thông tin farm</h3>
            <p className="text-xs text-muted-foreground">
              Xem nhanh vùng trồng đang chọn
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-2 text-sm text-slate-500 transition-colors hover:bg-slate-100"
        >
          Đóng
        </button>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-4">
          <div className="overflow-hidden bg-white">
            <div className="relative h-52">
              <img
                src={detailImage}
                alt={detailTitle}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute left-4 top-4 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/90 text-slate-700 shadow-sm hover:bg-white"
                  onClick={onToggleDetailExpanded}
                  title={isDetailExpanded ? "Thu gọn" : "Mở rộng"}
                >
                  {isDetailExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
                <div className="rounded-full bg-black/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white backdrop-blur-sm">
                  <MapPinned className="mr-1 inline h-3.5 w-3.5" />
                  Farm view
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                    {selectedEntity.properties?.code || "N/A"}
                  </span>
                  {selectedEntity.locationInfo?.zoneName && (
                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-sm">
                      {selectedEntity.locationInfo.zoneName}
                    </span>
                  )}
                </div>
                <h3 className="mt-3 text-2xl font-semibold leading-tight">
                  {detailTitle}
                </h3>
                <p className="mt-1 text-sm text-white/85">{detailSubtitle}</p>
                <p className="mt-1 max-w-[95%] text-xs leading-5 text-white/70">
                  {detailAddress}
                </p>
              </div>
            </div>

            {isDetailExpanded && (
              <div className="border-t border-slate-100 bg-white px-4 py-4">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-2xl bg-slate-50/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Mã số
                    </div>
                    <div className="mt-1 font-semibold text-slate-800">
                      {selectedEntity.properties?.code || "N/A"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Diện tích
                    </div>
                    <div className="mt-1 font-semibold text-slate-800">
                      {selectedEntity.properties?.area
                        ? `${selectedEntity.properties.area} ha`
                        : "N/A"}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-slate-50/80 p-3">
                    <div className="text-[10px] font-bold uppercase tracking-wide text-slate-500">
                      Độ cao
                    </div>
                    <div className="mt-1 font-semibold text-slate-800">
                      {selectedEntity.properties?.altitude
                        ? `${selectedEntity.properties.altitude}m`
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={() => window.open(detailMapsUrl, "_blank")}
                  >
                    <Route className="mr-2 h-4 w-4" />
                    Mở Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full"
                    onClick={handleShare}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Chia sẻ
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {isDetailExpanded && (
          <Tabs defaultValue="overview" className="space-y-4 px-1">
            <TabsList className="grid w-full grid-cols-2 rounded-full bg-slate-100 p-1">
              <TabsTrigger
                value="overview"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="health"
                className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                Chỉ số sức khoẻ
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="m-0 px-1">
              <div className="space-y-4 rounded-3xl bg-slate-50/80 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                      Thông tin farm
                    </div>
                    <div className="truncate text-lg font-semibold text-slate-900">
                      {detailTitle}
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {detailSubtitle}
                    </div>
                  </div>
                  <div className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-700 shadow-sm ring-1 ring-slate-200/70">
                    {selectedEntity.type}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-2">
                    <span className="text-slate-500">Địa chỉ</span>
                    <span className="text-right font-medium text-slate-800">
                      {detailAddress}
                    </span>
                  </div>
                  <div className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-2">
                    <span className="text-slate-500">Khu vực hiện tại</span>
                    <span className="text-right font-medium text-slate-800">
                      {selectedEntity.locationInfo?.areaName ||
                        selectedEntity.locationInfo?.zoneName ||
                        detailSubtitle}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                      Mã số
                    </span>
                    {selectedEntity.properties?.code || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                      Diện tích
                    </span>
                    {selectedEntity.properties?.area
                      ? `${selectedEntity.properties.area} ha`
                      : "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                    <span className="text-[10px] uppercase tracking-wide text-slate-500">
                      Độ cao
                    </span>
                    {selectedEntity.properties?.altitude
                      ? `${selectedEntity.properties.altitude}m`
                      : "N/A"}
                  </span>
                </div>

                <div className="space-y-1 border-t border-slate-200/70 pt-3 text-sm">
                  {selectedEntity.locationInfo?.zoneName && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Vùng trồng</span>
                      <span className="font-medium text-slate-800">
                        {selectedEntity.locationInfo.zoneName}
                      </span>
                    </div>
                  )}
                  {selectedEntity.locationInfo?.areaName && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Khu vực</span>
                      <span className="font-medium text-slate-800">
                        {selectedEntity.locationInfo.areaName}
                      </span>
                    </div>
                  )}
                  {selectedEntity.locationInfo?.plotName && (
                    <div className="flex items-center justify-between text-slate-600">
                      <span>Lô</span>
                      <span className="font-medium text-slate-800">
                        {selectedEntity.locationInfo.plotName}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="m-0 px-1">
              <div className="space-y-4 rounded-3xl bg-slate-50/80 p-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center justify-between rounded-xl bg-white/80 px-3 py-2 ring-1 ring-slate-200/60">
                    <span className="text-slate-500">Tổng cây</span>
                    <span className="font-semibold text-slate-900">
                      {selectedEntity.stats.total}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-green-50/80 px-3 py-2 ring-1 ring-green-200/60">
                    <span className="text-green-700">Khỏe mạnh</span>
                    <span className="font-semibold text-green-700">
                      {selectedEntity.stats.healthy}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-red-50/80 px-3 py-2 ring-1 ring-red-200/60">
                    <span className="text-red-700">Sâu bệnh</span>
                    <span className="font-semibold text-red-700">
                      {selectedEntity.stats.diseased}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-xl bg-yellow-50/80 px-3 py-2 ring-1 ring-yellow-200/60">
                    <span className="text-yellow-700">Thu hoạch</span>
                    <span className="font-semibold text-yellow-700">
                      {selectedEntity.stats.harvesting}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-white px-4 py-4 shadow-sm ring-1 ring-slate-200/60">
                  <div className="flex items-center justify-between gap-3">
                    <h4 className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <FlaskConical className="h-4 w-4 text-indigo-500" />
                      Chỉ số sức khỏe đất
                    </h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 rounded-full px-3 text-xs text-primary"
                      onClick={onEditSoil}
                    >
                      <Activity className="mr-1 h-3 w-3" />
                      Cập nhật
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Độ pH</span>
                      <span className="font-semibold text-slate-900">
                        {currentSoil.ph}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Độ ẩm</span>
                      <span className="font-semibold text-slate-900">
                        {currentSoil.moisture}%
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nhiệt độ</span>
                      <span className="font-semibold text-slate-900">
                        {currentSoil.temperature}°C
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Độ nén</span>
                      <span className="font-semibold text-slate-900">
                        {currentSoil.compaction}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Nitrogen</span>
                      <span className="font-semibold text-slate-800">
                        {currentSoil.nitrogen}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Phosphorus</span>
                      <span className="font-semibold text-slate-800">
                        {currentSoil.phosphorus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">Potassium</span>
                      <span className="font-semibold text-slate-800">
                        {currentSoil.potassium}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <span className="text-slate-500">OM</span>
                      <span className="font-semibold text-slate-800">
                        {currentSoil.organicMatter}%
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-slate-200/70 pt-3 text-xs text-slate-500">
                    Lần đo cuối:{" "}
                    <span className="font-medium text-slate-700">
                      {currentSoil.lastTested}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </ScrollArea>
    </div>
  );
};
