import { useMemo, useState } from "react";
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
import { Check, Search, X } from "lucide-react";
import useBankStore, { type BankAccount as StoredBankAccount } from "@/stores/useBankStore";

interface BankSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: number | null;
  onSelect: (account: StoredBankAccount) => void;
}

export function BankSelectorDialog({
  open,
  onOpenChange,
  selectedId = null,
  onSelect,
}: BankSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState<number | null>(selectedId);
  const bankAccounts = useBankStore((state) => state.bankAccounts);

  const filteredBankAccounts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    if (!query) return bankAccounts;

    return bankAccounts.filter((account) => {
      const searchableText = [
        account.bankName,
        account.accountNumber,
        account.accountHolder,
        account.branch,
        account.note,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [bankAccounts, searchTerm]);

  const selectedAccount = bankAccounts.find((account) => account.id === tempSelectedId);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedId(selectedId);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn tài khoản ngân hàng
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm và chọn một tài khoản từ mục Quản lý tài khoản ngân hàng để điền nhanh vào form.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo ngân hàng, số tài khoản, chủ tài khoản..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredBankAccounts.length} kết quả</span>
            {selectedAccount && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedAccount.bankName}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {filteredBankAccounts.map((account) => {
              const isSelected = tempSelectedId === account.id;

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => setTempSelectedId(account.id)}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                    <img
                      src={account.logo}
                      alt={account.bankName}
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
                          {account.bankName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {account.accountHolder}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        STK: {account.accountNumber}
                      </Badge>
                      <Badge variant="secondary" className="bg-slate-100 text-slate-700">
                        {account.status === "active" ? "Hoạt động" : "Ngưng hoạt động"}
                      </Badge>
                    </div>

                    {(account.branch || account.note) && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {account.branch}
                        {account.branch && account.note ? " • " : ""}
                        {account.note}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {filteredBankAccounts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <X className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy tài khoản phù hợp
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
              const account = bankAccounts.find((item) => item.id === tempSelectedId);
              if (account) onSelect(account);
              onOpenChange(false);
            }}
            disabled={!tempSelectedId}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
