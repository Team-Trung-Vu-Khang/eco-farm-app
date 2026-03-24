import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PROVINCES } from "@/constants/province";
import type { PersonnelFormData } from "../types";

interface ContactAddressCardProps {
  formData: PersonnelFormData;
  onChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => void;
}

export function ContactAddressCard({ formData, onChange }: ContactAddressCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Địa chỉ liên hệ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="province">Tỉnh / Thành phố</Label>
            <Select
              value={formData.province}
              onValueChange={(val) => onChange("province", val)}
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
            <Label htmlFor="district">Phường / Xã</Label>
            <Select
              value={formData.district}
              onValueChange={(val) => onChange("district", val)}
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
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Địa chỉ chi tiết</Label>
          <Input
            id="address"
            placeholder="Số nhà, tên đường, phường/xã..."
            value={formData.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
