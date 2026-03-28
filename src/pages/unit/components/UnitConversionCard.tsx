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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowRightLeft } from "lucide-react";
import type { UnitStandard } from "../types/types";

interface UnitConversionCardProps {
  unitName: string;
  conversionFactor: string | number;
  selectedStandard: string;
  selectedStandardLabel: string;
  standardOptions: UnitStandard[];
  onSelectStandard: (value: string) => void;
  onChangeFactor: (value: string) => void;
}

export function UnitConversionCard({
  unitName,
  conversionFactor,
  selectedStandard,
  selectedStandardLabel,
  standardOptions,
  onSelectStandard,
  onChangeFactor,
}: UnitConversionCardProps) {
  return (
    <Card>
      <CardContent className="p-6 space-y-6">
        <div className="flex items-center gap-2 pb-2 border-b">
          <ArrowRightLeft className="w-5 h-5 text-primary" />
          <h3 className="font-semibold text-lg">Quy đổi đơn vị</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-2">
            <Label>
              Đơn vị quy đổi (Quy về) <span className="text-red-500">*</span>
            </Label>
            <Select value={selectedStandard} onValueChange={onSelectStandard}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn đơn vị..." />
              </SelectTrigger>
              <SelectContent>
                {standardOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>
              Hệ số quy đổi <span className="text-red-500">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium whitespace-nowrap">
                1 {unitName || "..."} =
              </span>
              <Input
                type="number"
                min="0"
                step="0.000001"
                value={conversionFactor}
                onChange={(event) => onChangeFactor(event.target.value)}
                required
              />
              <span className="text-sm font-medium whitespace-nowrap text-muted-foreground w-20">
                {selectedStandardLabel}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 text-blue-700 p-3 rounded-md text-sm">
          Ví dụ: Nếu 1 Thùng = 100 Bao 5kg (Tổng 500kg). <br />
          Bạn chọn đơn vị quy đổi là <b>Kilogam (kg)</b> và nhập hệ số là <b>500</b>. <br />
          Hoặc chọn đơn vị quy đổi là <b>Tấn (Ton)</b> và nhập hệ số là <b>0.5</b>.
        </div>
      </CardContent>
    </Card>
  );
}
