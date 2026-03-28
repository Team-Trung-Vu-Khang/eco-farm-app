import { useMemo, useState } from "react";
import {
  Badge,
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Layers, MapPin, Search } from "lucide-react";
import useRegionStore from "../../../stores/useRegionStore";
import type { Region, SubArea } from "../types/types";

const FilterStep = ({
  step,
  label,
  done,
  active,
}: {
  step: number;
  label: string;
  done: boolean;
  active: boolean;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 text-xs font-bold transition-all",
      done ? "text-primary" : active ? "text-slate-700" : "text-slate-300",
    )}
  >
    <div
      className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black transition-colors",
        done
          ? "bg-primary text-white"
          : active
            ? "bg-slate-200 text-slate-600"
            : "bg-slate-100 text-slate-300",
      )}
    >
      {done ? <Check size={10} /> : step}
    </div>
    {label}
  </div>
);

interface SubAreaSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (region: Region, area: SubArea) => void;
  enterpriseId: string;
  selectedRegionId: string;
  selectedAreaId: string;
  onRegionChange: (regionId: string) => void;
}

export const SubAreaSelectorDialog = ({
  open,
  onOpenChange,
  onSelect,
  enterpriseId,
  selectedRegionId,
  selectedAreaId,
  onRegionChange,
}: SubAreaSelectorDialogProps) => {
  const { regions } = useRegionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalRegionId, setInternalRegionId] = useState(selectedRegionId);

  const filteredRegions = useMemo(
    () =>
      regions.filter((region) => {
        const matchesEnterprise =
          !enterpriseId ||
          region.enterpriseId === enterpriseId ||
          region.enterpriseId === `ent-${enterpriseId}`;
        return matchesEnterprise;
      }),
    [enterpriseId, regions],
  );

  const selectedRegion = useMemo(
    () => regions.find((region) => region.id.toString() === internalRegionId),
    [internalRegionId, regions],
  );

  const filteredAreas = useMemo(() => {
    if (!selectedRegion) return [];
    return (selectedRegion.subAreas || []).filter((area) =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, selectedRegion]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setInternalRegionId(selectedRegionId);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-3xl flex flex-col max-h-[90vh] border-none shadow-2xl">
        <DialogHeader className="p-6 bg-linear-to-br from-primary/10 via-white to-primary/5 border-b relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Layers size={80} className="text-primary rotate-12" />
          </div>
          <DialogTitle className="flex items-center gap-3 text-xl font-black text-slate-800">
            <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
              <Layers className="text-white h-5 w-5" />
            </div>
            Chọn khu vực canh tác
          </DialogTitle>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Chọn vùng trồng, sau đó chọn khu vực cụ thể
          </p>

          <div className="flex items-center gap-4 mt-3">
            <FilterStep
              step={1}
              label="Chọn vùng trồng"
              done={Boolean(internalRegionId)}
              active={!internalRegionId}
            />
            <div className="flex-1 h-px bg-slate-200" />
            <FilterStep
              step={2}
              label="Chọn khu vực"
              done={false}
              active={Boolean(internalRegionId)}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col overflow-hidden flex-1">
          <div className="px-6 py-4 bg-white border-b">
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 block">
              Vùng trồng
            </label>
            <Select
              value={internalRegionId}
              onValueChange={(value) => {
                setInternalRegionId(value);
                onRegionChange(value);
                setSearchTerm("");
              }}
            >
              <SelectTrigger className="h-11 rounded-xl bg-slate-50 border-slate-100">
                <SelectValue placeholder="Chọn vùng trồng..." />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                {filteredRegions.length === 0 ? (
                  <div className="py-4 text-center text-sm text-slate-400">
                    {enterpriseId
                      ? "Không có vùng nào cho đơn vị sở hữu này"
                      : "Chọn đơn vị sở hữu trước"}
                  </div>
                ) : (
                  filteredRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-primary/60" />
                        <span>{region.name}</span>
                        <span className="text-[10px] text-slate-400">
                          ({region.area} ha)
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          {internalRegionId ? (
            <>
              <div className="px-6 py-3 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm tên khu vực..."
                    className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 p-6 bg-slate-50/50 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {filteredAreas.map((area) => {
                    const isSelected = selectedAreaId === area.id.toString();

                    return (
                      <div
                        key={area.id}
                        onClick={() => {
                          if (!selectedRegion) return;
                          onSelect(selectedRegion, area);
                          onOpenChange(false);
                        }}
                        className={cn(
                          "group relative overflow-hidden p-5 rounded-2xl border-2 transition-all cursor-pointer bg-white",
                          isSelected
                            ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10 ring-1 ring-primary/20"
                            : "border-transparent hover:border-slate-200 hover:shadow-lg shadow-sm",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center transition-colors shadow-inner",
                                isSelected
                                  ? "bg-primary text-white"
                                  : "bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary",
                              )}
                            >
                              <Layers size={20} />
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 bg-primary/5 px-2 py-0.5 rounded-full">
                                  {area.code}
                                </span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {area.area} ha
                                </span>
                              </div>
                              <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {area.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <MapPin size={11} className="text-slate-300" />
                                <span>{selectedRegion?.name}</span>
                              </div>
                            </div>
                          </div>

                          <div
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                              isSelected
                                ? "bg-primary border-primary text-white scale-110"
                                : "border-slate-200 bg-white",
                            )}
                          >
                            {isSelected && <Check size={13} className="stroke-3" />}
                          </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">
                            {(area.plots || []).length} lô đất
                          </span>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] border-none font-bold",
                              area.status === "active"
                                ? "text-emerald-500 bg-emerald-50"
                                : "text-slate-400 bg-slate-50",
                            )}
                          >
                            {area.status === "active"
                              ? "Đang hoạt động"
                              : "Tạm dừng"}
                          </Badge>
                        </div>

                        <div
                          className={cn(
                            "absolute -bottom-6 -right-6 w-20 h-20 rounded-full transition-all duration-500",
                            isSelected
                              ? "bg-primary/5 scale-125"
                              : "bg-slate-50 scale-100",
                          )}
                        />
                      </div>
                    );
                  })}

                  {filteredAreas.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                        <Layers size={28} className="text-slate-300" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-600">
                        Không có khu vực nào
                      </h3>
                      <p className="text-sm mt-1 text-center max-w-48">
                        Vùng này chưa có khu vực nào được thiết lập
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MapPin size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium">
                Chọn vùng trồng để xem danh sách khu vực
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
