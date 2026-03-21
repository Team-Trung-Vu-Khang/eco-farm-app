import {
  Input,
  Label,
  Badge,
  Button,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Trash2, CreditCard } from "lucide-react";
import { vietQrBankData } from "@/constants/banks";
import type { BankAccount, BranchFormData } from "../../hooks/useBranchForm";

interface BankingStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

export function BankingStep({ formData, updateFormData }: BankingStepProps) {
  const handleAddNewBankAccount = () => {
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bankName: "",
      accountNumber: "",
      accountHolder: "",
      branch: "",
      isPrimary: formData.bankAccounts.length === 0,
    };
    updateFormData({ bankAccounts: [...formData.bankAccounts, newAccount] });
  };

  const handleRemoveBankAccount = (id: string) => {
    updateFormData({
      bankAccounts: formData.bankAccounts.filter((b) => b.id !== id),
    });
  };

  const handleUpdateBankAccount = (
    id: string,
    field: keyof BankAccount,
    value: any,
  ) => {
    updateFormData({
      bankAccounts: formData.bankAccounts.map((b) =>
        b.id === id ? { ...b, [field]: value } : b,
      ),
    });
  };

  const handleSetPrimaryBankAccount = (id: string) => {
    updateFormData({
      bankAccounts: formData.bankAccounts.map((b) => ({
        ...b,
        isPrimary: b.id === id,
      })),
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <h4 className="font-semibold text-lg flex items-center justify-between">
          Danh sách tài khoản ngân hàng
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{formData.bankAccounts.length}</Badge>
            <Button onClick={handleAddNewBankAccount} className="w-full">
              <Plus className="w-4 h-4 mr-2" /> Tạo tài khoản ngân hàng mới
            </Button>
          </div>
        </h4>

        {formData.bankAccounts.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
            <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
              <CreditCard className="w-6 h-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">
              Chưa có tài khoản ngân hàng nào
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.bankAccounts.map((account, index) => (
              <div
                key={account.id}
                className="border rounded-lg p-4 bg-card shadow-sm"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">Tài khoản #{index + 1}</h4>
                    {account.isPrimary && (
                      <Badge variant="default">Tài khoản chính</Badge>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!account.isPrimary && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSetPrimaryBankAccount(account.id)}
                        type="button"
                      >
                        Đặt làm chính
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBankAccount(account.id)}
                      type="button"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Tên ngân hàng</Label>
                    <Select
                      value={account.bankName}
                      onValueChange={(val) =>
                        handleUpdateBankAccount(account.id, "bankName", val)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn ngân hàng" />
                      </SelectTrigger>
                      <SelectContent className="max-h-56">
                        {vietQrBankData.map((bank) => (
                          <SelectItem key={bank.code} value={bank.shortName}>
                            {bank.shortName} - {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Số tài khoản</Label>
                    <Input
                      value={account.accountNumber}
                      onChange={(e) =>
                        handleUpdateBankAccount(
                          account.id,
                          "accountNumber",
                          e.target.value,
                        )
                      }
                      placeholder="VD: 0123456789"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Tên chủ tài khoản</Label>
                    <Input
                      value={account.accountHolder}
                      onChange={(e) =>
                        handleUpdateBankAccount(
                          account.id,
                          "accountHolder",
                          e.target.value,
                        )
                      }
                      placeholder="VD: Chi nhánh Miền Nam - EcoFarm"
                    />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label>Chi nhánh ngân hàng</Label>
                    <Input
                      value={account.branch}
                      onChange={(e) =>
                        handleUpdateBankAccount(
                          account.id,
                          "branch",
                          e.target.value,
                        )
                      }
                      placeholder="VD: Chi nhánh Sài Gòn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
