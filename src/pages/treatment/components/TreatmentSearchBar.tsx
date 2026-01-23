import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";
import { cropTypes, crops, varieties, diseases } from "../data/treatment.data";
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
    // Convert "all" to empty string for filtering
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
  const availableVarieties = filters.crop
    ? varieties[filters.crop as keyof typeof varieties] || []
    : [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="w-4 h-4" />
            Tìm kiếm phác đồ
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showAdvanced ? "Ẩn" : "Hiện"} tìm kiếm nâng cao
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Basic Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm theo mã, tên phác đồ, hoặc bệnh/sâu hại..."
            value={filters.keyword}
            onChange={(e) => updateFilter("keyword", e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Advanced Search */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Loại cây */}
              <div className="space-y-2">
                <Label className="text-xs">Loại cây</Label>
                <Select
                  value={filters.cropType || "all"}
                  onValueChange={(value) => {
                    updateFilter("cropType", value);
                    updateFilter("crop", "");
                    updateFilter("variety", "");
                  }}
                >
                  <SelectTrigger className="h-9">
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

              {/* Cây trồng */}
              <div className="space-y-2">
                <Label className="text-xs">Cây trồng</Label>
                <Select
                  value={filters.crop || "all"}
                  onValueChange={(value) => {
                    updateFilter("crop", value);
                    updateFilter("variety", "");
                  }}
                  disabled={!filters.cropType}
                >
                  <SelectTrigger className="h-9">
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

              {/* Giống */}
              <div className="space-y-2">
                <Label className="text-xs">Giống</Label>
                <Select
                  value={filters.variety || "all"}
                  onValueChange={(value) => updateFilter("variety", value)}
                  disabled={!filters.crop}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    {availableVarieties.map((variety) => (
                      <SelectItem key={variety} value={variety}>
                        {variety}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Bệnh/Sâu hại */}
              <div className="space-y-2">
                <Label className="text-xs">Bệnh/Sâu hại</Label>
                <Select
                  value={filters.disease || "all"}
                  onValueChange={(value) => updateFilter("disease", value)}
                >
                  <SelectTrigger className="h-9">
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

              {/* Mức độ */}
              <div className="space-y-2">
                <Label className="text-xs">Mức độ</Label>
                <Select
                  value={filters.severity || "all"}
                  onValueChange={(value) => updateFilter("severity", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="mild">Nhẹ</SelectItem>
                    <SelectItem value="moderate">Trung bình</SelectItem>
                    <SelectItem value="severe">Nghiêm trọng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái */}
              <div className="space-y-2">
                <Label className="text-xs">Trạng thái</Label>
                <Select
                  value={filters.status || "all"}
                  onValueChange={(value) => updateFilter("status", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Tất cả" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="active">Đang áp dụng</SelectItem>
                    <SelectItem value="inactive">Không áp dụng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-2" />
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
