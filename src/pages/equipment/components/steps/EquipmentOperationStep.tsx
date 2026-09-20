import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
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
              onChange={(e) =>
                updateField("fuelConsumptionRate", e.target.value)
              }
              placeholder="VD: 4.5 lít/giờ, 0.8 kWh/chuyến..."
            />
            <p className="text-xs text-muted-foreground">
              Tính theo lít/giờ, lít/ha, kWh/giờ...
            </p>
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
            <p className="text-xs text-muted-foreground">
              Theo giờ vận hành hoặc theo tháng
            </p>
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
        <div className="flex items-center justify-between flex-wrap gap-4 border-b pb-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Tài liệu kỹ thuật / Hướng dẫn sử dụng
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Đính kèm bản vẽ, sách hướng dẫn sử dụng (PDF, DOCX, Ảnh) hoặc nhập
              trực tiếp quy trình vận hành
            </p>
          </div>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "file")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                (formData.technicalDocType || "file") === "file"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Tải file lên
            </button>
            <button
              type="button"
              onClick={() => updateField("technicalDocType", "editor")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "editor"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Soạn thảo trực tiếp
            </button>
          </div>
        </div>

        {(formData.technicalDocType || "file") === "file" ? (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer block min-h-[160px]">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3 text-blue-600">
                <Upload className="w-7 h-7" />
              </div>
              <h4 className="text-base font-semibold text-slate-800">
                Tải lên tài liệu kỹ thuật / HDSD
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1">
                Hỗ trợ định dạng PDF, DOCX, bản vẽ CAD hoặc file ảnh — Tối đa
                20MB
              </p>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.zip"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const currentDocs = formData.documents || [];
                  const newDoc = {
                    documentType: "MANUAL",
                    fileName: file.name,
                    fileUrl: URL.createObjectURL(file),
                    fileObj: file,
                    content: "",
                  };
                  updateField("documents", [...currentDocs, newDoc]);
                }}
              />
            </label>

            {(formData.documents || []).length > 0 && (
              <div className="space-y-2 pt-2">
                <Label className="text-xs font-semibold text-slate-600">
                  Danh sách tài liệu đã đính kèm:
                </Label>
                <div className="space-y-2">
                  {(formData.documents || []).map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-blue-100/70 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-800 truncate">
                            {doc.fileName ||
                              doc.fileUrl?.split("/").pop() ||
                              `Tài liệu ${index + 1}`}
                          </p>
                          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                            ✓ Sẵn sàng đính kèm
                          </span>
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="text-slate-400 hover:text-red-600 h-8 w-8 p-0 rounded-full"
                        onClick={() => {
                          const updated = (formData.documents || []).filter(
                            (_, i) => i !== index,
                          );
                          updateField("documents", updated);
                        }}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <Label className="font-medium text-slate-700">
              Nội dung hướng dẫn vận hành / Quy chuẩn
            </Label>
            <Textarea
              className="min-h-[250px] font-mono text-sm leading-relaxed"
              placeholder="# Hướng dẫn vận hành..."
              value={formData.technicalDocContent || ""}
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
