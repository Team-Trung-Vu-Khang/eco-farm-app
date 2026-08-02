import { useState } from "react";
import {
  Badge,
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
import { Check, Search, Building2, User } from "lucide-react";
import { suppliers } from "../data/constants";

interface SupplierSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string | null;
  onSelect: (supplier: { id: string; name: string; type: string }) => void;
}

export function SupplierSelectorDialog({
  open,
  onOpenChange,
  selectedId = null,
  onSelect,
}: SupplierSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<string | null>(
    selectedId ? selectedId : null,
  );

  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const selectedSupplier = suppliers.find((c) => c.id === tempSelectedId);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedId(selectedId ? selectedId : null);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[80vh] max-h-[80vh] max-w-2xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600">
              <Search className="h-4 w-4" />
            </div>
            Chọn nhà cung cấp
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm kiếm và chọn một đối tác cung ứng từ hệ thống.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên nhà cung cấp..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredSuppliers.length} nhà cung cấp</span>
            {selectedSupplier && (
              <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-1 text-blue-700 font-medium">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedSupplier.name}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {filteredSuppliers.map((supplier) => {
              const isSelected = tempSelectedId === supplier.id;

              return (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => setTempSelectedId(supplier.id)}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-blue-500/30 hover:shadow-md",
                    isSelected
                      ? "border-blue-500 bg-blue-50/10 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                    {supplier.type === "enterprise" ? (
                      <Building2 className="h-5 w-5 text-slate-400" />
                    ) : (
                      <User className="h-5 w-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {supplier.name}
                        </h3>
                        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                          {supplier.type === "enterprise"
                            ? "Doanh nghiệp"
                            : "Nông hộ cá thể"}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-slate-50 p-6">
          <div className="flex w-full items-center justify-between sm:justify-end gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button
              disabled={!tempSelectedId}
              onClick={() => {
                if (selectedSupplier) {
                  onSelect(selectedSupplier);
                  onOpenChange(false);
                }
              }}
            >
              Chọn nhà cung cấp
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
