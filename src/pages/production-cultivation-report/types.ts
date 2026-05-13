export type ReportTemplateId =
  | "executive-summary"
  | "yield-harvest"
  | "cultivation-progress"
  | "material-cost"
  | "crop-health"
  | "cost-efficiency"
  | "labor-performance"
  | "compliance-traceability"
  | "risk-warning"
  | "plan-vs-actual";

export type ReportPeriodType =
  | "day"
  | "week"
  | "month"
  | "quarter"
  | "year"
  | "custom";

export type ReportScopeType =
  | "all"
  | "season"
  | "region"
  | "area"
  | "plot"
  | "crop"
  | "plan";

export type ReportJobStatus = "queued" | "processing" | "completed" | "failed";

export interface ReportTemplate {
  id: ReportTemplateId;
  name: string;
  description: string;
  category: string;
  audience: string;
  metrics: string[];
}

export interface ReportPeriod {
  type: ReportPeriodType;
  startDate: string;
  endDate: string;
}

export interface ReportScope {
  type: ReportScopeType;
  ids: string[];
  label: string;
}

export interface ReportRequest {
  templateId: ReportTemplateId;
  period: ReportPeriod;
  scope: ReportScope;
  comparisonEnabled: boolean;
  createdAt: string;
}

export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  tone: "positive" | "neutral" | "negative" | "warning";
}

export interface ReportChartPoint {
  label: string;
  yield: number;
  tasks: number;
  materials: number;
}

export interface ReportTableRow {
  id: string;
  name: string;
  scope: string;
  crop: string;
  period: string;
  progress: string;
  yield: string;
  material: string;
  risk: string;
}

export interface ReportInsight {
  id: string;
  title: string;
  description: string;
  tone: "positive" | "neutral" | "negative" | "warning";
}

export interface ReportBreakdownRow {
  id: string;
  label: string;
  value: string;
  description: string;
  tone: "positive" | "neutral" | "negative" | "warning";
}

export interface ReportMaterialRow {
  id: string;
  planName: string;
  stage: string;
  category: string;
  materialName: string;
  quantity: string;
  unit: string;
}

export interface ReportSourceRow {
  id: string;
  source: string;
  records: string;
  coverage: string;
  note: string;
  tone: "positive" | "neutral" | "negative" | "warning";
}

export interface ReportResult {
  id: string;
  templateId: ReportTemplateId;
  title: string;
  generatedAt: string;
  periodLabel: string;
  scopeLabel: string;
  metrics: ReportMetric[];
  chartData: ReportChartPoint[];
  tableRows: ReportTableRow[];
  insights: ReportInsight[];
  taskStatusRows: ReportBreakdownRow[];
  planPurposeRows: ReportBreakdownRow[];
  materialRows: ReportMaterialRow[];
  sourceRows: ReportSourceRow[];
  executiveSummary: string;
}

export interface ReportJob {
  id: string;
  request: ReportRequest;
  status: ReportJobStatus;
  progress: number;
  resultId?: string;
  error?: string;
  createdAt: string;
  completedAt?: string;
}
