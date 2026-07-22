import { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  cn,
  Button,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin, Plus, Search } from "lucide-react";

interface CultivationRegionSelectorProps {
  areas: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
}

/** Build a short scope summary string from the scopes array */
function buildScopeSummary(scopes: any[]): string {
  if (!scopes || scopes.length === 0) return "Chưa thiết lập phạm vi";
  const labels = scopes
    .map((s) => {
      if (s.scopeType === "REGION" && s.region) return s.region.name;
      if (s.scopeType === "AREA" && s.area) return s.area.name;
      if (s.scopeType === "PLOT" && s.plot) return s.plot.name;
      return "";
    })
    .filter(Boolean);
  if (labels.length === 0) return "Chưa thiết lập phạm vi";
  if (labels.length === 1) return labels[0];
  return `${labels[0]} +${labels.length - 1} khác`;
}

/** Build full scope badge list for display inside dialog */
function getScopeBadges(scopes: any[]): { label: string; type: string }[] {
  if (!scopes || scopes.length === 0) return [];
  return scopes
    .map((s) => {
      if (s.scopeType === "REGION" && s.region)
        return { label: s.region.name, type: "Vùng trồng" };
      if (s.scopeType === "AREA" && s.area)
        return { label: s.area.name, type: "Khu vực" };
      if (s.scopeType === "PLOT" && s.plot)
        return { label: s.plot.name, type: "Lô" };
      return { label: "", type: "" };
    })
    .filter((b) => b.label);
}

export const CultivationRegionSelector = ({
  areas,
  selectedId,
  onSelect,
  disabled,
}: CultivationRegionSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAreas = useMemo(() => {
    const lower = searchTerm.toLowerCase();
    if (!lower) return areas;
    return areas.filter((a) => {
      const nameMatch = (a.name ?? "").toLowerCase().includes(lower);
      const codeMatch = (a.code ?? "").toLowerCase().includes(lower);
      const scopeMatch = (a.scopes ?? []).some((s: any) => {
        const n = s.region?.name || s.area?.name || s.plot?.name || "";
        return n.toLowerCase().includes(lower);
      });
      return nameMatch || codeMatch || scopeMatch;
    });
  }, [areas, searchTerm]);

  const selectedArea = areas.find((a) => String(a.id) === String(selectedId));

  return (
    <>
      <div
        className={cn(
          "group border rounded-xl p-4 transition-all hover:shadow-sm cursor-pointer",
          selectedArea
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          disabled && "opacity-60 cursor-not-allowed",
        )}
        onClick={() => !disabled && setIsOpen(true)}
      >
        {selectedArea ? (
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 text-base truncate">
                {selectedArea.name}
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {buildScopeSummary(selectedArea.scopes)}
                </span>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 group-hover:text-primary text-sm"
              >
                Thay đổi
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="w-6 h-6" />
            <div className="text-base font-medium">Chọn vùng chăn nuôi</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl">
          <DialogHeader className="border-b pb-6 w-full">
            <DialogTitle className="flex items-start gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Chọn vùng chăn nuôi
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4 w-full">
            <div className="w-full space-y-3">
              <div className="w-full relative">
                <Search className="z-10 absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  className="w-full max-w-xl pl-10 h-10 bg-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên vùng, phạm vi, mã..."
                />
              </div>
              <div className="h-80 w-full max-w-xl overflow-y-auto overflow-x-hidden pr-1">
                <div className="space-y-2 w-full overflow-hidden">
                  {filteredAreas.map((a) => {
                    const isSelected = String(a.id) === String(selectedId);
                    const badges = getScopeBadges(a.scopes);
                    return (
                      <div
                        key={a.id}
                        className={cn(
                          "flex items-start w-full min-w-0 overflow-hidden justify-between p-3 rounded-xl border cursor-pointer transition-all",
                          isSelected
                            ? "bg-primary/5 border-primary shadow-sm"
                            : "hover:bg-slate-50 bg-white border-slate-100",
                        )}
                        onClick={() => {
                          onSelect(String(a.id));
                          setIsOpen(false);
                          setSearchTerm("");
                        }}
                      >
                        <div className="flex items-start gap-3 min-w-0 w-full">
                          <div
                            className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                              isSelected
                                ? "bg-primary text-white"
                                : "bg-slate-100 text-slate-400",
                            )}
                          >
                            <Layers className="w-5 h-5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <span className="text-base font-bold text-slate-800 truncate">
                                {a.name}
                              </span>
                              {a.code && (
                                <span className="text-xs font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                  {a.code}
                                </span>
                              )}
                            </div>
                            {badges.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5">
                                {badges.map((b, i) => (
                                  <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-xs px-2 py-0.5 h-5 border-slate-200 text-slate-500 bg-slate-50 font-normal"
                                  >
                                    <MapPin className="w-3 h-3 mr-1 shrink-0" />
                                    {b.type}: {b.label}
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="text-xs text-slate-400 italic">
                                Chưa thiết lập phạm vi
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {filteredAreas.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-400 italic">
                      Không tìm thấy vùng chăn nuôi nào
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
