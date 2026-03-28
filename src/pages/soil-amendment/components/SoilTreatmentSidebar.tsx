import { Badge, Button, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowUpDown, MapPin, Search, SlidersHorizontal } from "lucide-react";
import {
  getTreatmentIntensityConfig,
  getTreatmentStatusConfig,
} from "../data/soilAmendmentTreatmentConfig";
import type { TreatmentPlan } from "../types/treatment";

interface SoilTreatmentSidebarProps {
  filterIntensity: string;
  filterStatus: string;
  filteredData: TreatmentPlan[];
  searchKeyword: string;
  selectedId: number | null;
  setFilterIntensity: (value: string) => void;
  setFilterStatus: (value: string) => void;
  setSearchKeyword: (value: string) => void;
  setSelectedId: (value: number) => void;
}

export function SoilTreatmentSidebar({
  filterIntensity,
  filterStatus,
  filteredData,
  searchKeyword,
  selectedId,
  setFilterIntensity,
  setFilterStatus,
  setSearchKeyword,
  setSelectedId,
}: SoilTreatmentSidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all lg:col-span-3">
      <div className="z-10 shrink-0 space-y-3 border-b border-gray-100 bg-white p-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-gray-800">Danh sách phác đồ</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Tìm kiếm phác đồ..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            className="h-9 pl-9 text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button
            onClick={() => {
              setFilterStatus("");
              setFilterIntensity("");
            }}
            className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              !filterStatus && !filterIntensity
                ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
            type="button"
          >
            Tất cả
          </button>
          <button
            onClick={() => setFilterStatus("in_progress")}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              filterStatus === "in_progress"
                ? "border-green-600 bg-green-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-green-200 hover:bg-green-50 hover:text-green-600"
            }`}
            type="button"
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${filterStatus === "in_progress" ? "bg-white" : "bg-green-500"}`}
            />
            Đang chạy
          </button>
          <button
            onClick={() => setFilterIntensity("deep")}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-all ${
              filterIntensity === "deep"
                ? "border-red-600 bg-red-600 text-white shadow-sm"
                : "border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600"
            }`}
            type="button"
          >
            <div
              className={`h-1.5 w-1.5 rounded-full ${filterIntensity === "deep" ? "bg-white" : "bg-red-500"}`}
            />
            Cường độ sâu
          </button>
        </div>
      </div>

      <div className="custom-scrollbar flex-1 space-y-2 overflow-y-auto bg-gray-50/50 p-2">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
          <span>Kết quả ({filteredData.length})</span>
          <span className="flex cursor-pointer items-center gap-1 hover:text-gray-600">
            Mới nhất <ArrowUpDown className="h-3 w-3" />
          </span>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((item) => {
            const statusConfig = getTreatmentStatusConfig(item.status);
            const intensityConfig = getTreatmentIntensityConfig(item.intensity);
            const isSelected = selectedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedId(item.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${
                  isSelected
                    ? "border-green-200 bg-white shadow-md ring-1 ring-green-100"
                    : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                }`}
              >
                <div className="mb-2 flex items-start justify-between">
                  <span className="font-mono text-xs font-medium text-gray-500">
                    {item.code}
                  </span>
                  <div className={`h-2 w-2 rounded-full ${statusConfig.color}`} />
                </div>
                <h4 className="mb-1 line-clamp-2 text-sm font-semibold text-gray-900">
                  {item.name}
                </h4>
                <div className="mb-2 flex items-center gap-1.5 text-xs text-gray-500">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{item.zone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${intensityConfig.color} px-2 py-0.5 text-xs text-white`}>
                    {intensityConfig.label}
                  </Badge>
                  <span className="text-xs text-gray-500">{item.duration}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex h-60 flex-col items-center justify-center p-6 text-center text-gray-400">
            <Search className="mb-3 h-12 w-12 opacity-20" />
            <p className="text-sm font-medium">Không tìm thấy phác đồ nào</p>
            <Button
              variant="link"
              className="mt-2 text-green-600"
              onClick={() => {
                setSearchKeyword("");
                setFilterStatus("");
                setFilterIntensity("");
              }}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
