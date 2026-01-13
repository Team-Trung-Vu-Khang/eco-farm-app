import { useState } from "react";
import { useLocation } from "wouter";
import {
  Building2,
  User,
  MapPin,
  Upload,
  FileText,
  Image,
  X,
  Check,
} from "lucide-react";
import { useToast } from "@tankhang1/eco-shared-ui";
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
} from "@tankhang1/eco-shared-ui";

export default function EnterpriseCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    type: "enterprise" as "enterprise" | "farm",
    code: "",
    name: "",
    taxCode: "",
    foundedDate: "",
    representative: "",
    phone: "",
    email: "",
    website: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    description: "",
    mainProducts: [] as string[],
    documents: [] as { name: string; type: string; size: string }[],
  });

  const [newProduct, setNewProduct] = useState("");

  const addProduct = () => {
    if (newProduct.trim()) {
      setFormData({
        ...formData,
        mainProducts: [...formData.mainProducts, newProduct.trim()],
      });
      setNewProduct("");
    }
  };

  const removeProduct = (index: number) => {
    setFormData({
      ...formData,
      mainProducts: formData.mainProducts.filter((_, i) => i !== index),
    });
  };

  const handleComplete = () => {
    toast({
      title: "Thành công",
      description: `Đã tạo ${
        formData.type === "enterprise" ? "doanh nghiệp" : "nông hộ"
      } "${formData.name}"`,
    });
    setLocation("/enterprise");
  };

  const steps: Step[] = [
    {
      id: "type",
      title: "Loại hình",
      description: "Chọn loại tổ chức",
      content: (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-xl font-display font-bold">
              Chọn loại hình tổ chức
            </h2>
            <p className="text-muted-foreground mt-1">
              Bạn muốn tạo doanh nghiệp hay nông hộ?
            </p>
          </div>
          <RadioGroup
            value={formData.type}
            onValueChange={(value: "enterprise" | "farm") =>
              setFormData({ ...formData, type: value })
            }
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="enterprise"
              className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === "enterprise"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
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
                <p className="text-sm text-muted-foreground">
                  Công ty, HTX, trang trại lớn
                </p>
              </div>
              {formData.type === "enterprise" && (
                <Check className="w-5 h-5 text-primary" />
              )}
            </Label>
            <Label
              htmlFor="farm"
              className={`flex flex-col items-center gap-4 p-6 rounded-xl border-2 cursor-pointer transition-all ${
                formData.type === "farm"
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
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
        </div>
      ),
    },
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Tên, mã, thông tin chung",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">
                Mã {formData.type === "enterprise" ? "doanh nghiệp" : "nông hộ"}{" "}
                *
              </Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) =>
                  setFormData({ ...formData, code: e.target.value })
                }
                placeholder={
                  formData.type === "enterprise" ? "VD: DN001" : "VD: NH001"
                }
                data-testid="input-code"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxCode">Mã số thuế</Label>
              <Input
                id="taxCode"
                value={formData.taxCode}
                onChange={(e) =>
                  setFormData({ ...formData, taxCode: e.target.value })
                }
                placeholder="Nhập mã số thuế (nếu có)"
                data-testid="input-taxCode"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">
              Tên {formData.type === "enterprise" ? "doanh nghiệp" : "nông hộ"}{" "}
              *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Nhập tên đầy đủ"
              data-testid="input-name"
            />
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
                data-testid="input-representative"
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
                data-testid="input-foundedDate"
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
              data-testid="input-description"
            />
          </div>
        </div>
      ),
      isValid: formData.name.length > 0 && formData.code.length > 0,
    },
    {
      id: "contact",
      title: "Liên hệ",
      description: "Điện thoại, email, website",
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
                data-testid="input-phone"
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
                data-testid="input-email"
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
              data-testid="input-website"
            />
          </div>
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Địa chỉ</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Tỉnh/Thành phố *</Label>
                <Input
                  id="province"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                  placeholder="VD: TP. Hồ Chí Minh"
                  data-testid="input-province"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">Quận/Huyện *</Label>
                <Input
                  id="district"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                  placeholder="VD: Củ Chi"
                  data-testid="input-district"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ward">Phường/Xã</Label>
                <Input
                  id="ward"
                  value={formData.ward}
                  onChange={(e) =>
                    setFormData({ ...formData, ward: e.target.value })
                  }
                  placeholder="VD: Tân Phú"
                  data-testid="input-ward"
                />
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
                data-testid="input-address"
              />
            </div>
          </div>
        </div>
      ),
      isValid: formData.phone.length > 0 && formData.email.length > 0,
    },
    {
      id: "products",
      title: "Sản phẩm chính",
      description: "Cây trồng, sản phẩm",
      content: (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center mb-4">
            <h3 className="font-semibold">Sản phẩm/Cây trồng chính</h3>
            <p className="text-sm text-muted-foreground">
              Thêm các sản phẩm chính mà bạn sản xuất
            </p>
          </div>
          <div className="flex gap-2">
            <Input
              value={newProduct}
              onChange={(e) => setNewProduct(e.target.value)}
              placeholder="VD: Sầu riêng, Xoài, Bưởi..."
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), addProduct())
              }
              data-testid="input-new-product"
            />
            <Button onClick={addProduct} data-testid="add-product">
              Thêm
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 min-h-[100px] p-4 border border-dashed rounded-lg">
            {formData.mainProducts.length === 0 ? (
              <p className="text-muted-foreground text-sm w-full text-center">
                Chưa có sản phẩm nào. Nhập tên và nhấn "Thêm".
              </p>
            ) : (
              formData.mainProducts.map((product, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-sm py-1.5 px-3 gap-2"
                >
                  {product}
                  <button
                    onClick={() => removeProduct(index)}
                    className="hover:text-destructive"
                    data-testid={`remove-product-${index}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))
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
              Upload giấy phép kinh doanh, chứng chỉ VietGAP, GlobalGAP (nếu có)
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
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">giay_phep_kinh_doanh.pdf</p>
                <p className="text-xs text-muted-foreground">
                  2.4 MB • Đã tải lên
                </p>
              </div>
              <Badge variant="outline" className="text-green-600">
                <Check className="w-3 h-3 mr-1" /> Hoàn thành
              </Badge>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Image className="w-5 h-5 text-green-600" />
              <div className="flex-1">
                <p className="text-sm font-medium">chung_chi_vietgap.jpg</p>
                <p className="text-xs text-muted-foreground">
                  1.8 MB • Đã tải lên
                </p>
              </div>
              <Badge variant="outline" className="text-green-600">
                <Check className="w-3 h-3 mr-1" /> Hoàn thành
              </Badge>
            </div>
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
              Xem lại thông tin trước khi tạo
            </p>
          </div>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Thông tin{" "}
                {formData.type === "enterprise" ? "doanh nghiệp" : "nông hộ"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại hình:</span>
                <Badge>
                  {formData.type === "enterprise" ? "Doanh nghiệp" : "Nông hộ"}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã:</span>
                <span className="font-medium">{formData.code || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên:</span>
                <span className="font-medium">{formData.name || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Người đại diện:</span>
                <span>{formData.representative || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Điện thoại:</span>
                <span>{formData.phone || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span>{formData.email || "-"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Địa chỉ:</span>
                <span className="text-right max-w-[200px]">
                  {[
                    formData.address,
                    formData.ward,
                    formData.district,
                    formData.province,
                  ]
                    .filter(Boolean)
                    .join(", ") || "-"}
                </span>
              </div>
              {formData.mainProducts.length > 0 && (
                <div className="pt-2 border-t">
                  <span className="text-muted-foreground">Sản phẩm chính:</span>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {formData.mainProducts.map((p, i) => (
                      <Badge key={i} variant="secondary">
                        {p}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      title={`Tạo mới ${
        formData.type === "enterprise" ? "Doanh nghiệp" : "Nông hộ"
      }`}
      description="Điền thông tin theo từng bước để tạo mới"
    >
      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={() => setLocation("/enterprise")}
            completeLabel="Tạo mới"
          />
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
