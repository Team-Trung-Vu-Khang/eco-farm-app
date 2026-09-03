import React, { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, MapPin, Search, Sprout } from "lucide-react";

export interface MockCropTreeItem {
  id: string;
  code: string;
  name: string;
  regionId: string;
  regionName: string;
  plotName: string;
  plantedDate: string;
}

export const MOCK_CROP_TREES: MockCropTreeItem[] = [
  {
    id: "tree-001",
    code: "CY-ST25-01",
    name: "Lúa ST25 — Gốc giống #01",
    regionId: "region-1",
    regionName: "Vùng Canh Tác Lúa A",
    plotName: "Lô 01 — Ruộng giống ST25",
    plantedDate: "2026-05-15",
  },
  {
    id: "tree-002",
    code: "CY-ST25-02",
    name: "Lúa ST25 — Gốc giống #02",
    regionId: "region-1",
    regionName: "Vùng Canh Tác Lúa A",
    plotName: "Lô 01 — Ruộng giống ST25",
    plantedDate: "2026-05-15",
  },
  {
    id: "tree-003",
    code: "CY-ST25-03",
    name: "Lúa ST25 — Gốc giống #03",
    regionId: "region-1",
    regionName: "Vùng Canh Tác Lúa A",
    plotName: "Lô 02 — Ruộng hữu cơ đợt 1",
    plantedDate: "2026-06-01",
  },
  {
    id: "tree-004",
    code: "CY-RAU-01",
    name: "Cải ngọt hữu cơ — Luống #01",
    regionId: "region-2",
    regionName: "Vùng Canh Tác Rau B",
    plotName: "Lô 06 — Luống cải ngọt",
    plantedDate: "2026-07-10",
  },
  {
    id: "tree-005",
    code: "CY-RAU-02",
    name: "Cải ngọt hữu cơ — Luống #02",
    regionId: "region-2",
    regionName: "Vùng Canh Tác Rau B",
    plotName: "Lô 06 — Luống cải ngọt",
    plantedDate: "2026-07-10",
  },
  {
    id: "tree-006",
    code: "CY-XA-01",
    name: "Xà lách VietGAP — Luống #01",
    regionId: "region-2",
    regionName: "Vùng Canh Tác Rau B",
    plotName: "Lô 07 — Luống xà lách",
    plantedDate: "2026-07-20",
  },
  {
    id: "tree-007",
    code: "CY-BO-01",
    name: "Cây Bơ 034 — Gốc cổ thụ #01",
    regionId: "region-3",
    regionName: "Vùng Cây Ăn Trái C",
    plotName: "Lô 10 — Vườn Bơ",
    plantedDate: "2024-03-10",
  },
  {
    id: "tree-008",
    code: "CY-BO-02",
    name: "Cây Bơ 034 — Gốc cổ thụ #02",
    regionId: "region-3",
    regionName: "Vùng Cây Ăn Trái C",
    plotName: "Lô 10 — Vườn Bơ",
    plantedDate: "2024-03-10",
  },
];

interface HarvestTreeSelectorDialogProps {
  selectedTreeIds: string[];
  onConfirm: (selectedTrees: MockCropTreeItem[]) => void;
  customTrigger?: React.ReactNode;
}

