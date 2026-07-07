import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, MapPin, Plus, Search, X } from "lucide-react";
import type { FarmRegionResponse } from "@/features/farm/types/farm.type";

interface SelectedRegionCardProps {
  regionId: string;
  regions: FarmRegionResponse[];
  onRemove: () => void;
}

export function SelectedRegionCard({
  regionId,
  regions,
  onRemove,
}: SelectedRegionCardProps) {
  const region = regions.find((item) => item.id.toString() === regionId);
  if (!region) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-bottom-2 fade-in overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm duration-300">
      <div className="flex items-center gap-4 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
          <MapPin className="h-6 w-6 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 flex items-center gap-2">
            <span className="rounded bg-primary/5 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              Vùng trồng
            </span>
            <span className="text-[10px] font-medium text-slate-400">
              #{region.code}
            </span>
          </div>
          <h4 className="truncate font-bold leading-tight text-slate-800">
            {region.name}
          </h4>
          <p className="mt-0.5 truncate text-[11px] italic text-slate-500">
            {region.address}, {region.ward}, {region.district},{" "}
            {region.province}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 rounded-full text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

interface RegionSelectorProps {
  regions: FarmRegionResponse[];
  enterpriseId: number | null;
  onSelect: (id: string) => void;
  selectedId?: string;
  showEnterprise?: boolean;
}

export function AreaRegionSelector({
  regions,
  enterpriseId,
  onSelect,
  selectedId,
  showEnterprise = false,
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredRegions = useMemo(
    () =>
      regions.filter(
        (region) =>
          (!showEnterprise ||
            !enterpriseId ||
            String(region.metadataJson?.enterpriseId) ===
              String(enterpriseId)) &&
          (region.name || "").toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    [enterpriseId, showEnterprise, regions, searchTerm],
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        disabled={showEnterprise && !enterpriseId}
        className="h-12 w-full cursor-pointer gap-2 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 font-bold text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
        variant="outline"
      >
        <Plus className="h-5 w-5" />
        Chọn vùng trồng
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchTerm("");
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
          <DialogHeader className="shrink-0 border-b bg-slate-50 p-6">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Chọn vùng trồng
            </DialogTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Phần khu vực đang tạo sẽ thuộc về vùng trồng được chọn
            </p>
          </DialogHeader>

          <div className="shrink-0 border-b bg-white px-6 pb-5">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 z-10 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm vùng trồng..."
                className="rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-6">
              {filteredRegions.map((region) => (
                <div
                  key={region.id}
                  onClick={() => {
                    onSelect(region.id.toString());
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex cursor-pointer items-center justify-between rounded-xl border-2 p-3 transition-all",
                    selectedId === region.id.toString()
                      ? "border-primary/40 bg-primary/10"
                      : "border-slate-100 bg-white hover:border-primary/20 hover:bg-slate-50",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-800">
                        {region.name}
                      </div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Vùng trồng
                      </div>
                    </div>
                  </div>

                  {selectedId === region.id.toString() ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <Badge
                        variant="secondary"
                        className="border-none bg-primary/10 text-[10px] text-primary"
                      >
                        Đã chọn
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex h-5 w-5 items-center justify-center rounded border-2 border-slate-200 transition-colors group-hover:border-primary">
                      <Plus className="h-3.5 w-3.5 text-slate-300" />
                    </div>
                  )}
                </div>
              ))}

              {filteredRegions.length === 0 && (
                <div className="py-12 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-slate-100 bg-slate-50">
                    <Search className="h-6 w-6 text-slate-300" />
                  </div>
                  <div className="text-sm font-medium text-slate-500">
                    Không tìm thấy vùng trồng nào
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
