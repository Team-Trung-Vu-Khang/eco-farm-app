import { useState } from "react";
import {
  Button,
  Label,
  Editor,
  Input,
  convertLexicalToHtml,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Upload, X, FileText, Droplets } from "lucide-react";
import type { FertilizerFormData } from "../../types/types";

interface FertilizerUsageStepProps {
  formData: FertilizerFormData;
  updateField: (field: keyof FertilizerFormData, value: any) => void;
}

export const FertilizerUsageStep = ({
  formData,
  updateField,
}: FertilizerUsageStepProps) => {
  const handleRemoveDoc = (index: number) => {
    const newDocs = [...formData.documents];
    newDocs.splice(index, 1);
    updateField("documents", newDocs);
  };

  const [isDragging, setIsDragging] = useState(false);

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
      name: file.name,
      size: file.size,
      file: file,
    }));
    updateField("documents", [...formData.documents, ...newDocs]);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-white p-6 rounded-xl shadow-sm border space-y-6">
        <div>
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Droplets className="w-5 h-5 text-primary" />
            Hướng dẫn sử dụng
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Mô tả cách sử dụng, liều lượng và tài liệu đính kèm
          </p>
        </div>

        <div className="space-y-2">
          <Label>Nội dung hướng dẫn</Label>
          <div className="mt-2 border rounded-lg overflow-hidden">
            <Editor
              contentEditableClassname="h-[300px]"
              initialHtml={formData.usage}
              onSerializedChange={async (value) => {
                const html = await convertLexicalToHtml(value);
                updateField("usage", html);
              }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label>Tài liệu đính kèm (PDF, Word)</Label>

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

          {formData.documents.length > 0 && (
            <div className="space-y-2 mt-4">
              {formData.documents.map((doc, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 border rounded-lg bg-slate-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{doc.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {(doc.size / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveDoc(idx)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
