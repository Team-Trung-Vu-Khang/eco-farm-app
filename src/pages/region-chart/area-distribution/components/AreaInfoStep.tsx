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
import { MapPin } from "lucide-react";
import { EnterpriseSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import type { Land } from "@/stores/useLandStore";
import type { Terrain } from "@/stores/useTerrainStore";
import type { Region, SubArea } from "../../constants";
import { AreaRegionSelector, SelectedRegionCard } from "./AreaRegionSelector";

interface AreaInfoStepProps {
  selectEnterpriseId: number | null;
  setSelectEnterpriseId: (value: number | null) => void;
  regions: Region[];
  selectedRegionId: number | null;
  setSelectedRegionId: (value: number | null) => void;
  formData: Partial<SubArea>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<SubArea>>>;
  lands: Land[];
  terrains: Terrain[];
}

export function AreaInfoStep({
  selectEnterpriseId,
  setSelectEnterpriseId,
  regions,
  selectedRegionId,
  setSelectedRegionId,
  formData,
  setFormData,
  lands,
  terrains,
}: AreaInfoStepProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin khu vực</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          <div className="space-y-3">
            <Label className="text-sm font-medium">
              Đơn vị sở hữu <span className="text-red-500">*</span>
            </Label>
            <EnterpriseSelector
              selectedId={selectEnterpriseId?.toString() ?? ""}
              onSelect={(value) => {
                setSelectEnterpriseId(value ? Number(value) : null);
                setSelectedRegionId(null);
                setFormData((prev) => ({
                  ...prev,
                  landType: "",
                  terrain: "",
                }));
              }}
            />
          </div>

          <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-700">
              Vùng trồng <span className="text-red-500">*</span>
            </Label>

            <AreaRegionSelector
              regions={regions}
              enterpriseId={selectEnterpriseId}
              selectedId={selectedRegionId?.toString()}
              onSelect={(id) => {
                const region = regions.find((item) => item.id === Number(id));
                setSelectedRegionId(Number(id));
                if (region) {
                  setFormData((prev) => ({
                    ...prev,
                    landType: region.landType || "",
                    terrain: region.terrain || "",
                  }));
                }
              }}
            />

            <div className="mt-1">
              {selectedRegionId ? (
                <SelectedRegionCard
                  regionId={selectedRegionId.toString()}
                  regions={regions}
                  onRemove={() => {
                    setSelectedRegionId(null);
                    setFormData((prev) => ({
                      ...prev,
                      landType: "",
                      terrain: "",
                    }));
                  }}
                />
              ) : (
                <div className="animate-in fade-in flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-100 bg-slate-50/50 px-4 py-6 text-center duration-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-300 shadow-sm">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="text-[11px] font-bold text-slate-500">
                    Chưa chọn vùng trồng
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Mã khu vực <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.code || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, code: e.target.value }))
              }
              placeholder="VD: KHU-A"
            />
          </div>
          <div className="space-y-2">
            <Label>
              Tên khu vực <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name || ""}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Tên khu vực"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Diện tích (ha)</Label>
            <Input
              type="number"
              value={formData.area || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  area: parseFloat(e.target.value),
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Loại đất</Label>
            <Select
              value={formData.landType || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, landType: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại đất" />
              </SelectTrigger>
              <SelectContent>
                {lands.map((land) => (
                  <SelectItem key={land.code} value={land.code}>
                    {land.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Địa hình</Label>
            <Select
              value={formData.terrain || ""}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, terrain: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn địa hình" />
              </SelectTrigger>
              <SelectContent>
                {terrains.map((terrain) => (
                  <SelectItem key={terrain.code} value={terrain.code}>
                    {terrain.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
