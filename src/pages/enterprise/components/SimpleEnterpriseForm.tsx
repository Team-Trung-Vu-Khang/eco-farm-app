import {
  Button,
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, ImagePlus, MapPin, Upload } from "lucide-react";
import { useRef } from "react";
import { useGeoProvinces, useGeoWards, useMasterData } from "@/features/master-data";
import { useEnterpriseFormContext } from "../context/EnterpriseFormContext";

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const organizationTypesQuery = useMasterData("organization-types", {
    params: { status: "active", page: 0, size: 100 },
  });
  const provincesQuery = useGeoProvinces({
    params: { status: "active", page: 0, size: 100 },
  });
  const wardsQuery = useGeoWards({
    params: {
      provinceCode: formData.province,
      page: 0,
      size: 100,
    },
    enabled: Boolean(formData.province),
  });

  const isValid = Boolean(
    formData.image.trim() &&
      formData.code.trim() &&
      formData.name.trim() &&
      formData.taxCode.trim() &&
      formData.organizationTypeId !== "" &&
      formData.province.trim() &&
      formData.ward.trim() &&
      formData.address.trim() &&
      formData.description.trim(),
  );
  const isEditMode = mode === "edit";

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-24">
      <div className="flex items-center gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-blue-900">
        <div className="rounded-xl bg-white p-2 shadow-sm">
          <Building2 className="h-6 w-6 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold">Chế độ đơn giản</h3>
          <p className="text-sm text-blue-700">
            {isEditMode
              ? "Cập nhật nhanh các thông tin cần thiết của doanh nghiệp."
              : "Nhập nhanh các thông tin cần thiết để tạo doanh nghiệp."}
          </p>
        </div>
      </div>

      <Card className="rounded-3xl border-slate-200 shadow-sm">
        <CardContent className="space-y-6 p-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Doanh nghiệp</h2>
            <p className="mt-1 text-sm text-slate-500">
              Thông tin nhận diện và địa chỉ đăng ký của doanh nghiệp.
            </p>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-4 sm:flex-row sm:items-center">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Logo doanh nghiệp"
                  className="h-full w-full object-contain"
                />
              ) : (
                <ImagePlus className="h-7 w-7 text-slate-300" />
              )}
            </div>
            <div className="flex-1">
              <Label required>Logo</Label>
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
              <Label required>Mã doanh nghiệp</Label>
              <Input
                value={formData.code}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, code: event.target.value }))
                }
                placeholder="VD: DN001"
              />
            </div>
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
              <Label required>Mã số thuế</Label>
              <Input
                value={formData.taxCode}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, taxCode: event.target.value }))
                }
                placeholder="Nhập mã số thuế"
              />
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
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-5">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
              <MapPin className="h-4 w-4 text-emerald-600" />
              Địa chỉ doanh nghiệp
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label required>Tỉnh thành</Label>
                <Select
                  value={formData.province || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, province: value, ward: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tỉnh thành" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {provincesQuery.items.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.fullName || item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label required>Phường xã</Label>
                <Select
                  value={formData.ward || ""}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, ward: value }))
                  }
                  disabled={!formData.province}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường xã" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60 overflow-y-auto">
                    {wardsQuery.items.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.fullName || item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label required>Địa chỉ chi tiết</Label>
              <Input
                value={formData.address}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, address: event.target.value }))
                }
                placeholder="Số nhà, đường, thôn/xóm..."
              />
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-5">
            <Label required>Ghi chú</Label>
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
