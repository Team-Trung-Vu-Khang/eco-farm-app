import { useState } from "react";
import { useLocation } from "wouter";
import {
  AdminLayout,
  Button,
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
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CreditCard, Save, X } from "lucide-react";
import useBankStore from "../../stores/useBankStore";

import BankLogo from "./components/BankLogo";
import { BANK_LIST, BANK_LOGOS } from "./data/bank-constants";

export default function BankCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Zustand store
  const bankAccounts = useBankStore((state) => state.bankAccounts);
  const addBankAccount = useBankStore((state) => state.addBankAccount);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    status: "active" as "active" | "inactive",
    note: "",
    logo: "",
  });

  const handleBankChange = (val: string) => {
    setFormData({
      ...formData,
      bankName: val,
      logo: BANK_LOGOS[val] || "",
    });
  };

  const handleSubmit = () => {
    if (
      !formData.bankName ||
      !formData.accountNumber ||
      !formData.accountHolder
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Generate new ID
    const newId =
      bankAccounts.length > 0
        ? Math.max(...bankAccounts.map((b) => b.id)) + 1
        : 1;

    // Add to store
    addBankAccount({
      id: newId,
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolder: formData.accountHolder,
      branch: formData.branch,
      status: formData.status,
      note: formData.note,
      logo: formData.logo,
      createdAt: new Date().toISOString(),
    });

    toast({
      title: "Thành công",
      description: `Đã thêm tài khoản ngân hàng "${formData.bankName} - ${formData.accountNumber}"`,
    });
    setLocation("/bank");
  };

  return (
    <AdminLayout
      title="Thêm mới tài khoản ngân hàng"
      description="Thêm tài khoản ngân hàng mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/bank")}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin tài khoản</CardTitle>
            <CardDescription>
              Chi tiết thông tin tài khoản ngân hàng
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="bankName">Tên ngân hàng *</Label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <Select
                    value={formData.bankName}
                    onValueChange={handleBankChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn ngân hàng" />
                    </SelectTrigger>
                    <SelectContent className="max-h-56">
                      {BANK_LIST.map((bank) => (
                        <SelectItem key={bank.value} value={bank.value}>
                          {bank.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {formData.logo && (
                  <BankLogo
                    bankName={formData.bankName}
                    logo={formData.logo}
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Số tài khoản *</Label>
                <Input
                  id="accountNumber"
                  placeholder="Nhập số tài khoản"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, accountNumber: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="accountHolder">Chủ tài khoản *</Label>
                <Input
                  id="accountHolder"
                  placeholder="NHAP TEN CHU TAI KHOAN"
                  className="uppercase"
                  value={formData.accountHolder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountHolder: e.target.value.toUpperCase(),
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Chi nhánh ngân hàng</Label>
              <Input
                id="branch"
                placeholder="VD: Chi nhánh Hoàn Kiếm"
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Ghi chú</Label>
              <Textarea
                id="note"
                placeholder="Ghi chú thêm..."
                rows={3}
                value={formData.note}
                onChange={(e) =>
                  setFormData({ ...formData, note: e.target.value })
                }
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
      </div>
    </AdminLayout>
  );
}
