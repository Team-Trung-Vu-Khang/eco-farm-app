import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  Leaf,
  Presentation,
} from "lucide-react";
import type { FoundationCropResponse } from "../../../../features/foundation";

interface DocumentationTabProps {
  cropFoundation: FoundationCropResponse;
}

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

export function DocumentationTab({ cropFoundation }: DocumentationTabProps) {
  let doc: any = null;
  
  if (cropFoundation.documents && cropFoundation.documents.length > 0) {
    const farmingDoc = cropFoundation.documents.find((d: any) => d.name === "Kỹ thuật canh tác");
    if (farmingDoc) {
      doc = {
        type: farmingDoc.type || "editor",
        content: farmingDoc.content,
        file: farmingDoc.fileUrl ? { name: farmingDoc.fileName || "Tài liệu đính kèm" } : null,
      };
    }
  } else {
    // Fallback for older data format
    let docs: any = null;
    try {
      if (cropFoundation.metadataJson) {
        const meta = typeof cropFoundation.metadataJson === "string" 
          ? JSON.parse(cropFoundation.metadataJson) 
          : cropFoundation.metadataJson;
        docs = meta.docs;
      }
    } catch (error) {
      console.error("Failed to parse metadataJson", error);
    }
    doc = docs?.farmingTechnique;
  }

  if (!doc) {
    return (
      <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl">
        <CardContent className="p-12 flex flex-col items-center justify-center text-slate-400">
          <FileText className="w-12 h-12 mb-4 text-slate-300" />
          <p className="text-sm font-medium">
            Chưa có tài liệu kỹ thuật canh tác
          </p>
        </CardContent>
      </Card>
    );
  }

  const renderFilePreview = () => {
    const file = doc.file as File | null | undefined;
    // Ưu tiên dùng File object nếu còn trong memory
    const fileName: string | null =
      file?.name ??
      (typeof doc.content === "string" && doc.type === "pdf"
        ? doc.content
        : null);

    if (!fileName) {
      return (
        <div className="flex flex-col items-center justify-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-200">
          <FileText className="w-10 h-10 text-slate-300 mb-3" />
          <p className="text-sm font-bold text-slate-700">
            Tài liệu đã được tải lên
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Tính năng xem trước đang được phát triển
          </p>
        </div>
      );
    }

    const {
      icon: Icon,
      color,
      bg,
      border,
      badge,
    } = getFileIconConfig(fileName);
    const ext = fileName.split(".").pop()?.toUpperCase() ?? "FILE";

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
              {fileName}
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
          {file && (
            <p className="text-xs text-slate-500">
              {formatFileSize(file.size)}
            </p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100/50 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-slate-800">
              <Leaf className="w-4 h-4 text-emerald-600" />
              Kỹ thuật canh tác
            </CardTitle>
            <Badge
              className={
                doc.type === "editor"
                  ? "bg-green-100 text-green-700"
                  : "bg-blue-100 text-blue-700"
              }
              variant="secondary"
            >
              {doc.type === "editor"
                ? "Biên soạn trực tiếp"
                : "Tài liệu đính kèm"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {doc.type === "editor" && typeof doc.content === "string" ? (
            <div
              className="prose prose-sm prose-slate max-w-none prose-headings:font-bold prose-a:text-blue-600"
              dangerouslySetInnerHTML={{ __html: doc.content }}
            />
          ) : doc.type === "editor" ? (
            <p className="text-sm text-slate-500 italic">
              Dữ liệu tài liệu đang ở định dạng chưa được biên dịch (JSON).
            </p>
          ) : (
            renderFilePreview()
          )}
        </CardContent>
      </Card>
    </div>
  );
}

