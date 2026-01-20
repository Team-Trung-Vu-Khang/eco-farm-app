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
  useToast,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@tankhang1/eco-shared-ui";
import { CreditCard, Save, User, X } from "lucide-react";

export default function PersonnelCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    province: "",
    district: "",
    address: "",
    taxCode: "",
    taxAddress: "",
    avatar: "", // URL string for simplicity in demo
    department: "",
    position: "",
    team: "",
    status: "active",
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    bankBranch: "",
  });

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thành công",
      description: `Đã thêm nhân sự "${formData.fullName}"`,
    });
    setLocation("/personnel");
  };

  return (
    <AdminLayout
      title="Thêm mới nhân sự"
      description="Thêm hồ sơ nhân sự mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/personnel")}>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="bank">Thông tin ngân hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Avatar & Basic Status */}
              <div className="md:col-span-1 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Ảnh đại diện</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 overflow-hidden relative group cursor-pointer hover:border-primary">
                      {formData.avatar ? (
                        <img
                          src={formData.avatar}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-gray-400" />
                      )}
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs font-medium">
                          Tải ảnh lên
                        </span>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = URL.createObjectURL(file);
                            setFormData({ ...formData, avatar: url });
                          }
                        }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground text-center">
                      Hỗ trợ định dạng JPG, PNG. Tối đa 2MB.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-2">
                      <Label htmlFor="status">Trạng thái làm việc</Label>
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
                          <SelectItem value="active">Đang làm việc</SelectItem>
                          <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
                          <SelectItem value="on_leave">Nghỉ phép</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column: Detailed Info */}
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Họ và tên *</Label>
                      <Input
                        id="fullName"
                        placeholder="Nhập họ và tên"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Số điện thoại *</Label>
                        <Input
                          id="phone"
                          placeholder="0901234567"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="taxCode">Mã số thuế cá nhân</Label>
                        <Input
                          id="taxCode"
                          placeholder="MST cá nhân"
                          value={formData.taxCode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxCode: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
                        <Input
                          id="taxAddress"
                          placeholder="Địa chỉ đăng ký thuế"
                          value={formData.taxAddress}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              taxAddress: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Địa chỉ liên hệ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="province">Tỉnh / Thành phố</Label>
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
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="district">Quận / Huyện</Label>
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
                            <SelectItem value="caugiay">Cầu Giấy</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">Địa chỉ chi tiết</Label>
                      <Input
                        id="address"
                        placeholder="Số nhà, tên đường, phường/xã..."
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Công việc & Chức vụ</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="department">Phòng ban</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(val) =>
                            setFormData({ ...formData, department: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Kinh doanh">
                              Kinh doanh
                            </SelectItem>
                            <SelectItem value="Kỹ thuật">Kỹ thuật</SelectItem>
                            <SelectItem value="Kế toán">Kế toán</SelectItem>
                            <SelectItem value="Hành chính">
                              Hành chính
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Chức vụ</Label>
                        <Select
                          value={formData.position}
                          onValueChange={(val) =>
                            setFormData({ ...formData, position: val })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn chức vụ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GiamDoc">Giám Đốc</SelectItem>
                            <SelectItem value="TruongPhong">
                              Trưởng Phòng
                            </SelectItem>
                            <SelectItem value="NhanVien">Nhân Viên</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="team">Đội / Nhóm</Label>
                      <Input
                        id="team"
                        placeholder="VD: Đội kinh doanh miền Bắc, Tổ kỹ thuật 1..."
                        value={formData.team}
                        onChange={(e) =>
                          setFormData({ ...formData, team: e.target.value })
                        }
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank">
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
                  <div className="space-y-2">
                    <Label htmlFor="bankBranch">Chi nhánh ngân hàng</Label>
                    <Input
                      id="bankBranch"
                      placeholder="VD: CN Hoàn Kiếm"
                      value={formData.bankBranch}
                      onChange={(e) =>
                        setFormData({ ...formData, bankBranch: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          accountNumber: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="accountHolder">Chủ tài khoản</Label>
                    <Input
                      id="accountHolder"
                      placeholder="TÊN CHỦ TÀI KHOẢN"
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
