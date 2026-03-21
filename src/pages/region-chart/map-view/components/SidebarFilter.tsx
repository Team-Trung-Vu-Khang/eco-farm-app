import React from "react";
import {
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, AlertTriangle, Sprout } from "lucide-react";
import { MOCK_REGIONS, MOCK_AREAS } from "../../constants";
import type { SelectedEntityStats } from "../types";

interface SidebarFilterProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterRegion: string;
  setFilterRegion: (val: string) => void;
  filterArea: string;
  setFilterArea: (val: string) => void;
  filterStatus: string;
  setFilterStatus: (val: string) => void;
  stats: SelectedEntityStats | any;
  availablePlants: any[];
  onPlantClick: (lat: number, lng: number) => void;
}

export const SidebarFilter: React.FC<SidebarFilterProps> = ({
  searchTerm,
  setSearchTerm,
  filterRegion,
  setFilterRegion,
  filterArea,
  setFilterArea,
  filterStatus,
  setFilterStatus,
  stats,
  availablePlants,
  onPlantClick,
}) => {
  return (
    <>
      <div className="p-4 border-b space-y-4">
        <div>
          <Label>Tìm kiếm cây trồng</Label>
          <div className="relative mt-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tên, mã cây..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Vùng trồng</Label>
            <Select value={filterRegion} onValueChange={setFilterRegion}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {MOCK_REGIONS.map((r) => (
                  <SelectItem key={r.id} value={r.id.toString()}>
                    {r.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Khu vực</Label>
            <Select value={filterArea} onValueChange={setFilterArea}>
              <SelectTrigger>
                <SelectValue placeholder="Tất cả" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                {MOCK_AREAS.filter(
                  (a) =>
                    filterRegion === "all" ||
                    a.regionId.toString() === filterRegion,
                ).map((a) => (
                  <SelectItem key={a.id} value={a.id.toString()}>
                    {a.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label>Trạng thái cây</Label>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Tất cả trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="healthy">Khỏe mạnh</SelectItem>
              <SelectItem value="diseased">Bị bệnh</SelectItem>
              <SelectItem value="harvesting">Đang thu hoạch</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        {searchTerm ? (
          <>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-primary" /> Kết quả tìm kiếm (
              {availablePlants.length})
            </h3>
            <div className="space-y-2 mb-6">
              {availablePlants.slice(0, 10).map((p, i) => (
                <Card
                  key={p.properties?.id || i}
                  className="cursor-pointer hover:bg-slate-50 border-slate-100 transition-colors"
                  onClick={() => {
                    const lat = p.geometry?.coordinates?.[1];
                    const lng = p.geometry?.coordinates?.[0];
                    if (lat != null && lng != null) {
                      onPlantClick(lat, lng);
                    }
                  }}
                >
                  <CardContent className="p-3">
                    <div className="font-bold text-sm truncate">
                      {p.properties?.name}
                    </div>
                    <div className="text-[10px] text-muted-foreground flex justify-between">
                      <span>Mã: {p.properties?.code}</span>
                      <span className="text-primary italic">Click để xem</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {availablePlants.length > 10 && (
                <div className="text-[10px] text-center text-muted-foreground pt-1">
                  Hiển thị 10/{availablePlants.length} kết quả
                </div>
              )}
              {availablePlants.length === 0 && (
                <div className="text-sm text-muted-foreground text-center py-4">
                  Không tìm thấy cây phù hợp
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Thống kê nhanh
            </h3>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {stats.healthy}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Sprout className="w-3 h-3" /> Cây khỏe
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-red-50 border-red-200">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {stats.diseased}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Cần xử lý
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <div className="text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span>Tổng diện tích</span>
                  <span className="font-medium">
                    {MOCK_REGIONS.reduce((acc, r) => acc + r.area, 0)} ha
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Số vùng trồng</span>
                  <span className="font-medium">{stats.regions}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Số khu vực</span>
                  <span className="font-medium">{stats.areas}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span>Số lô trồng</span>
                  <span className="font-medium">{stats.plots}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </ScrollArea>
    </>
  );
};
