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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X, Trash2 } from "lucide-react";
import useBranchStore from "../../stores/useBranchStore";
import { PROVINCES } from "@/constants/province";

export default function BranchEditPage() {
  const [, params] = useRoute("/branch/:id/edit");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const branchId = params?.id ? parseInt(params.id) : undefined;
  const getBranchById = useBranchStore((state) => state.getBranchById);
  const updateBranch = useBranchStore((state) => state.updateBranch);
  const deleteBranch = useBranchStore((state) => state.deleteBranch);
  const branch = branchId ? getBranchById(branchId) : undefined;

  const [formData, setFormData] = useState({
    enterpriseId: "",
    code: "",
    name: "",
    taxCode: "",
    taxAddress: "",
    website: "",
    phone: "",
    email: "",
    address: "",
    province: "",
    district: "",
    ward: "",
    description: "",
  });

  useEffect(() => {
    if (branch) {
      // Parse location data from branch
      const getLocationCode = (
        value: string | undefined,
        type: "province" | "district" | "ward",
      ) => {
        if (!value) return "";
        const maps = {
          province: { "TP.HCM": "hcm", "Hà Nội": "hn", "Đà Nẵng": "dn" },
          district: { "Quận 1": "q1", "Quận 3": "q3", "Ba Đình": "badinh" },
          ward: { "Phường 1": "p1", "Phường 2": "p2", "Kim Mã": "kimma" },
        };
        const map = maps[type] as Record<string, string>;
        return map[value] || "";
      };

      // Extract street address (remove ward, district, city)
      let streetAddress = branch.address;
      if (branch.ward)
        streetAddress = streetAddress
          .replace(`, ${branch.ward}`, "")
          .replace(`${branch.ward}, `, "");
      if (branch.district)
        streetAddress = streetAddress
          .replace(`, ${branch.district}`, "")
          .replace(`${branch.district}, `, "");
      if (branch.city)
        streetAddress = streetAddress
          .replace(`, ${branch.city}`, "")
          .replace(`${branch.city}`, "");

      setFormData({
        enterpriseId: "1", // Default to first enterprise for now
        code: branch.code,
        name: branch.name,
        taxCode: branch.taxCode || "",
        taxAddress: branch.taxAddress || "",
        website: branch.website || "",
        phone: branch.phone,
        email: branch.email,
        address: streetAddress.trim(),
        province: getLocationCode(branch.city, "province"),
        district: getLocationCode(branch.district, "district"),
        ward: getLocationCode(branch.ward, "ward"),
        description: "",
      });
    }
  }, [branch]);

  const handleSubmit = () => {
    if (!formData.name || !branchId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Map location codes to names
    const getLocationName = (
      code: string,
      type: "province" | "district" | "ward",
    ) => {
      const maps = {
        province: { hcm: "TP.HCM", hn: "Hà Nội", dn: "Đà Nẵng" },
        district: { q1: "Quận 1", q3: "Quận 3", badinh: "Ba Đình" },
        ward: { p1: "Phường 1", p2: "Phường 2", kimma: "Kim Mã" },
      };
      return maps[type][code as keyof (typeof maps)[typeof type]] || "";
    };

    // Construct full address
    const fullAddress = [
      formData.address,
      getLocationName(formData.ward, "ward"),
      getLocationName(formData.district, "district"),
      getLocationName(formData.province, "province"),
    ]
      .filter(Boolean)
      .join(", ");

    updateBranch(branchId, {
      code: formData.code,
      name: formData.name,
      taxCode: formData.taxCode,
      taxAddress: formData.taxAddress,
      website: formData.website,
      phone: formData.phone,
      email: formData.email,
      address: fullAddress || formData.address,
      city: getLocationName(formData.province, "province"),
      district: getLocationName(formData.district, "district"),
      ward: getLocationName(formData.ward, "ward"),
    });

    toast({
      title: "Cập nhật thành công",
      description: `Đã cập nhật thông tin chi nhánh "${formData.name}"`,
    });
    setLocation("/branch");
  };

  const handleDelete = () => {
    if (branchId) {
      deleteBranch(branchId);
      toast({
        title: "Đã xóa",
        description: "Đã xóa chi nhánh khỏi hệ thống",
      });
      setLocation("/branch");
    }
  };

  // Show not found if branch doesn't exist
  if (branchId && !branch) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">
            Không tìm thấy thông tin chi nhánh
          </h2>
          <Button onClick={() => setLocation("/branch")}>
            <X className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Chỉnh sửa chi nhánh"
      description={`Cập nhật thông tin chi nhánh #${params?.id}`}
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/branch")}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Cập nhật
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin chung</CardTitle>
              <CardDescription>Thông tin cơ bản của chi nhánh</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="enterprise">Đơn vị chủ quản *</Label>
                <Select
                  value={formData.enterpriseId}
                  onValueChange={(val) =>
                    setFormData({ ...formData, enterpriseId: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Đơn vị sở hữu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">
                      Công ty CP Nông nghiệp Xanh EcoFarm
                    </SelectItem>
                    <SelectItem value="2">HTX Rau sạch Thanh Hà</SelectItem>
                    <SelectItem value="3">Nông hộ Nguyễn Văn A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="code">Mã chi nhánh</Label>
                  <Input
                    id="code"
                    placeholder="Tự động tạo nếu để trống"
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxCode">Mã số thuế chi nhánh</Label>
                  <Input
                    id="taxCode"
                    placeholder="MST chi nhánh (nếu có)"
                    value={formData.taxCode}
                    onChange={(e) =>
                      setFormData({ ...formData, taxCode: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
                <Input
                  id="taxAddress"
                  placeholder="Địa chỉ đăng ký thuế (nếu khác địa chỉ chi nhánh)"
                  value={formData.taxAddress}
                  onChange={(e) =>
                    setFormData({ ...formData, taxAddress: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  placeholder="VD: https://ecofarm.vn"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Tên chi nhánh *</Label>
                <Input
                  id="name"
                  placeholder="VD: Chi nhánh Miền Nam"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả / Ghi chú</Label>
                <Textarea
                  id="description"
                  placeholder="Thông tin thêm về chi nhánh..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ & Vị trí</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Tỉnh / Thành phố</Label>
                  <Select
                    value={formData.province}
                    onValueChange={(val) =>
                      setFormData({ ...formData, province: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Tỉnh / Thành Phố" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province.code} value={province.code}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phường / Xã</Label>
                  <Select
                    value={formData.district}
                    onValueChange={(val) =>
                      setFormData({ ...formData, district: val })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn Phường / Xã" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.find(
                        (p) => p.code === formData.province,
                      )?.districts.map((district) => (
                        <SelectItem key={district.code} value={district.code}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Phường / Xã</Label>
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
                      <SelectItem value="kimma">Kim Mã</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Địa chỉ chi tiết</Label>
                <Input
                  id="address"
                  placeholder="Số nhà, đường..."
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/30">
            <CardHeader>
              <CardTitle className="text-destructive font-medium text-base">
                Vùng nguy hiểm
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Xóa chi nhánh này sẽ không thể khôi phục lại dữ liệu.
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Xóa chi nhánh
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Bạn có chắc chắn muốn xóa?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh
                        viễn chi nhánh và loại bỏ dữ liệu khỏi máy chủ của chúng
                        tôi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Tiếp tục xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Liên hệ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input
                  id="phone"
                  placeholder="028..."
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
                  placeholder="branch@example.com"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
