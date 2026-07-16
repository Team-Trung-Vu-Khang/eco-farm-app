import {
  BankSelectorDialog,
  type BankOption,
} from "@/features/bank/components/BankSelectorDialog";
import { useMasterData } from "@/features/master-data";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Banknote,
  CreditCard,
  PencilLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { BranchBankAccount, BranchFormData } from "../../types/types";

interface BankingStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

function getBankDisplayName(bank: BankOption) {
  return bank.shortName || bank.name;
}

export function BankingStep({ formData, updateFormData }: BankingStepProps) {
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const banksQuery = useMasterData("banks", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const bankMasterData = useMemo(() => banksQuery.items as BankOption[], [banksQuery.items]);
  const [editingBankId, setEditingBankId] = useState<string | null>(null);
  const [draftBank, setDraftBank] = useState({
    bankId: "",
    bankCode: "",
    bankName: "",
    bin: "",
    logo: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    note: "",
  });
  const [bankSearchQuery, setBankSearchQuery] = useState("");

  const selectedBanks = useMemo(
    () => formData.bankAccounts,
    [formData.bankAccounts],
  );

  const selectedDraftBankId = useMemo(() => {
    if (draftBank.bankId) return draftBank.bankId;
    const matched = bankMasterData.find(
      (bank) =>
        bank.shortName === draftBank.bankName ||
        bank.name === draftBank.bankName ||
        bank.code === draftBank.bankName,
    );
    return matched ? String(matched.id) : "";
  }, [bankMasterData, draftBank.bankId, draftBank.bankName]);

  const selectedBankLabel = useMemo(() => {
    if (!selectedDraftBankId) return "Chọn ngân hàng...";
    const bank = bankMasterData.find(
      (item) => String(item.id) === selectedDraftBankId,
    );
    return bank ? getBankDisplayName(bank) : draftBank.bankName;
  }, [bankMasterData, draftBank.bankName, selectedDraftBankId]);

  const handleSelectBank = (bank: BankOption) => {
    setDraftBank((prev) => ({
      ...prev,
      bankId: String(bank.id),
      bankCode: bank.code || "",
      bankName: bank.shortName || bank.name || "",
      bin: bank.bin || "",
      logo: bank.logoUrl || "",
    }));
  };

  const handleEditBankAccount = (account: BranchBankAccount) => {
    setEditingBankId(account.id);
    setDraftBank({
      bankId: String(account.bankId ?? ""),
      bankCode: account.bankCode,
      bankName: account.bankName,
      bin: account.bin || "",
      logo: account.logo || "",
      accountNumber: account.accountNumber,
      accountHolder: account.accountHolder,
      branch: account.branch,
      note: account.note || "",
    });
  };

  const clearDraftBank = () => {
    setEditingBankId(null);
    setDraftBank({
      bankId: "",
      bankCode: "",
      bankName: "",
      bin: "",
      logo: "",
      accountNumber: "",
      accountHolder: "",
      branch: "",
      note: "",
    });
  };

  const handleAddNewBankAccount = () => {
    if (
      !draftBank.bankId ||
      !draftBank.bankName ||
      !draftBank.accountNumber ||
      !draftBank.accountHolder
    ) {
      return;
    }

    const nextAccount: BranchBankAccount = {
      id: editingBankId || Date.now().toString(),
      bankAccountId: editingBankId
        ? formData.bankAccounts.find((item) => item.id === editingBankId)
            ?.bankAccountId
        : undefined,
      bankId: draftBank.bankId || undefined,
      bankCode: draftBank.bankCode,
      bankName: draftBank.bankName,
      accountNumber: draftBank.accountNumber,
      accountHolder: draftBank.accountHolder,
      branch: draftBank.branch,
      note: draftBank.note,
      bin: draftBank.bin,
      logo: draftBank.logo,
      isPrimary: editingBankId
        ? formData.bankAccounts.find((item) => item.id === editingBankId)
            ?.isPrimary || false
        : formData.bankAccounts.length === 0,
    };

    const nextAccounts: BranchBankAccount[] = editingBankId
      ? formData.bankAccounts.map((item) =>
          item.id === editingBankId ? nextAccount : item,
        )
      : [...formData.bankAccounts, nextAccount];

    updateFormData({ bankAccounts: nextAccounts });
    clearDraftBank();
  };

  const handleRemoveBankAccount = (id: string) => {
    const nextAccounts = formData.bankAccounts.filter((item) => item.id !== id);
    if (
      nextAccounts.length > 0 &&
      !nextAccounts.some((item) => item.isPrimary)
    ) {
      nextAccounts[0] = { ...nextAccounts[0], isPrimary: true };
    }
    if (editingBankId === id) {
      clearDraftBank();
    }
    updateFormData({ bankAccounts: nextAccounts });
  };

  const handleSetPrimaryBankAccount = (id: string) => {
    updateFormData({
      bankAccounts: formData.bankAccounts.map((item) => ({
        ...item,
        isPrimary: item.id === id,
      })),
    });
  };

  const filteredAccounts = useMemo(() => {
    const query = bankSearchQuery.toLowerCase().trim();
    if (!query) return selectedBanks;
    return selectedBanks.filter((account) => {
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
    <div className="max-w-4xl mx-auto space-y-8">
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                {(draftBank.bankName || draftBank.accountNumber) && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => clearDraftBank()}
                    className="h-11 px-3 text-muted-foreground"
                  >
                    Xóa
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Chọn nhanh một tài khoản có sẵn để tự điền các trường bên dưới
                hoặc nhập mới nếu cần.
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Số tài khoản <span className="text-red-500">*</span>
              </Label>
              <Input
                value={draftBank.accountNumber}
                onChange={(event) =>
                  setDraftBank((prev) => ({
                    ...prev,
                    accountNumber: event.target.value,
                  }))
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
                value={draftBank.accountHolder}
                onChange={(event) =>
                  setDraftBank((prev) => ({
                    ...prev,
                    accountHolder: event.target.value.toUpperCase(),
                  }))
                }
                placeholder="TÊN CHỦ TÀI KHOẢN"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Chi nhánh</Label>
              <Input
                value={draftBank.branch}
                onChange={(event) =>
                  setDraftBank((prev) => ({
                    ...prev,
                    branch: event.target.value,
                  }))
                }
                placeholder="VD: CN Hoàn Kiếm"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label className="text-sm font-semibold">Ghi chú</Label>
              <Input
                value={draftBank.note}
                onChange={(event) =>
                  setDraftBank((prev) => ({
                    ...prev,
                    note: event.target.value,
                  }))
                }
                placeholder="Ghi chú thêm (không bắt buộc)"
                className="bg-muted/30 focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button
            onClick={handleAddNewBankAccount}
            className="h-12 w-full bg-primary font-bold text-white hover:bg-primary/90"
          >
            <Plus className="mr-2 h-5 w-5" />
            {editingBankId ? "Cập nhật vào danh sách" : "Thêm vào danh sách"}
          </Button>
        </CardContent>
      </Card>

      <BankSelectorDialog
        open={isBankDialogOpen}
        onOpenChange={setIsBankDialogOpen}
        selectedAccountLabel={
          draftBank.accountNumber
            ? `${draftBank.bankName} - ${draftBank.accountNumber}`
            : draftBank.bankName
        }
        accounts={[]}
        banks={bankMasterData}
        loading={banksQuery.loading}
        defaultViewMode="bank"
        onSelect={() => undefined}
        onSelectBank={handleSelectBank}
      />

      <div className="space-y-4">
        <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
          <h4 className="flex items-center gap-3 text-xl font-bold">
            Danh sách đã thêm
            <Badge
              variant="secondary"
              className="rounded-full px-3 py-1 text-sm"
            >
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
            <p className="mt-2 text-sm text-muted-foreground/70 max-w-sm mx-auto">
              Các tài khoản ngân hàng bạn thêm sẽ hiển thị tại đây để kiểm tra
              trước khi lưu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filteredAccounts.map((account) => {
              const bankInfo = bankMasterData.find(
                (bank) =>
                  bank.shortName === account.bankName ||
                  bank.name === account.bankName ||
                  bank.code === account.bankName,
              );

              return (
                <Card
                  key={account.id}
                  className="group cursor-default border-primary/10 transition-all hover:border-primary/50 hover:shadow-md"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-transform group-hover:scale-105">
                      <img
                        src={
                          account.logo ||
                          bankInfo?.logoUrl ||
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
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground"
                            onClick={() => handleEditBankAccount(account)}
                          >
                            <PencilLine className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleRemoveBankAccount(account.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="font-mono text-lg font-bold tracking-wider text-primary">
                        {account.accountNumber}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="truncate uppercase font-medium">
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
                        {!account.isPrimary && (
                          <Button
                            variant="ghost"
                            size="sm"
                            type="button"
                            onClick={() =>
                              handleSetPrimaryBankAccount(account.id)
                            }
                            className="ml-auto h-7 px-2 text-muted-foreground hover:bg-muted/50"
                          >
                            Đặt làm chính
                          </Button>
                        )}
                      </div>
                      {editingBankId === account.id && (
                        <Badge variant="secondary" className="mt-2">
                          Đang chỉnh sửa
                        </Badge>
                      )}
                      {account.isPrimary && (
                        <Badge className="mt-2" variant="default">
                          Tài khoản chính
                        </Badge>
                      )}
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
}
