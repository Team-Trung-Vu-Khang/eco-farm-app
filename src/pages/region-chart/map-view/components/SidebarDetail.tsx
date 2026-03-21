import React from "react";
import {
  Card,
  CardContent,
  ScrollArea,
  Button,
} from "@tankhang1/eco-shared-ui";
import {
  Search,
  AlertTriangle,
  Sprout,
  FlaskConical,
  Droplets,
  Thermometer,
  Info,
  Activity,
} from "lucide-react";
import type { SelectedEntity, SoilData } from "../types";

interface SidebarDetailProps {
  selectedEntity: SelectedEntity;
  onClose: () => void;
  soilData: Record<string, SoilData>;
  onEditSoil: () => void;
}

export const SidebarDetail: React.FC<SidebarDetailProps> = ({
  selectedEntity,
  onClose,
  soilData,
  onEditSoil,
}) => {
  const currentId =
    selectedEntity.properties?.code || selectedEntity.properties?.id;
  const currentSoil = soilData[currentId] || {
    ph: 0,
    moisture: 0,
    temperature: 0,
    compaction: 0,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    organicMatter: 0,
    lastTested: "Chưa có dữ liệu",
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-left-5 fade-in bg-slate-50">
      <div className="p-4 border-b bg-white flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Search className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Chi tiết kỹ thuật</h3>
            <p className="text-xs text-muted-foreground">Báo cáo tổng hợp</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-sm p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
        >
          Đóng
        </button>
      </div>

      <ScrollArea className="flex-1 p-2">
        {/* General Info Card */}
        <Card className="border-none shadow-sm mb-6">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-sm text-muted-foreground">Đối tượng</div>
                <div className="text-xl font-bold text-primary">
                  {selectedEntity.type}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Mã số</div>
                <div className="font-mono font-medium bg-slate-100 px-2 py-0.5 rounded text-sm inline-block">
                  {selectedEntity.properties?.code || "N/A"}
                </div>
              </div>
            </div>

            {selectedEntity.properties?.area && (
              <div className="bg-primary/5 rounded-lg p-3 flex items-center justify-between border border-primary/10">
                <span className="text-sm font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-primary" /> Tổng diện tích
                </span>
                <span className="font-bold text-lg">
                  {selectedEntity.properties.area}{" "}
                  <span className="text-sm font-normal text-muted-foreground">
                    ha
                  </span>
                </span>
              </div>
            )}

            {selectedEntity.properties?.altitude && (
              <div className="flex justify-between text-sm py-1 border-b border-dashed">
                <span className="text-muted-foreground">Độ cao trung bình</span>
                <span>{selectedEntity.properties.altitude}m</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
            <Sprout className="w-4 h-4" />
            Thống kê cây trồng
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-white border-none shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-slate-800">
                  {selectedEntity.stats.total}
                </div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-1">
                  Tổng cộng
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-100 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-green-600">
                  {selectedEntity.stats.healthy}
                </div>
                <div className="text-xs font-medium text-green-700 uppercase tracking-wide mt-1">
                  Khỏe mạnh
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 border-red-100 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-red-600">
                  {selectedEntity.stats.diseased}
                </div>
                <div className="text-xs font-medium text-red-700 uppercase tracking-wide mt-1">
                  Sâu bệnh
                </div>
              </CardContent>
            </Card>
            <Card className="bg-yellow-50 border-yellow-100 shadow-sm">
              <CardContent className="p-4 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold text-yellow-600">
                  {selectedEntity.stats.harvesting}
                </div>
                <div className="text-xs font-medium text-yellow-700 uppercase tracking-wide mt-1">
                  Thu hoạch
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Soil Health Section */}
        <div className="mb-6 px-2">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center gap-2 text-sm text-slate-700">
              <FlaskConical className="w-4 h-4 text-indigo-500" />
              Chỉ số sức khỏe đất
            </h4>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs text-primary"
              onClick={onEditSoil}
            >
              <Activity className="w-3 h-3 mr-1" />
              Cập nhật
            </Button>
          </div>

          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] font-bold uppercase text-indigo-600">
                        Độ pH
                      </span>
                    </div>
                    <div className="text-xl font-bold text-indigo-900 leading-none">
                      {currentSoil.ph}
                    </div>
                    <div className="text-[9px] text-indigo-500 mt-1">
                      Mức:{" "}
                      {currentSoil.ph === 0
                        ? "N/A"
                        : currentSoil.ph > 7
                          ? "Kiềm"
                          : currentSoil.ph < 6
                            ? "Chua"
                            : "Tối ưu"}
                    </div>
                  </div>
                  <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-[10px] font-bold uppercase text-blue-600">
                        Độ ẩm
                      </span>
                    </div>
                    <div className="text-xl font-bold text-blue-900 leading-none">
                      {currentSoil.moisture}%
                    </div>
                    <div className="text-[9px] text-blue-500 mt-1">
                      Trạng thái: {currentSoil.moisture === 0 ? "N/A" : "Tốt"}
                    </div>
                  </div>
                  <div className="bg-orange-50/50 rounded-xl p-3 border border-orange-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Thermometer className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-[10px] font-bold uppercase text-orange-600">
                        Nhiệt độ
                      </span>
                    </div>
                    <div className="text-xl font-bold text-orange-900 leading-none">
                      {currentSoil.temperature}°C
                    </div>
                    <div className="text-[9px] text-orange-500 mt-1">
                      {currentSoil.temperature === 0 ? "N/A" : "Ổn định"}
                    </div>
                  </div>
                  <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] font-bold uppercase text-emerald-600">
                        Độ nén
                      </span>
                    </div>
                    <div className="text-xl font-bold text-emerald-900 leading-none">
                      {currentSoil.compaction}
                    </div>
                    <div className="text-[9px] text-emerald-500 mt-1">
                      psi ({currentSoil.compaction === 0 ? "N/A" : "Tốt"})
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400">N</div>
                    <div className="text-xs font-bold text-slate-700">
                      {currentSoil.nitrogen}
                    </div>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400">P</div>
                    <div className="text-xs font-bold text-slate-700">
                      {currentSoil.phosphorus}
                    </div>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400">K</div>
                    <div className="text-xs font-bold text-slate-700">
                      {currentSoil.potassium}
                    </div>
                  </div>
                  <div className="text-center p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="text-[9px] font-bold text-slate-400">OM</div>
                    <div className="text-xs font-bold text-slate-700">
                      {currentSoil.organicMatter}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    Lần đo cuối:
                  </span>
                  <span className="text-xs font-medium text-slate-600">
                    {currentSoil.lastTested}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Plant Types List */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-sm text-slate-700">
            <Search className="w-4 h-4" />
            Phân loại cây ({Object.keys(selectedEntity.stats.types).length})
          </h4>
          <Card className="border-none shadow-sm overflow-hidden">
            <div className="divide-y">
              {Object.entries(selectedEntity.stats.types).map(([name, count]) => (
                <div
                  key={name}
                  className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm font-medium text-slate-700">{name}</span>
                  <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded-full">
                    {count} cây
                  </span>
                </div>
              ))}
              {Object.keys(selectedEntity.stats.types).length === 0 && (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  Chưa có dữ liệu cây trồng trong khu vực này.
                </div>
              )}
            </div>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
};
