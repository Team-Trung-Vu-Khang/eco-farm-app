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
import { CheckCircle2, Search, Building2 } from "lucide-react";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";

interface EnterpriseSelectorDialogProps {
  isOpen: boolean;
  onSelect: (id: string) => void;
  selectedId?: string;
  onOpenChange: (open: boolean) => void;
}

export const EnterpriseSelectorDialog = ({
  isOpen,
  onSelect,
  selectedId = "",
  onOpenChange,
}: EnterpriseSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [tempSelectedId, setTempSelectedId] = useState<string>("");
  
  const enterprises = useEnterpriseStore((state) => state.enterprises);

  const filteredEnterprises = useMemo(() => {
    return enterprises.filter((enterprise) => {
      const matchesSearch =
        enterprise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enterprise.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType =
        selectedType === "all" || enterprise.type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [searchTerm, selectedType, enterprises]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setTempSelectedId(selectedId);
          setSearchTerm("");
          setSelectedType("all");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-green-600" />
            Chọn đơn vị nguồn gốc
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex gap-2 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 z-10" />
              <Input
                placeholder="Tìm kiếm theo tên hoặc mã đơn vị..."
                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex bg-slate-100 p-1 rounded-lg self-start">
              <Button
                variant={selectedType === "all" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("all")}
                className={cn(
                  "text-xs px-3",
                  selectedType === "all" && "bg-white text-green-700 shadow-sm hover:bg-white"
                )}
              >
                Tất cả
              </Button>
              <Button
                variant={selectedType === "enterprise" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("enterprise")}
                className={cn(
                  "text-xs px-3",
                  selectedType === "enterprise" && "bg-white text-green-700 shadow-sm hover:bg-white"
                )}
              >
                Doanh nghiệp
              </Button>
              <Button
                variant={selectedType === "farm" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("farm")}
                className={cn(
                  "text-xs px-3",
                  selectedType === "farm" && "bg-white text-green-700 shadow-sm hover:bg-white"
                )}
              >
                Trang trại
              </Button>
              <Button
                variant={selectedType === "cooperative" ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedType("cooperative")}
                className={cn(
                  "text-xs px-3",
                  selectedType === "cooperative" && "bg-white text-green-700 shadow-sm hover:bg-white"
                )}
              >
                Hợp tác xã
              </Button>
            </div>
          </div>
          <ScrollArea className="h-[400px] border border-slate-200 rounded-xl bg-slate-50/50">
            <div className="p-2 space-y-2">
              {filteredEnterprises.map((enterprise) => {
                const isSelected = tempSelectedId === String(enterprise.id);
                return (
                  <div
                    key={enterprise.id}
                    onClick={() => setTempSelectedId(String(enterprise.id))}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all bg-white hover:border-green-600/40",
                      isSelected && "bg-green-50 border-green-600",
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-900">
                          {enterprise.name}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-[10px] font-medium text-slate-600">
                          {enterprise.type === 'enterprise' ? 'Doanh nghiệp' : enterprise.type === 'farm' ? 'Trang trại' : 'Hợp tác xã'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span>Mã: {enterprise.code}</span>
                        {enterprise.taxCode && <span>MST: {enterprise.taxCode}</span>}
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                );
              })}
              {filteredEnterprises.length === 0 && (
                <div className="text-center py-12 text-sm text-slate-400 flex flex-col items-center gap-2">
                  <Building2 className="w-8 h-8 text-slate-200" />
                  Không tìm thấy đơn vị phù hợp
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            onClick={() => {
              onSelect(tempSelectedId);
              onOpenChange(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={!tempSelectedId}
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
