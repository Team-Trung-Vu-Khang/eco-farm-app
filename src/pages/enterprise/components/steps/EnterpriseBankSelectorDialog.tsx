import { bankAccountApi, type BankAccountQueryParams, type BankAccountRecord } from "@/features/bank";
import { masterDataApi } from "@/features/master-data/api/master-data.api";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useInfiniteQuery } from "@tanstack/react-query";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type BankOption = {
  id: number | string;
  code?: string;
  bin?: string;
  shortName?: string;
  name?: string;
  logoUrl?: string;
};

type EnterpriseBankSelectorDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedAccountLabel: string;
  accountQueryParams?: Omit<BankAccountQueryParams, "keyword" | "page" | "size">;
  onSelect: (account: BankAccountRecord) => void;
  onSelectBank?: (bank: BankOption) => void;
};

function getBankDisplayName(account: BankAccountRecord) {
  return account.bank?.shortName || account.bank?.name || "";
}

export function EnterpriseBankSelectorDialog({
  open,
  onOpenChange,
  selectedAccountLabel,
  accountQueryParams,
  onSelect,
  onSelectBank,
}: EnterpriseBankSelectorDialogProps) {
  const workspaceId = useSelectedWorkspaceId();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"account" | "bank">("account");
  const [tempSelectedId, setTempSelectedId] = useState<number | string | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => setDebouncedSearchTerm(searchTerm.trim()),
      300,
    );
    return () => window.clearTimeout(timeoutId);
  }, [searchTerm]);

  const accountsQuery = useInfiniteQuery({
    queryKey: ["enterprise-bank-selector-accounts", accountQueryParams, debouncedSearchTerm],
    queryFn: ({ pageParam }) =>
      bankAccountApi.list(
        { ...accountQueryParams, keyword: debouncedSearchTerm || undefined, page: pageParam, size: 20 },
        workspaceId!,
      ),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: open && viewMode === "account" && workspaceId != null,
    staleTime: 5 * 60 * 1000,
  });
  const banksQuery = useInfiniteQuery({
    queryKey: ["enterprise-bank-selector-banks", debouncedSearchTerm],
    queryFn: ({ pageParam }) =>
      masterDataApi.list("banks", {
        status: "active",
        keyword: debouncedSearchTerm || undefined,
        page: pageParam,
        size: 20,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: open && viewMode === "bank",
    staleTime: 5 * 60 * 1000,
  });
  const accounts = useMemo(
    () => accountsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [accountsQuery.data],
  );
  const banks = useMemo<BankOption[]>(
    () =>
      banksQuery.data?.pages.flatMap((page) => page.content).map((bank) => ({
        id: bank.id,
        code: bank.code,
        bin: bank.bin,
        shortName: bank.shortName,
        name: bank.name,
        logoUrl: bank.logoUrl,
      })) ?? [],
    [banksQuery.data],
  );
  const isLoading =
    viewMode === "account" ? accountsQuery.isLoading : banksQuery.isLoading;
  const isFetchingNextPage =
    viewMode === "account"
      ? accountsQuery.isFetchingNextPage
      : banksQuery.isFetchingNextPage;
  const hasNextPage =
    viewMode === "account" ? accountsQuery.hasNextPage : banksQuery.hasNextPage;
  const fetchNextPage =
    viewMode === "account" ? accountsQuery.fetchNextPage : banksQuery.fetchNextPage;
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    if (
      hasNextPage &&
      !isFetchingNextPage &&
      element.scrollHeight - element.scrollTop - element.clientHeight < 160
    ) {
      fetchNextPage();
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setViewMode("account");
          const selected = accounts.find((account) => {
            const bankName = getBankDisplayName(account);
            const displayLabel = `${bankName} - ${account.accountNumber}`;
            return (
              displayLabel === selectedAccountLabel ||
              account.accountNumber === selectedAccountLabel ||
              bankName === selectedAccountLabel
            );
          });
          setTempSelectedId(selected?.id ?? null);
          setSearchTerm("");
          setDebouncedSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] w-[95vw] sm:w-full max-w-4xl flex-col overflow-hidden border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-4 py-4 sm:px-6 sm:py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn tài khoản ngân hàng
          </DialogTitle>
          <DialogDescription className="mt-1 text-sm text-muted-foreground">
            Chọn một tài khoản có sẵn để điền nhanh số tài khoản và thông tin
            chủ tài khoản.
          </DialogDescription>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-4 py-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-start gap-3 sm:gap-4">
          <div className="w-full sm:max-w-32">
            <Select
              value={viewMode}
              onValueChange={(value) => {
                setViewMode(value as "account" | "bank");
                setSearchTerm("");
                setDebouncedSearchTerm("");
                setTempSelectedId(null);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-slate-200 bg-white">
                <SelectValue placeholder="Chọn chế độ hiển thị" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="account">Danh sách account</SelectItem>
                <SelectItem value="bank">Danh sách ngân hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="relative w-full">
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

        <div className="min-h-0 flex-1 overflow-y-auto" onScroll={handleScroll}>
          <div className="grid gap-3 p-4 sm:p-6 sm:grid-cols-2">
            {isLoading && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                Đang tải danh sách tài khoản...
              </div>
            )}

            {viewMode === "account" &&
              accounts.map((account) => {
                const bankName = getBankDisplayName(account);
                const isSelected = tempSelectedId === account.id;

                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setTempSelectedId(account.id)}
                    className={[
                      "group flex w-full min-w-0 items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
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

            {viewMode === "bank" &&
              banks.map((bank) => {
                const isSelected = tempSelectedId === bank.id;
                const displayName = bank.shortName || bank.name || "";
                const accountCount = accounts.filter(
                  (account) => account.bank?.id === bank.id,
                ).length;

                return (
                  <button
                    key={bank.id}
                    type="button"
                    onClick={() => setTempSelectedId(bank.id)}
                    className={[
                      "group flex w-full min-w-0 items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                      isSelected
                        ? "border-primary/40 bg-primary/5 shadow-sm"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
                      <img
                        src={
                          bank.logoUrl ||
                          `https://placehold.co/56x56?text=${displayName?.[0] || "B"}`
                        }
                        alt={displayName}
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
                            {displayName}
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
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          BIN: {bank.bin}
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

            {viewMode === "account" && !isLoading && accounts.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy tài khoản phù hợp
              </div>
            )}

            {viewMode === "bank" && !isLoading && banks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy ngân hàng phù hợp
              </div>
            )}
            {isFetchingNextPage && (
              <div className="col-span-full py-4 text-center text-sm text-muted-foreground">
                Đang tải thêm...
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-white px-4 py-4 sm:px-6">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (viewMode === "account") {
                const account = accounts.find(
                  (item) => item.id === tempSelectedId,
                );
                if (account) onSelect(account);
              } else {
                const bank = banks.find((item) => item.id === tempSelectedId);
                if (bank && onSelectBank) {
                  onSelectBank({
                    id: bank.id,
                    code: bank.code,
                    bin: bank.bin,
                    shortName: bank.shortName,
                    name: bank.name,
                    logoUrl: bank.logoUrl,
                  });
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
