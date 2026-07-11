import {
  Badge,
  Button,
  Card,
  CardContent,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Paperclip, Upload, X } from "lucide-react";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  formatLegalFileSize,
  type LegalFileGroupConfig,
  type LegalIdentificationFileMeta,
} from "../data/constants";

type LegalIdentificationFileGroupProps = {
  group: LegalFileGroupConfig;
  files: LegalIdentificationFileMeta[];
  onChange?: (files: LegalIdentificationFileMeta[]) => void;
  readOnly?: boolean;
};

export function LegalIdentificationFileGroup({
  group,
  files,
  onChange,
  readOnly = false,
}: LegalIdentificationFileGroupProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (incoming: FileList | File[]) => {
    const nextFiles = [...files];
    let validationError: string | null = null;

    Array.from(incoming).forEach((file) => {
      if (file.size > 25 * 1024 * 1024) {
        validationError = `File ${file.name} vượt quá 25MB.`;
        return;
      }

      const duplicate = nextFiles.some(
        (current) => current.name === file.name && current.size === file.size,
      );
      if (!duplicate) {
        nextFiles.push({
          id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          uploadedAt: new Date().toISOString(),
        });
      }
    });

    setError(validationError);
    onChange?.(nextFiles);
  };

  const removeFile = (fileId: string) => {
    onChange?.(files.filter((file) => file.id !== fileId));
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (readOnly) return;
    if (event.dataTransfer.files?.length) {
      handleFiles(event.dataTransfer.files);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    if (event.target.files?.length) {
      handleFiles(event.target.files);
    }
    event.target.value = "";
  };

  return (
    <Card className="border-slate-200/70 shadow-sm">
      <CardContent className="p-5">
        <div className="border-b border-slate-100 pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <h3 className="text-base font-semibold text-slate-900">
                {group.title}
              </h3>
              <p className="text-sm text-slate-500">{group.description}</p>
            </div>
            <Badge
              variant="outline"
              className="self-start border-slate-200 bg-slate-50 text-slate-600"
            >
              {files.length > 0 ? `${files.length} file` : "Chưa có file"}
            </Badge>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {group.requirements.map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-50 px-3 py-1 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200/70"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
        {!readOnly && (
          <div className="p-4 sm:p-6">
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              className={cn(
                "cursor-pointer rounded-2xl border border-dashed p-5 transition-all sm:p-6",
                isDragging
                  ? "border-primary/50 bg-primary/5"
                  : "border-slate-200/70 bg-slate-50/40 hover:border-primary/30 hover:bg-white",
              )}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Upload className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-medium text-slate-900">
                      Kéo thả hoặc bấm để tải file
                    </p>
                    <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-slate-500 ring-1 ring-slate-200/70">
                      PDF, Word, Excel, ảnh scan
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Có thể tải nhiều file cùng lúc, tối đa 25MB mỗi file.
                  </p>
                </div>
              </div>

              <input
                ref={inputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.heic,.tif,.tiff"
                onChange={handleInputChange}
                className="hidden"
              />
            </div>

            {error && (
              <div className="mt-3 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                {error}
              </div>
            )}
          </div>
        )}
        <div className={cn("p-4 sm:p-6", readOnly && "pt-4")}>
          {files.length > 0 ? (
            <div className="space-y-2">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200/70"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-500 ring-1 ring-slate-200/70">
                    <Paperclip className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {file.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {formatLegalFileSize(file.size)}
                    </div>
                  </div>
                  {!readOnly && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-red-500"
                      onClick={() => removeFile(file.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200/70 bg-slate-50/50 px-4 py-5 text-sm text-slate-500">
              Chưa có file nào trong nhóm hồ sơ này.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
