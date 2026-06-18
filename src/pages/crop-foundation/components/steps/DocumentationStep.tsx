import { useRef, useState } from "react";
import {
  Button,
  Card,
  Editor,
  Label,
  RadioGroup,
  RadioGroupItem,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  Presentation,
  Upload,
  X,
} from "lucide-react";

import type { CreateCropFoundationForm } from "../../types/types";

interface DocumentationStepProps {
  formData: CreateCropFoundationForm;
  handleUpdateDocs: (
    docKey: "farmingTechnique" | "qualityStandard",
    updates: any,
  ) => void;
}

const ACCEPTED_DOC_TYPES =
  ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.odt,.ods";
const MAX_FILE_SIZE_MB = 10;

type FileIconConfig = {
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  badge: string;
};

function getFileIconConfig(fileName: string): FileIconConfig {
  const ext = fileName.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf")
    return {
      icon: FileType,
      color: "text-red-600",
      bg: "bg-red-50",
      border: "border-red-200",
      badge: "bg-red-100 text-red-700",
    };
  if (["doc", "docx", "odt"].includes(ext))
    return {
      icon: FileText,
      color: "text-blue-600",
      bg: "bg-blue-50",
      border: "border-blue-200",
      badge: "bg-blue-100 text-blue-700",
    };
  if (["xls", "xlsx", "ods"].includes(ext))
    return {
      icon: FileSpreadsheet,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      badge: "bg-emerald-100 text-emerald-700",
    };
  if (["ppt", "pptx"].includes(ext))
    return {
      icon: Presentation,
      color: "text-orange-600",
      bg: "bg-orange-50",
      border: "border-orange-200",
      badge: "bg-orange-100 text-orange-700",
    };
  return {
    icon: File,
    color: "text-slate-600",
    bg: "bg-slate-50",
    border: "border-slate-200",
    badge: "bg-slate-100 text-slate-700",
  };
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadZoneProps {
  docKey: "farmingTechnique" | "qualityStandard";
  file: File | null;
  onFileChange: (file: File | null) => void;
}

function UploadZone({ docKey, file, onFileChange }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validate = (f: File): string | null => {
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024)
      return `File vượt quá ${MAX_FILE_SIZE_MB}MB.`;
    return null;
  };

  const handleFile = (f: File) => {
    const err = validate(f);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    onFileChange(f);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) handleFile(dropped);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) handleFile(selected);
    e.target.value = "";
  };

  const handleRemove = () => {
    setError(null);
    onFileChange(null);
  };

  if (file) {
    const {
      icon: Icon,
      color,
      bg,
      border,
      badge,
    } = getFileIconConfig(file.name);
    const ext = file.name.split(".").pop()?.toUpperCase() ?? "FILE";
    return (
      <div
        className={cn(
          "flex items-center gap-4 rounded-xl border px-4 py-3",
          bg,
          border,
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border",
            border,
          )}
        >
          <Icon className={cn("h-5 w-5", color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="truncate text-sm font-semibold text-slate-800">
              {file.name}
            </p>
            <span
              className={cn(
                "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-bold uppercase",
                badge,
              )}
            >
              {ext}
            </span>
          </div>
          <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={handleRemove}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 transition-colors"
          title="Xóa file"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={handleDrag}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200",
          isDragging
            ? "border-purple-400 bg-purple-50 scale-[1.01]"
            : "border-muted-foreground/20 bg-muted/20 hover:bg-muted/30 hover:border-muted-foreground/30",
        )}
      >
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm group-hover:scale-110 transition-transform">
          <Upload className="h-5 w-5 text-muted-foreground/60" />
        </div>
        <p className="text-sm font-bold text-foreground">
          Kéo thả hoặc click để tải lên
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          PDF, Word, Excel, PowerPoint — tối đa {MAX_FILE_SIZE_MB}MB
        </p>
        <input
          id={`file-input-${docKey}`}
          type="file"
          ref={fileInputRef}
          accept={ACCEPTED_DOC_TYPES}
          onChange={handleInputChange}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="mt-5 bg-white"
          onClick={(e) => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
        >
          Chọn file
        </Button>
      </div>
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
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
              Tài liệu đính kèm
            </h3>
            <p className="text-sm text-slate-500">Tài liệu kỹ thuật, v.v</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
      </div>

      <div className="space-y-12">
        {(["farmingTechnique"] as const).map((docKey) => {
          const doc = formData.docs[docKey];
          return (
            <div key={docKey} className="space-y-6">
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
                      Upload tài liệu
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
                  <UploadZone
                    docKey={docKey}
                    file={doc.file}
                    onFileChange={(file) => handleUpdateDocs(docKey, { file })}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
