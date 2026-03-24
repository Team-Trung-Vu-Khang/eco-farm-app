import {
  Button,
  Label,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Upload } from "lucide-react";
import type { PesticideFormData } from "../types";

interface PesticideTechnicalDocsStepProps {
  formData: PesticideFormData;
  onFormFieldChange: <K extends keyof PesticideFormData>(
    field: K,
    value: PesticideFormData[K],
  ) => void;
}

export default function PesticideTechnicalDocsStep({
  formData,
  onFormFieldChange,
}: PesticideTechnicalDocsStepProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">Tài liệu kỹ thuật</h3>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => onFormFieldChange("technicalDocType", "file")}
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
              onClick={() => onFormFieldChange("technicalDocType", "editor")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                formData.technicalDocType === "editor"
                  ? "bg-white shadow-sm text-primary"
                  : "text-muted-foreground hover:text-slate-900"
              }`}
            >
              Soạn thảo trực tiếp
            </button>
          </div>
        </div>

        {formData.technicalDocType === "file" ? (
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-12 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
              <FileText className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-semibold mb-2">
              Tải lên tài liệu kỹ thuật
            </h4>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              Hỗ trợ định dạng PDF, DOCX. Dung lượng tối đa 20MB.
            </p>
            <Button>
              <Upload className="w-4 h-4 mr-2" />
              Chọn tài liệu
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Label>Nội dung tài liệu</Label>
            <Textarea
              className="min-h-[400px] font-mono"
              placeholder="# Tài liệu kỹ thuật..."
              value={formData.technicalDocContent}
              onChange={(e) =>
                onFormFieldChange("technicalDocContent", e.target.value)
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
