import {
  useGeoProvinces,
  useGeoWards,
  useMasterData,
} from "@/features/master-data";
import {
  Button,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image, Upload } from "lucide-react";
import { Controller } from "react-hook-form";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

export function SimpleFormPage() {
  const {
    formData,
    control,
    setFormData,
    isDragging,
    handleDrag,
    handleLogoDrop,
    handleImageUpload,
  } = useEnterpriseFormContext();
  const organizationTypes = useMasterData("organization-types", {
    params: { status: "active", page: 0, size: 100 },
  });
  const provinces = useGeoProvinces({
    params: { status: "active", page: 0, size: 100 },
  });
  const wards = useGeoWards({
    params: { provinceCode: formData.province, page: 0, size: 100 },
    enabled: Boolean(formData.province),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div className="space-y-4">
        <Label required>Logo / Hình ảnh đại diện</Label>

        <div className="flex flex-rows items-center gap-6">
          <div
            className={`flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed bg-slate-50 transition-colors ${isDragging.logo ? "border-primary bg-primary/5" : "border-slate-300 hover:border-primary"}`}
            onClick={() =>
              document.getElementById("simple-logo-upload")?.click()
            }
            onDragEnter={(event) => handleDrag("logo", event)}
            onDragOver={(event) => handleDrag("logo", event)}
            onDragLeave={(event) => handleDrag("logo", event)}
            onDrop={handleLogoDrop}
          >
            {formData.image ? (
              <img
                src={formData.image}
                alt="Logo doanh nghiệp"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="text-center text-xs text-slate-500">
                <Image className="mx-auto mb-1 h-8 w-8 text-slate-400" />
                Upload
              </div>
            )}
          </div>
          <div>
            <input
              id="simple-logo-upload"
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex flex-1 flex-col gap-3 sm:items-start sm:pt-4 sm:text-left">
              <p className="text-sm leading-6 text-slate-500">
                Tải lên logo hoặc hình ảnh đại diện của doanh nghiệp.
                <br />
                Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 5MB.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  document.getElementById("simple-logo-upload")?.click()
                }
              >
                <Upload className="mr-2 h-4 w-4" />
                Chọn hình ảnh
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="code"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label required>Mã doanh nghiệp</Label>
              <Input placeholder="Nhập mã doanh nghiệp" {...field} />
              {fieldState.error && (
                <p className="text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="name"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label required>Tên doanh nghiệp</Label>
              <Input placeholder="Nhập tên doanh nghiệp" {...field} />
              {fieldState.error && (
                <p className="text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="taxCode"
          render={({ field }) => (
            <div className="space-y-2">
              <Label required>Mã số thuế</Label>
              <Input
                placeholder="Nhập mã số thuế"
                {...field}
                value={field.value ?? ""}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="organizationTypeId"
          render={({ field, fieldState }) => (
            <div className="space-y-2">
              <Label required>Loại hình tổ chức</Label>
              <Select
                value={field.value === "" ? "" : String(field.value)}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn loại hình tổ chức" />
                </SelectTrigger>
                <SelectContent>
                  {organizationTypes.items.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldState.error && (
                <p className="text-xs text-red-600">
                  {fieldState.error.message}
                </p>
              )}
            </div>
          )}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Controller
          control={control}
          name="province"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Tỉnh thành</Label>
              <Select
                value={field.value || ""}
                onValueChange={(value) => {
                  field.onChange(value);
                  setFormData((prev) => ({
                    ...prev,
                    province: value,
                    ward: "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn tỉnh thành" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {provinces.items.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.fullName || item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          control={control}
          name="ward"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>Phường xã</Label>
              <Select
                value={field.value || ""}
                onValueChange={field.onChange}
                disabled={!formData.province || wards.loading}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      wards.loading ? "Đang tải..." : "Chọn phường xã"
                    }
                  />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {wards.items.map((item) => (
                    <SelectItem key={item.code} value={item.code}>
                      {item.fullName || item.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
      </div>
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Địa chỉ chi tiết</Label>
            <Input
              placeholder="Số nhà, đường, ấp..."
              {...field}
              value={field.value ?? ""}
            />
          </div>
        )}
      />
      <Controller
        control={control}
        name="description"
        render={({ field }) => (
          <div className="space-y-2">
            <Label>Ghi chú</Label>
            <Textarea
              rows={4}
              placeholder="Nhập ghi chú"
              {...field}
              value={field.value ?? ""}
            />
          </div>
        )}
      />
    </div>
  );
}
