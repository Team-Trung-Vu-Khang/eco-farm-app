import {
  Button,
  Card,
  Editor,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, CloudUpload, FileText, Trash, X } from "lucide-react";
import type { CreateVarietyForm } from "../types/types";

interface SeedDocumentationStepProps {
  compactMode?: boolean;
  formData: CreateVarietyForm;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  setFormData: React.Dispatch<React.SetStateAction<CreateVarietyForm>>;
}

export function SeedDocumentationStep({
  compactMode = false,
  formData,
  pdfInputRef,
  setFormData,
}: SeedDocumentationStepProps) {
  if (compactMode) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 py-4">
        <div className="flex flex-col items-center space-y-4">
          <Label className="text-center text-sm font-bold uppercase tracking-widest text-slate-700">
            Hình thức đính kèm
          </Label>
          <RadioGroup
            defaultValue="pdf"
            value={formData.contentType}
            onValueChange={(value: "pdf" | "editor") =>
              setFormData((currentForm) => ({
                ...currentForm,
                contentType: value,
              }))
            }
            className="flex gap-6"
          >
            {[
              { value: "pdf", label: "Tải file PDF" },
              { value: "editor", label: "Soạn thảo trực tiếp" },
            ].map((option) => (
              <div
                key={option.value}
                className={cn(
                  "flex min-w-[200px] cursor-pointer items-center space-x-3 rounded-xl border p-4 transition-all",
                  formData.contentType === option.value
                    ? "border-green-200 bg-green-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300",
                )}
                onClick={() =>
                  setFormData((currentForm) => ({
                    ...currentForm,
                    contentType: option.value as "pdf" | "editor",
                  }))
                }
              >
                <RadioGroupItem
                  value={option.value}
                  id={`${option.value}-opt-step`}
                  className="text-green-600 data-[state=checked]:border-green-600 data-[state=checked]:text-green-600"
                />
                <Label
                  htmlFor={`${option.value}-opt-step`}
                  className="cursor-pointer text-sm font-bold text-slate-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <SeedDocumentationContent
          compactMode
          formData={formData}
          pdfInputRef={pdfInputRef}
          setFormData={setFormData}
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 py-4">
      <div className="mb-8 space-y-2 text-center">
        <h3 className="text-lg font-bold text-slate-800">
          Phương thức cung cấp tài liệu
        </h3>
        <p className="text-slate-500">
          Chọn cách bạn muốn nhập thông tin hướng dẫn kỹ thuật cho giống này
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div
          onClick={() =>
            setFormData((currentForm) => ({
              ...currentForm,
              contentType: "pdf",
            }))
          }
          className={cn(
            "group relative cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md",
            formData.contentType === "pdf"
              ? "border-green-500 bg-green-50/10 ring-2 ring-green-500/20"
              : "border-slate-100 bg-white hover:border-green-200",
          )}
        >
          <div className="mb-4 flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                formData.contentType === "pdf"
                  ? "bg-green-100 text-green-600"
                  : "bg-slate-100 text-slate-400 group-hover:bg-green-50 group-hover:text-green-500",
              )}
            >
              <CloudUpload className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Tải file PDF</h4>
              <p className="text-sm text-slate-500">Dành cho tài liệu có sẵn</p>
            </div>
            {formData.contentType === "pdf" && (
              <div className="absolute right-6 top-6">
                <CheckCircle2 className="h-6 w-6 fill-green-100 text-green-600" />
              </div>
            )}
          </div>
        </div>

        <div
          onClick={() =>
            setFormData((currentForm) => ({
              ...currentForm,
              contentType: "editor",
            }))
          }
          className={cn(
            "group relative cursor-pointer rounded-2xl border-2 p-6 transition-all hover:shadow-md",
            formData.contentType === "editor"
              ? "border-green-500 bg-green-50/10 ring-2 ring-green-500/20"
              : "border-slate-100 bg-white hover:border-green-200",
          )}
        >
          <div className="mb-4 flex items-center gap-4">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-full transition-colors",
                formData.contentType === "editor"
                  ? "bg-green-100 text-green-600"
                  : "bg-slate-100 text-slate-400 group-hover:bg-green-50 group-hover:text-green-500",
              )}
            >
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Soạn thảo trực tiếp</h4>
              <p className="text-sm text-slate-500">Nhập nội dung văn bản</p>
            </div>
            {formData.contentType === "editor" && (
              <div className="absolute right-6 top-6">
                <CheckCircle2 className="h-6 w-6 fill-green-100 text-green-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4">
        <SeedDocumentationContent
          formData={formData}
          pdfInputRef={pdfInputRef}
          setFormData={setFormData}
        />
      </div>
    </div>
  );
}

