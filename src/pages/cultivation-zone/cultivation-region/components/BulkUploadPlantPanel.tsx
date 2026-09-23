import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Button,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileText,
  Upload,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useLocation } from "wouter";
import {
  plantIdentificationApi,
  plantKeys,
  type BulkUploadJobStatus,
} from "@/features/farm";
import { SAMPLE_HEADERS } from "./ImportPlantDialog";
import type { VarietyOption } from "./types";

interface GeoUnit {
  id: string;
  name: string;
  type: string;
  /** 3 = Vùng, 2 = Khu vực, 1 = Lô */
  level: number;
}

interface BulkUploadPlantPanelProps {
  cultivationZoneId: string;
  scopedGeographicalUnits: GeoUnit[];
  productionVarietyOptions: VarietyOption[];
}

const RUNNING_STATUSES: BulkUploadJobStatus[] = [
  "STARTING",
  "STARTED",
  "STOPPING",
];

const JOB_STATUS_LABELS: Partial<Record<BulkUploadJobStatus, string>> = {
  STARTING: "Đang khởi tạo",
  STARTED: "Đang xử lý",
  COMPLETED: "Hoàn tất",
  FAILED: "Thất bại",
  STOPPED: "Đã dừng",
};

const scopeTypeOf = (level: number) =>
  level === 1 ? "PLOT" : level === 2 ? "AREA" : "REGION";

