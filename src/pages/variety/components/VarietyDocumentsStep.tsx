import {
  BookOpen,
  FileText,
  Trash,
  Upload,
} from "lucide-react";
import {
  Button,
  Card,
  Editor,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
  type SerializedEditorState,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { initialEditorValue } from "../../docs/mocks";
import type { CreateVarietyForm } from "../types/types";

interface VarietyDocumentsStepProps {
  formData: CreateVarietyForm;
  updateField: <K extends keyof CreateVarietyForm>(
    key: K,
    value: CreateVarietyForm[K],
  ) => void;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  onContentTypeChange: (value: "pdf" | "editor") => void;
}

export function VarietyDocumentsStep({
  formData,
  updateField,
  pdfInputRef,
  onContentTypeChange,
}: VarietyDocumentsStepProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative overflow-hidden rounded-xl border border-purple-200 bg-linear-to-r from-purple-50 via-white to-purple-50 p-6 shadow-sm">
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-purple-100 flex items-center justify-center text-purple-600 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-900">Tài liệu kỹ thuật</h3>
            <p className="text-sm text-purple-700/80">
              Lưu trữ các hướng dẫn kỹ thuật quan trọng cho giống cây này
            </p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <Label className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Chọn hình thức tài liệu
          </Label>
          <RadioGroup
            defaultValue="pdf"
            value={formData.contentType}
            onValueChange={onContentTypeChange}
            className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl w-full max-w-md"
          >
            <div className="relative">
              <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
              <Label
                htmlFor="pdf"
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-6 rounded-xl cursor-pointer font-bold text-sm transition-all duration-300",
                  formData.contentType === "pdf"
                    ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                )}
              >
                <Upload className="w-4 h-4" />
                Tải file PDF
              </Label>
            </div>
            <div className="relative">
              <RadioGroupItem value="editor" id="editor" className="peer sr-only" />
              <Label
                htmlFor="editor"
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-6 rounded-xl cursor-pointer font-bold text-sm transition-all duration-300",
                  formData.contentType === "editor"
                    ? "bg-white text-purple-700 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-200/50",
                )}
              >
                <FileText className="w-4 h-4" />
                Soạn thảo
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="min-h-[400px]">
          {formData.contentType === "pdf" ? (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-8">
                <div
                  onClick={() => pdfInputRef.current?.click()}
                  className={cn(
                    "group flex flex-col items-center justify-center rounded-3xl border-2 border-dashed h-[400px] transition-all cursor-pointer bg-white relative overflow-hidden",
                    formData.pdfFile
                      ? "bg-purple-50/30 border-purple-500/30"
                      : "hover:bg-purple-50/30 hover:border-purple-500/50 border-slate-200",
                  )}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    ref={pdfInputRef}
                    className="hidden"
                    onChange={(event) =>
                      updateField("pdfFile", event.target.files?.[0] || null)
                    }
                  />
                  <div className="absolute inset-0 bg-linear-to-br from-transparent to-purple-50/30 pointer-events-none" />

                  {formData.pdfFile ? (
                    <div className="flex flex-col items-center text-center p-8 z-10 w-full max-w-sm mx-auto animate-in zoom-in duration-300">
                      <div className="w-20 h-20 rounded-2xl bg-white shadow-xl shadow-purple-100 flex items-center justify-center text-red-500 mb-6 ring-4 ring-white">
                        <FileText className="w-10 h-10" />
                      </div>
                      <h4 className="text-lg font-bold text-slate-900 line-clamp-2 break-all">
                        {formData.pdfFile.name}
                      </h4>
                      <p className="text-sm text-slate-500 mt-2 font-medium bg-slate-100 px-3 py-1 rounded-full">
                        {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="mt-8 rounded-full px-6 shadow-red-200 shadow-lg"
                        onClick={(event) => {
                          event.stopPropagation();
                          updateField("pdfFile", null);
                        }}
                      >
                        <Trash className="w-4 h-4 mr-2" />
                        Xóa file
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-6 text-center z-10 p-8">
                      <div className="w-24 h-24 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:scale-110 group-hover:bg-purple-100 group-hover:text-purple-600 transition-all duration-500">
                        <Upload className="w-10 h-10" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-bold text-slate-700 group-hover:text-purple-700 transition-colors">
                          Tải lên tài liệu PDF
                        </p>
                        <p className="text-sm text-slate-500 max-w-xs mx-auto">
                          Kéo thả file vào đây hoặc click để chọn từ máy tính của bạn
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:col-span-4 space-y-6">
                <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-6 space-y-4">
                  <h4 className="font-bold text-purple-900 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Lưu ý tài liệu
                  </h4>
                  <ul className="space-y-3">
                    {[
                      "Định dạng PDF chuẩn",
                      "Dung lượng tối đa 10MB",
                      "Không chứa mã độc",
                      "Nội dung rõ ràng, dễ đọc",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-purple-800/80"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <p className="text-xs text-slate-500 leading-relaxed text-justify">
                    * Tài liệu kỹ thuật bao gồm: Quy trình canh tác, Hướng dẫn
                    chăm sóc, Tiêu chuẩn thu hoạch và các chứng nhận chất lượng
                    liên quan.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-purple-100 to-pink-100 rounded-[20px] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
                <Card className="relative overflow-hidden border-2 border-slate-100 shadow-sm focus-within:border-purple-500/50 focus-within:ring-4 focus-within:ring-purple-500/10 transition-all rounded-2xl bg-white">
                  <Editor
                    maxLength={2000000}
                    contentEditableClassname="h-[500px] p-8 focus:outline-none bg-white font-serif text-base leading-loose text-slate-700"
                    editorSerializedState={
                      typeof formData.editorContent === "string"
                        ? (initialEditorValue as unknown as SerializedEditorState)
                        : (formData.editorContent as unknown as SerializedEditorState)
                    }
                    onSerializedChange={(content) =>
                      updateField("editorContent", content as unknown as string)
                    }
                  />
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
