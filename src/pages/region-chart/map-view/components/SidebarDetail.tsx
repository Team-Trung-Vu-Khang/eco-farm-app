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
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  MapPinned,
  Route,
  Share2,
} from "lucide-react";

import type {
  DrilldownItem,
  SelectedEntity,
  SoilClusterInfo,
  SoilData,
} from "../types/types";
import { buildGoogleMapsUrl } from "../utils/utils";

interface SidebarDetailProps {
  selectedEntity: SelectedEntity;
  soilData: Record<string, SoilData>;
  canGoBack: boolean;
  onBack: () => void;
  onClose: () => void;
  onEditSoil: () => void;
  onSelectChild: (item: DrilldownItem) => void;
  onSelectSoilCluster: (cluster: SoilClusterInfo) => void;
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

const getLevelLabel = (level: SelectedEntity["level"]) => {
  switch (level) {
    case "zone":
      return "Vùng trồng";
    case "area":
      return "Khu vực";
    case "plot":
      return "Lô trồng";
    case "plant":
      return "Cây trồng";
    case "soil-cluster":
      return "Cụm thiết bị";
    default:
      return "Thông tin";
  }
};

const InfoLine = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start justify-between gap-4 py-1.5">
    <span className="text-slate-500">{label}</span>
    <span className="text-right font-medium text-slate-800">{value}</span>
  </div>
);

