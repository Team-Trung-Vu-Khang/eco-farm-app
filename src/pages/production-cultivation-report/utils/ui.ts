import type {
  ReportInsight,
  ReportJobStatus,
  ReportPeriodType,
  ReportResult,
  ReportScopeType,
} from "../types";

export type Option = {
  label: string;
  value: string;
};

export const chartPalette = [
  "#16a34a",
  "#2563eb",
  "#f59e0b",
  "#dc2626",
  "#0f766e",
  "#7c3aed",
];

export const periodTypeOptions: Array<{
  label: string;
  value: ReportPeriodType;
}> = [
  { label: "Ngày", value: "day" },
  { label: "Tuần", value: "week" },
  { label: "Tháng", value: "month" },
  { label: "Quý", value: "quarter" },
  { label: "Năm", value: "year" },
  { label: "Tùy chỉnh", value: "custom" },
];

export const scopeTypeOptions: Array<{ label: string; value: ReportScopeType }> =
  [
    { label: "Toàn hệ thống", value: "all" },
    { label: "Mùa vụ", value: "season" },
    { label: "Vùng trồng", value: "region" },
    { label: "Khu vực", value: "area" },
    { label: "Lô canh tác", value: "plot" },
    { label: "Cây trồng", value: "crop" },
    { label: "Kế hoạch", value: "plan" },
  ];

export const statusLabels: Record<ReportJobStatus, string> = {
  queued: "Đang chờ",
  processing: "Đang tổng hợp",
  completed: "Hoàn tất",
  failed: "Lỗi",
};

function toDateInput(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getDefaultPeriod(type: ReportPeriodType) {
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (type === "day") {
    return { startDate: toDateInput(start), endDate: toDateInput(end) };
  }

  if (type === "week") {
    const day = start.getDay() || 7;
    start.setDate(start.getDate() - day + 1);
    end.setDate(start.getDate() + 6);
  }

  if (type === "month") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
  }

  if (type === "quarter") {
    const quarterStartMonth = Math.floor(start.getMonth() / 3) * 3;
    start.setMonth(quarterStartMonth, 1);
    end.setMonth(quarterStartMonth + 3, 0);
  }

  if (type === "year" || type === "custom") {
    start.setMonth(0, 1);
    end.setMonth(11, 31);
  }

  return { startDate: toDateInput(start), endDate: toDateInput(end) };
}

export function getToneClass(
  tone: "positive" | "neutral" | "negative" | "warning",
) {
  const toneClass = {
    positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
    neutral: "bg-slate-50 text-slate-700 border-slate-200",
    negative: "bg-rose-50 text-rose-700 border-rose-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return toneClass[tone];
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function parseDisplayNumber(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function getInsightToneIconName(insight: ReportInsight) {
  if (insight.tone === "positive") return "success";
  if (insight.tone === "negative") return "alert";
  if (insight.tone === "warning") return "alert";
  return "activity";
}

export function normalizeReportResult(result?: ReportResult) {
  if (!result) return undefined;

  return {
    ...result,
    metrics: result.metrics ?? [],
    chartData: result.chartData ?? [],
    tableRows: result.tableRows ?? [],
    insights: result.insights ?? [],
    taskStatusRows: result.taskStatusRows ?? [],
    planPurposeRows: result.planPurposeRows ?? [],
    materialRows: result.materialRows ?? [],
    sourceRows: result.sourceRows ?? [],
    executiveSummary:
      result.executiveSummary ??
      "Báo cáo này được tạo từ phiên bản dữ liệu cũ. Vui lòng tổng hợp lại để có đầy đủ phân tích chi tiết.",
  };
}
