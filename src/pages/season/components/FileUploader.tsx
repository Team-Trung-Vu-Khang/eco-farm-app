import React, { useState, useRef } from "react";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Upload,
  X,
  FileText,
  Table,
  FilePen,
  Image,
  File as IconFile,
} from "lucide-react";
import type { SeasonDocument } from "../types/types";

interface FileUploaderProps {
  files: (File | SeasonDocument)[];
  onChange: (files: (File | SeasonDocument)[]) => void;
  maxFiles?: number;
  accept?: string;
  maxSizeMB?: number;
}

export function FileUploader({
  files,
  onChange,
  maxFiles = 5,
  accept = ".pdf,.doc,.docx,.xls,.xlsx",
  maxSizeMB = 10,
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return <FileText className="w-4 h-4 text-red-500" />;
      case "xls":
      case "xlsx":
      case "csv":
        return <Table className="w-4 h-4 text-green-600" />;
      case "doc":
      case "docx":
        return <FilePen className="w-4 h-4 text-blue-600" />;
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return <Image className="w-4 h-4 text-purple-500" />;
      default:
        return <IconFile className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getFileIconBg = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    switch (ext) {
      case "pdf":
        return "bg-red-50";
      case "xls":
      case "xlsx":
      case "csv":
        return "bg-green-50";
      case "doc":
      case "docx":
        return "bg-blue-50";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
        return "bg-purple-50";
      default:
        return "bg-slate-50";
    }
  };

  const handleFiles = (newFiles: FileList | null) => {
    // ... existing handleFiles logic
    if (!newFiles) return;

    const validFiles: File[] = [];
    const currentFileCount = files.length;

    Array.from(newFiles).forEach((file) => {
      // Check size
      if (file.size > maxSizeMB * 1024 * 1024) {
        alert(
          `File ${file.name} vượt quá dung lượng cho phép (${maxSizeMB}MB)`,
        );
        return;
      }

      // Check if already exists by name and size (simple check)
      const exists = files.some(
        (f) => f.name === file.name && (f as File).size === file.size,
      );
      if (!exists) {
        validFiles.push(file);
      }
    });

    if (currentFileCount + validFiles.length > maxFiles) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxFiles} tài liệu`);
      const remainingSlots = maxFiles - currentFileCount;
      onChange([...files, ...validFiles.slice(0, remainingSlots)]);
    } else {
      onChange([...files, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer text-center
          ${
            isDragging
              ? "border-primary bg-primary/5 scale-[1.01]"
              : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/5"
          }
        `}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          accept={accept}
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Upload
              className={`w-6 h-6 ${isDragging ? "text-primary animate-bounce" : "text-muted-foreground"}`}
            />
          </div>
          <p className="font-bold text-slate-800">
            Kéo thả hoặc nhấn để tải lên
          </p>
          <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
            Chấp nhận PDF, Word, Excel (Tối đa {maxSizeMB}MB mỗi tệp)
          </p>
        </div>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-1 gap-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="group flex items-center justify-between p-3 rounded-lg border bg-white shadow-sm hover:border-primary/30 transition-all animate-in fade-in slide-in-from-top-1"
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <div
                  className={`p-2 rounded-lg shrink-0 ${getFileIconBg(file.name)}`}
                >
                  {getFileIcon(file.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold truncate pr-2">{file.name}</p>
                  {(file as File).size && (
                    <p className="text-[10px] text-muted-foreground">
                      {((file as File).size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex justify-end">
          <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
            {files.length}/{maxFiles} Tệp đã chọn
          </span>
        </div>
      )}
    </div>
  );
}
