import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus, Search, Trash2 } from "lucide-react";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";
import type { BankAccount } from "../../data/constants";

type EnterpriseBankAccountFormCardProps = {
  bankLabel: string;
  account: BankAccount;
  onChange: (updates: Partial<BankAccount>) => void;
  onPickBank: () => void;
  onClearBank: () => void;
  onAdd: () => void;
};

export function EnterpriseBankAccountFormCard({
  bankLabel,
  account,
  onChange,
  onPickBank,
  onClearBank,
  onAdd,
}: EnterpriseBankAccountFormCardProps) {
  const { isSubmitting } = useEnterpriseFormContext();
  const hasBankSelected = Boolean(
    account.bankName || account.bin || account.logo,
  );

  return (
    <Card className="overflow-hidden border-primary/20 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg font-medium">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Search className="h-4 w-4" />
          </div>
          Thêm tài khoản ngân hàng
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Chọn một tài khoản có sẵn hoặc nhập thông tin tài khoản bên dưới.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Tài khoản đã có</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onPickBank}
                disabled={isSubmitting}
                className="h-11 flex-1 justify-between border-primary/20 bg-muted/20 text-left font-normal hover:border-primary/40 hover:bg-primary/5"
              >
                <span className="truncate">{bankLabel}</span>
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              </Button>

              {hasBankSelected && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClearBank}
                  disabled={isSubmitting}
                  className="h-11 px-3 text-muted-foreground"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Xóa
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Chọn một tài khoản từ danh sách có sẵn để điền nhanh.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold" required>
              Số tài khoản
            </Label>
            <Input
              value={account.accountNumber}
              onChange={(event) =>
                onChange({ accountNumber: event.target.value })
              }
              placeholder="Nhập số tài khoản"
              className="bg-muted/30 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold" required>
              Chủ tài khoản
            </Label>
            <Input
              value={account.accountHolder}
              onChange={(event) =>
                onChange({ accountHolder: event.target.value.toUpperCase() })
              }
              placeholder="TÊN CHỦ TÀI KHOẢN"
              className="bg-muted/30 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Chi nhánh</Label>
            <Input
              value={account.branch}
              onChange={(event) => onChange({ branch: event.target.value })}
              placeholder="VD: CN Hoàn Kiếm"
              className="bg-muted/30 focus-visible:ring-primary"
            />
          </div>

          <div className="md:col-span-2 space-y-2">
            <Label className="text-sm font-semibold">Ghi chú</Label>
            <Input
              value={account.note}
              onChange={(event) => onChange({ note: event.target.value })}
              placeholder="Ghi chú thêm (không bắt buộc)"
              className="bg-muted/30 focus-visible:ring-primary"
            />
          </div>
        </div>

        <Button
          disabled={isSubmitting}
          onClick={onAdd}
          className="h-12 w-full bg-primary font-bold text-white hover:bg-primary/90"
        >
          <Plus className="mr-2 h-5 w-5" />
          Thêm vào danh sách
        </Button>
      </CardContent>
    </Card>
  );
}
