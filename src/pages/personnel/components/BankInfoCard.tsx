import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Label,
  Input,
  Combobox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard } from "lucide-react";
import { vietQrBankData } from "@/constants/banks";
import type { PersonnelFormData } from "../types";

const bankOptions = vietQrBankData.map((bank) => ({
  id: bank.id,
  bin: bank.bin,
  label: bank.name,
  image: bank.logo,
  value: bank.bin,
}));

interface BankInfoCardProps {
  formData: PersonnelFormData;
  onChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => void;
}

export function BankInfoCard({ formData, onChange }: BankInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-primary" />
          Thông tin tài khoản ngân hàng
        </CardTitle>
        <CardDescription>
          Thông tin tài khoản nhận lương/thưởng
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Ngân hàng</Label>
            <Combobox
              options={bankOptions}
              value={formData.bankName}
              onChange={(val) => onChange("bankName", val)}
              placeholder="Chọn ngân hàng..."
              searchPlaceholder="Tìm tên ngân hàng..."
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankBranch">Chi nhánh ngân hàng</Label>
            <Input
              id="bankBranch"
              placeholder="VD: CN Hoàn Kiếm"
              value={formData.bankBranch}
              onChange={(e) => onChange("bankBranch", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Số tài khoản</Label>
            <Input
              id="accountNumber"
              placeholder="Nhập số tài khoản"
              value={formData.accountNumber}
              onChange={(e) => onChange("accountNumber", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountHolder">Chủ tài khoản</Label>
            <Input
              id="accountHolder"
              placeholder="TÊN CHỦ TÀI KHOẢN"
              className="uppercase"
              value={formData.accountHolder}
              onChange={(e) => onChange("accountHolder", e.target.value.toUpperCase())}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
