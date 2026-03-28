import {
  Card,
  CardContent,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Scale } from "lucide-react";
import { UNIT_STATUS_OPTIONS, UNIT_TYPE_OPTIONS } from "../data/constants";
import type { UnitFormData } from "../types/types";

interface UnitBasicInfoCardProps {
  formData: UnitFormData;
  updateField: <K extends keyof UnitFormData>(
    field: K,
    value: UnitFormData[K],
  ) => void;
}

export function UnitBasicInfoCard({
  formData,
  updateField,
}: UnitBasicInfoCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b">
          <Scale className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Thông tin cơ bản</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>
              Mã đơn vị <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.code}
              onChange={(event) => updateField("code", event.target.value)}
              placeholder="VD: BAG25, KG, LIT..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label>
              Tên đơn vị <span className="text-red-500">*</span>
            </Label>
            <Input
              value={formData.name}
              onChange={(event) => updateField("name", event.target.value)}
              placeholder="VD: Bao 25kg, Thùng 20L..."
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại đơn vị</Label>
            <Select
              value={formData.type}
              onValueChange={(value) => updateField("type", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_TYPE_OPTIONS.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => updateField("status", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {UNIT_STATUS_OPTIONS.map((status) => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Mô tả</Label>
          <Textarea
            value={formData.description}
            onChange={(event) => updateField("description", event.target.value)}
            placeholder="Mô tả chi tiết..."
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );
}
