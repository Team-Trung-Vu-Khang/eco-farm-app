import {
  Label,
  Input,
  MultiSelect,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image, MapPin, Upload } from "lucide-react";
import { PROVINCES } from "@/constants/province";
import type { CooperativeFormData } from "../../types/types";
import { CLASSIFICATION_OPTIONS } from "../../data/constants";
import { useEffect, useRef, useState } from "react";

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
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const [addressQuery, setAddressQuery] = useState(formData.address || "");
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
      if (!isFocused || !addressQuery || addressQuery.trim().length < 3 || !MAP4D_ACCESS_KEY) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const params = new URLSearchParams({ key: MAP4D_ACCESS_KEY, text: addressQuery.trim() });
        const res = await fetch(`https://api.map4d.vn/sdk/autosuggest?${params.toString()}`);
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
              item.address && Number.isFinite(item.lat) && Number.isFinite(item.lng),
          );
        setSuggestions(next);
        setShowSuggestions(next.length > 0);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 400);
    return () => window.clearTimeout(timer);
  }, [MAP4D_ACCESS_KEY, addressQuery, isFocused]);

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
    setAddressQuery(selectedAddress);
    setShowSuggestions(false);
    setIsFocused(false);
    setFormData({
      ...formData,
      address: selectedAddress,
      latitude: item.lat,
      longitude: item.lng,
    });
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="code">Mã hợp tác xã *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="VD: DN001, DN002..."
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
            placeholder="Nhập mã số thuế"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên hợp tác xã *</Label>
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
            placeholder="VD: EcoFarm..."
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="classification">Phân loại</Label>
          <MultiSelect
            options={CLASSIFICATION_OPTIONS}
            placeholder="Chọn phân loại..."
            value={formData.classification}
            onChange={(v) => setFormData({ ...formData, classification: v })}
          />
        </div>
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
                setFormData({ ...formData, province: val, district: "", ward: "" })
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
            <Label htmlFor="district">Quận / Huyện *</Label>
            <Select
              value={formData.district}
              onValueChange={(val) =>
                setFormData({ ...formData, district: val, ward: "" })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Quận / Huyện" />
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
          <Label htmlFor="ward">Phường / Xã</Label>
          <Input
            id="ward"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            placeholder="VD: Phường Bến Nghé / Xã Tân Phú"
          />
        </div>
        <div className="space-y-2 mt-4" ref={searchContainerRef}>
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input
            id="address"
            value={addressQuery}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onChange={(e) =>
              {
                setAddressQuery(e.target.value);
                setFormData({ ...formData, address: e.target.value });
                if (!e.target.value) {
                  setShowSuggestions(false);
                  setSuggestions([]);
                }
              }
            }
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
                  <div className="text-xs text-slate-500 truncate">{item.address}</div>
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-slate-500">
            Tọa độ: {formData.latitude?.toFixed(6) ?? "--"}, {formData.longitude?.toFixed(6) ?? "--"}
          </p>
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
