import { useMemo, useState } from "react";
import {
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
import type { Plot, Region, SubArea } from "../types/types";

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

interface PlotSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (region: Region, area: SubArea, plot: Plot) => void;
  enterpriseId: string;
  selectedRegionId: string;
  selectedAreaId: string;
  selectedPlotId: string;
  onRegionChange: (regionId: string) => void;
}

export const PlotSelectorDialog = ({
  open,
  onOpenChange,
  onSelect,
  enterpriseId,
  selectedRegionId,
  selectedAreaId,
  selectedPlotId,
  onRegionChange,
}: PlotSelectorDialogProps) => {
  const { regions } = useRegionStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [internalRegionId, setInternalRegionId] = useState(selectedRegionId);
  const [internalAreaId, setInternalAreaId] = useState(selectedAreaId);

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

  const filteredAreas = selectedRegion?.subAreas || [];
  const selectedArea = filteredAreas.find(
    (area) => area.id.toString() === internalAreaId,
  );
  const filteredPlots = useMemo(() => {
    if (!selectedArea) return [];
    return (selectedArea.plots || []).filter((plot) =>
      plot.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, selectedArea]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setInternalRegionId(selectedRegionId);
          setInternalAreaId(selectedAreaId);
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
            Chọn lô canh tác
          </DialogTitle>
          <p className="text-slate-500 mt-1 font-medium text-sm">
            Chọn vùng trồng, khu vực, sau đó chọn lô đất cụ thể
          </p>

          <div className="flex items-center gap-4 mt-3">
            <FilterStep
              step={1}
              label="Vùng"
              done={Boolean(internalRegionId)}
              active={!internalRegionId}
            />
            <div className="flex-1 h-px bg-slate-200" />
            <FilterStep
              step={2}
              label="Khu vực"
              done={Boolean(internalAreaId)}
              active={Boolean(internalRegionId) && !internalAreaId}
            />
            <div className="flex-1 h-px bg-slate-200" />
            <FilterStep
              step={3}
              label="Lô đất"
              done={false}
              active={Boolean(internalAreaId)}
            />
          </div>
        </DialogHeader>

        <div className="flex flex-col overflow-hidden flex-1">
          <div className="px-6 py-4 bg-white border-b grid grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Vùng trồng
              </label>
              <Select
                value={internalRegionId}
                onValueChange={(value) => {
                  setInternalRegionId(value);
                  setInternalAreaId("");
                  onRegionChange(value);
                }}
              >
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Chọn vùng..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {filteredRegions.map((region) => (
                    <SelectItem key={region.id} value={region.id.toString()}>
                      {region.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 block">
                Khu vực
              </label>
              <Select
                value={internalAreaId}
                disabled={!internalRegionId}
                onValueChange={(value) => {
                  setInternalAreaId(value);
                  setSearchTerm("");
                }}
              >
                <SelectTrigger className="h-10 rounded-xl bg-slate-50 border-slate-100">
                  <SelectValue placeholder="Chọn khu vực..." />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {filteredAreas.map((area) => (
                    <SelectItem key={area.id} value={area.id.toString()}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {internalAreaId ? (
            <>
              <div className="px-6 py-3 bg-white border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Tìm tên lô..."
                    className="pl-10 h-10 rounded-xl bg-slate-50 border-slate-100 focus:bg-white transition-all"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 p-6 bg-slate-50/50 overflow-y-auto">
                <div className="grid grid-cols-1 gap-3 pb-4">
                  {filteredPlots.map((plot) => {
                    const isSelected = selectedPlotId === plot.id;

                    return (
                      <div
                        key={plot.id}
                        onClick={() => {
                          if (!selectedRegion || !selectedArea) return;
                          onSelect(selectedRegion, selectedArea, plot);
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
                              <h4 className="font-bold text-slate-800 group-hover:text-primary transition-colors">
                                {plot.name}
                              </h4>
                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="font-bold text-slate-700">
                                  {plot.area} ha
                                </span>
                                <span>·</span>
                                <span>
                                  {selectedRegion.name} › {selectedArea.name}
                                </span>
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
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-slate-400 bg-slate-50/50">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <MapPin size={28} className="text-slate-300" />
              </div>
              <p className="text-sm font-medium">
                {!internalRegionId ? "Chọn vùng trồng" : "Chọn khu vực"} để tiếp
                tục
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
