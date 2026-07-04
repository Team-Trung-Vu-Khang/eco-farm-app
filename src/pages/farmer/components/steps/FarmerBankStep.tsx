import { vietQrBankData } from "@/constants/banks";
import { useBankDirectory } from "@/features/bank-directory/hooks/useBankDirectory";
import type { BankDirectoryItem } from "@/features/bank-directory/types/bank-directory.type";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Banknote, Check, CreditCard, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { BankAccount } from "../../types";

type BankInputMethod = "manual" | "excel" | "qr-image" | "qr-scan";

interface FarmerBankStepProps {
  bankAccounts: BankAccount[];
  newBankAccount: BankAccount;
  setNewBankAccount: (acc: BankAccount) => void;
  bankInputMethod: string;
  setBankInputMethod: (val: BankInputMethod) => void;
  hasCamera: boolean;
  bankSearchQuery: string;
  setBankSearchQuery: (val: string) => void;
  isDragging: Record<string, boolean>;
  handleDrag: (id: string, e: React.DragEvent) => void;
  processExcelFile: (file: File) => void;
  processQRImage: (file: File) => void;
  handleLiveScan: (result: Array<{ rawValue: string }> | null) => void;
  addBankAccount: () => void;
  removeBankAccount: (index: number) => void;
}

function getBankDisplayName(bank: BankDirectoryItem) {
  return bank.shortName || bank.name || "";
}

function getBankSelectionLabel(bank: BankDirectoryItem) {
  const bankName = getBankDisplayName(bank);
  return bank.bin ? `${bankName} - ${bank.bin}` : bankName;
}

function FarmerBankSelectorDialog({
  open,
  onOpenChange,
  selectedBankName,
  banks,
  loading = false,
  onSelect,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedBankName: string;
  banks: BankDirectoryItem[];
  loading?: boolean;
  onSelect: (bank: BankDirectoryItem) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedName, setTempSelectedName] = useState(selectedBankName);

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

  const selectedBank = banks.find((bank) => {
    const bankName = getBankDisplayName(bank);
    const displayName = getBankSelectionLabel(bank);
    return displayName === tempSelectedName || bankName === tempSelectedName;
  });

  const handleConfirm = () => {
    const bank = banks.find((item) => {
      const bankName = getBankDisplayName(item);
      const displayName = getBankSelectionLabel(item);
      return displayName === tempSelectedName || bankName === tempSelectedName;
    });

    if (bank) onSelect(bank);
    onOpenChange(false);
  };

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
            <span>
              {loading ? "Đang tải..." : `${filteredBanks.length} kết quả`}
            </span>
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
            {!loading &&
              filteredBanks.map((bank) => {
                const bankName = getBankDisplayName(bank);
                const displayName = getBankSelectionLabel(bank);
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
                          Mã: {bank.code}
                        </Badge>
                      </div>
                    </div>
                  </button>
                );
              })}

            {!loading && filteredBanks.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy ngân hàng phù hợp
              </div>
            )}

            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 animate-pulse text-slate-400" />
                Đang tải danh sách ngân hàng
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleConfirm}
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

