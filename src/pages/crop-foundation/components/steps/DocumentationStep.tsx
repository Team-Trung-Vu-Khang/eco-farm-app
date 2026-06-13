import {
  Card,
  Editor,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Leaf, ShieldCheck, Upload } from "lucide-react";

import type { CreateCropFoundationForm } from "../../types/types";

interface DocumentationStepProps {
  formData: CreateCropFoundationForm;
  handleUpdateDocs: (
    docKey: "farmingTechnique" | "qualityStandard",
    updates: any,
  ) => void;
}

export function DocumentationStep({
  formData,
  handleUpdateDocs,
}: DocumentationStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-linear-to-r from-purple-50 via-white to-purple-50 p-6">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Hệ thống tài liệu
            </h3>
            <p className="text-sm text-slate-500">
              Cập nhật các hướng dẫn kỹ thuật và tiêu chuẩn chất lượng
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-12">
        {(["farmingTechnique"] as const).map((docKey) => {
          const doc = formData.docs[docKey];
          const isFarming = docKey === "farmingTechnique";
          return (
            <div key={docKey} className="space-y-6">
              <div
                className={cn(
                  "flex items-center gap-3 border-l-4 pl-4 py-1",
                  isFarming ? "border-green-500" : "border-blue-500",
                )}
              >
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-lg",
                    isFarming
                      ? "bg-green-50 text-green-600"
                      : "bg-blue-50 text-blue-600",
                  )}
                >
                  {isFarming ? (
                    <Leaf className="h-6 w-6" />
                  ) : (
                    <ShieldCheck className="h-6 w-6" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    {isFarming ? "Kỹ thuật canh tác" : "Tiêu chuẩn chất lượng"}
                  </h3>
                  <p className="text-sm text-slate-500">
                    {isFarming
                      ? "Quy trình làm đất, bón phân, tưới nước và chăm sóc định kỳ"
                      : "Các tiêu chí VietGAP, GlobalGAP, tiêu chuẩn xuất khẩu..."}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <RadioGroup
                  value={doc.type}
                  onValueChange={(v) => handleUpdateDocs(docKey, { type: v })}
                  className="flex items-center gap-6 pl-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="editor" id={`${docKey}-editor`} />
                    <Label
                      htmlFor={`${docKey}-editor`}
                      className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      Soạn thảo nội dung
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pdf" id={`${docKey}-pdf`} />
                    <Label
                      htmlFor={`${docKey}-pdf`}
                      className="text-sm font-medium cursor-pointer flex items-center gap-1.5"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload PDF
                    </Label>
                  </div>
                </RadioGroup>

                {doc.type === "editor" ? (
                  <Card className="overflow-hidden border-2 focus-within:border-green-500/50 transition-all shadow-sm">
                    <Editor
                      maxLength={10000}
                      contentEditableClassname="h-[200px] p-4 focus:outline-none bg-white font-sans text-sm"
                      initialHtml={
                        typeof doc.content === "string"
                          ? doc.content
                          : undefined
                      }
                      editorSerializedState={
                        typeof doc.content !== "string"
                          ? doc.content
                          : undefined
                      }
                      onSerializedChange={(content) =>
                        handleUpdateDocs(docKey, { content })
                      }
                    />
                  </Card>
                ) : (
                  <div className="border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-5 h-5 text-muted-foreground/60" />
                    </div>
                    <p className="text-sm font-bold text-foreground">
                      Click để tải lên PDF
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Hỗ trợ định dạng .pdf, dung lượng tối đa 10MB
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
