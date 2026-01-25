import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Building2,
  User,
  MapPin,
  Upload,
  FileText,
  Image,
  Check,
  Users,
  Plus,
  Trash2,
  CreditCard,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@tankhang1/eco-shared-ui";
import { StepperForm, type Step } from "@tankhang1/eco-shared-ui";
import { RadioGroup, RadioGroupItem } from "@tankhang1/eco-shared-ui";
import { Input } from "@tankhang1/eco-shared-ui";
import { Label } from "@tankhang1/eco-shared-ui";
import { Textarea } from "@tankhang1/eco-shared-ui";
import { Button } from "@tankhang1/eco-shared-ui";
import { Badge } from "@tankhang1/eco-shared-ui";
import { AdminLayout } from "@tankhang1/eco-shared-ui";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tankhang1/eco-shared-ui";

interface Branch {
  name: string;
  taxCode: string;
  phone: string;
  taxAddress: string;
  email: string;
  address: string;
  note: string;
}

interface BankAccount {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  branch: string;
  note: string;
}

export default function EnterpriseEditPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Mock data fetching
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFormData({
        type: "enterprise",
        code: "DN2024001",
        name: "Công ty Cổ phần Nông nghiệp Xanh EcoFarm",
        brandName: "EcoFarm Vietnam",
        taxCode: "0101234567",
        taxAddress: "Tầng 5, Tòa nhà ABC, Cầu Giấy, Hà Nội",
        classification: "production",
        foundedDate: "2020-03-15",
        representative: "Nguyễn Văn Giám Đốc",
        phone: "02438888999",
        email: "contact@ecofarm.vn",
        website: "https://ecofarm.vn",
        province: "hn",
        district: "cau_giay",
        ward: "dich_vong",
        address: "Số 123 Đường Xuân Thủy",
        image:
          "https://images.unsplash.com/photo-1595839019623-668b555776a3?w=800&q=80",
        description:
          "Doanh nghiệp tiên phong trong lĩnh vực nông nghiệp công nghệ cao, chuyên sản xuất và cung ứng rau sạch chuẩn VietGAP.",
        branches: [
          {
            name: "Chi nhánh Miền Nam",
            taxCode: "0101234567-001",
            phone: "02839999888",
            taxAddress: "Quận 1, TP.HCM",
            email: "hcm@ecofarm.vn",
            address: "Số 456 Nguyễn Thị Minh Khai, Q1",
            note: "Văn phòng đại diện phía Nam",
          },
        ],
        bankAccounts: [
          {
            bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
            accountHolder: "ECOFARM CORP",
            accountNumber: "0011001234567",
            branch: "Sở Giao Dịch",
            note: "Tài khoản chính",
          },
        ],
        documents: [
          { name: "giay_phep_kd.pdf", type: "application/pdf", size: "2.5MB" },
        ],
      });
    }, 500);
  }, []);

  const [formData, setFormData] = useState({
    type: "enterprise" as "enterprise" | "farm" | "cooperative",
    code: "",
    name: "",
    brandName: "",
    taxCode: "",
    taxAddress: "",
    classification: "production",
    foundedDate: "",
    representative: "",
    phone: "",
    email: "",
    website: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    image: "",
    description: "",
    branches: [] as Branch[],
    bankAccounts: [] as BankAccount[],
    documents: [] as { name: string; type: string; size: string }[],
  });

  const [newBankAccount, setNewBankAccount] = useState<BankAccount>({
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branch: "",
    note: "",
  });

  const [newBranch, setNewBranch] = useState<Branch>({
    name: "",
    taxCode: "",
    phone: "",
    taxAddress: "",
    email: "",
    address: "",
    note: "",
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, image: url }));
    }
  };

  const addBranch = () => {
    if (newBranch.name.trim()) {
      setFormData({
        ...formData,
        branches: [...formData.branches, newBranch],
      });
      setNewBranch({
        name: "",
        taxCode: "",
        phone: "",
        taxAddress: "",
        email: "",
        address: "",
        note: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Tên chi nhánh không được để trống",
        variant: "destructive",
      });
    }
  };

  const removeBranch = (index: number) => {
    setFormData({
      ...formData,
      branches: formData.branches.filter((_, i) => i !== index),
    });
  };

  const addBankAccount = () => {
    if (newBankAccount.bankName && newBankAccount.accountNumber) {
      setFormData({
        ...formData,
        bankAccounts: [...formData.bankAccounts, newBankAccount],
      });
      setNewBankAccount({
        bankName: "",
        accountHolder: "",
        accountNumber: "",
        branch: "",
        note: "",
      });
    } else {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập tên ngân hàng và số tài khoản",
        variant: "destructive",
      });
    }
  };

  const removeBankAccount = (index: number) => {
    setFormData({
      ...formData,
      bankAccounts: formData.bankAccounts.filter((_, i) => i !== index),
    });
  };

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleComplete = () => {
    setShowConfirmDialog(true);
  };

  const submitForm = () => {
    setShowConfirmDialog(false);
    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin ${
        formData.type === "enterprise"
          ? "doanh nghiệp"
          : formData.type === "cooperative"
            ? "hợp tác xã"
            : "nông hộ"
      } "${formData.name}"`,
    });
    setLocation("/enterprise");
  };

  const steps: Step[] = [
    {
      id: "type",
      title: "Loại hình",
      description: "Loại hình tổ chức",
      content: (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-display font-bold">
              Loại hình tổ chức
            </h2>
            <p className="text-muted-foreground mt-1">
              Loại hình hiện tại của đơn vị
            </p>
          </div>
          {/* Disable type change in edit mode usually, or keep it enable based on requirement. 
              Here I'll disable it to show 'Edit' context difference } */}
          <RadioGroup
            disabled
            value={formData.type}
            onValueChange={(value: "enterprise" | "farm" | "cooperative") =>
              setFormData({ ...formData, type: value })
            }
            className="grid grid-cols-1 md:grid-cols-3 gap-4 opacity-80"
          >
            <Label
              htmlFor="enterprise"
              className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${
                formData.type === "enterprise"
                  ? "border-primary bg-primary/5 cursor-default"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <RadioGroupItem
                value="enterprise"
                id="enterprise"
                className="sr-only"
              />
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Doanh nghiệp</p>
                <p className="text-sm text-muted-foreground">Công ty lớn</p>
              </div>
              {formData.type === "enterprise" && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </Label>

            <Label
              htmlFor="cooperative"
              className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${
                formData.type === "cooperative"
                  ? "border-primary bg-primary/5 cursor-default"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <RadioGroupItem
                value="cooperative"
                id="cooperative"
                className="sr-only"
              />
              <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center">
                <Users className="w-8 h-8 text-orange-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Hợp tác xã</p>
                <p className="text-sm text-muted-foreground">HTX, tổ hợp tác</p>
              </div>
              {formData.type === "cooperative" && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </Label>

            <Label
              htmlFor="farm"
              className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 transition-all ${
                formData.type === "farm"
                  ? "border-primary bg-primary/5 cursor-default"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <RadioGroupItem value="farm" id="farm" className="sr-only" />
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Nông hộ</p>
                <p className="text-sm text-muted-foreground">
                  Hộ gia đình, cá nhân
                </p>
              </div>
              {formData.type === "farm" && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </Label>
          </RadioGroup>
          <p className="text-center text-sm text-muted-foreground italic">
            * Loại hình tổ chức không thể thay đổi sau khi tạo
          </p>
        </div>
      ),
    },
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, thương hiệu, mã, thuế",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col items-center gap-4 mb-6">
            <Label>Logo / Hình ảnh đại diện</Label>
            <div className="flex items-center gap-6 w-full">
              <div
                className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 overflow-hidden relative cursor-pointer hover:border-primary transition-colors group"
                onClick={() =>
                  document.getElementById("avatar-edit-upload")?.click()
                }
              >
                {formData.image ? (
                  <>
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Image className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                    <span className="text-xs text-gray-500">Upload</span>
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-2">
                <Input
                  id="avatar-edit-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <div className="text-sm text-muted-foreground">
                  <p>Tải lên logo hoặc hình ảnh đại diện của đơn vị.</p>
                  <p>Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document.getElementById("avatar-edit-upload")?.click()
                  }
                  type="button"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Thay đổi hình ảnh
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">Mã đơn vị *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder="VD: DN001, HTX001..."
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="classification">Phân loại</Label>
              <Select
                value={formData.classification}
                onValueChange={(val) =>
                  setFormData({ ...formData, classification: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phân loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="production">Sản xuất</SelectItem>
                  <SelectItem value="processing">Chế biến</SelectItem>
                  <SelectItem value="trading">Thương mại</SelectItem>
                  <SelectItem value="service">Dịch vụ</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Tên đầy đủ *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="VD: Công ty TNHH ABC..."
              data-testid="input-name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brandName">Tên thương hiệu</Label>
            <Input
              id="brandName"
              value={formData.brandName}
              onChange={(e) =>
                setFormData({ ...formData, brandName: e.target.value })
              }
              placeholder="VD: EcoFarm..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) =>
                  setFormData({ ...formData, taxCode: e.target.value })
                }
                placeholder="Nhập mã số thuế"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
              <Input
                id="taxAddress"
                value={formData.taxAddress}
                onChange={(e) =>
                  setFormData({ ...formData, taxAddress: e.target.value })
                }
                placeholder="Địa chỉ đăng ký thuế"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="representative">Người đại diện *</Label>
              <Input
                id="representative"
                value={formData.representative}
                onChange={(e) =>
                  setFormData({ ...formData, representative: e.target.value })
                }
                placeholder="Họ và tên"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="foundedDate">Ngày thành lập</Label>
              <Input
                id="foundedDate"
                type="date"
                value={formData.foundedDate}
                onChange={(e) =>
                  setFormData({ ...formData, foundedDate: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Giới thiệu về doanh nghiệp/nông hộ"
              rows={3}
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contact",
      title: "Liên hệ",
      description: "Điện thoại, email, địa chỉ",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="0901234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="contact@example.com"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
              placeholder="https://example.com"
            />
          </div>
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Địa chỉ trụ sở</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                <Select
                  value={formData.province}
                  onValueChange={(val) =>
                    setFormData({ ...formData, province: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Tỉnh/Thành" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hcm">TP. Hồ Chí Minh</SelectItem>
                    <SelectItem value="hn">Hà Nội</SelectItem>
                    <SelectItem value="dn">Đà Nẵng</SelectItem>
                    <SelectItem value="bd">Bình Dương</SelectItem>
                    <SelectItem value="la">Long An</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện *</Label>
                <Select
                  value={formData.district}
                  onValueChange={(val) =>
                    setFormData({ ...formData, district: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Quận/Huyện" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1">Quận 1</SelectItem>
                    <SelectItem value="q3">Quận 3</SelectItem>
                    <SelectItem value="cu_chi">Củ Chi</SelectItem>
                    <SelectItem value="thu_duc">Thủ Đức</SelectItem>
                    <SelectItem value="cau_giay">Cầu Giấy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Select
                  value={formData.ward}
                  onValueChange={(val) =>
                    setFormData({ ...formData, ward: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Phường/Xã" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="p1">Phường 1</SelectItem>
                    <SelectItem value="p2">Phường 2</SelectItem>
                    <SelectItem value="tan_phu">Tân Phú</SelectItem>
                    <SelectItem value="tan_phong">Tân Phong</SelectItem>
                    <SelectItem value="dich_vong">Dịch Vọng</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2 mt-4">
              <Label htmlFor="address">Địa chỉ chi tiết</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                placeholder="Số nhà, đường, ấp..."
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.phone.length > 0 && formData.email.length > 0,
    },
    {
      id: "branches",
      title: "Chi nhánh",
      description: "Quản lý chi nhánh",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                Quản lý chi nhánh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="select">Chọn từ danh sách</TabsTrigger>
                  <TabsTrigger value="create">Tạo mới</TabsTrigger>
                </TabsList>

                <TabsContent value="select" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chọn chi nhánh có sẵn</Label>
                    <Select
                      onValueChange={(val) => {
                        const selected = [
                          {
                            name: "Chi nhánh Miền Bắc",
                            taxCode: "0101234567-001",
                            phone: "02412345678",
                            email: "bac@enterprise.com",
                            address: "Hoàn Kiếm, Hà Nội",
                            taxAddress: "Hoàn Kiếm, Hà Nội",
                            note: "Văn phòng đại diện",
                          },
                          {
                            name: "Chi nhánh Miền Trung",
                            taxCode: "0101234567-002",
                            phone: "02361234567",
                            email: "trung@enterprise.com",
                            address: "Hải Châu, Đà Nẵng",
                            taxAddress: "Hải Châu, Đà Nẵng",
                            note: "Kho vận",
                          },
                        ].find((b) => b.name === val);
                        if (selected) {
                          setNewBranch(selected);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chi nhánh..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Chi nhánh Miền Bắc">
                          Chi nhánh Miền Bắc
                        </SelectItem>
                        <SelectItem value="Chi nhánh Miền Trung">
                          Chi nhánh Miền Trung
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newBranch.name && (
                    <div className="bg-muted/50 p-4 rounded-lg border text-sm space-y-2">
                      <p>
                        <strong>Mã số thuế:</strong> {newBranch.taxCode}
                      </p>
                      <p>
                        <strong>Địa chỉ:</strong> {newBranch.address}
                      </p>
                      <Button onClick={addBranch} className="w-full mt-2">
                        Thêm chi nhánh này
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tên chi nhánh *</Label>
                      <Input
                        value={newBranch.name}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, name: e.target.value })
                        }
                        placeholder="Nhập tên chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Mã số thuế</Label>
                      <Input
                        value={newBranch.taxCode}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            taxCode: e.target.value,
                          })
                        }
                        placeholder="MST chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Số điện thoại</Label>
                      <Input
                        value={newBranch.phone}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, phone: e.target.value })
                        }
                        placeholder="SĐT chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        value={newBranch.email}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, email: e.target.value })
                        }
                        placeholder="Email chi nhánh"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ thuế</Label>
                      <Input
                        value={newBranch.taxAddress}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            taxAddress: e.target.value,
                          })
                        }
                        placeholder="Địa chỉ đăng ký thuế"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Địa chỉ chi nhánh</Label>
                      <Input
                        value={newBranch.address}
                        onChange={(e) =>
                          setNewBranch({
                            ...newBranch,
                            address: e.target.value,
                          })
                        }
                        placeholder="Địa chỉ hoạt động"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Ghi chú</Label>
                      <Textarea
                        value={newBranch.note}
                        onChange={(e) =>
                          setNewBranch({ ...newBranch, note: e.target.value })
                        }
                        placeholder="Ghi chú thêm..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button onClick={addBranch} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm chi nhánh mới
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách chi nhánh
              <Badge variant="secondary">{formData.branches.length}</Badge>
            </h4>

            {formData.branches.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <Building2 className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có chi nhánh nào được thêm
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vui lòng thêm chi nhánh từ form bên trên
                </p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Tên chi nhánh
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Mã số thuế
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Liên hệ
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Địa chỉ
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.branches.map((branch, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">{branch.name}</td>
                        <td className="py-3 px-4">{branch.taxCode || "-"}</td>
                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs">{branch.phone}</span>
                            <span className="text-xs text-muted-foreground">
                              {branch.email}
                            </span>
                          </div>
                        </td>
                        <td
                          className="py-3 px-4 max-w-[200px] truncate"
                          title={branch.address}
                        >
                          {branch.address || "-"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeBranch(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "bank",
      title: "Ngân hàng",
      description: "Tài khoản thanh toán",
      content: (
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-medium flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Quản lý tài khoản ngân hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="create" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="select">Chọn từ danh sách</TabsTrigger>
                  <TabsTrigger value="create">Tạo mới</TabsTrigger>
                </TabsList>

                <TabsContent value="select" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Chọn tài khoản mẫu</Label>
                    <Select
                      onValueChange={(val) => {
                        const selected = [
                          {
                            bankName:
                              "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
                            accountHolder: "ECOFARM CORP",
                            accountNumber: "0011001234567",
                            branch: "Sở Giao Dịch",
                            note: "Tài khoản chính",
                          },
                          {
                            bankName: "Ngân hàng TMCP Quân Đội (MBBank)",
                            accountHolder: "NGUYEN VAN A",
                            accountNumber: "88889999",
                            branch: "Hoàn Kiếm",
                            note: "Tài khoản cá nhân",
                          },
                        ].find((b) => b.bankName === val);
                        if (selected) {
                          setNewBankAccount(selected);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tài khoản..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)">
                          Vietcombank - ECOFARM CORP
                        </SelectItem>
                        <SelectItem value="Ngân hàng TMCP Quân Đội (MBBank)">
                          MBBank - NGUYEN VAN A
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newBankAccount.bankName && (
                    <div className="bg-muted/50 p-4 rounded-lg border text-sm space-y-2">
                      <p>
                        <strong>Số tài khoản:</strong>{" "}
                        {newBankAccount.accountNumber}
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong>{" "}
                        {newBankAccount.accountHolder}
                      </p>
                      <Button onClick={addBankAccount} className="w-full mt-2">
                        Thêm tài khoản này
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="create" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label>Ngân hàng *</Label>
                      <Select
                        value={newBankAccount.bankName}
                        onValueChange={(val) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            bankName: val,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngân hàng" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Vietcombank">
                            Vietcombank
                          </SelectItem>
                          <SelectItem value="VietinBank">VietinBank</SelectItem>
                          <SelectItem value="BIDV">BIDV</SelectItem>
                          <SelectItem value="Agribank">Agribank</SelectItem>
                          <SelectItem value="MBBank">MBBank</SelectItem>
                          <SelectItem value="Techcombank">
                            Techcombank
                          </SelectItem>
                          <SelectItem value="ACB">ACB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Số tài khoản *</Label>
                      <Input
                        value={newBankAccount.accountNumber}
                        onChange={(e) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            accountNumber: e.target.value,
                          })
                        }
                        placeholder="Nhập số tài khoản"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Chủ tài khoản</Label>
                      <Input
                        value={newBankAccount.accountHolder}
                        onChange={(e) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            accountHolder: e.target.value.toUpperCase(),
                          })
                        }
                        placeholder="TÊN CHỦ TÀI KHOẢN"
                      />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <Label>Chi nhánh ngân hàng</Label>
                      <Input
                        value={newBankAccount.branch}
                        onChange={(e) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            branch: e.target.value,
                          })
                        }
                        placeholder="VD: CN Hoàn Kiếm"
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Ghi chú</Label>
                      <Textarea
                        value={newBankAccount.note}
                        onChange={(e) =>
                          setNewBankAccount({
                            ...newBankAccount,
                            note: e.target.value,
                          })
                        }
                        placeholder="Ghi chú thêm..."
                        rows={2}
                      />
                    </div>
                  </div>
                  <Button onClick={addBankAccount} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Thêm tài khoản
                  </Button>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h4 className="font-semibold text-lg flex items-center justify-between">
              Danh sách tài khoản
              <Badge variant="secondary">{formData.bankAccounts.length}</Badge>
            </h4>

            {formData.bankAccounts.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed rounded-xl bg-muted/10">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground font-medium">
                  Chưa có tài khoản nào được thêm
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Vui lòng thêm tài khoản từ form bên trên
                </p>
              </div>
            ) : (
              <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/40">
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Ngân hàng
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Số tài khoản
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Chủ tài khoản
                      </th>
                      <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                        Chi nhánh
                      </th>
                      <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.bankAccounts.map((acc, index) => (
                      <tr
                        key={index}
                        className="border-b last:border-0 hover:bg-muted/10 transition-colors"
                      >
                        <td className="py-3 px-4 font-medium">
                          {acc.bankName}
                        </td>
                        <td className="py-3 px-4 font-mono">
                          {acc.accountNumber}
                        </td>
                        <td className="py-3 px-4">{acc.accountHolder}</td>
                        <td className="py-3 px-4">{acc.branch || "-"}</td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:bg-destructive/10"
                            onClick={() => removeBankAccount(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "documents",
      title: "Tài liệu",
      description: "Giấy phép, chứng chỉ",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold">Tài liệu đính kèm</h3>
            <p className="text-sm text-muted-foreground">
              Cập nhật giấy phép kinh doanh, chứng chỉ VietGAP, GlobalGAP (nếu
              có)
            </p>
          </div>
          <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer">
            <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="font-medium mb-1">
              Kéo thả file hoặc click để tải lên
            </p>
            <p className="text-sm text-muted-foreground">
              Hỗ trợ PDF, Word, hình ảnh (tối đa 5MB mỗi file)
            </p>
            <Button variant="outline" className="mt-4">
              <Upload className="w-4 h-4 mr-2" />
              Chọn file
            </Button>
          </div>
          <div className="space-y-2">
            {formData.documents.map((doc, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
              >
                {doc.type.includes("image") ? (
                  <Image className="w-5 h-5 text-green-600" />
                ) : (
                  <FileText className="w-5 h-5 text-blue-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium">{doc.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.size} • Đã tải lên
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-display font-bold text-xl">
              Kiểm tra thông tin
            </h3>
            <p className="text-muted-foreground">
              Xem lại thông tin trước khi cập nhật
            </p>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Thông tin chung
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="mb-4 flex justify-center">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Logo"
                    className="w-24 h-24 rounded-lg object-cover border"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-muted flex items-center justify-center border">
                    <Image className="w-10 h-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Loại hình:</span>
                    <Badge>
                      {formData.type === "enterprise"
                        ? "Doanh nghiệp"
                        : formData.type === "cooperative"
                          ? "Hợp tác xã"
                          : "Nông hộ"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Phân loại:</span>
                    <span className="font-medium capitalize">
                      {formData.classification}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã đơn vị:</span>
                    <span className="font-medium">{formData.code || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên đầy đủ:</span>
                    <span className="font-medium">{formData.name || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Thương hiệu:</span>
                    <span className="font-medium">
                      {formData.brandName || "-"}
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã số thuế:</span>
                    <span>{formData.taxCode || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Địa chỉ thuế:</span>
                    <span className="text-right max-w-[150px] truncate">
                      {formData.taxAddress || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Đại diện:</span>
                    <span>{formData.representative || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Điện thoại:</span>
                    <span>{formData.phone || "-"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="truncate max-w-[150px]">
                      {formData.email || "-"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="pt-2 border-t mt-2">
                <span className="text-muted-foreground block mb-1">
                  Địa chỉ trụ sở:
                </span>
                <span className="font-medium">
                  {formData.address}
                  {formData.ward && `, ${formData.ward}`}
                  {formData.district && `, ${formData.district}`}
                  {formData.province && `, ${formData.province}`}
                </span>
              </div>
            </CardContent>
          </Card>

          {formData.bankAccounts.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Tài khoản ngân hàng ({formData.bankAccounts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.bankAccounts.map((acc, i) => (
                  <div
                    key={i}
                    className="p-3 bg-muted/30 rounded border border-border text-sm"
                  >
                    <div className="font-bold flex justify-between">
                      <span>{acc.bankName}</span>
                      <span className="font-mono">{acc.accountNumber}</span>
                    </div>
                    <div className="text-muted-foreground mt-1 flex justify-between">
                      <span>Chủ TK: {acc.accountHolder}</span>
                      {acc.branch && <span>CN: {acc.branch}</span>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {formData.branches.length > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Danh sách chi nhánh ({formData.branches.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {formData.branches.map((branch, i) => (
                  <div
                    key={i}
                    className="p-3 bg-muted/30 rounded border border-border text-sm"
                  >
                    <div className="font-bold">{branch.name}</div>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-muted-foreground">
                      <div>MST: {branch.taxCode || "-"}</div>
                      <div>SĐT: {branch.phone || "-"}</div>
                      <div className="col-span-2">
                        Đ/c: {branch.address || "-"}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={`Cập nhật ${
        formData.type === "enterprise"
          ? "Doanh nghiệp"
          : formData.type === "cooperative"
            ? "Hợp tác xã"
            : "Nông hộ"
      }`}
      description="Cập nhật thông tin chi tiết"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/enterprise")}
            completeLabel="Cập nhật"
          />
        </CardContent>
      </Card>
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận cập nhật</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn cập nhật{" "}
              {formData.type === "enterprise"
                ? "doanh nghiệp"
                : formData.type === "cooperative"
                  ? "hợp tác xã"
                  : "nông hộ"}{" "}
              "{formData.name}" không?
              <br />
              Thông tin mới sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
