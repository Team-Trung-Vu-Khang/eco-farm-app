import { useState, useMemo } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  cn,
} from "@tankhang1/eco-shared-ui";
import {
  Search,
  MapPin,
  Briefcase,
  Building2,
  Check,
  X,
  Filter,
} from "lucide-react";
import type { Region } from "../../../region-chart/constants";
import useRegionStore from "../../../../stores/useRegionStore";
import useEnterpriseStore from "../../../../stores/useEnterpriseStore";
import { PROVINCES } from "../../../../constants/province";

export const CultivationZoneDialog = ({
  open,
  onOpenChange,
  onConfirm,
  initialSelections = [],
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (selections: Region[]) => void;
  initialSelections: Region[];
}) => {
  const { regions } = useRegionStore();
  const { enterprises } = useEnterpriseStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [entFilter, setEntFilter] = useState<string>("all");
  const [provFilter, setProvFilter] = useState<string>("all");
  const [distFilter, setDistFilter] = useState<string>("all");

  const [tempSelections, setTempSelections] =
    useState<Region[]>(initialSelections);

  const toggleSelection = (region: Region) => {
    const exists = tempSelections.find((s) => s.id === region.id);
    if (exists) {
      setTempSelections(tempSelections.filter((s) => s.id !== region.id));
    } else {
      setTempSelections([...tempSelections, region]);
    }
  };

  const isSelected = (id: number) => {
    return tempSelections.some((s) => s.id === id);
  };

  const handleConfirm = () => {
    onConfirm(tempSelections);
    onOpenChange(false);
  };

  const filteredRegions = useMemo(() => {
    return regions.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEnt =
        entFilter === "all" || r.enterpriseId.toString() === entFilter;
      const matchesProv = provFilter === "all" || r.provinceId === provFilter;
      const matchesDist = distFilter === "all" || r.districtId === distFilter;

      return matchesSearch && matchesEnt && matchesProv && matchesDist;
    });
  }, [regions, searchTerm, entFilter, provFilter, distFilter]);

  const resetFilters = () => {
    setEntFilter("all");
    setProvFilter("all");
    setDistFilter("all");
    setSearchTerm("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-3xl flex flex-col max-h-[90vh] border-none shadow-2xl">
        {/* Header Section */}
        <DialogHeader className="p-8 bg-linear-to-br from-primary/10 via-white to-primary/5 border-b relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <MapPin size={120} className="text-primary rotate-12" />
          </div>

          <DialogTitle className="flex items-center gap-3 text-2xl font-black text-slate-800">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <MapPin className="text-white h-6 w-6" />
            </div>
            Chọn vùng canh tác
          </DialogTitle>

          <p className="text-slate-500 mt-2 font-medium">
            Lọc theo vị trí địa lý và doanh nghiệp để tìm vùng trồng phù hợp
          </p>

          <div className="mt-6 flex flex-wrap gap-2 max-h-24 overflow-y-auto custom-scrollbar">
            {tempSelections.map((s) => (
              <Badge
                key={s.id}
                variant="secondary"
                className="pl-3 pr-1 py-1 gap-2 bg-white border border-primary/20 text-primary font-bold shadow-sm animate-in fade-in zoom-in duration-200"
              >
                {s.name}
                <div
                  className="bg-primary/10 hover:bg-primary/20 rounded-full p-0.5 cursor-pointer transition-colors"
                  onClick={() => toggleSelection(s)}
                >
                  <X size={12} />
                </div>
              </Badge>
            ))}
            {tempSelections.length === 0 && (
              <div className="flex items-center gap-2 text-slate-400 italic text-sm py-1">
                <Filter size={14} />
                Chưa có vùng nào được chọn
              </div>
            )}
          </div>
        </DialogHeader>

        {/* Filter Section */}
        <div className="px-8 py-6 bg-white border-b space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                placeholder="Tìm tên vùng hoặc mã số..."
                className="pl-12 h-12 rounded-2xl bg-slate-50 border-slate-100 focus:bg-white transition-all text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="ghost"
              className="h-12 rounded-2xl text-slate-500 hover:text-primary transition-colors gap-2"
              onClick={resetFilters}
            >
              <X size={18} />
              Đặt lại lọc
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-2">
                Đơn vị sở hữu
              </label>
              <Select value={entFilter} onValueChange={setEntFilter}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Tất cả doanh nghiệp" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">Tất cả doanh nghiệp</SelectItem>
                  {enterprises.map((e) => (
                    <SelectItem key={e.id} value={e.id.toString()}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-2">
                Tỉnh thành
              </label>
              <Select value={provFilter} onValueChange={setProvFilter}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Tất cả tỉnh thành" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">Tất cả tỉnh thành</SelectItem>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 ml-2">
                Quận huyện
              </label>
              <Select value={distFilter} onValueChange={setDistFilter}>
                <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Tất cả quận huyện" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  <SelectItem value="all">Tất cả quận huyện</SelectItem>
                  {PROVINCES.find((p) => p.code === provFilter)?.districts.map(
                    (district) => (
                      <SelectItem key={district.code} value={district.code}>
                        {district.name}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <ScrollArea className="flex-1 p-8 bg-slate-50/50 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-4">
            {filteredRegions.map((region) => {
              const enterprise = enterprises.find(
                (e) => e.id.toString() === region.enterpriseId.toString(),
              );
              const isSelectedActive = isSelected(region.id);

              return (
                <div
                  key={region.id}
                  onClick={() => toggleSelection(region)}
                  className={cn(
                    "group relative overflow-hidden p-5 rounded-3xl border-2 transition-all cursor-pointer bg-white",
                    isSelectedActive
                      ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                      : "border-transparent hover:border-slate-200 hover:shadow-lg shadow-sm",
                  )}
                >
                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex gap-4">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                          isSelectedActive
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                        )}
                      >
                        <Building2 size={24} />
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                            {region.code}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {region.area} ha
                          </span>
                        </div>
                        <h4 className="font-bold text-slate-800 text-lg group-hover:text-primary transition-colors">
                          {region.name}
                        </h4>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <MapPin size={12} className="text-slate-300" />
                          {region.address}
                        </p>
                      </div>
                    </div>

                    <div
                      className={cn(
                        "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0 mt-1",
                        isSelectedActive
                          ? "bg-primary border-primary text-white scale-110"
                          : "border-slate-200 bg-white",
                      )}
                    >
                      {isSelectedActive && (
                        <Check size={14} className="stroke-3" />
                      )}
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600">
                        {enterprise?.name || "N/A"}
                      </span>
                    </div>

                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] border-none font-bold",
                        region.status === "active"
                          ? "text-emerald-500 bg-emerald-50"
                          : "text-slate-400 bg-slate-50",
                      )}
                    >
                      {region.status === "active"
                        ? "Đang hoạt động"
                        : "Tạm dừng"}
                    </Badge>
                  </div>

                  {/* Decoration Circle */}
                  <div
                    className={cn(
                      "absolute -bottom-8 -right-8 w-24 h-24 rounded-full transition-all duration-500",
                      isSelectedActive
                        ? "bg-primary/5 scale-125"
                        : "bg-slate-50 scale-100",
                    )}
                  />
                </div>
              );
            })}
          </div>

          {filteredRegions.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mb-6">
                <Search size={40} className="text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-600">
                Không tìm thấy vùng nào
              </h3>
              <p className="text-sm mt-2">
                Vui lòng điều chỉnh lại bộ lọc hoặc từ khóa tìm kiếm
              </p>
            </div>
          )}
        </ScrollArea>

        {/* Footer Section */}
        <div className="p-8 bg-white border-t flex items-center justify-between">
          <div className="text-sm">
            <span className="text-slate-400 font-medium">Đã chọn: </span>
            <span className="text-primary font-black text-lg">
              {tempSelections.length}
            </span>
            <span className="text-slate-400 font-medium"> vùng canh tác</span>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-8 h-12 rounded-2xl font-bold text-slate-600 hover:bg-slate-50 border-slate-200 transition-all active:scale-95"
            >
              Hủy bỏ
            </Button>
            <Button
              onClick={handleConfirm}
              className="px-10 h-12 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all"
            >
              Xác nhận lựa chọn
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
