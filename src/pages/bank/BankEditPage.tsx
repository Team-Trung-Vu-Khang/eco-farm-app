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
import useBankStore from "../../stores/useBankStore";

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

export default function BankEditPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/bank/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  // Zustand store
  const bankAccountId = params?.id ? parseInt(params.id) : undefined;
  const getBankAccountById = useBankStore((state) => state.getBankAccountById);
  const updateBankAccount = useBankStore((state) => state.updateBankAccount);
  const deleteBankAccount = useBankStore((state) => state.deleteBankAccount);
  const bankAccount = bankAccountId
    ? getBankAccountById(bankAccountId)
    : undefined;

  const [formData, setFormData] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    branch: "",
    status: "active" as "active" | "inactive",
    note: "",
    logo: "",
  });

  // Load bank account data
  useEffect(() => {
    if (bankAccount) {
      setFormData({
        bankName: bankAccount.bankName,
        accountNumber: bankAccount.accountNumber,
        accountHolder: bankAccount.accountHolder,
        branch: bankAccount.branch,
        status: bankAccount.status,
        note: bankAccount.note,
        logo: bankAccount.logo,
      });
    }
  }, [bankAccount]);

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
      !formData.accountHolder ||
      !bankAccountId
    ) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    updateBankAccount(bankAccountId, {
      bankName: formData.bankName,
      accountNumber: formData.accountNumber,
      accountHolder: formData.accountHolder,
      branch: formData.branch,
      status: formData.status,
      note: formData.note,
      logo: formData.logo,
    });

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật tài khoản "${formData.bankName} - ${formData.accountNumber}"`,
    });
    setLocation("/bank");
  };

  const handleDelete = () => {
    if (bankAccountId) {
      deleteBankAccount(bankAccountId);
      toast({
        title: "Thành công",
        description: "Đã xóa tài khoản ngân hàng",
      });
      setLocation("/bank");
    }
  };

  // Show not found if bank account doesn't exist
  if (bankAccountId && !bankAccount) {
    return (
      <AdminLayout
        title="Không tìm thấy"
        description="Tài khoản ngân hàng không tồn tại"
      >
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy tài khoản ngân hàng
          </h2>
          <Button onClick={() => setLocation("/bank")}>
            <X className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

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
                      <SelectItem value="VPBank">VPBank</SelectItem>
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
                <Label htmlFor="status">Trạng thái</Label>
                <Select
                  value={formData.status}
                  onValueChange={(val: "active" | "inactive") =>
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
