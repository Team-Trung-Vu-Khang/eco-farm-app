import type { BankAccountStatus } from "@/features/bank";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard } from "lucide-react";
import type { BankFormData } from "../types/types";
import BankLogo from "./BankLogo";

type BankOption = {
  id: number | string;
  shortName?: string;
  name?: string;
  logoUrl?: string;
};

interface BankFormCardProps {
  formData: BankFormData;
  banks: BankOption[];
  showStatusField?: boolean;
  onBankChange: (value: string) => void;
  onFieldChange: <K extends keyof BankFormData>(
    key: K,
    value: BankFormData[K],
  ) => void;
}

export function BankFormCard({
  formData,
  banks,
  showStatusField = false,
  onBankChange,
  onFieldChange,
}: BankFormCardProps) {
  const selectedBank = banks.find(
    (bank) => String(bank.id) === String(formData.bankId),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin tài khoản</CardTitle>
        <CardDescription>
          Chi tiết thông tin tài khoản ngân hàng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="bankName" required>
            Tên ngân hàng
          </Label>
          <div className="flex gap-3">
            <div className="flex-1">
              <Select
                value={String(formData.bankId || "")}
                onValueChange={onBankChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn ngân hàng" />
                </SelectTrigger>
                <SelectContent className="max-h-56">
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={String(bank.id)}>
                      {bank.shortName || bank.name || ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.logo && (
              <BankLogo
                bankName={
                  selectedBank?.shortName ||
                  selectedBank?.name ||
                  formData.bankName
                }
                logo={formData.logo}
                className="rounded-lg"
              />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber" required>
              Số tài khoản
            </Label>
            <Input
              id="accountNumber"
              placeholder="Nhập số tài khoản"
              value={formData.accountNumber}
              onChange={(event) =>
                onFieldChange("accountNumber", event.target.value)
              }
            />
          </div>
          {showStatusField ? (
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  onFieldChange("status", value as BankAccountStatus)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngừng hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="accountHolder">Chủ tài khoản *</Label>
              <Input
                id="accountHolder"
                placeholder="NHAP TEN CHU TAI KHOAN"
                className="uppercase"
                value={formData.accountHolder}
                onChange={(event) =>
                  onFieldChange(
                    "accountHolder",
                    event.target.value.toUpperCase(),
                  )
                }
              />
            </div>
          )}
        </div>

        {showStatusField ? (
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Chủ tài khoản *</Label>
            <Input
              id="accountHolder"
              placeholder="NHAP TEN CHU TAI KHOAN"
              className="uppercase"
              value={formData.accountHolder}
              onChange={(event) =>
                onFieldChange("accountHolder", event.target.value.toUpperCase())
              }
            />
          </div>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="branch">Chi nhánh ngân hàng</Label>
          <Input
            id="branch"
            placeholder="VD: Chi nhánh Hoàn Kiếm"
            value={formData.branch}
            onChange={(event) => onFieldChange("branch", event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea
            id="note"
            placeholder="Ghi chú thêm..."
            rows={3}
            value={formData.note}
            onChange={(event) => onFieldChange("note", event.target.value)}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm border border-blue-200 mt-2">
          <CreditCard className="w-5 h-5 shrink-0" />
          <p>
            Vui lòng kiểm tra kỹ thông tin số tài khoản và chủ tài khoản để
            tránh sai sót trong quá trình giao dịch.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
