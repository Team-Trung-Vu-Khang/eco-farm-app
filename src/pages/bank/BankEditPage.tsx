import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
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
  DeleteDialog,
} from "@tankhang1/eco-shared-ui";
import { CreditCard, Save, Trash2, X } from "lucide-react";

export default function BankEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bank/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Mock data fetching
  useEffect(() => {
    // Simulate API call using ID
    console.log("Fetching bank account", params?.id);
    setTimeout(() => {
      setFormData({
        bankName: "Vietcombank",
        accountNumber: "0011001234567",
        accountHolder: "ECOFARM CORP",
        branch: "Sở Giao Dịch",
        status: "active",
        note: "Tài khoản chính",
      });
    }, 500);
  }, []);

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    status: "active",
    note: "",
  });

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
      title: "Cập nhật thành công",
      description: `Đã cập nhật tài khoản "${formData.bankName} - ${formData.accountNumber}"`,
    });
    setLocation("/bank");
  };

  const handleDelete = () => {
    toast({
      title: "Thành công",
      description: "Đã xóa tài khoản ngân hàng",
    });
    setLocation("/bank");
  };

  return (
    <AdminLayout
      title="Cập nhật tài khoản ngân hàng"
      description="Chỉnh sửa thông tin tài khoản ngân hàng"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
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
              <Select
                value={formData.bankName}
                onValueChange={(val) =>
                  setFormData({ ...formData, bankName: val })
                }
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
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
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

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa tài khoản ${formData.bankName} - ${formData.accountNumber}?`}
      />
    </AdminLayout>
  );
}
