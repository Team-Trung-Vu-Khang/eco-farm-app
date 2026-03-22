import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  Building2,
  Calendar,
  Camera,
  Check,
  CreditCard,
  Download,
  FileText,
  Globe,
  Image,
  Info,
  Mail,
  MapPin,
  Phone,
  Plus,
  QrCode,
  Scan,
  Search,
  Trash2,
  Upload,
  User,
  Users,
} from "lucide-react";
import { PROVINCES } from "@/constants/province";
import { vietQrBankData } from "@/constants/banks";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

const classificationOptions = [
  { value: "production", label: "Sản xuất" },
  { value: "processing", label: "Chế biến" },
  { value: "trading", label: "Thương mại" },
  { value: "service", label: "Dịch vụ" },
  { value: "other", label: "Khác" },
];

const bankOptions = vietQrBankData.map((bank) => ({
  id: bank.id,
  bin: bank.bin,
  label: bank.name,
  image: bank.logo,
  value: bank.bin,
}));

export function EnterpriseBasicInfoStep() {
  const {
    formData,
    setFormData,
    isDragging,
    handleDrag,
    handleLogoDrop,
    handleImageUpload,
  } = useEnterpriseFormContext();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Label>Logo / Hình ảnh đại diện</Label>
        <div className="flex items-center gap-6 w-full">
          <div
            className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-all group ${isDragging["logo"] ? "border-primary bg-primary/5 scale-105" : "border-gray-300 bg-gray-50 hover:border-primary"}`}
            onClick={() => document.getElementById("avatar-upload")?.click()}
            onDragEnter={(e) => handleDrag("logo", e)}
            onDragOver={(e) => handleDrag("logo", e)}
            onDragLeave={(e) => handleDrag("logo", e)}
            onDrop={handleLogoDrop}
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
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="text-sm text-muted-foreground">
              <p>Tải lên logo hoặc hình ảnh đại diện của doanh nghiệp.</p>
              <p>Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("avatar-upload")?.click()}
              type="button"
            >
              <Upload className="w-4 h-4 mr-2" />
              Chọn hình ảnh
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã doanh nghiệp *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="VD: DN001, DN002..."
            data-testid="input-code"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên doanh nghiệp *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Công ty TNHH ABC..."
            data-testid="input-name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxAuthority">Cơ quan thuế</Label>
          <Input
            id="taxAuthority"
            value={formData.taxAuthority}
            onChange={(e) =>
              setFormData({ ...formData, taxAuthority: e.target.value })
            }
            placeholder="Cục thuế / Chi cục thuế..."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Ngày cấp</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) =>
              setFormData({ ...formData, issueDate: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="classification">Phân loại</Label>
          <MultiSelect
            options={classificationOptions}
            placeholder="Chọn phân loại..."
            value={formData.classification}
            onChange={(v) => setFormData({ ...formData, classification: v })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="representative">Người đại diện pháp luật *</Label>
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
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) =>
            setFormData({ ...formData, website: e.target.value })
          }
          placeholder="https://..."
        />
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Địa chỉ trụ sở</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh / Thành phố *</Label>
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
            <Label htmlFor="ward">Phường / Xã *</Label>
            <Select
              value={formData.ward}
              onValueChange={(val) => setFormData({ ...formData, ward: val })}
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

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Hotline</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="09xx xxx xxx"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="email@example.com"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả doanh nghiệp</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Giới thiệu về doanh nghiệp"
          rows={3}
        />
      </div>
    </div>
  );
}