/** File mẫu: header cố định theo BE, giá trị enum dùng nhãn tiếng Việt mặc định của BE. */
const downloadSample = () => {
  const today = new Date().toISOString().split("T")[0];
  const worksheet = XLSX.utils.aoa_to_sheet([
    SAMPLE_HEADERS,
    [
      "2.5",
      "18",
      "tháng",
      today,
      "11.5460",
      "106.8938",
      "Khỏe mạnh",
      "Cây đầu dòng",
    ],
    ["1.8", "2", "năm", today, "11.5472", "106.8951", "Mắc bệnh", ""],
  ]);
  worksheet["!cols"] = SAMPLE_HEADERS.map((h) => ({
    wch: Math.max(h.length + 4, 14),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Danh sách cây trồng");
  XLSX.writeFile(workbook, "mau-danh-sach-cay-trong.xlsx");
};

export function BulkUploadPlantPanel({
  cultivationZoneId,
  scopedGeographicalUnits,
  productionVarietyOptions,
}: BulkUploadPlantPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [scopeId, setScopeId] = useState("");
  const [varietyId, setVarietyId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [jobId, setJobId] = useState<number | null>(null);

  const selectedScope = scopedGeographicalUnits.find((u) => u.id === scopeId);

  const submit = useMutation({
    mutationFn: () =>
      plantIdentificationApi.bulkUpload(file!, {
        domainCode: "CROP",
        location: {
          scopeType: scopeTypeOf(selectedScope!.level),
          scopeId: Number(scopeId),
        },
        cultivationZoneId: Number(cultivationZoneId),
        productionSubjectVariantId: Number(varietyId),
      }),
    onSuccess: (res) => setJobId(res.jobExecutionId),
    onError: (e: Error) =>
      toast({ variant: "destructive", title: "Lỗi", description: e.message }),
  });

  const statusQuery = useQuery({
    queryKey: ["plant-identification-bulk-upload", jobId],
    queryFn: () => plantIdentificationApi.getBulkUploadStatus(jobId!),
    enabled: jobId !== null,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      return !status || RUNNING_STATUSES.includes(status) ? 2000 : false;
    },
  });

  const job = statusQuery.data;
  const isDone =
    statusQuery.isError || (!!job && !RUNNING_STATUSES.includes(job.status));
  const isRunning = submit.isPending || (jobId !== null && !isDone);
  const result = job?.result;
  const progress = job?.progress;

  // Job xong có dòng thành công → làm mới danh sách cây
  useEffect(() => {
    if (isDone && result?.successRows) {
      queryClient.invalidateQueries({ queryKey: plantKeys.all() });
    }
  }, [isDone, result?.successRows, queryClient]);

  const reset = () => {
    setJobId(null);
    setFile(null);
    submit.reset();
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const canSubmit = !!selectedScope && !!varietyId && !!file && !isRunning;

  return (
    <div className="space-y-5 rounded-xl border border-slate-200 bg-white p-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label required>Phạm vi (Vùng / Khu vực / Lô)</Label>
          <Select
            value={scopeId}
            onValueChange={setScopeId}
            disabled={isRunning || isDone}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn phạm vi áp dụng cho cả file" />
            </SelectTrigger>
            <SelectContent>
              {scopedGeographicalUnits.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.type}: {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label required>Giống cây</Label>
          <Select
            value={varietyId}
            onValueChange={setVarietyId}
            disabled={isRunning || isDone}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn giống cây cho cả file" />
            </SelectTrigger>
            <SelectContent>
              {productionVarietyOptions.map((o) => (
                <SelectItem key={o.id} value={o.id}>
                  {o.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-3">
          <FileText className="h-5 w-5 shrink-0 text-slate-400" />
          <div className="min-w-0 text-sm">
            <p className="truncate font-medium text-slate-700">
              {file ? file.name : "Chưa chọn file .xlsx"}
            </p>
            <p className="text-xs text-slate-500">
              Mỗi dòng 1 cây. Bắt buộc Vĩ độ, Kinh độ.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={downloadSample}
          >
            <Download className="mr-1.5 h-4 w-4" /> Tải mẫu
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={isRunning || isDone}
            onClick={() => fileInputRef.current?.click()}
          >
            Chọn file
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
        </div>
      </div>

      {!isDone && (
        <div className="flex justify-end">
          <Button
            type="button"
            disabled={!canSubmit}
            onClick={() => submit.mutate()}
          >
            <Upload className="mr-1.5 h-4 w-4" />
            {isRunning ? "Đang tải lên..." : "Tải lên"}
          </Button>
        </div>
      )}

      {jobId !== null && (
        <div className="space-y-3 rounded-lg border border-slate-200 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium text-slate-700">
              {statusQuery.isError
                ? "Không lấy được trạng thái xử lý"
                : (JOB_STATUS_LABELS[job?.status ?? "STARTING"] ?? job?.status)}
            </span>
            {progress && (
              <span className="text-slate-500">
                {progress.processedRows}/{progress.totalRows} dòng
              </span>
            )}
          </div>

          {isRunning && (
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{
                  width: progress?.totalRows
                    ? `${(progress.processedRows / progress.totalRows) * 100}%`
                    : "10%",
                }}
              />
            </div>
          )}

          {result && (
            <div className="flex flex-wrap gap-2 text-xs font-semibold">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">
                Tổng {result.totalRows}
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Thành công{" "}
                {result.successRows}
              </span>
              {result.failedRows > 0 && (
                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-red-700">
                  <AlertCircle className="h-3.5 w-3.5" /> Lỗi{" "}
                  {result.failedRows}
                </span>
              )}
            </div>
          )}

          {!!result?.errors.length && (
            <div className="max-h-60 overflow-auto rounded-md border border-red-100">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-red-50 text-red-800">
                  <tr>
                    <th className="w-20 px-3 py-2">Dòng</th>
                    <th className="px-3 py-2">Lỗi</th>
                  </tr>
                </thead>
                <tbody>
                  {result.errors.map((err) => (
                    <tr key={err.rowNumber} className="border-t border-red-50">
                      <td className="px-3 py-1.5 font-medium">
                        {err.rowNumber}
                      </td>
                      <td className="px-3 py-1.5 text-slate-600">
                        {err.message}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {isDone && (
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={reset}>
                Tải file khác
              </Button>
              {!!result?.successRows && (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setLocation("/plant-identification")}
                >
                  Xem danh sách cây
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
