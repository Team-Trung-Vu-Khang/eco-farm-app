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
import { useEffect, useRef, useState } from "react";
import { Controller } from "react-hook-form";
import { useEnterpriseFormContext } from "../../context/EnterpriseFormContext";

const classificationOptions = [
  { value: "production", label: "Sản xuất" },
  { value: "processing", label: "Chế biến" },
  { value: "trading", label: "Thương mại" },
  { value: "service", label: "Dịch vụ" },
  { value: "other", label: "Khác" },
];

export function EnterpriseBasicInfoStep() {
  return <EnterpriseBasicInfoStepContent showContactSelector />;
}

interface EnterpriseBasicInfoStepContentProps {
  showContactSelector?: boolean;
}

function EnterpriseBasicInfoStepContent({
  showContactSelector = true,
}: EnterpriseBasicInfoStepContentProps) {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const organizationTypesQuery = useMasterData("organization-types", {
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
  const [addressQuery, setAddressQuery] = useState(formData.address || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; address: string; lat: number; lng: number }>
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const skipNextSearchRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    setAddressQuery(formData.address || "");
  }, [formData.address]);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (skipNextSearchRef.current) {
        skipNextSearchRef.current = false;
        return;
      }
      if (!isFocused || !addressQuery || addressQuery.trim().length < 3) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      if (!MAP4D_ACCESS_KEY) return;

      try {
        const params = new URLSearchParams({
          key: MAP4D_ACCESS_KEY,
          text: addressQuery.trim(),
        });
        const res = await fetch(
          `https://api.map4d.vn/sdk/autosuggest?${params.toString()}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as {
          result?: Array<{
            name?: string;
            address?: string;
            location?: { lat?: number; lng?: number };
          }>;
        };
        const result = Array.isArray(data.result) ? data.result : [];
        const next = result
          .map((item) => ({
            name: item?.name || "",
            address: item?.address || "",
            lat: Number(item?.location?.lat),
            lng: Number(item?.location?.lng),
          }))
          .filter(
            (item) =>
              item.address &&
              Number.isFinite(item.lat) &&
              Number.isFinite(item.lng),
          );
        setSuggestions(next);
        setShowSuggestions(next.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);

    return () => window.clearTimeout(timer);
  }, [addressQuery, isFocused, MAP4D_ACCESS_KEY]);

  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
        setIsFocused(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handlePickAddress = (item: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => {
    const selectedAddress = item.address || item.name;
    skipNextSearchRef.current = true;
    setAddressQuery(selectedAddress);
    setShowSuggestions(false);
    setIsFocused(false);
    setFormData((prev) => ({
      ...prev,
      address: selectedAddress,
      latitude: item.lat,
      longitude: item.lng,
    }));
    toast({
      title: "Đã chọn địa chỉ",
      description: "Đã lưu địa chỉ và tọa độ.",
    });
  };

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
          <Label htmlFor="code" required>
            Mã doanh nghiệp
          </Label>
          <Controller
            control={control}
            name="code"
            render={({ field, fieldState }) => (
              <>
                <Input
                  id="code"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  name={field.name}
                  placeholder="VD: DN001, DN002..."
                  data-testid="input-code"
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
      </div>

      <div className="grid grid-cols-2 gap-4">
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
                placeholder="VD: EcoFarm..."
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxCode">Mã số thuế</Label>
          <Controller
            control={control}
            name="taxCode"
            render={({ field }) => (
              <Input
                id="taxCode"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Nhập mã số thuế"
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxAuthority">Cơ quan thuế</Label>
          <Controller
            control={control}
            name="taxAuthority"
            render={({ field }) => (
              <Input
                id="taxAuthority"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Cục thuế / Chi cục thuế..."
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="issueDate">Ngày cấp</Label>
          <Controller
            control={control}
            name="issueDate"
            render={({ field }) => (
              <Input
                id="issueDate"
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
          <Controller
            control={control}
            name="taxAddress"
            render={({ field }) => (
              <Input
                id="taxAddress"
                value={field.value || ""}
                onChange={(e) => field.onChange(e.target.value)}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Địa chỉ đăng ký thuế"
              />
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="classification">Phân loại</Label>
          <Controller
            control={control}
            name="classification"
            render={({ field }) => (
              <MultiSelect
                options={classificationOptions}
                placeholder="Chọn phân loại..."
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
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
        <div className="grid grid-cols-2 gap-4">
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

        <div className="space-y-2 mt-4" ref={searchContainerRef}>
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Controller
            control={control}
            name="address"
            render={({ field }) => (
              <Input
                id="address"
                value={addressQuery}
                onFocus={() => {
                  setIsFocused(true);
                  if (suggestions.length > 0) setShowSuggestions(true);
                }}
                onChange={(e) => {
                  setAddressQuery(e.target.value);
                  field.onChange(e.target.value);
                  if (!e.target.value) {
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Số nhà, đường, ấp..."
              />
            )}
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="z-[99999] mt-1 max-h-56 overflow-y-auto rounded-md border bg-white shadow">
              {suggestions.map((item, index) => (
                <button
                  key={`${item.lat}-${item.lng}-${index}`}
                  type="button"
                  className="w-full border-b px-3 py-2 text-left text-sm hover:bg-slate-50 last:border-b-0"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePickAddress(item)}
                >
                  <div className="font-medium text-slate-800 truncate">
                    {item.name || item.address}
                  </div>
                  <div className="text-xs text-slate-500 truncate">
                    {item.address}
                  </div>
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">
            Tọa độ: {formData.latitude?.toFixed(6) ?? "--"},{" "}
            {formData.longitude?.toFixed(6) ?? "--"}
          </p>
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
