import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PROVINCES } from "@/constants/province";
import { useEffect, useRef, useState } from "react";

interface AddressLocationCardProps {
  formData: {
    province: string;
    district: string;
    ward: string;
    address: string;
    latitude?: string;
    longitude?: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function AddressLocationCard({ formData, onUpdate }: AddressLocationCardProps) {
  const MAP4D_ACCESS_KEY = import.meta.env.VITE_MAP4D_ACCESS_KEY;
  const { toast } = useToast();
  const [query, setQuery] = useState(formData.address || "");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<
    Array<{ name: string; address: string; lat: number; lng: number }>
  >([]);
  const [isFocused, setIsFocused] = useState(false);
  const skipNextSearchRef = useRef(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      if (skipNextSearchRef.current) {
        skipNextSearchRef.current = false;
        return;
      }
      if (!isFocused || !query || query.trim().length < 3 || !MAP4D_ACCESS_KEY) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      try {
        const params = new URLSearchParams({ key: MAP4D_ACCESS_KEY, text: query.trim() });
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
  }, [MAP4D_ACCESS_KEY, isFocused, query]);

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
    setQuery(selectedAddress);
    setShowSuggestions(false);
    setIsFocused(false);
    onUpdate("address", selectedAddress);
    onUpdate("latitude", String(item.lat));
    onUpdate("longitude", String(item.lng));
    toast({
      title: "Đã chọn địa chỉ",
      description: "Đã lưu địa chỉ và tọa độ chi nhánh.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ & Vị trí</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Tỉnh / Thành phố</Label>
            <Select
              value={formData.province}
              onValueChange={(val) => onUpdate("province", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Tỉnh/Thành" />
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
            <Label>Phường / Xã</Label>
            <Select
              value={formData.district}
              onValueChange={(val) => onUpdate("district", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường / Xã" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.find((p) => p.code === formData.province)?.districts.map(
                  (district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Phường / Xã</Label>
            <Select
              value={formData.ward}
              onValueChange={(val) => onUpdate("ward", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường/Xã" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="p1">Phường 1</SelectItem>
                <SelectItem value="p2">Phường 2</SelectItem>
                <SelectItem value="kimma">Kim Mã</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2" ref={searchContainerRef}>
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input
            id="address"
            placeholder="Số nhà, đường..."
            value={query}
            onFocus={() => {
              setIsFocused(true);
              if (suggestions.length > 0) setShowSuggestions(true);
            }}
            onChange={(e) => {
              setQuery(e.target.value);
              onUpdate("address", e.target.value);
              if (!e.target.value) {
                setShowSuggestions(false);
                setSuggestions([]);
              }
            }}
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
            Tọa độ: {formData.latitude || "--"}, {formData.longitude || "--"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