function SeedDocumentationContent({
  compactMode = false,
  formData,
  pdfInputRef,
  setFormData,
}: {
  compactMode?: boolean;
  formData: CreateVarietyForm;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  setFormData: React.Dispatch<React.SetStateAction<CreateVarietyForm>>;
}) {
  if (formData.contentType === "pdf") {
    return (
      <div
        onClick={() => pdfInputRef.current?.click()}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center justify-center border-2 border-dashed transition-all",
          compactMode
            ? "rounded-3xl bg-slate-50/30 p-10"
            : "min-h-[280px] rounded-3xl bg-slate-50/50 p-12",
          formData.pdfFile
            ? "border-green-500/30 bg-green-50/10"
            : "border-slate-200 hover:border-green-500/50 hover:bg-green-50/10",
        )}
      >
        <input
          type="file"
          accept=".pdf"
          ref={pdfInputRef}
          className="hidden"
          onChange={(event) =>
            setFormData((currentForm) => ({
              ...currentForm,
              pdfFile: event.target.files?.[0] || null,
            }))
          }
        />
        {formData.pdfFile ? (
          compactMode ? (
            <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-red-500 shadow-xl shadow-green-900/5 ring-1 ring-slate-100">
                <FileText className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <p className="max-w-md break-all text-lg font-bold text-slate-800">
                  {formData.pdfFile.name}
                </p>
                <p className="text-sm font-medium text-slate-500">
                  File PDF sẵn sàng để tải lên
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-red-500 hover:bg-red-50 hover:text-red-700"
                  onClick={(event) => {
                    event.stopPropagation();
                    setFormData((currentForm) => ({
                      ...currentForm,
                      pdfFile: null,
                    }));
                  }}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Gỡ bỏ file
                </Button>
              </div>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 flex w-full max-w-md items-center gap-6 rounded-2xl bg-white p-4 shadow-xl shadow-green-900/5 ring-1 ring-slate-100 duration-300">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <FileText className="h-7 w-7" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-slate-800">
                  {formData.pdfFile.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-400">
                  {(formData.pdfFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500"
                onClick={(event) => {
                  event.stopPropagation();
                  setFormData((currentForm) => ({
                    ...currentForm,
                    pdfFile: null,
                  }));
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )
        ) : compactMode ? (
          <div className="flex flex-col items-center gap-5 py-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 transition-transform group-hover:scale-110">
              <CloudUpload className="h-10 w-10 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-bold text-slate-700">
                Chọn tài liệu hướng dẫn PDF
              </p>
              <p className="text-xs font-medium text-slate-400">
                Kéo thả hoặc click để chọn file (Max 5MB)
              </p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-lg ring-1 ring-slate-100 transition-transform group-hover:scale-110">
              <CloudUpload className="h-8 w-8 text-green-500" />
            </div>
            <div className="space-y-1">
              <p className="text-base font-bold text-slate-700 transition-colors group-hover:text-green-700">
                Tải liệu hướng dẫn PDF
              </p>
              <p className="mx-auto max-w-xs text-sm font-medium text-slate-400">
                Kéo thả hoặc click để tải lên file PDF (Tối đa 5MB)
              </p>
            </div>
            <Button
              variant="outline"
              className="mt-2 border-slate-200 bg-white text-slate-600 hover:border-green-200 hover:text-green-700"
            >
              Chọn file
            </Button>
          </div>
        )}
      </div>
    );
  }

  return compactMode ? (
    <div className="animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-3 flex items-center justify-between px-1">
        <Label className="text-sm font-bold text-slate-700">
          Nội dung chi tiết tài liệu
        </Label>
        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-400">
          Trình soạn thảo văn bản
        </span>
      </div>
      <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-xl shadow-slate-100/50">
        <Editor
          maxLength={10000}
          initialText={formData.editorContent}
          contentEditableClassname="min-h-[400px] p-6 bg-white focus:outline-none prose prose-slate max-w-none"
          onSerializedChange={(value) =>
            setFormData((currentForm) => ({
              ...currentForm,
              editorContent: value as string,
            }))
          }
        />
      </Card>
    </div>
  ) : (
    <div className="animate-in slide-in-from-bottom-2 duration-300">
      <Card className="overflow-hidden rounded-2xl border-slate-200 shadow-sm ring-1 ring-slate-100">
        <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50 px-4 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-400/20" />
            <div className="h-3 w-3 rounded-full bg-yellow-400/20" />
            <div className="h-3 w-3 rounded-full bg-green-400/20" />
          </div>
          <span className="ml-2 text-xs font-medium text-slate-400">
            Editor
          </span>
        </div>
        <Editor
          maxLength={10000}
          contentEditableClassname="h-[400px] p-6 bg-white focus:outline-none prose max-w-none"
          editorSerializedState={formData.editorContent as never}
          onSerializedChange={(value) =>
            setFormData((currentForm) => ({
              ...currentForm,
              editorContent: value as string,
            }))
          }
        />
      </Card>
    </div>
  );
}