export const FarmerBankStep = ({
  bankAccounts,
  newBankAccount,
  setNewBankAccount,
  bankInputMethod,
  setBankInputMethod,
  hasCamera,
  bankSearchQuery,
  setBankSearchQuery,
  isDragging,
  handleDrag,
  processExcelFile,
  processQRImage,
  handleLiveScan,
  addBankAccount,
  removeBankAccount,
}: FarmerBankStepProps) => {
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const { banks: bankDirectory, loading: bankDirectoryLoading } =
    useBankDirectory({
      initialQuery: {
        status: "active",
        page: 0,
        size: 100,
      },
      enabled: true,
    });

  void bankInputMethod;
  void setBankInputMethod;
  void hasCamera;
  void isDragging;
  void handleDrag;
  void processExcelFile;
  void processQRImage;
  void handleLiveScan;

  const selectedBanks = useMemo(() => bankAccounts, [bankAccounts]);

  const selectedBankLabel = useMemo(() => {
    if (!newBankAccount.bankName) return "Chọn ngân hàng...";
    return newBankAccount.bin
      ? `${newBankAccount.bankName} - ${newBankAccount.bin}`
      : newBankAccount.bankName;
  }, [newBankAccount.bankName, newBankAccount.bin]);

  const handleSelectBank = (bank: BankDirectoryItem) => {
    const bankName = getBankDisplayName(bank);

    setNewBankAccount({
      ...newBankAccount,
      bankId: bank.id,
      bankName,
      bin: bank.bin || "",
      logo: bank.logoUrl || "",
    });
  };

  const filteredAccounts = useMemo(() => {
    const query = bankSearchQuery.toLowerCase().trim();
    return selectedBanks
      .map((account, index) => ({ account, index }))
      .filter(({ account }) => {
        if (!query) return true;

        return [
          account.bankName,
          account.accountNumber,
          account.accountHolder,
          account.branch,
          account.note,
        ]
          .join(" ")
          .toLowerCase()
          .includes(query);
      });
  }, [bankSearchQuery, selectedBanks]);

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <Card className="overflow-hidden border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Banknote className="h-5 w-5 text-primary" />
            Thêm tài khoản ngân hàng
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Chọn ngân hàng từ danh sách hoặc nhập tay thông tin tài khoản mới.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Chọn tài khoản từ danh sách
              </Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBankDialogOpen(true)}
                  className="h-11 flex-1 justify-between border-primary/20 bg-muted/20 text-left font-normal hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="truncate">{selectedBankLabel}</span>
                  <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Button>
                {(newBankAccount.bankName || newBankAccount.accountNumber) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setNewBankAccount({
                        bankId: "",
                        bankName: "",
                        accountHolder: "",
                        accountNumber: "",
                        branch: "",
                        note: "",
                        bin: "",
                        logo: "",
                      })
                    }
                    className="h-11 px-3 text-muted-foreground"
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Chọn nhanh từ danh sách ngân hàng master data hoặc nhập mới bên dưới.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Số tài khoản <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newBankAccount.accountNumber}
                onChange={(event) =>
                  setNewBankAccount({
                    ...newBankAccount,
                    accountNumber: event.target.value,
                  })
                }
                placeholder="Nhập số tài khoản"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Chủ tài khoản <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newBankAccount.accountHolder}
                onChange={(event) =>
                  setNewBankAccount({
                    ...newBankAccount,
                    accountHolder: event.target.value.toUpperCase(),
                  })
                }
                placeholder="TÊN CHỦ TÀI KHOẢN"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Chi nhánh</Label>
              <Input
                value={newBankAccount.branch}
                onChange={(event) =>
                  setNewBankAccount({
                    ...newBankAccount,
                    branch: event.target.value,
                  })
                }
                placeholder="VD: CN Hoàn Kiếm"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label className="text-sm font-semibold">Ghi chú</Label>
              <Input
                value={newBankAccount.note}
                onChange={(event) =>
                  setNewBankAccount({
                    ...newBankAccount,
                    note: event.target.value,
                  })
                }
                placeholder="Ghi chú thêm (không bắt buộc)"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            onClick={addBankAccount}
            className="h-12 w-full bg-primary font-bold text-white hover:bg-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            Thêm vào danh sách
          </Button>
        </CardContent>
      </Card>

      <FarmerBankSelectorDialog
        open={isBankDialogOpen}
        onOpenChange={setIsBankDialogOpen}
        selectedBankName={selectedBankLabel}
        banks={bankDirectory}
        loading={bankDirectoryLoading}
        onSelect={handleSelectBank}
      />

      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h4 className="flex items-center gap-3 text-xl font-bold">
            Danh sách đã thêm
            <Badge variant="secondary" className="rounded-full px-3 py-1 text-sm">
              {selectedBanks.length}
            </Badge>
          </h4>
          {selectedBanks.length > 0 && (
            <p className="text-sm italic text-muted-foreground">
              * Nhấn vào biểu tượng thùng rác để xóa tài khoản
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {selectedBanks.length > 0 && (
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm tài khoản..."
                value={bankSearchQuery}
                onChange={(event) => setBankSearchQuery(event.target.value)}
                className="border-none bg-muted/30 pl-10 shadow-none focus-visible:ring-primary"
              />
            </div>
          )}
        </div>

        {selectedBanks.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed bg-muted/5 py-16 text-center transition-colors hover:bg-muted/10">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-muted/40">
              <CreditCard className="h-10 w-10 text-muted-foreground" />
            </div>
            <h5 className="text-lg font-bold text-muted-foreground">
              Chưa có tài khoản nào
            </h5>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground/70">
              Các tài khoản ngân hàng bạn thêm sẽ hiển thị tại đây để kiểm tra
              trước khi lưu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredAccounts.map(({ account, index }) => {
              const bankInfo = vietQrBankData.find(
                (bank) =>
                  bank.shortName === account.bankName || bank.name === account.bankName,
              );

              return (
                <Card
                  key={`${account.bankName}-${account.accountNumber}-${index}`}
                  className="group cursor-default border-primary/10 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-transform group-hover:scale-105">
                      <img
                        src={
                          account.logo ||
                          bankInfo?.logo ||
                          `https://placehold.co/56x56?text=${account.bankName?.[0] || "B"}`
                        }
                        alt={account.bankName}
                        className="h-full w-full object-contain"
                        onError={(event) => {
                          (event.target as HTMLImageElement).src =
                            "https://placehold.co/56x56?text=B";
                        }}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="truncate text-base font-bold">
                          {account.bankName}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive/10"
                          onClick={() => removeBankAccount(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="font-mono text-lg font-bold tracking-wider text-primary">
                        {account.accountNumber}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate font-medium uppercase">
                          {account.accountHolder}
                        </span>
                        {account.branch && (
                          <span className="ml-2 truncate italic">
                            CN: {account.branch}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        {account.note && (
                          <p className="line-clamp-1 text-xs text-muted-foreground">
                            {account.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
