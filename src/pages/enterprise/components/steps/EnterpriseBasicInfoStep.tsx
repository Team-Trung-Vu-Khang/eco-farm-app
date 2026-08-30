import {
  useGeoProvinces,
  useGeoWards,
  useMasterData,
} from "@/features/master-data";
import {
  Button,
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
import { Image, MapPin, Upload } from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";
import AddressSearchInput from "@/components/AddressSearchInput";
import { getDefaultOrganizationImage } from "../../data/default-organization-images";
import { fetchTaxPayerInfo } from "@/utils/tax";

export function EnterpriseBasicInfoStep() {
  return <EnterpriseBasicInfoStepContent />;
}

function EnterpriseBasicInfoStepContent() {
  const { toast } = useToast();
  const organizationTypesQuery = useMasterData("organization-types", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const businessLinesQuery = useMasterData("business-lines", {
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const provincesQuery = useGeoProvinces({
    params: {
      status: "active",
      page: 0,
      size: 100,
    },
  });
  const {
    formData,
    setFormData,
    control,
    isDragging,
    handleDrag,
    handleLogoDrop,
    handleImageUpload,
  } = useEnterpriseFormContext();

  const [isCheckingTax, setIsCheckingTax] = useState(false);

  const handleCheckTaxCode = async (taxCodeVal?: string) => {
    const taxCode = (taxCodeVal || formData.taxCode || "").trim();
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

        if (!prev.taxAuthority.trim() && data.taxDepartment) {
          updates.taxAuthority = data.taxDepartment;
        }

        if (!prev.address.trim() && data.address) {
          updates.address = data.address;
        }

        if (!prev.organizationTypeId && data.orgType) {
          const matchedOrgType = organizationTypesQuery.items.find(
            (item) =>
              item.name.toLowerCase().includes(data.orgType!.toLowerCase()) ||
              data.orgType!.toLowerCase().includes(item.name.toLowerCase()),
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
  const displayImage =
    formData.image || getDefaultOrganizationImage(formData.type);
  const wardsQuery = useGeoWards({
    params: {
      provinceCode: formData.province,
      page: 0,
      size: 100,
    },
    enabled: Boolean(formData.province),
  });

  const provinceOptions = provincesQuery.items.map((province) => ({
    value: province.code,
    label: province.fullName || province.name,
  }));

  const wardOptions = wardsQuery.items.map((ward) => ({
    value: ward.code,
    label: ward.fullName || ward.name,
  }));
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
            {displayImage ? (
              <>
                <img
                  src={displayImage}
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên doanh nghiệp
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="name"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="VD: Công ty TNHH ABC..."
                  data-testid="input-name"
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandName">Tên thương hiệu</Label>
          <Controller
            control={control}
            name="brandName"
            render={({ field }) => (
              <Input
                id="brandName"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: Tên thương hiệu đăng ký"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="aliasName">Tên gợi nhớ</Label>
          <Controller
            control={control}
            name="aliasName"
            render={({ field }) => (
              <Input
                id="aliasName"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="VD: EcoFarm..."
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxCode" required>
            Mã số thuế
          </Label>
          <Controller
            control={control}
            name="taxCode"
            render={({ field, fieldState }) => (
              <>
                <div className="flex gap-2">
                  <Input
                    id="taxCode"
                    className="flex-1"
                    value={field.value || ""}
                    onChange={(e) => field.onChange(e.target.value)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    name={field.name}
                    placeholder="Nhập mã số thuế"
                    aria-invalid={!!fieldState.error}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isCheckingTax}
                    onClick={() => handleCheckTaxCode(field.value)}
                    className="shrink-0"
                  >
                    {isCheckingTax ? "Đang kiểm tra..." : "Kiểm tra"}
                  </Button>
                </div>
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxAuthority" required>
            Cơ quan thuế
          </Label>
          <Controller
            control={control}
            name="taxAuthority"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="taxAuthority"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="Cục thuế / Chi cục thuế..."
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate" required>
            Ngày cấp
          </Label>
          <Controller
            control={control}
            name="issueDate"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="issueDate"
                  type="date"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxAddress" required>
            Địa chỉ thuế
          </Label>
          <Controller
            control={control}
            name="taxAddress"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="taxAddress"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="Địa chỉ đăng ký thuế"
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="organizationTypeId" required>
            Loại hình tổ chức
          </Label>
          <Controller
            control={control}
            name="organizationTypeId"
            render={({ field, fieldState }) => (
              <>
                <Select
                  value={field.value === "" ? "" : String(field.value)}
                  onValueChange={(val) => field.onChange(val)}
                >
                  <SelectTrigger aria-invalid={!!fieldState.error}>
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
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="classification" required>
            Phân loại
          </Label>
          <Controller
            control={control}
            name="classification"
            render={({ field, fieldState }) => (
              <>
                <MultiSelect
                  options={classificationOptions}
                  placeholder="Chọn phân loại..."
                  value={field.value ?? []}
                  onChange={field.onChange}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="representative" required>
            Người đại diện pháp luật
          </Label>
          <Controller
            control={control}
            name="representative"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="representative"
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="Họ và tên"
                  aria-invalid={!!fieldState.error}
                />
                {fieldState.error ? (
                  <p className="text-xs text-red-600">
                    {fieldState.error.message}
                  </p>
                ) : null}
              </>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="foundedDate">Ngày thành lập</Label>
          <Controller
            control={control}
            name="foundedDate"
            render={({ field }) => (
              <Input
                id="foundedDate"
                type="date"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <Input
              id="website"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
              placeholder="https://..."
            />
          )}
        />
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
            <Controller
              control={control}
              name="province"
              render={({ field, fieldState }) => (
                <>
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => {
                      field.onChange(val);
                      setFormData((prev) => ({
                        ...prev,
                        province: val,
                        ward: "",
                      }));
                    }}
                  >
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue placeholder="Chọn Tỉnh / Thành Phố" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {provinceOptions.map((province) => (
                        <SelectItem key={province.value} value={province.value}>
                          {province.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward" required>
              Phường / Xã
            </Label>
            <Controller
              control={control}
              name="ward"
              render={({ field, fieldState }) => (
                <>
                  <Select
                    value={field.value || ""}
                    onValueChange={(val) => field.onChange(val)}
                    disabled={!formData.province || wardsQuery.loading}
                  >
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue
                        placeholder={
                          formData.province
                            ? wardsQuery.loading
                              ? "Đang tải..."
                              : "Chọn Phường / Xã"
                            : "Chọn Tỉnh / Thành Phố trước"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="max-h-80 overflow-y-auto">
                      {wardOptions.map((ward) => (
                        <SelectItem key={ward.value} value={ward.value}>
                          {ward.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error ? (
                    <p className="text-xs text-red-600">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </>
              )}
            />
          </div>
        </div>

        <div className="space-y-2 mt-4">
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <AddressSearchInput
            value={formData.address}
            onChange={(address) =>
              setFormData((prev) => ({ ...prev, address }))
            }
            onSelectLocation={({ address, latitude, longitude }) =>
              setFormData((prev) => ({ ...prev, address, latitude, longitude }))
            }
            latitude={formData.latitude}
            longitude={formData.longitude}
            placeholder="Số nhà, đường, ấp..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả doanh nghiệp</Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              id="description"
              value={field.value || ""}
              onChange={(e) => field.onChange(e.target.value)}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
              placeholder="Giới thiệu về doanh nghiệp"
              rows={3}
            />
          )}
        />
      </div>
    </div>
  );
}
