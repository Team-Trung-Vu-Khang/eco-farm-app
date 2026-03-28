import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowUpDown,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import { TreatmentListItem } from "./TreatmentListItem";
import { TreatmentSearchBar } from "./TreatmentSearchBar";
import type { SearchFilters, Treatment } from "../types/treatment.types";

interface TreatmentSidebarProps {
  filteredData: Treatment[];
  searchFilters: SearchFilters;
  setSearchFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  selectedId: number | null;
  onSelect: (id: number) => void;
  severityConfig: Record<string, { label: string; iconColor: string }>;
  onResetFilters: () => void;
}

export function TreatmentSidebar({
  filteredData,
  searchFilters,
  setSearchFilters,
  selectedId,
  onSelect,
  severityConfig,
  onResetFilters,
}: TreatmentSidebarProps) {
  return (
    <div className="lg:col-span-3 flex flex-col h-full bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden transform transition-all">
      <div className="p-3 border-b border-gray-100 bg-white z-10 space-y-3 shrink-0">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-gray-800 text-base">Danh sách phác đồ</h3>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-600"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
        </div>

        <TreatmentSearchBar
          filters={searchFilters}
          onFiltersChange={setSearchFilters}
        />

        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar scoll-smooth">
          <button
            onClick={() =>
              setSearchFilters((prev) => ({
                ...prev,
                status: "",
                severity: "",
              }))
            }
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${
              !searchFilters.status && !searchFilters.severity
                ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </button>
          {(Object.entries(severityConfig) as [string, { label: string; iconColor: string }][]).map(
            ([key, config]) => (
              <button
                key={key}
                onClick={() =>
                  setSearchFilters((prev) => ({
                    ...prev,
                    severity: key,
                    status: "",
                  }))
                }
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  searchFilters.severity === key
                    ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    searchFilters.severity === key
                      ? "bg-white"
                      : config.iconColor.split(" ")[0].replace("text-", "bg-")
                  }`}
                />
                {config.label}
              </button>
            ),
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50/50 p-2 space-y-2 custom-scrollbar">
        <div className="flex items-center justify-between px-2 py-1 text-[10px] uppercase font-bold text-gray-400 tracking-wider">
          <span>Kết quả ({filteredData.length})</span>
          <span className="flex items-center gap-1 cursor-pointer hover:text-gray-600">
            Mới nhất <ArrowUpDown className="w-3 h-3" />
          </span>
        </div>

        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <TreatmentListItem
              key={item.id}
              treatment={item}
              isSelected={selectedId === item.id}
              onClick={() => onSelect(item.id)}
            />
          ))
        ) : (
          <div className="h-60 flex flex-col items-center justify-center text-center p-6 text-gray-400">
            <Search className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium">Không tìm thấy phác đồ nào</p>
            <Button
              variant="link"
              className="text-green-600 mt-2"
              onClick={onResetFilters}
            >
              Xóa bộ lọc
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
