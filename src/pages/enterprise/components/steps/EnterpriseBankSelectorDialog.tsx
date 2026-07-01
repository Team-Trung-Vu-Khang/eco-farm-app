import type { BankDirectoryItem } from "@/features/bank-directory/types/bank-directory.type";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

type EnterpriseBankSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBankName: string;
  banks: BankDirectoryItem[];
  loading?: boolean;
  onSelect: (bank: BankDirectoryItem) => void;
};

function getBankDisplayName(bank: BankDirectoryItem) {
  return bank.shortName || bank.name || "";
}

export function EnterpriseBankSelectorDialog({
  open,
  onOpenChange,
  selectedBankName,
  banks,
  loading = false,
  onSelect,
}: EnterpriseBankSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedName, setTempSelectedName] = useState(selectedBankName);

  const filteredBanks = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return banks;

    return banks.filter((bank) => {
      const searchable = [getBankDisplayName(bank), bank.code, bank.bin]
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [banks, searchTerm]);

  const selectedBank = banks.find((bank) => {
    const bankName = getBankDisplayName(bank);
    return (
      bankName === tempSelectedName ||
      `${bankName} - ${bank.bin}` === tempSelectedName
    );
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedName(selectedBankName);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-4xl flex-col overflow-hidden border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn ngân hàng
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Chọn một ngân hàng từ master data để điền nhanh thông tin vào form.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, mã hoặc BIN ngân hàng..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredBanks.length} ngân hàng</span>
            {selectedBank && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {getBankDisplayName(selectedBank)}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                Đang tải danh sách ngân hàng...
              </div>
            )}

            {filteredBanks.map((bank) => {
              const bankName = getBankDisplayName(bank);
              const displayName = `${bankName} - ${bank.bin}`;
              const isSelected =
                tempSelectedName === displayName || tempSelectedName === bankName;

              return (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setTempSelectedName(displayName)}
                  className={[
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  ].join(" ")}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                    <img
                      src={
                        bank.logoUrl ||
                        `https://placehold.co/56x56?text=${bankName?.[0] || "B"}`
                      }
                      alt={bankName}
                      className="h-full w-full object-contain"
                      onError={(event) => {
                        (event.target as HTMLImageElement).src =
                          "https://placehold.co/56x56?text=B";
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {bankName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {bank.name}
                        </p>
                      </div>
                      <div
                        className={[
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        BIN: {bank.bin}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        Mã: {bank.code}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredBanks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy ngân hàng phù hợp
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              const bank = banks.find((item) => {
                const bankName = getBankDisplayName(item);
                const displayName = `${bankName} - ${item.bin}`;
                return displayName === tempSelectedName || bankName === tempSelectedName;
              });

              if (bank) onSelect(bank);
              onOpenChange(false);
            }}
            disabled={!tempSelectedName}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
