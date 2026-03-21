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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PROVINCES } from "@/constants/province";

interface AddressLocationCardProps {
  formData: {
    province: string;
    district: string;
    ward: string;
    address: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function AddressLocationCard({ formData, onUpdate }: AddressLocationCardProps) {
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
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input
            id="address"
            placeholder="Số nhà, đường..."
            value={formData.address}
            onChange={(e) => onUpdate("address", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
