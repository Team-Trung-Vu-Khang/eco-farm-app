import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AddressRemoteCombobox } from "@/components/AddressRemoteCombobox";
import AddressSearchInput from "@/components/AddressSearchInput";
import { ImagePlus, MapPin, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useMasterData } from "@/features/master-data";
import { useEnterpriseFormContext } from "../context/EnterpriseFormContext";
import { getDefaultOrganizationImage } from "../data/default-organization-images";
import { fetchTaxPayerInfo } from "@/utils/tax";

interface SimpleEnterpriseFormProps {
  onComplete: () => void;
  mode?: "create" | "edit";
}

export default function SimpleEnterpriseForm({
  onComplete,
  mode = "create",
}: SimpleEnterpriseFormProps) {
  const {
    formData,
    setFormData,
    handleImageUpload,
    isSubmitting,
  } = useEnterpriseFormContext();
  const displayImage =
    formData.image || getDefaultOrganizationImage(formData.type);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const organizationTypesQuery = useMasterData("organization-types", {
    params: { status: "active", page: 0, size: 100 },
  });
  const businessLinesQuery = useMasterData("business-lines", {
    params: { status: "active", page: 0, size: 100 },
  });
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

      setFormData((prev) => {
        const updates: Partial<typeof prev> = {};

        if (!prev.name.trim() && data.name) {
          updates.name = data.name;
        }

        if (!prev.address.trim() && data.address) {
          updates.address = data.address;
        }

        if (!prev.organizationTypeId && data.orgType) {
          const matchedOrgType = organizationTypesQuery.items.find(
            (item) =>
              item.name.toLowerCase().includes(data.orgType!.toLowerCase()) ||
              data.orgType!.toLowerCase().includes(item.name.toLowerCase())
          );
          if (matchedOrgType) {
            updates.organizationTypeId = String(matchedOrgType.id);
          }
        }

        return { ...prev, ...updates };
      });

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
      formData.taxCode.trim() &&
      formData.organizationTypeId !== "" &&
      formData.classification.length > 0 &&
      formData.province.trim() &&
      formData.ward.trim() &&
      formData.address.trim(),
  );
  const isEditMode = mode === "edit";

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Doanh nghiệp</h2>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="Logo doanh nghiệp"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlus className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <Label>Logo</Label>
              <p className="mt-1 text-xs text-slate-500">
                JPG hoặc PNG, tối đa 5MB.
              </p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 gap-2"
            >
              <Upload className="h-4 w-4" />
              Tải logo
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label required>Tên doanh nghiệp</Label>
              <Input
                value={formData.name}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="VD: Công ty TNHH ABC"
              />
            </div>
            <div className="space-y-2">
              <Label>Tên gợi nhớ</Label>
              <Input
                value={formData.aliasName}
                onChange={(event) =>
                  setFormData((prev) => ({
                    ...prev,
                    aliasName: event.target.value,
                  }))
                }
                placeholder="VD: Tên thường gọi của đơn vị"
              />
            </div>
            <div className="space-y-2">
              <Label required>Mã số thuế</Label>
              <div className="flex gap-2">
                <Input
                  className="flex-1"
                  value={formData.taxCode}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, taxCode: event.target.value }))
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
              <Label required>Loại hình tổ chức</Label>
              <Select
                value={String(formData.organizationTypeId || "")}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, organizationTypeId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hình tổ chức" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypesQuery.items.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label required>Lĩnh vực</Label>
              <MultiSelect
                options={businessLinesQuery.items.map((item) => ({
                  value: String(item.id),
                  label: item.name || item.code || String(item.id),
                }))}
                placeholder="Chọn lĩnh vực..."
                value={formData.classification}
                onChange={(classification) =>
                  setFormData((prev) => ({ ...prev, classification }))
                }
              />
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Địa chỉ doanh nghiệp
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label required>Tỉnh thành</Label>
                <AddressRemoteCombobox
                  type="province"
                  value={formData.province || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, province: value, ward: "" }))
                  }
                  placeholder="Chọn tỉnh thành"
                  searchPlaceholder="Tìm tỉnh thành..."
                />
              </div>
              <div className="space-y-2">
                <Label required>Phường xã</Label>
                <AddressRemoteCombobox
                  type="ward"
                  value={formData.ward || ""}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, ward: value }))
                  }
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
                onChange={(value) => setFormData((prev) => ({ ...prev, address: value }))}
                onSelectLocation={({ latitude, longitude }) =>
                  setFormData((prev) => ({ ...prev, latitude, longitude }))
                }
                latitude={formData.latitude}
                longitude={formData.longitude}
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-5">
            <Label>Ghi chú</Label>
            <Textarea
              value={formData.description}
              onChange={(event) =>
                setFormData((prev) => ({ ...prev, description: event.target.value }))
              }
              placeholder="Nhập ghi chú về doanh nghiệp..."
              rows={4}
            />
          </div>

          <Button
            type="button"
            onClick={onComplete}
            disabled={!isValid || isSubmitting}
            className="h-12 w-full rounded-xl text-base font-bold"
          >
            {isEditMode ? "Cập nhật doanh nghiệp" : "Tạo mới doanh nghiệp"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