export function HarvestTreeSelectorDialog({
  selectedTreeIds,
  onConfirm,
  customTrigger,
}: HarvestTreeSelectorDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [regionQuery, setRegionQuery] = useState<string>("");
  const [filterPlantedDate, setFilterPlantedDate] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);

  const filteredTrees = useMemo(() => {
    return MOCK_CROP_TREES.filter((tree) => {
      if (regionQuery.trim()) {
        const query = regionQuery.trim().toLowerCase();
        if (!tree.regionName.toLowerCase().includes(query)) return false;
      }
      if (filterPlantedDate && tree.plantedDate !== filterPlantedDate) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchCode = tree.code.toLowerCase().includes(query);
        const matchName = tree.name.toLowerCase().includes(query);
        const matchPlot = tree.plotName.toLowerCase().includes(query);
        if (!matchCode && !matchName && !matchPlot) return false;
      }
      return true;
    });
  }, [regionQuery, filterPlantedDate, searchQuery]);

  const toggleSelectTree = (id: string) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    const allFilteredIds = filteredTrees.map((t) => t.id);
    const isAllSelected = allFilteredIds.every((id) =>
      tempSelectedIds.includes(id),
    );
    if (isAllSelected) {
      setTempSelectedIds((prev) =>
        prev.filter((id) => !allFilteredIds.includes(id)),
      );
    } else {
      setTempSelectedIds((prev) =>
        Array.from(new Set([...prev, ...allFilteredIds])),
      );
    }
  };

  const handleOpen = () => {
    setTempSelectedIds(selectedTreeIds);
    setIsOpen(true);
  };

  const handleSave = () => {
    const selectedTrees = MOCK_CROP_TREES.filter((t) =>
      tempSelectedIds.includes(t.id),
    );
    onConfirm(selectedTrees);
    setIsOpen(false);
  };

  return (
    <>
      {customTrigger ? (
        <div onClick={handleOpen}>{customTrigger}</div>
      ) : (
        <Button
          type="button"
          onClick={handleOpen}
          variant="outline"
          className="w-full h-11 border-dashed border-green-300 bg-green-50/50 hover:bg-green-100/60 text-green-700 font-bold gap-2 rounded-xl cursor-pointer"
        >
          <Sprout className="w-4 h-4 text-green-600" />
          <span>
            {selectedTreeIds.length > 0
              ? `Đã chọn ${selectedTreeIds.length} cây trồng (Nhấn để thay đổi)`
              : "Chọn danh sách cây trồng thu hoạch..."}
          </span>
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-xl border-none shadow-2xl flex flex-col h-[580px]">
          <DialogHeader className="p-4 px-5 bg-slate-50 border-b shrink-0 flex flex-row items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2 text-base font-extrabold text-slate-900">
                <Sprout className="w-5 h-5 text-green-600" />
                Chọn danh sách cây trồng thu hoạch
              </DialogTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                Tìm kiếm Vùng trồng, Ngày trồng hoặc Tìm kiếm Mã/Tên cây
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800 border-none font-bold text-xs">
              Đã chọn {tempSelectedIds.length} cây
            </Badge>
          </DialogHeader>

          {/* Search & Filter Bar */}
          <div className="p-4 bg-white border-b space-y-3 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Filter 1: Tim kiem Vung trong */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Tìm kiếm Vùng trồng
                </span>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Nhập tên Vùng trồng..."
                    value={regionQuery}
                    onChange={(e) => setRegionQuery(e.target.value)}
                    className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Filter 2: Ngay trong */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Lọc theo Ngày trồng
                </span>
                <Input
                  type="date"
                  value={filterPlantedDate}
                  onChange={(e) => setFilterPlantedDate(e.target.value)}
                  className="h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>
            </div>

            {/* Search Box & Select All */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Tìm theo Mã cây, Tên cây, Tên lô..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200 rounded-xl"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleSelectAll}
                className="h-9 px-3 text-xs font-bold shrink-0 border-slate-200 rounded-xl"
              >
                Chọn tất cả ({filteredTrees.length})
              </Button>
            </div>
          </div>

          {/* Trees List with fixed height container */}
          <ScrollArea className="flex-1 overflow-y-auto p-4">
            {filteredTrees.length > 0 ? (
              <div className="grid gap-2">
                {filteredTrees.map((tree) => {
                  const isChecked = tempSelectedIds.includes(tree.id);
                  return (
                    <div
                      key={tree.id}
                      onClick={() => toggleSelectTree(tree.id)}
                      className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                        isChecked
                          ? "bg-green-50/80 border-green-300 shadow-2xs"
                          : "bg-white border-slate-150 hover:border-slate-300 hover:bg-slate-50/50"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center transition-colors shrink-0 ${
                            isChecked
                              ? "bg-green-600 text-white"
                              : "border border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-xs truncate">
                              {tree.name}
                            </span>
                            <Badge
                              variant="outline"
                              className="text-[10px] bg-slate-50 text-slate-600 border-slate-200 shrink-0 font-bold"
                            >
                              {tree.code}
                            </Badge>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {tree.plotName} ({tree.regionName})
                            </span>
                            <span>•</span>
                            <span>Trồng ngày: {tree.plantedDate}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Sprout className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-500 font-medium text-xs">
                  Không tìm thấy cây trồng phù hợp với bộ lọc.
                </p>
              </div>
            )}
          </ScrollArea>

          {/* Footer Actions */}
          <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="rounded-xl h-10 px-5 text-xs font-bold"
            >
              Hủy
            </Button>
            <Button
              onClick={handleSave}
              className="rounded-xl h-10 px-6 text-xs font-bold bg-green-600 hover:bg-green-700 text-white"
            >
              Xác nhận ({tempSelectedIds.length} cây)
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
