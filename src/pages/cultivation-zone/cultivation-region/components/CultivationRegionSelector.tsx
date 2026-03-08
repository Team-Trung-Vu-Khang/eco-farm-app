import React, { useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
  Button,
  Badge,
} from "@tankhang1/eco-shared-ui";
import { Layers, Plus, Search } from "lucide-react";

interface CultivationRegionSelectorProps {
  areas: any[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
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
    return areas.filter(
      (a) =>
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.targetName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.id.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [areas, searchTerm]);

  const selectedArea = areas.find((a) => a.id === selectedId);

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
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-slate-900 truncate">
                {selectedArea.name}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-2">
                <span className="truncate">{selectedArea.targetName}</span>
              </div>
            </div>
            {!disabled && (
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-400 group-hover:text-primary"
              >
                Thay đổi
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-2 text-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
            <Plus className="w-5 h-5" />
            <div className="text-sm font-medium">Chọn vùng canh tác</div>
          </div>
        )}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-6 w-full">
            <DialogTitle className="flex items-start gap-2">
              <Layers className="w-5 h-5 text-primary" />
              Chọn vùng canh tác
            </DialogTitle>
          </DialogHeader>

          <div className="p-4 space-y-4 w-full">
            <div className="flex flex-col w-full gap-3">
              <div className="w-full relative">
                <Search className="z-10 absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  className="w-full max-w-xl pl-10 h-10 bg-white"
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Tìm tên vùng, tên đối tượng, mã..."
                />
              </div>
              <ScrollArea className="h-80 max-w-xl">
                <div className="space-y-2 w-full">
                  {filteredAreas.map((a) => (
                    <div
                      key={a.id}
                      className={cn(
                        "flex items-center w-full max-w-xl justify-between p-3 rounded-xl border cursor-pointer transition-all",
                        selectedId === a.id
                          ? "bg-primary/5 border-primary shadow-sm"
                          : "hover:bg-slate-50 bg-white border-slate-100",
                      )}
                      onClick={() => {
                        onSelect(a.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            selectedId === a.id
                              ? "bg-primary text-white"
                              : "bg-slate-100 text-slate-400",
                          )}
                        >
                          <Layers className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">
                            {a.name}
                          </div>
                          <div className="text-[10px] text-muted-foreground truncate">
                            Đối tượng: {a.targetName}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredAreas.length === 0 && (
                    <div className="py-10 text-center text-sm text-slate-400 italic">
                      Không tìm thấy vùng canh tác nào
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
