import type { BankAccountRecord } from "@/features/bank";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

export type BankOption = {
  id: number | string;
  code?: string;
  bin?: string;
  shortName?: string;
  name?: string;
  logoUrl?: string;
};

type BankSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAccountLabel: string;
  accounts: BankAccountRecord[];
  banks: BankOption[];
  loading?: boolean;
  onSelect: (account: BankAccountRecord) => void;
  onSelectBank?: (bank: BankOption) => void;
};

const getAccountDisplayName = (account: BankAccountRecord) =>
  account.bank?.shortName || account.bank?.name || "";

const getBankDisplayName = (bank: BankOption) =>
  bank.shortName || bank.name || "";

const getAccountLabel = (account: BankAccountRecord) =>
  account.accountNumber
    ? `${getAccountDisplayName(account)} - ${account.accountNumber}`
    : getAccountDisplayName(account);

export function BankSelectorDialog({
  open,
  onOpenChange,
  selectedAccountLabel,
  accounts,
  banks,
  loading = false,
  onSelect,
  onSelectBank,
}: BankSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"account" | "bank">("account");
  const [tempSelectedId, setTempSelectedId] = useState<number | string | null>(
    null,
  );

  const filteredAccounts = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return accounts;

    return accounts.filter((account) => {
      const searchable = [
        getAccountDisplayName(account),
        account.accountNumber,
        account.accountHolder,
        account.branch,
        account.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [accounts, searchTerm]);

  const filteredBanks = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return banks;

    return banks.filter((bank) => {
      const searchable = [getBankDisplayName(bank), bank.code, bank.bin]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return searchable.includes(query);
    });
  }, [banks, searchTerm]);

  const selectedAccount = accounts.find(
    (account) => String(account.id) === String(tempSelectedId),
  );
  const selectedBank = banks.find(
    (bank) => String(bank.id) === String(tempSelectedId),
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setViewMode("account");
          const selected = accounts.find((account) => {
            const bankName = getAccountDisplayName(account);
            const displayLabel = getAccountLabel(account);
            return (
              displayLabel === selectedAccountLabel ||
              account.accountNumber === selectedAccountLabel ||
              bankName === selectedAccountLabel
            );
          });
          setTempSelectedId(selected?.id ?? null);
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
            Chọn tài khoản ngân hàng
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Chọn một tài khoản có sẵn hoặc chuyển sang danh sách ngân hàng.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <Select
              value={viewMode}
              onValueChange={(value) => {
                setViewMode(value as "account" | "bank");
                setSearchTerm("");
                setTempSelectedId(null);
              }}
            >
              <SelectTrigger className="h-11 max-w-32 rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Chọn chế độ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Danh sách account</SelectItem>
                <SelectItem value="bank">Danh sách ngân hàng</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder={
                  viewMode === "account"
                    ? "Tìm theo ngân hàng, số tài khoản, chủ tài khoản..."
                    : "Tìm theo tên ngân hàng, mã hoặc BIN..."
                }
                className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
              />
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{loading ? "Đang tải..." : "Sẵn sàng"}</span>
            {selectedAccount && viewMode === "account" && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {getAccountLabel(selectedAccount)}
              </span>
            )}
            {selectedBank && viewMode === "bank" && (
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
                <Search className="mb-2 h-5 w-5 animate-pulse text-slate-400" />
                Đang tải danh sách...
              </div>
            )}

            {!loading &&
              viewMode === "account" &&
              filteredAccounts.map((account) => {
                const bankName = getAccountDisplayName(account);
                const isSelected = String(account.id) === String(tempSelectedId);

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setTempSelectedId(account.id)}
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
                          account.bank?.logoUrl ||
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
                            {account.accountHolder}
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
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          STK: {account.accountNumber}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {account.status === "active"
                            ? "Hoạt động"
                            : "Ngưng hoạt động"}
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

            {!loading && viewMode === "bank" &&
              filteredBanks.map((bank) => {
                const bankName = getBankDisplayName(bank);
                const isSelected = String(bank.id) === String(tempSelectedId);
                const accountCount = accounts.filter(
                  (account) => String(account.bank?.id) === String(bank.id),
                ).length;

                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setTempSelectedId(bank.id)}
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
                            {bank.code}
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
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          BIN: {bank.bin || "-"}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {accountCount} tài khoản
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}

            {!loading &&
              viewMode === "account" &&
              filteredAccounts.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                  <Search className="mb-2 h-5 w-5 text-slate-400" />
                  Không tìm thấy tài khoản phù hợp
                </div>
              )}

            {!loading && viewMode === "bank" && filteredBanks.length === 0 && (
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
              if (viewMode === "account") {
                const account = accounts.find(
                  (item) => String(item.id) === String(tempSelectedId),
                );
                if (account) onSelect(account);
              } else {
                const bank = banks.find(
                  (item) => String(item.id) === String(tempSelectedId),
                );
                if (bank && onSelectBank) {
                  onSelectBank(bank);
                }
              }
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
