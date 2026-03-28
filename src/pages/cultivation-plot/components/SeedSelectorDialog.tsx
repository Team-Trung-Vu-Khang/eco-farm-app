import { useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Search, Sprout } from "lucide-react";
import useSeedStore from "../../../stores/useSeedStore";
import type { CropVariety } from "../types/types";

interface SeedSelectorDialogProps {
  isOpen: boolean;
  variety: CropVariety | null;
  onSelect: (seedIds: string[]) => void;
  selectedSeedIds?: string[];
  onOpenChange: (open: boolean) => void;
}

export const SeedSelectorDialog = ({
  isOpen,
  variety,
  onSelect,
  selectedSeedIds = [],
  onOpenChange,
}: SeedSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<string[]>([]);
  const { seeds } = useSeedStore();

  const filteredSeeds = useMemo(() => {
    if (!variety) return [];
    return seeds.filter(
      (seed) =>
        seed.varietyCode === variety.varietyCode &&
        (seed.varietyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          seed.varietyCode.toLowerCase().includes(searchTerm.toLowerCase())),
    );
  }, [searchTerm, seeds, variety]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setTempSelectedIds(selectedSeedIds);
          setSearchTerm("");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-primary" />
            Chọn hạt giống cho {variety?.varietyName}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm hạt giống..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <ScrollArea className="h-72 border rounded-xl bg-slate-50/50">
            <div className="p-2 space-y-2">
              {filteredSeeds.map((seed) => {
                const isSelected = tempSelectedIds.includes(seed.id);
                return (
                  <div
                    key={seed.id}
                    onClick={() =>
                      setTempSelectedIds((previous) =>
                        isSelected
                          ? previous.filter((id) => id !== seed.id)
                          : [...previous, seed.id],
                      )
                    }
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white hover:border-primary/40",
                      isSelected && "bg-primary/5 border-primary",
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {seed.varietyName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        {seed.varietyCode} - {seed.supplier}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              onSelect(tempSelectedIds);
              onOpenChange(false);
            }}
            className="flex-1"
            disabled={tempSelectedIds.length === 0}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
