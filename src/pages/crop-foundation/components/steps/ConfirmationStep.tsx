import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Check,
  File,
  FileSpreadsheet,
  FileText,
  FileType,
  FlaskConical,
  Presentation,
  Sprout,
} from "lucide-react";
import { useCatalog } from "../../../../features/foundation";
import { useFormContext } from "react-hook-form";
import type { CropFoundationFormValues } from "../../schemas/cropFoundationSchema";

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

export function ConfirmationStep() {
  const { getValues } = useFormContext<CropFoundationFormValues>();
  const formData = getValues();
  const { items: groupCrops } = useCatalog("crop-groups");
  const groupName = groupCrops.find(
    (g) => String(g.id) === formData.cropGroupId,
  )?.name;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="text-center space-y-4 py-6">
        <div className="w-20 h-20 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-lg shadow-green-100 ring-4 ring-white">
          <Check className="w-10 h-10" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            Xác nhận thông tin
          </h3>
          <p className="text-slate-500 max-w-lg mx-auto text-sm mt-2">
            Vui lòng kiểm tra kỹ tất cả các thông tin đã nhập trước khi hoàn tất
            quá trình khởi tạo cây trồng mới.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
              <Sprout className="w-4 h-4" />
              Thông tin cơ bản
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 text-sm">
            {[
              { label: "Mã cây", value: formData.code },
              { label: "Tên cây", value: formData.name },
              { label: "Nhóm", value: groupName },
              { label: "Thu hoạch", value: formData.harvestMethod },
            ].map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-1.5 border-b border-dashed last:border-0 border-zinc-100"
              >
                <span className="text-muted-foreground">{item.label}</span>
                <span className="font-bold text-foreground uppercase tracking-wide">
                  {item.value || "---"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50">
          <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
              <FlaskConical className="w-4 h-4" />
              Thông số nông học
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {[
                {
                  label: "Tên KH",
                  value: formData.technicalSpecs.scientificName,
                },
                {
                  label: "Nhiệt độ",
                  value:
                    formData.technicalSpecs.temperatureFrom != null &&
                    formData.technicalSpecs.temperatureTo != null
                      ? `${formData.technicalSpecs.temperatureFrom} - ${formData.technicalSpecs.temperatureTo} °C`
                      : "",
                },
                {
                  label: "Độ ẩm",
                  value:
                    formData.technicalSpecs.humidityFrom != null &&
                    formData.technicalSpecs.humidityTo != null
                      ? `${formData.technicalSpecs.humidityFrom} - ${formData.technicalSpecs.humidityTo} %`
                      : "",
                },
                {
                  label: "Độ pH",
                  value:
                    formData.technicalSpecs.phFrom != null &&
                    formData.technicalSpecs.phTo != null
                      ? `${formData.technicalSpecs.phFrom} - ${formData.technicalSpecs.phTo}`
                      : "",
                },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">
                    {item.label}
                  </p>
                  <p className="font-bold text-slate-900">
                    {item.value || "--"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-md shadow-zinc-200/50 ring-1 ring-zinc-200/50 overflow-hidden">
        <CardHeader className="bg-zinc-50/50 border-b border-zinc-100/50">
          <CardTitle className="text-base font-bold flex items-center gap-2 text-green-700">
            <FileText className="w-4 h-4" />
            Tài liệu đính kèm
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-8">
          {[
            { label: "Tài liệu đính kèm, v.v", key: "farmingTechnique" },
            // { label: "Tiêu chuẩn chất lượng", key: "qualityStandard" },
          ].map((item) => (
            <div key={item.key} className="space-y-1">
              {(() => {
                const doc = (formData.docs as any)[item.key];
                if (doc.type === "editor") {
                  return (
                    <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md ring-1 ring-green-100 text-xs">
                      <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                      <span className="font-bold text-green-800">
                        Nội dung soạn thảo
                      </span>
                    </div>
                  );
                }
                const file: File | null = doc.file;
                if (!file) {
                  return (
                    <div className="flex items-center gap-2 p-3 bg-zinc-50 rounded-md ring-1 ring-zinc-100 text-xs text-muted-foreground italic">
                      Chưa tải file lên
                    </div>
                  );
                }
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
                      "flex items-center gap-3 rounded-xl border px-3 py-2.5",
                      bg,
                      border,
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm border",
                        border,
                      )}
                    >
                      <Icon className={cn("h-4 w-4", color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <p className="truncate text-xs font-semibold text-slate-800">
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
                      <p className="text-[10px] text-slate-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                );
              })()}
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
