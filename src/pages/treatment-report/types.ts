export type TreatmentReportImprovement = "better" | "unchanged" | "worse";

export type TreatmentReportStatus =
  | "not-started"
  | "in-progress"
  | "needs-review"
  | "completed";

export interface TreatmentReportMaterialUsage {
  id: string;
  name: string;
  quantity: string;
  unit: string;
}

export interface TreatmentReportEvidence {
  id: string;
  name: string;
  fileType: string;
  size: string;
  addedAt: string;
}

export interface TreatmentReportEntry {
  id: string;
  treatmentId: number;
  planId: number;
  targetLabel: string;
  recordedAt: string;
  symptoms: string;
  improvement: TreatmentReportImprovement;
  actions: string;
  materials: TreatmentReportMaterialUsage[];
  evidences: TreatmentReportEvidence[];
  reassessmentNote: string;
  createdAt: string;
}

export interface TreatmentReportSummary {
  status: TreatmentReportStatus;
  elapsedDays: number;
  completedTaskRate: number;
  totalMaterialItems: number;
  lastUpdatedAt?: string;
  latestReassessment?: string;
}
