import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import AddressSearchInput from "@/components/AddressSearchInput";
import { useMasterData } from "@/features/master-data";
import { fetchTaxPayerInfo } from "@/utils/tax";
import {
  Button,
  Input,
  Label,
  MultiSelect,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { getDefaultOrganizationImage } from "../../../enterprise/data/default-organization-images";
import type { CooperativeFormData } from "../../types/types";

interface BasicInfoStepProps {
  formData: CooperativeFormData;
  setFormData: (data: CooperativeFormData) => void;
  isDragging: Record<string, boolean>;
  handleDrag: (id: string, e: React.DragEvent) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogoDrop: (e: React.DragEvent) => void;
}

export function BasicInfoStep({
  formData,
  setFormData,
  isDragging,
  handleDrag,
  handleImageUpload,
  handleLogoDrop,
}: BasicInfoStepProps) {
  const [isCheckingTax, setIsCheckingTax] = useState(false);
  const { toast } = useToast();
  const handleCheckTaxCode = async () => {
    const taxCode = (formData.taxCode || "").trim();
    if (!taxCode) {
      toast({
        title: "Thông báo",
        description: "Vui lòng nhập mã số thuế trước khi kiểm tra",
      });
      return;
    }
    setIsCheckingTax(true);
    try {
      const data = await fetchTaxPayerInfo(taxCode);
      if (!data) {
        toast({
          title: "Thông báo",
          description: "Mã số thuế không tìm thấy hoặc lỗi kết nối",
          variant: "destructive",
        });
        return;
      }
      if (data.success === false) {
        toast({
          title: "Thông báo",
          description: data.message || "Mã số thuế không tìm thấy",
          variant: "destructive",
        });
        return;
      }
      const updates: Partial<CooperativeFormData> = {};
      if (!formData.name.trim() && data.name) updates.name = data.name;
      if (!formData.address.trim() && data.address)
        updates.address = data.address;
      setFormData({ ...formData, ...updates });
      toast({
        title: "Thành công",
        description: "Đã tự động điền thông tin từ mã số thuế",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCheckingTax(false);
    }
  };
  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const classificationOptions = businessLinesQuery.items.map((item) => ({
    value: String(item.id),
    label: item.name || item.code || String(item.id),
  }));

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Label>Logo / Hình ảnh đại diện</Label>
        <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 w-full">
          <div
            className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-all group shrink-0 ${isDragging["logo"] ? "border-primary bg-primary/5 scale-105" : "border-gray-300 bg-gray-50 hover:border-primary"}`}
            onClick={() => document.getElementById("avatar-upload")?.click()}
            onDragEnter={(e) => handleDrag("logo", e)}
            onDragOver={(e) => handleDrag("logo", e)}
            onDragLeave={(e) => handleDrag("logo", e)}
            onDrop={handleLogoDrop}
          >
            {formData.image || getDefaultOrganizationImage("cooperative") ? (
              <>
                <img
                  src={
                    formData.image || getDefaultOrganizationImage("cooperative")
                  }
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
          <div className="flex-1 space-y-2 text-center sm:text-left">
            <input
              id="avatar-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <div className="text-sm text-muted-foreground">
              <p>Tải lên logo hoặc hình ảnh đại diện của hợp tác xã.</p>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên hợp tác xã
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: HTX Nông nghiệp ABC..."
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
            placeholder="VD: Tên thương hiệu đăng ký"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxCode" required>
            Mã số thuế
          </Label>
          <div className="flex gap-2">
            <Input
              id="taxCode"
              className="flex-1"
              value={formData.taxCode}
              onChange={(e) =>
                setFormData({ ...formData, taxCode: e.target.value })
              }
              placeholder="Nhập mã số thuế"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isCheckingTax}
              onClick={handleCheckTaxCode}
              className="shrink-0"
            >
              {isCheckingTax ? "Đang kiểm tra..." : "Kiểm tra"}
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="classification" required>
            Lĩnh vực
          </Label>
          <MultiSelect
            options={classificationOptions}
            placeholder="Chọn lĩnh vực..."
            value={formData.classification}
            onChange={(v) => setFormData({ ...formData, classification: v })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aliasName">Tên gợi nhớ</Label>
        <Input
          id="aliasName"
          value={formData.aliasName}
          onChange={(e) =>
            setFormData({ ...formData, aliasName: e.target.value })
          }
          placeholder="VD: EcoFarm..."
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="representative" required>
            Người đại diện pháp luật
          </Label>
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

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Địa chỉ trụ sở</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province" required>
              Tỉnh / Thành phố
            </Label>
            <AddressRemoteCombobox
              type="province"
              value={formData.province}
              onChange={(val) =>
                setFormData({ ...formData, province: val, district: "" })
              }
              placeholder="Chọn Tỉnh / Thành Phố"
              searchPlaceholder="Tìm tỉnh thành..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="district" required>
              Phường / Xã
            </Label>
            <AddressRemoteCombobox
              type="ward"
              value={formData.district}
              onChange={(val) => setFormData({ ...formData, district: val })}
              provinceCode={formData.province}
              placeholder={
                formData.province
                  ? "Chọn Phường / Xã"
                  : "Chọn Tỉnh / Thành Phố trước"
              }
              searchPlaceholder="Tìm phường xã..."
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <AddressSearchInput
            value={formData.address}
            onChange={(address) => setFormData({ ...formData, address })}
            onSelectLocation={({ address, latitude, longitude }) =>
              setFormData({ ...formData, address, latitude, longitude })
            }
            latitude={formData.latitude}
            longitude={formData.longitude}
            placeholder="Số nhà, đường, ấp..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả hợp tác xã</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Giới thiệu về hợp tác xã"
          rows={3}
        />
      </div>
    </div>
  );
}
