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
  CheckCircle2,
  FileCheck,
  Search,
  Filter,
  Wrench,
  ChevronRight,
  Info,
  Calendar,
} from "lucide-react";
import type { Regimen } from "../../../stores/useRegimenStore";

interface RegimenSelectorProps {
  regimens: Regimen[];
  onSelect: (regimen: Regimen) => void;
  type: "amendment" | "treatment";
  selectedRegimenId?: string;
}

export const RegimenSelector = ({
  regimens,
  onSelect,
  type,
  selectedRegimenId,
}: RegimenSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProvider, setFilterProvider] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterCrop, setFilterCrop] = useState<string>("all");

  const selectedRegimen = useMemo(
    () => regimens.find((r) => r.id === selectedRegimenId),
    [regimens, selectedRegimenId],
  );

  // Metadata for filters
  const providers = useMemo(
    () => [
      "all",
      ...Array.from(new Set(regimens.map((r) => r.provider))).filter(Boolean),
    ],
    [regimens],
  );

  const categories = useMemo(
    () => [
      "all",
      ...Array.from(new Set(regimens.map((r) => r.category))).filter(Boolean),
    ],
    [regimens],
  );

  const crops = useMemo(
    () => [
      "all",
      ...Array.from(new Set(regimens.map((r) => r.crop))).filter(Boolean),
    ],
    [regimens],
  );

  const filteredRegimens = useMemo(() => {
    return regimens.filter((r) => {
      const matchType =
        (type === "amendment" && r.type === "cai-tao-dat") ||
        (type === "treatment" && r.type === "tri-benh");
      const matchSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchProvider =
        filterProvider === "all" || r.provider === filterProvider;
      const matchCategory =
        filterCategory === "all" || r.category === filterCategory;
      const matchCrop = filterCrop === "all" || r.crop === filterCrop;

      return (
        matchType && matchSearch && matchProvider && matchCategory && matchCrop
      );
    });
  }, [regimens, type, searchTerm, filterProvider, filterCategory, filterCrop]);

  const handleSelect = (regimen: Regimen) => {
    onSelect(regimen);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className={cn(
          "w-full h-16 justify-between px-4 border-2 transition-all rounded-2xl",
          selectedRegimen
            ? type === "amendment"
              ? "border-amber-500 bg-amber-50/50 hover:bg-amber-50"
              : "border-blue-500 bg-blue-50/50 hover:bg-blue-50"
            : "border-slate-200 border-dashed hover:border-slate-300 hover:bg-slate-50",
        )}
      >
        <div className="flex items-center gap-4 text-left">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              selectedRegimen
                ? type === "amendment"
                  ? "bg-amber-500 text-white"
                  : "bg-blue-500 text-white"
                : "bg-slate-100 text-slate-400",
            )}
          >
            {type === "amendment" ? (
              <Wrench className="w-5 h-5" />
            ) : (
              <FileCheck className="w-5 h-5" />
            )}
          </div>
          <div className="min-w-0">
            {selectedRegimen ? (
              <>
                <p
                  className={cn(
                    "font-bold text-sm truncate",
                    type === "amendment" ? "text-amber-900" : "text-blue-900",
                  )}
                >
                  {selectedRegimen.name}
                </p>
                <p className="text-[10px] text-slate-500 truncate">
                  {selectedRegimen.provider} • {selectedRegimen.category}
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-sm text-slate-600">
                  {type === "amendment"
                    ? "Chọn quy trình cải tạo..."
                    : "Chọn phác đồ điều trị..."}
                </p>
                <p className="text-[10px] text-slate-400">
                  Tìm kiếm dựa trên hiện trạng đất, bệnh hại, cây trồng
                </p>
              </>
            )}
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-slate-400 shrink-0" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl p-0 overflow-hidden rounded-3xl border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
            <DialogTitle className="flex items-center gap-3 text-xl font-black">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  type === "amendment"
                    ? "bg-amber-100 text-amber-600"
                    : "bg-blue-100 text-blue-600",
                )}
              >
                {type === "amendment" ? (
                  <Wrench className="w-5 h-5" />
                ) : (
                  <FileCheck className="w-5 h-5" />
                )}
              </div>
              <div className="flex flex-col">
                <span>
                  {type === "amendment"
                    ? "Kho quy trình cải tạo đất"
                    : "Kho phác đồ điều trị bệnh"}
                </span>
                <span className="text-xs text-muted-foreground font-normal">
                  Tìm kiếm và áp dụng giải pháp kỹ thuật từ các chuyên gia
                </span>
              </div>
            </DialogTitle>
          </DialogHeader>

          {/* Filters & Search */}
          <div className="p-6 space-y-4 border-b bg-white shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
              <Input
                placeholder="Tìm tên phác đồ, triệu chứng, hoặc mô tả..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-xl h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">
                  Đơn vị cung cấp
                </label>
                <Select
                  value={filterProvider}
                  onValueChange={setFilterProvider}
                >
                  <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Tất cả đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p === "all" ? "Tất cả đơn vị" : p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">
                  Hiện trạng / Nhóm
                </label>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Tất cả danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "Tất cả danh mục" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-widest font-black text-slate-400 ml-1">
                  Cây trồng
                </label>
                <Select value={filterCrop} onValueChange={setFilterCrop}>
                  <SelectTrigger className="h-10 bg-slate-50/50 border-slate-200">
                    <SelectValue placeholder="Tất cả cây trồng" />
                  </SelectTrigger>
                  <SelectContent>
                    {crops.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c === "all" ? "Tất cả cây trồng" : c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ScrollArea className="flex-1 bg-slate-50/30">
            <div className="p-6 grid grid-cols-1 gap-4">
              {filteredRegimens.map((regimen) => (
                <div
                  key={regimen.id}
                  onClick={() => handleSelect(regimen)}
                  className={cn(
                    "p-5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col gap-4 group",
                    selectedRegimenId === regimen.id
                      ? type === "amendment"
                        ? "bg-amber-50 border-amber-500 shadow-md"
                        : "bg-blue-50 border-blue-500 shadow-md"
                      : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm",
                  )}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-black text-slate-900 leading-tight group-hover:text-primary transition-colors">
                          {regimen.name}
                        </h4>
                        {selectedRegimenId === regimen.id && (
                          <CheckCircle2
                            className={cn(
                              "w-5 h-5 animate-in zoom-in",
                              type === "amendment"
                                ? "text-amber-500"
                                : "text-blue-500",
                            )}
                          />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                        {regimen.description}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn(
                        "bg-slate-50 text-[9px] font-bold uppercase shrink-0 tracking-wider",
                        type === "amendment"
                          ? "text-amber-700 bg-amber-50 border-amber-100"
                          : "text-blue-700 bg-blue-50 border-blue-100",
                      )}
                    >
                      {regimen.category}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-1 rounded-lg">
                      <Info className="w-3 h-3" />
                      {regimen.provider}
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 bg-slate-100/50 px-2 py-1 rounded-lg">
                      <Calendar className="w-3 h-3" />
                      Cây: {regimen.crop}
                    </div>
                  </div>
                </div>
              ))}

              {filteredRegimens.length === 0 && (
                <div className="text-center py-20 px-6">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-4 border border-dashed border-slate-200">
                    <Filter className="w-10 h-10 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Không tìm thấy phác đồ phù hợp
                  </h3>
                  <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
                    Hãy thử thay đổi từ khóa tìm kiếm hoặc bỏ bớt các bộ lọc để
                    có nhiều kết quả hơn.
                  </p>
                  <Button
                    variant="link"
                    className="mt-4"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterProvider("all");
                      setFilterCategory("all");
                      setFilterCrop("all");
                    }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 bg-white border-t shrink-0 flex justify-center">
            <p className="text-[10px] text-slate-400 font-medium">
              Dữ liệu phác đồ được chuẩn hóa theo quy trình của Eco-Farm Global
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
