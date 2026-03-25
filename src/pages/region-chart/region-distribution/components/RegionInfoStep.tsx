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
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import { PROVINCES } from "@/constants/province";
import type { Region } from "../../constants";

type EnterpriseOption = {
  id: string | number;
  name: string;
  province?: string;
  district?: string;
  address?: string;
};

type LookupOption = {
  id?: string | number;
  code?: string | number;
  name: string;
};

interface RegionInfoStepProps {
  formData: Partial<Region>;
  setFormData: (data: Partial<Region>) => void;
  enterprises: EnterpriseOption[];
  lands: LookupOption[];
  terrains: LookupOption[];
}

export const RegionInfoStep = ({
  formData,
  setFormData,
  enterprises,
  lands,
  terrains,
}: RegionInfoStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cơ bản</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Mã vùng <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.code || ""}
              onChange={(event) =>
                setFormData({ ...formData, code: event.target.value })
              }
              placeholder="VD: REG-001"
            />
          </div>
          <div className="space-y-2">
            <Label>
              Tên vùng <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name || ""}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
              placeholder="Tên vùng trồng"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Đơn vị sở hữu <span className="text-red-500">*</span>
            </Label>
            <EnterpriseSelector
              selectedId={formData.enterpriseId || ""}
              onSelect={(value) => {
                const selectedEnterprise = enterprises.find(
                  (enterprise) => enterprise.id.toString() === value,
                );

                if (selectedEnterprise) {
                  const normalize = (input: string) =>
                    input
                      .toLowerCase()
                      .replace(/^(tỉnh|thành phố|tp\.)\s+/i, "")
                      .trim();

                  const province = PROVINCES.find(
                    (item) =>
                      normalize(item.name) ===
                      normalize(selectedEnterprise.province || ""),
                  );
                  const district = province?.districts.find(
                    (item) =>
                      normalize(item.name) ===
                      normalize(selectedEnterprise.district || ""),
                  );

                  setFormData({
                    ...formData,
                    enterpriseId: value,
                    provinceId: province?.code || formData.provinceId,
                    districtId: district?.code || formData.districtId,
                    address: selectedEnterprise.address || formData.address,
                  });
                  return;
                }

                setFormData({ ...formData, enterpriseId: value });
              }}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-medium">Diện tích (ha)</Label>
            <Input
              type="number"
              className="h-10 border-slate-300 focus:border-primary focus:ring-primary/20"
              value={formData.area || ""}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  area: parseFloat(event.target.value),
                })
              }
              placeholder="Nhập diện tích"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tỉnh / Thành Phố</Label>
            <Select
              value={formData.provinceId}
              onValueChange={(value) =>
                setFormData({ ...formData, provinceId: value })
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
            <Label>Phường/Xã</Label>
            <Select
              value={formData.districtId}
              onValueChange={(value) =>
                setFormData({ ...formData, districtId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn Phường / Xã" />
              </SelectTrigger>
              <SelectContent>
                {PROVINCES.find((province) => province.code === formData.provinceId)?.districts.map(
                  (district) => (
                    <SelectItem key={district.code} value={district.code}>
                      {district.name}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Địa chỉ chi tiết</Label>
          <Input
            value={formData.address || ""}
            onChange={(event) =>
              setFormData({ ...formData, address: event.target.value })
            }
            placeholder="Số nhà, đường, thôn/xóm..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại đất</Label>
            <Select
              value={formData.landType}
              onValueChange={(value) =>
                setFormData({ ...formData, landType: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại đất" />
              </SelectTrigger>
              <SelectContent>
                {lands.map((land) => (
                  <SelectItem
                    key={land.id || land.code}
                    value={(land.id || land.code || "").toString()}
                  >
                    {land.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Địa hình</Label>
            <Select
              value={formData.terrain}
              onValueChange={(value) =>
                setFormData({ ...formData, terrain: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn địa hình" />
              </SelectTrigger>
              <SelectContent>
                {terrains.map((terrain) => (
                  <SelectItem
                    key={terrain.id || terrain.code}
                    value={(terrain.id || terrain.code || "").toString()}
                  >
                    {terrain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Ghi chú</Label>
          <Textarea
            value={formData.note || ""}
            onChange={(event) =>
              setFormData({ ...formData, note: event.target.value })
            }
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
};
