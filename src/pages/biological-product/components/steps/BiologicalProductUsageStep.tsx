import { useState } from "react";
import {
  Button,
  Label,
  Input,
  MultiSelect,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X, FileText, Droplets } from "lucide-react";
import type { BiologicalProductFormData } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { farmSupplyApi } from "@/features/farm-supply";

interface BiologicalProductUsageStepProps {
  formData: BiologicalProductFormData;
  updateField: (field: keyof BiologicalProductFormData, value: any) => void;
}

export const BiologicalProductUsageStep = ({
  formData,
  updateField,
}: BiologicalProductUsageStepProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleRemoveDoc = (index: number) => {
    const newDocs = [...formData.documents];
    newDocs.splice(index, 1);
    updateField("documents", newDocs);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files: File[]) => {
    const newDocs = files.map((file) => ({
      fileName: file.name,
      name: file.name,
      size: file.size,
      file: file,
      fileObj: file,
      fileUrl: URL.createObjectURL(file),
      documentType: "MANUAL",
    }));
    updateField("documents", [...(formData.documents || []), ...newDocs]);
  };

  const { data: apiSubjects } = useQuery({
    queryKey: ["target-subjects", "CROP"],
    queryFn: () => farmSupplyApi.getTargetSubjects("CROP"),
    staleTime: 5 * 60 * 1000,
  });

  const cropMultiOptions = (apiSubjects ?? []).map((s: any) => ({
    label: s.name,
    value: s.name,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      {/* Card: Usage Details */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-5">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Droplets className="w-5 h-5 text-primary" />
          Hướng dẫn & Đối tượng sử dụng
        </h3>

        <div className="space-y-2">
          <Label>Công dụng / Chỉ định</Label>
          <Textarea
            value={formData.indications}
            onChange={(e) => updateField("indications", e.target.value)}
            placeholder="Đối kháng nấm bệnh gì, cải tạo đất hay kích thích sinh trưởng ra sao..."
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Giai đoạn tác động</Label>
            <Input
              value={formData.applicationStage}
              onChange={(e) => updateField("applicationStage", e.target.value)}
              placeholder="VD: Xử lý đất trước gieo trồng, giai đoạn cây con, sau thu hoạch..."
            />
          </div>
          <div className="space-y-2">
            <Label>Hạn sử dụng</Label>
            <Input
              value={formData.shelfLife}
              onChange={(e) => updateField("shelfLife", e.target.value)}
              placeholder="VD: 2 năm, 24 tháng..."
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Đối tượng sử dụng (cây trồng áp dụng)</Label>
          <MultiSelect
            options={cropMultiOptions}
            value={formData.targetCrops || []}
            onChange={(value) => updateField("targetCrops", value)}
            placeholder="Chọn các loại cây trồng..."
          />
        </div>

        <div className="space-y-2">
          <Label>Liều lượng khuyến cáo</Label>
          <Textarea
            value={formData.recommendedDosage}
            onChange={(e) => updateField("recommendedDosage", e.target.value)}
            placeholder="VD: Lúa: 100-150 kg/ha/lần. Cây ăn quả: 0.5kg/gốc."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Cách dùng (Phương thức sử dụng)</Label>
          <Textarea
            value={formData.applicationMethod}
            onChange={(e) => updateField("applicationMethod", e.target.value)}
            placeholder="VD: Trộn đất, tưới gốc, phun qua lá, ủ với phân chuồng..."
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Lưu ý khi sử dụng</Label>
          <Textarea
            value={formData.usageNotes}
            onChange={(e) => updateField("usageNotes", e.target.value)}
            placeholder="VD: Không dùng chung thuốc hóa học, tưới giữ ẩm sau khi xử lý..."
            rows={3}
          />
        </div>
      </div>

      {/* Card: Document Upload */}
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Tài liệu đính kèm (PDF, Word)
        </h3>

        <label
          htmlFor="documentUpload"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            isDragging
              ? "border-primary bg-primary/5"
              : "border-slate-200 hover:bg-slate-50"
          }`}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
            <Upload className="w-6 h-6" />
          </div>
          <p className="font-medium text-slate-900">
            Tải lên tài liệu hướng dẫn
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Kéo thả file vào đây hoặc click để chọn (PDF, DOCX)
          </p>
          <Input
            id="documentUpload"
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            multiple
            onChange={handleFileInput}
          />
        </label>

        {formData.documents && formData.documents.length > 0 && (
          <div className="space-y-2 mt-4">
            {formData.documents.map((doc: any, idx: number) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border rounded-lg bg-slate-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm truncate">
                      {doc.fileName || doc.name || doc.fileUrl?.split("/").pop() || `Tài liệu ${idx + 1}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {doc.size
                        ? `${(doc.size / (1024 * 1024)).toFixed(2)} MB`
                        : "Tài liệu đính kèm"}
                    </div>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveDoc(idx)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
