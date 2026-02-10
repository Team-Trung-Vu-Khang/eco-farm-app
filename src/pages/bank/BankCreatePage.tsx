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
} from "@tankhang1/eco-shared-ui";
import { CreditCard, Save, X } from "lucide-react";

const BANK_LOGOS: Record<string, string> = {
  Vietcombank:
    "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-Vietcombank.png",
  VietinBank:
    "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-VietinBank-CTG-Orientation-1.png",
  BIDV: "https://play-lh.googleusercontent.com/BGXsq66VHM-uuMxFx14aFiHMuW3f9M1VnpAyrh6lRTyKpffwHjp-XqKlt2fnvp0zqpr1",
  Agribank:
    "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-Agribank-V.png",
  MBBank:
    "https://cdn.haitrieu.com/wp-content/uploads/2022/02/Icon-MB-Bank-MBB.png",
  Techcombank:
    "https://play-lh.googleusercontent.com/Ddr3ZQEu6Vef9JV9ITALeyBEXvYwQWZ3kKJXxrdncD9JR0xlsO--J6zo7uGARfuTBmk",
  ACB: "https://cdn.haitrieu.com/wp-content/uploads/2022/01/Logo-ACB.png",
};

export default function BankCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    status: "active",
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
                    <SelectContent>
                      <SelectItem value="Vietcombank">Vietcombank</SelectItem>
                      <SelectItem value="VietinBank">VietinBank</SelectItem>
                      <SelectItem value="BIDV">BIDV</SelectItem>
                      <SelectItem value="Agribank">Agribank</SelectItem>
                      <SelectItem value="MBBank">MBBank</SelectItem>
                      <SelectItem value="Techcombank">Techcombank</SelectItem>
                      <SelectItem value="ACB">ACB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.logo && (
                  <div className="w-10 h-10 rounded-lg border bg-white flex items-center justify-center p-1 overflow-hidden shrink-0">
                    <img
                      src={formData.logo}
                      alt="Bank Logo"
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/40x40?text=" +
                          formData.bankName?.[0];
                      }}
                    />
                  </div>
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
