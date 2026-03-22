import { useState, useRef, useEffect } from "react";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { PROVINCES } from "@/constants/province";
import type { BranchFormData } from "../../hooks/useBranchForm";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function LocationMarker({
  position,
  setPosition,
}: {
  position: [number, number];
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} /> : null;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMapEvents({});
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

interface LocationStepProps {
  formData: BranchFormData;
  updateFormData: (updates: Partial<BranchFormData>) => void;
}

export function LocationStep({ formData, updateFormData }: LocationStepProps) {
  const { toast } = useToast();
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [searchAddress, setSearchAddress] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchAddress) handleSearchAddress(searchAddress);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchAddress]);

  const handleSearchAddress = async (query: string) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    try {
      const resp = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=vn&limit=5`,
      );
      const data = await resp.json();
      setAddressSuggestions(data || []);
      setShowSuggestions(!!(data && data.length > 0));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSelectAddress = (suggestion: any) => {
    const address = suggestion.address || {};
    const road = address.road || address.street || "";
    const houseNumber = address.house_number || "";
    const streetAddress = houseNumber ? `${houseNumber} ${road}` : road;

    updateFormData({
      latitude: parseFloat(suggestion.lat),
      longitude: parseFloat(suggestion.lon),
      address: streetAddress || suggestion.display_name.split(",")[0],
      ward: address.suburb || address.neighbourhood || address.quarter || "",
      district: address.city_district || address.county || address.town || "",
      city: address.city || address.province || address.state || "",
    });

    setSearchAddress(suggestion.display_name);
    setShowSuggestions(false);
    toast({
      title: "Thành công",
      description: "Đã tìm thấy địa chỉ trên bản đồ",
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          updateFormData({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          });
          toast({ title: "Thành công", description: "Đã lấy vị trí hiện tại" });
        },
        () =>
          toast({
            title: "Lỗi",
            description: "Không thể lấy vị trí hiện tại",
            variant: "destructive",
          }),
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Tìm kiếm địa chỉ trên bản đồ</h3>
        </div>

        <div className="relative" ref={searchContainerRef}>
          <Input
            value={searchAddress}
            onChange={(e) => {
              setSearchAddress(e.target.value);
              if (!e.target.value) setShowSuggestions(false);
            }}
            placeholder="Nhập địa chỉ để tìm kiếm..."
            onFocus={() =>
              addressSuggestions.length > 0 && setShowSuggestions(true)
            }
          />

          {showSuggestions && addressSuggestions.length > 0 && (
            <div className="absolute z-[99999] w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {addressSuggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0 transition-colors"
                  onClick={() => handleSelectAddress(suggestion)}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {suggestion.display_name}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-96 rounded-lg overflow-hidden border">
          <MapContainer
            center={[formData.latitude, formData.longitude]}
            zoom={15}
            style={{ height: "100%", width: "100%", zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker
              position={[formData.latitude, formData.longitude]}
              setPosition={(pos) =>
                updateFormData({ latitude: pos[0], longitude: pos[1] })
              }
            />
            <MapUpdater center={[formData.latitude, formData.longitude]} />
          </MapContainer>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Vĩ độ</Label>
            <Input value={formData.latitude.toFixed(6)} disabled />
          </div>
          <div className="space-y-2">
            <Label>Kinh độ</Label>
            <Input value={formData.longitude.toFixed(6)} disabled />
          </div>
        </div>

        <Button
          variant="outline"
          onClick={handleGetCurrentLocation}
          className="w-full"
          type="button"
        >
          <MapPin className="w-4 h-4 mr-2" /> Lấy vị trí hiện tại
        </Button>
      </div>

      <div className="pt-4 border-t">
        <h3 className="font-semibold mb-4">Địa chỉ chi tiết</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => updateFormData({ address: e.target.value })}
              placeholder="Số nhà, tên đường"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">Tỉnh / Thành phố</Label>
              <Select
                value={formData.city}
                onValueChange={(val) => updateFormData({ city: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Tỉnh / Thành phố" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.map((p) => (
                    <SelectItem key={p.code} value={p.code}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ward">Phường / Xã</Label>
              <Select
                value={formData.ward}
                onValueChange={(val) => updateFormData({ ward: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn Phường / Xã" />
                </SelectTrigger>
                <SelectContent>
                  {PROVINCES.find(
                    (p) => p.code === formData.city,
                  )?.districts.map((d) => (
                    <SelectItem key={d.code} value={d.code}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
