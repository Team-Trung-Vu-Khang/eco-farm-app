import AddressSearchInput from "@/components/AddressSearchInput";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ImagePlus, MapPin, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { getDefaultOrganizationImage } from "../../enterprise/data/default-organization-images";
import type { FarmerFormData } from "../types";
import { fetchTaxPayerInfo } from "@/utils/tax";

interface SimpleFarmerFormProps {
  formData: FarmerFormData;
  onChange: (field: keyof FarmerFormData, value: string) => void;
  onImageUpload: (file: File) => void;
  onSelectLocation: (location: { latitude: number; longitude: number }) => void;
  onComplete: () => void;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function SimpleFarmerForm({
  formData,
  onChange,
  onImageUpload,
  onSelectLocation,
  onComplete,
  isEdit = false,
  isSubmitting = false,
}: SimpleFarmerFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isCheckingTax, setIsCheckingTax] = useState(false);
  const { toast } = useToast();

  const handleCheckTaxCode = async () => {
    const taxCode = formData.taxCode.trim();
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

      if (!formData.name.trim() && data.name) {
        onChange("name", data.name);
      }

      if (!formData.address.trim() && data.address) {
        onChange("address", data.address);
      }

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
  const isValid = Boolean(
    formData.name.trim() &&
    formData.province?.trim() &&
    formData.ward?.trim() &&
    formData.address.trim(),
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border bg-white">
              {formData.image || getDefaultOrganizationImage("farm") ? (
                <img
                  src={formData.image || getDefaultOrganizationImage("farm")}
                  alt="Hình ảnh nông hộ"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlus className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <Label>Logo / hình ảnh</Label>
              <p className="mt-1 text-xs text-slate-500">
                JPG hoặc PNG, tối đa 5MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onImageUpload(file);
                e.target.value = "";
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Tải hình ảnh
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label required>Tên nông hộ</Label>
              <Input
                value={formData.name}
                onChange={(e) => onChange("name", e.target.value)}
                placeholder="Nhập tên nông hộ"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên gợi nhớ</Label>
              <Input
                value={formData.aliasName}
                onChange={(e) => onChange("aliasName", e.target.value)}
                placeholder="VD: Tên thường gọi của nông hộ"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label>Mã số thuế</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  value={formData.taxCode}
                  onChange={(e) => onChange("taxCode", e.target.value)}
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
          </div>
          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Địa chỉ nông hộ
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label required>Tỉnh thành</Label>
                <AddressRemoteCombobox
                  type="province"
                  value={formData.province || ""}
                  onChange={(value) => {
                    onChange("province", value);
                    onChange("ward", "");
                  }}
                  placeholder="Chọn tỉnh thành"
                  searchPlaceholder="Tìm tỉnh thành..."
                />
              </div>
              <div className="space-y-2">
                <Label required>Phường xã</Label>
                <AddressRemoteCombobox
                  type="ward"
                  value={formData.ward || ""}
                  onChange={(value) => onChange("ward", value)}
                  provinceCode={formData.province}
                  placeholder={
                    formData.province
                      ? "Chọn phường xã"
                      : "Chọn tỉnh thành trước"
                  }
                  searchPlaceholder="Tìm phường xã..."
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label required>Địa chỉ chi tiết</Label>
              <AddressSearchInput
                value={formData.address}
                onChange={(value) => onChange("address", value)}
                onSelectLocation={onSelectLocation}
                latitude={formData.latitude}
                longitude={formData.longitude}
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>
          </div>
          <div className="space-y-2 border-t border-slate-100 pt-5">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => onChange("description", e.target.value)}
              rows={4}
              placeholder="Nhập ghi chú về nông hộ..."
            />
          </div>
          <Button
            type="button"
            onClick={onComplete}
            disabled={!isValid || isSubmitting}
            className="h-12 w-full rounded-xl text-base font-bold"
          >
            {isEdit ? "Cập nhật nông hộ" : "Tạo mới nông hộ"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
