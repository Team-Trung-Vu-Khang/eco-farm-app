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
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Layers,
  Loader2,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useRegionAreas } from "@/features/farm/hooks/useRegions";
import type {
  FarmRegionResponse,
  FarmAreaResponse,
} from "@/features/farm/types/farm.type";

interface PlotLocationSelectorProps {
  regions: FarmRegionResponse[];
  enterpriseId: number | null;
  selectedRegionId: number | null;
  selectedAreaId: string | null;
  selectedAreaName?: string | null;
  onSelect: (regionId: number, areaId: string) => void;
  onSearchChange?: (value: string) => void;
  showEnterprise?: boolean;
}

// ── Sub-component: renders areas for a single expanded region ──────────────────
interface RegionAreasListProps {
  region: FarmRegionResponse;
  selectedRegionId: number | null;
  selectedAreaId: string | null;
  onPick: (regionId: number, areaId: string) => void;
}

const RegionAreasList = ({
  region,
  selectedRegionId,
  selectedAreaId,
  onPick,
}: RegionAreasListProps) => {
  const { items: areas, isLoading } = useRegionAreas(region.id, {
    params: { size: 100 },
  });

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-3 pl-2 text-xs text-slate-400">
        <Loader2 className="h-3 w-3 animate-spin" />
        Đang tải khu vực...
      </div>
    );
  }

  if (!areas || areas.length === 0) {
    return (
      <p className="py-2 pl-2 text-xs italic text-slate-400">Chưa có khu vực</p>
    );
  }

  return (
    <>
      {areas.map((area: FarmAreaResponse) => {
        const areaSelected =
          region.id === selectedRegionId &&
          String(area.id) === String(selectedAreaId);

        return (
          <div
            key={area.id}
            onClick={() => !areaSelected && onPick(region.id, String(area.id))}
            className={cn(
              "flex cursor-pointer items-center justify-between rounded-xl border-2 p-2.5 transition-all",
              areaSelected
                ? "cursor-not-allowed border-primary/40 bg-primary/10 opacity-60"
                : "border-slate-100 bg-white hover:border-primary/20 hover:bg-slate-50",
            )}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <span className="text-xs font-bold text-slate-700">
                  {area.name}
                </span>
                {area.acreage != null && (
                  <div className="text-[10px] text-slate-400">
                    {area.acreage} ha
                  </div>
                )}
              </div>
            </div>
            {areaSelected ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <Badge
                  variant="secondary"
                  className="h-4 border-none bg-primary/10 py-0 text-[9px] text-primary"
                >
                  Đã chọn
                </Badge>
              </div>
            ) : (
              <div className="flex h-4 w-4 items-center justify-center rounded border border-slate-200 transition-colors group-hover:border-primary">
                <Plus className="h-3 w-3 text-slate-300 group-hover:text-primary" />
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};

// ── Main component ─────────────────────────────────────────────────────────────
export const PlotLocationSelector = ({
  regions,
  enterpriseId,
  selectedRegionId,
  selectedAreaId,
  selectedAreaName,
  onSelect,
  onSearchChange,
  showEnterprise = false,
}: PlotLocationSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedRegions, setExpandedRegions] = useState<string[]>([]);

  const filteredRegions = useMemo(() => {
    const base = (showEnterprise && enterpriseId)
      ? regions.filter(
          (region) =>
            String(region.metadataJson?.enterpriseId || "") ===
            String(enterpriseId),
        )
      : regions;

    const normalizedQuery = searchTerm.trim().toLowerCase();
    if (!normalizedQuery) return base;

    return base.filter(
      (region) =>
        region.name?.toLowerCase().includes(normalizedQuery) ||
        region.code?.toLowerCase().includes(normalizedQuery),
    );
  }, [regions, enterpriseId, searchTerm]);

  const toggleRegion = (id: string) =>
    setExpandedRegions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );

  const handlePick = (regionId: number, areaId: string) => {
    onSelect(regionId, areaId);
    setIsOpen(false);
    setSearchTerm("");
    onSearchChange?.("");
    setExpandedRegions([]);
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="h-12 w-full cursor-pointer gap-2 rounded-lg border-2 border-dashed border-primary/20 bg-primary/5 font-bold text-primary shadow-sm transition-all hover:border-primary/40 hover:bg-primary/10 hover:shadow-md"
        variant="outline"
      >
        <Plus className="h-5 w-5" />
        {selectedAreaName
          ? selectedAreaName
          : selectedAreaId
            ? "Thay đổi vị trí"
            : "Chọn vùng trồng & khu vực"}
      </Button>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            setSearchTerm("");
            onSearchChange?.("");
            setExpandedRegions([]);
          }
        }}
      >
        <DialogContent className="flex max-h-[90vh] max-w-xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
          <DialogHeader className="shrink-0 border-b bg-slate-50 p-6">
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Chọn vùng trồng & khu vực
            </DialogTitle>
            <p className="mt-1 text-xs text-muted-foreground">
              Mở rộng vùng trồng để xem và chọn khu vực
            </p>
          </DialogHeader>

          <div className="shrink-0 border-b bg-white px-6 pb-5 pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 z-10 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm vùng trồng..."
                className="rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
                value={searchTerm}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearchTerm(value);
                  onSearchChange?.(value);
                }}
              />
            </div>
          </div>

          <ScrollArea className="flex-1 overflow-y-auto">
            <div className="space-y-4 p-6">
              {filteredRegions.map((region) => (
                <div key={region.id} className="space-y-2">
                  {/* Region row */}
                  <div className="group flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleRegion(region.id.toString())}
                      className="rounded p-1 transition-colors hover:bg-slate-100"
                    >
                      {expandedRegions.includes(region.id.toString()) ? (
                        <ChevronDown className="h-4 w-4 text-slate-400" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      )}
                    </button>
                    <div
                      onClick={() => toggleRegion(region.id.toString())}
                      className="flex flex-1 cursor-pointer items-center justify-between rounded-xl border-2 border-slate-100 bg-white p-3 transition-all hover:border-primary/20 hover:bg-slate-50"
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
                      {region.id === selectedRegionId && (
                        <Badge
                          variant="secondary"
                          className="border-none bg-primary/10 text-[9px] text-primary"
                        >
                          Đang chọn
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Areas list — only fetched when region is expanded */}
                  {expandedRegions.includes(region.id.toString()) && (
                    <div className="ml-6 space-y-2 border-l-2 border-slate-100 py-1 pl-4">
                      <RegionAreasList
                        region={region}
                        selectedRegionId={selectedRegionId}
                        selectedAreaId={selectedAreaId}
                        onPick={handlePick}
                      />
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
                    Không tìm thấy dữ liệu phù hợp
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex shrink-0 justify-end gap-3 border-t bg-slate-50 p-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Hủy
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