const MetricCard = ({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: React.ReactNode;
  tone?: "slate" | "green" | "red" | "amber";
}) => {
  const toneClass =
    tone === "green"
      ? "bg-green-50/90 text-green-700"
      : tone === "red"
        ? "bg-red-50/90 text-red-700"
        : tone === "amber"
          ? "bg-amber-50/90 text-amber-700"
          : "bg-white/80 text-slate-700";

  return (
    <div className={`rounded-xl px-3 py-3 ${toneClass}`}>
      <div className="text-[10px] uppercase tracking-wide opacity-80">
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
};

export const SidebarDetail: React.FC<SidebarDetailProps> = ({
  selectedEntity,
  soilData,
  canGoBack,
  onBack,
  onClose,
  onEditSoil,
  onSelectChild,
  onSelectSoilCluster,
  isDetailExpanded,
  onToggleDetailExpanded,
}) => {
  const currentId = selectedEntity.id || selectedEntity.key;
  const currentSoil = soilData[currentId] || EMPTY_SOIL;
  const detailTitle =
    selectedEntity.properties?.name || selectedEntity.type || "Thông tin farm";
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
  const soilCluster = selectedEntity.soilCluster;

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
    <div className="flex h-full flex-col bg-slate-50/60">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary">
            <MapPinned className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-base font-semibold leading-tight text-slate-900">
              Thông tin farm
            </div>
            <div className="text-xs text-slate-500">
              Xem nhanh và drill-down từng lớp dữ liệu
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canGoBack && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 rounded-full px-3 text-slate-600"
              onClick={onBack}
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Quay lại
            </Button>
          )}
          <button
            onClick={onClose}
            className="rounded-full px-2.5 py-1.5 text-sm text-slate-500 transition-colors hover:bg-slate-100"
          >
            Đóng
          </button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="pb-4">
          <div className="overflow-hidden">
            <div className="relative h-48">
              <img
                src={detailImage}
                alt={detailTitle}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute left-4 top-4 flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/90 text-slate-700 hover:bg-white"
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
                  {getLevelLabel(selectedEntity.level)}
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
              <div className="px-4 py-4">
                <div className="grid grid-cols-3 gap-2">
                  <MetricCard
                    label="Mã số"
                    value={selectedEntity.properties?.code || "N/A"}
                  />
                  <MetricCard
                    label="Diện tích"
                    value={
                      selectedEntity.properties?.area
                        ? `${selectedEntity.properties.area} ha`
                        : "N/A"
                    }
                  />
                  <MetricCard
                    label="Độ cao"
                    value={
                      selectedEntity.properties?.altitude
                        ? `${selectedEntity.properties.altitude} m`
                        : "N/A"
                    }
                  />
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
          <Tabs defaultValue="overview" className="space-y-4 px-3">
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

            <TabsContent value="overview" className="m-0">
              <div className="space-y-4">
                <div className="rounded-2xl bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500">
                        {getLevelLabel(selectedEntity.level)}
                      </div>
                      <div className="truncate text-lg font-semibold text-slate-900">
                        {detailTitle}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {detailSubtitle}
                      </div>
                    </div>
                    <div className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                      {selectedEntity.type}
                    </div>
                  </div>

                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <InfoLine label="Địa chỉ" value={detailAddress} />
                    <InfoLine
                      label="Khu vực hiện tại"
                      value={
                        selectedEntity.locationInfo?.areaName ||
                        selectedEntity.locationInfo?.zoneName ||
                        detailSubtitle
                      }
                    />
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
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
                        ? `${selectedEntity.properties.altitude} m`
                        : "N/A"}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="text-sm font-medium text-slate-700">
                      Danh sách bên dưới
                    </div>
                    {selectedEntity.children?.length ? (
                      <div className="space-y-2">
                        {selectedEntity.children.map((item) => (
                          <button
                            key={item.key}
                            onClick={() => onSelectChild(item)}
                            className="flex w-full items-start justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-left transition-colors hover:bg-slate-100"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900">
                                {item.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {item.subtitle || getLevelLabel(item.level)}
                              </div>
                            </div>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-600">
                              {getLevelLabel(item.level)}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl bg-slate-50/70 px-3 py-3 text-sm text-slate-500">
                        Chưa có danh sách con để hiển thị.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="health" className="m-0">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <MetricCard label="Tổng" value={selectedEntity.stats.total} />
                  <MetricCard
                    label={
                      selectedEntity.level === "plant" ? "Cây khỏe" : "Khỏe"
                    }
                    value={selectedEntity.stats.healthy}
                    tone="green"
                  />
                  <MetricCard
                    label={
                      selectedEntity.level === "plant" ? "Sâu bệnh" : "Bị sâu bệnh"
                    }
                    value={selectedEntity.stats.diseased}
                    tone="red"
                  />
                  <MetricCard
                    label="Thu hoạch"
                    value={selectedEntity.stats.harvesting}
                    tone="amber"
                  />
                </div>

                <div className="rounded-2xl bg-white/70 p-4">
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

                  {soilCluster ? (
                    <div className="mt-4 space-y-3">
                      <div className="rounded-xl bg-slate-50/70 px-4 py-3">
                        <div className="text-[10px] uppercase tracking-wide text-slate-500">
                          Cụm đang xem
                        </div>
                        <div className="mt-1 text-base font-semibold text-slate-900">
                          {soilCluster.label}
                        </div>
                        <div className="text-sm text-slate-500">
                          {soilCluster.position} • {soilCluster.deviceCount} thiết bị
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <MetricCard label="Độ pH" value={soilCluster.metrics.ph} />
                        <MetricCard
                          label="Độ ẩm"
                          value={`${soilCluster.metrics.moisture}%`}
                        />
                        <MetricCard
                          label="Nhiệt độ"
                          value={`${soilCluster.metrics.temperature}°C`}
                        />
                        <MetricCard
                          label="Độ nén"
                          value={soilCluster.metrics.compaction}
                        />
                        <MetricCard
                          label="Nitrogen"
                          value={soilCluster.metrics.nitrogen}
                        />
                        <MetricCard
                          label="Phosphorus"
                          value={soilCluster.metrics.phosphorus}
                        />
                        <MetricCard
                          label="Potassium"
                          value={soilCluster.metrics.potassium}
                        />
                        <MetricCard
                          label="OM"
                          value={`${soilCluster.metrics.organicMatter}%`}
                        />
                      </div>

                      <div className="text-xs text-slate-500">
                        Lần đo cuối:{" "}
                        <span className="font-medium text-slate-700">
                          {soilCluster.metrics.lastTested}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Độ pH</span>
                        <span className="font-semibold text-slate-900">
                          {currentSoil.ph}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Độ ẩm</span>
                        <span className="font-semibold text-slate-900">
                          {currentSoil.moisture}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nhiệt độ</span>
                        <span className="font-semibold text-slate-900">
                          {currentSoil.temperature}°C
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Độ nén</span>
                        <span className="font-semibold text-slate-900">
                          {currentSoil.compaction}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Nitrogen</span>
                        <span className="font-semibold text-slate-800">
                          {currentSoil.nitrogen}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Phosphorus</span>
                        <span className="font-semibold text-slate-800">
                          {currentSoil.phosphorus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">Potassium</span>
                        <span className="font-semibold text-slate-800">
                          {currentSoil.potassium}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">OM</span>
                        <span className="font-semibold text-slate-800">
                          {currentSoil.organicMatter}%
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 border-t border-slate-200/70 pt-3">
                    <div className="text-sm font-medium text-slate-700">
                      Cụm thiết bị
                    </div>
                    <div className="mt-2 space-y-2">
                      {selectedEntity.soilClusters?.length ? (
                        selectedEntity.soilClusters.map((cluster) => (
                          <button
                            key={cluster.key}
                            onClick={() => onSelectSoilCluster(cluster)}
                            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-slate-50 px-3 py-3 text-left transition-colors hover:bg-slate-100"
                          >
                            <div className="min-w-0">
                              <div className="text-sm font-medium text-slate-900">
                                {cluster.label}
                              </div>
                              <div className="text-xs text-slate-500">
                                {cluster.position} • {cluster.deviceCount} thiết bị
                              </div>
                            </div>
                            <span className="text-xs text-slate-500">
                              {cluster.lastSynced}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="rounded-xl bg-slate-50/70 px-3 py-3 text-sm text-slate-500">
                          Chưa có cụm thiết bị nào.
                        </div>
                      )}
                    </div>
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
