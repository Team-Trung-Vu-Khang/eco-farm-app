import { useState } from "react";
import { Search, Filter, X, ChevronUp } from "lucide-react";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { cropTypes, crops, diseases } from "../data/treatment.data";
import type { SearchFilters } from "../types/treatment.types";

interface TreatmentSearchBarProps {
  filters: SearchFilters;
  onFiltersChange: (filters: SearchFilters) => void;
}

export function TreatmentSearchBar({
  filters,
  onFiltersChange,
}: TreatmentSearchBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof SearchFilters, value: string) => {
    const filterValue = value === "all" ? "" : value;
    onFiltersChange({ ...filters, [key]: filterValue });
  };

  const clearFilters = () => {
    onFiltersChange({
      keyword: "",
      cropType: "",
      crop: "",
      variety: "",
      disease: "",
      severity: "",
      status: "",
    });
  };

  // Get cascading options
  const availableCrops = filters.cropType
    ? crops[filters.cropType as keyof typeof crops] || []
    : [];

  const activeFilterCount =
    Object.values(filters).filter(Boolean).length - (filters.keyword ? 1 : 0);

  return (
    <div className="space-y-3">
      {/* Basic Search */}
      {/* Basic Search Row */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm phác đồ..."
            value={filters.keyword}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            className="pl-10 h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors w-full"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          className={`h-10 w-10 shrink-0 border-gray-200 ${showAdvanced || activeFilterCount > 0 ? "bg-green-50 text-green-600 border-green-200" : "bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50"}`}
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <Filter className="w-4 h-4" />
        </Button>
      </div>

      {/* Active Filters Summary (if collapsed) */}
      {!showAdvanced && activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(filters).map(([key, value]) => {
            if (!value || key === "keyword") return null;
            return (
              <Badge
                key={key}
                variant="secondary"
                className="px-2 py-0.5 text-[10px] font-normal bg-green-50 text-green-700 hover:bg-green-100 cursor-pointer"
                onClick={() => updateFilter(key as keyof SearchFilters, "all")}
              >
                {value} <X className="w-3 h-3 ml-1" />
              </Badge>
            );
          })}
        </div>
      )}

      {/* Advanced Search Panel */}
      {showAdvanced && (
        <div className="space-y-3 pt-2 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 gap-3">
            {/* Loại cây & Cây trồng Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-gray-500 font-bold">
                  Loại cây
                </Label>
                <Select
                  value={filters.cropType || "all"}
                  onValueChange={(value) => {
                    updateFilter("cropType", value);
                    updateFilter("crop", "");
                    updateFilter("variety", "");
                  }}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {cropTypes.map((type) => (
                      <SelectItem key={type.id} value={type.name}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-gray-500 font-bold">
                  Cây trồng
                </Label>
                <Select
                  value={filters.crop || "all"}
                  onValueChange={(value) => {
                    updateFilter("crop", value);
                    updateFilter("variety", "");
                  }}
                  disabled={!filters.cropType}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {availableCrops.map((crop) => (
                      <SelectItem key={crop} value={crop}>
                        {crop}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bệnh & Mức độ Row */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-gray-500 font-bold">
                  Bệnh/Sâu
                </Label>
                <Select
                  value={filters.disease || "all"}
                  onValueChange={(value) => updateFilter("disease", value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {diseases.map((disease) => (
                      <SelectItem key={disease} value={disease}>
                        {disease}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-[10px] uppercase text-gray-500 font-bold">
                  Mức độ
                </Label>
                <Select
                  value={filters.severity || "all"}
                  onValueChange={(value) => updateFilter("severity", value)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="M0">M0 - Phòng</SelectItem>
                    <SelectItem value="M1">M1 - Chớm</SelectItem>
                    <SelectItem value="M2">M2 - Vừa</SelectItem>
                    <SelectItem value="M3">M3 - Nặng</SelectItem>
                    <SelectItem value="M4">M4 - Khủng hoảng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Trạng thái */}
            {/* <div className="space-y-1.5">
              <Label className="text-[10px] uppercase text-gray-500 font-bold">
                Trạng thái
              </Label>
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => updateFilter("status", value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Đang áp dụng</SelectItem>
                  <SelectItem value="inactive">Không áp dụng</SelectItem>
                </SelectContent>
              </Select>
            </div> */}
          </div>

          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs h-7 text-gray-500 hover:text-red-500 px-2"
            >
              Xóa bộ lọc
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(false)}
              className="text-xs h-7 text-green-600 px-2"
            >
              <ChevronUp className="w-3 h-3 mr-1" /> Thu gọn
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
