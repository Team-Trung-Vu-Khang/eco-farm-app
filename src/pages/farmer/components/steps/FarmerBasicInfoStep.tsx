import { useAddressOptions } from "@/features/master-data";
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
import { Controller, type Control, type FieldErrors } from "react-hook-form";
import type { FarmerFormInput } from "../../data/farmer-form.schema";
import type { FarmerFormData } from "../../types";
import { farmerClassificationOptions } from "../../types";

const asInputValue = (value: unknown) =>
  typeof value === "string" || typeof value === "number"
    ? String(value)
    : "";

const asMultiValue = (value: unknown) => (Array.isArray(value) ? value : []);

interface FarmerBasicInfoStepProps {
  formData: FarmerFormData;
  control: Control<FarmerFormInput, unknown>;
  errors: FieldErrors<FarmerFormInput>;
  updateField: <K extends keyof FarmerFormData>(
    field: K,
    value: FarmerFormData[K],
  ) => void;
  isDragging: boolean;
  handleDrag: (id: string, e: React.DragEvent) => void;
  processLogoImage: (file: File) => void;
}

export const FarmerBasicInfoStep = ({
  formData,
  control,
  errors,
  updateField,
  isDragging,
  handleDrag,
  processLogoImage,
}: FarmerBasicInfoStepProps) => {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const { provinces, wards, isLoadingProvinces, isLoadingWards } =
    useAddressOptions(formData.province);
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; address: string; lat: number; lng: number }>
  >([]);
  const skipNextSearchRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (skipNextSearchRef.current) {
        skipNextSearchRef.current = false;
        return;
      }
      if (
        !isFocused ||
        !formData.address ||
        formData.address.trim().length < 3 ||
        !MAP4D_ACCESS_KEY
      ) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const params = new URLSearchParams({
          key: MAP4D_ACCESS_KEY,
          text: formData.address.trim(),
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
        const next = (Array.isArray(data.result) ? data.result : [])
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
  }, [MAP4D_ACCESS_KEY, formData.address, isFocused]);

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

  const handleSelectAddress = (item: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  }) => {
    const selectedAddress = item.address || item.name;
    skipNextSearchRef.current = true;
    setShowSuggestions(false);
    setIsFocused(false);
    updateField("address", selectedAddress);
    updateField("latitude", item.lat);
    updateField("longitude", item.lng);
    toast({
      title: "Đã chọn địa chỉ",
      description: "Đã lưu địa chỉ và tọa độ.",
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processLogoImage(file);
  };

  const handleLogoDrop = (e: React.DragEvent) => {
    handleDrag("logo", e);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      processLogoImage(file);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Label>Logo / Hình ảnh đại diện</Label>
        <div className="flex items-center gap-6 w-full">
          <div
            className={`w-32 h-32 rounded-lg border-2 border-dashed flex items-center justify-center overflow-hidden relative cursor-pointer transition-all group ${isDragging ? "border-primary bg-primary/5 scale-105" : "border-gray-300 bg-gray-50 hover:border-primary"}`}
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
              <p>Tải lên logo hoặc hình ảnh đại diện của nông hộ.</p>
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
            Mã nông hộ
          </Label>
          <Controller
            control={control}
            name="code"
            render={({ field }) => (
              <Input
                id="code"
                value={asInputValue(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                aria-invalid={!!errors.code}
                placeholder="VD: DN001, DN002..."
              />
            )}
          />
          {errors.code?.message ? (
            <p className="text-xs text-red-600">{errors.code.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="name" required>
            Tên nông hộ
          </Label>
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id="name"
                value={asInputValue(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                aria-invalid={!!errors.name}
                placeholder="VD: Công ty TNHH ABC..."
              />
            )}
          />
          {errors.name?.message ? (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandName">Tên thương hiệu</Label>
          <Controller
            control={control}
            name="brandName"
            render={({ field }) => (
              <Input
                id="brandName"
                value={asInputValue(field.value)}
                onChange={field.onChange}
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
                value={asInputValue(field.value)}
                onChange={field.onChange}
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
                value={asInputValue(field.value)}
                onChange={field.onChange}
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
                value={asInputValue(field.value)}
                onChange={field.onChange}
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
          <Label htmlFor="classification">Phân loại</Label>
          <Controller
            control={control}
            name="classification"
            render={({ field }) => (
              <MultiSelect
                options={farmerClassificationOptions}
                placeholder="Chọn phân loại..."
                value={asMultiValue(field.value)}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
          <Controller
            control={control}
            name="taxAddress"
            render={({ field }) => (
              <Input
                id="taxAddress"
                value={asInputValue(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                placeholder="Địa chỉ đăng ký thuế"
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
            render={({ field }) => (
              <Input
                id="representative"
                value={asInputValue(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
                aria-invalid={!!errors.representative}
                placeholder="Họ và tên"
              />
            )}
          />
          {errors.representative?.message ? (
            <p className="text-xs text-red-600">
              {errors.representative.message}
            </p>
          ) : null}
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
                value={asInputValue(field.value)}
                onChange={field.onChange}
                onBlur={field.onBlur}
                ref={field.ref}
                name={field.name}
              />
            )}
          />
        </div>
      </div>

      <div className="pt-4 border-t">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Địa chỉ nông hộ</h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="province" required>
              Tỉnh / Thành Phố
            </Label>
            <Controller
              control={control}
              name="province"
              render={({ field }) => (
                <Select
                  value={asInputValue(field.value)}
                  onValueChange={(val) => {
                    field.onChange(val);
                    updateField("district", "");
                    updateField("ward", "");
                  }}
                  disabled={isLoadingProvinces}
                >
                  <SelectTrigger aria-invalid={!!errors.province}>
                    <SelectValue
                      placeholder={
                        isLoadingProvinces
                          ? "Đang tải danh sách tỉnh/thành phố..."
                          : "Chọn Tỉnh / Thành Phố"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    {provinces.map((province) => (
                      <SelectItem key={province.code} value={province.code}>
                        {province.fullName || province.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.province?.message ? (
              <p className="text-xs text-red-600">{errors.province.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="ward" required>
              Phường / Xã
            </Label>
            <Controller
              control={control}
              name="ward"
              render={({ field }) => (
                <Select
                  value={asInputValue(field.value)}
                  onValueChange={field.onChange}
                  disabled={!formData.province || isLoadingWards}
                >
                  <SelectTrigger aria-invalid={!!errors.ward}>
                    <SelectValue
                      placeholder={
                        !formData.province
                          ? "Chọn Tỉnh / Thành Phố trước"
                          : isLoadingWards
                            ? "Đang tải phường/xã..."
                            : "Chọn Phường / Xã"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 overflow-y-auto">
                    {wards.map((ward) => (
                      <SelectItem key={ward.code} value={ward.code}>
                        {ward.fullName || ward.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.ward?.message ? (
              <p className="text-xs text-red-600">{errors.ward.message}</p>
            ) : null}
          </div>
        </div>
        <div className="space-y-2 mt-4" ref={searchContainerRef}>
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input
            id="address"
            value={asInputValue(formData.address)}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onChange={(e) => {
              updateField("address", e.target.value);
              if (!e.target.value) {
                setShowSuggestions(false);
                setSuggestions([]);
              }
            }}
            placeholder="Số nhà, đường, ấp..."
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="z-[99999] mt-1 max-h-56 overflow-y-auto rounded-md border bg-white shadow">
              {suggestions.map((item, index) => (
                <button
                  key={`${item.lat}-${item.lng}-${index}`}
                  type="button"
                  className="w-full border-b px-3 py-2 text-left text-sm hover:bg-slate-50 last:border-b-0"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelectAddress(item)}
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
        <Label htmlFor="description">Mô tả nông hộ</Label>
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <Textarea
              id="description"
              value={asInputValue(field.value)}
              onChange={field.onChange}
              onBlur={field.onBlur}
              ref={field.ref}
              name={field.name}
              placeholder="Giới thiệu về nông hộ"
              rows={3}
            />
          )}
        />
      </div>
    </div>
  );
};
