import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea, Input } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Wrench, Upload } from "lucide-react";
import { maintenanceIntervals } from "../../data/constants";
import type { EquipmentFormData } from "../../types";

interface EquipmentOperationStepProps {
  formData: EquipmentFormData;
  updateField: (field: keyof EquipmentFormData, value: any) => void;
}

export const EquipmentOperationStep = ({
  formData,
  updateField,
}: EquipmentOperationStepProps) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Operations & Maintenance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          Vận hành & Bảo dưỡng định kỳ
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Định mức tiêu hao nhiên liệu</Label>
            <Input
              value={formData.fuelConsumptionRate}
              onChange={(e) => updateField("fuelConsumptionRate", e.target.value)}
              placeholder="VD: 4.5 lít/giờ, 0.8 kWh/chuyến..."
            />
            <p className="text-xs text-muted-foreground">Tính theo lít/giờ, lít/ha, kWh/giờ...</p>
          </div>

          <div className="space-y-2">
            <Label>Lịch bảo dưỡng định kỳ</Label>
            <Select
              value={formData.maintenanceSchedule}
              onValueChange={(v) => {
                updateField("maintenanceSchedule", v);
                updateField("maintainanceInterval", v); // Sync legacy field
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn lịch bảo dưỡng..." />
              </SelectTrigger>
              <SelectContent>
                {maintenanceIntervals.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Theo giờ vận hành hoặc theo tháng</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Phụ tùng chính kèm theo</Label>
          <Textarea
            value={formData.mainAccessories}
            onChange={(e) => updateField("mainAccessories", e.target.value)}
            placeholder="Danh sách phụ kiện, phụ tùng đi kèm máy (VD: Trạm sạc, dàn xới, lọc dầu...)"
            rows={4}
          />
        </div>
      </div>

      {/* Technical Documents / Guides */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Tài liệu kỹ thuật / Hướng dẫn sử dụng
          </h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "file")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "file"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Tải file lên
            </button>
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "editor")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "editor"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Nhập nội dung
            </button>
          </div>
        </div>

        {formData.technicalDocType === "file" ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <FileText className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">
              Tải lên tài liệu kỹ thuật
            </h4>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Hỗ trợ PDF, DOCX, bản vẽ kỹ thuật... Dung lượng tối đa 50MB.
            </p>
            <Button type="button">
              <Upload className="w-4 h-4 mr-2" />
              Chọn tài liệu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Nội dung hướng dẫn vận hành / Quy chuẩn</Label>
            <Textarea
              className="min-h-[250px] font-mono leading-relaxed"
              placeholder="# Hướng dẫn vận hành..."
              value={formData.technicalDocContent}
              onChange={(e) =>
                updateField("technicalDocContent", e.target.value)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};
