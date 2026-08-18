import type {
  FoundationDocumentRequest,
  MasterDataSeasonResponse,
  SeasonDomainCode,
} from "@/features/master-data/types/master-data.type";

export type SeasonStatus = "active" | "inactive" | "archived";

export interface SeasonStage {
  id?: number;
  name: string;
  description?: string;
  durationDays?: number;
  displayOrder?: number;
  documents: (FoundationDocumentRequest & { id?: number })[];
}

export interface SeasonFormData {
  code: string;
  name: string;
  description: string;
  domainCode: SeasonDomainCode;
  selectedPrimaryId?: string;
  selectedChildId?: string;
  productionSubjectId?: number;
  productionSubjectVariantId?: number;
  stages: SeasonStage[];
  displayOrder?: number;
  status: SeasonStatus;
}

export interface SeasonDocument {
  id: number;
  type: "editor" | "pdf";
  name: string;
  content: string;
  fileUrl: string;
  fileName: string;
}

/** Legacy Season type used by useSeasonStore and other pages (plan, soil-amendment) */
export interface Season {
  id: string;
  code: string;
  name: string;
  description: string;
  duration: number;
  status: "planning" | "active" | "completed" | "cancelled";
  seasonType?: "plant" | "animal";
  scope: "crop" | "variety";
  cropId?: string;
  varietyId?: string;
  growthCycleIds: string[];
  growthCycles?: unknown[];
  selectedStages?: Record<string, Record<string, string | number>>;
  documents: {
    id: string;
    name: string;
    url: string;
    type: "technical" | "regulatory" | "other";
    uploadedAt: string;
  }[];
  createdAt: number;
  updatedAt: number;
}

export const EMPTY_SEASON_STAGE: SeasonStage = {
  name: "",
  description: "",
  durationDays: 0,
  displayOrder: 0,
  documents: [],
};

export function mapSeasonResponseToForm(
  season: MasterDataSeasonResponse,
): SeasonFormData {
  return {
    code: season.code,
    name: season.name,
    description: season.description || "",
    domainCode: season.domainCode,
    productionSubjectId: season.productionSubject?.id,
    productionSubjectVariantId: season.productionSubjectVariant?.id,
    stages: (season.stages || []).map((stage) => ({
      id: stage.id,
      name: stage.name,
      description: stage.description,
      durationDays: stage.durationDays,
      displayOrder: stage.displayOrder,
      documents: (stage.documents || []).map((doc) => ({
        id: doc.id,
        type: doc.type,
        name: doc.name,
        content: doc.content,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
      })),
    })),
    displayOrder: season.displayOrder,
    status: (season.status as SeasonStatus) || "active",
  };
}

export function mapSeasonFormToRequest(
  formData: SeasonFormData,
): {
  domainCode: SeasonDomainCode;
  code?: string;
  name: string;
  description?: string;
  productionSubjectId?: number;
  productionSubjectVariantId?: number;
  stages: {
    id?: number;
    name: string;
    description?: string;
    durationDays?: number;
    displayOrder?: number;
    documents: FoundationDocumentRequest[];
  }[];
  displayOrder?: number;
  status: SeasonStatus;
} {
  return {
    domainCode: formData.domainCode,
    code: formData.code || undefined,
    name: formData.name,
    description: formData.description || undefined,
    productionSubjectId: formData.productionSubjectId,
    productionSubjectVariantId: formData.productionSubjectVariantId,
    stages: formData.stages.map((stage, index) => ({
      id: stage.id,
      name: stage.name,
      description: stage.description,
      durationDays: stage.durationDays,
      displayOrder: stage.displayOrder ?? index,
      documents: stage.documents.map((doc) => ({
        id: doc.id,
        type: doc.type,
        name: doc.name,
        content: doc.content,
        fileUrl: doc.fileUrl,
        fileName: doc.fileName,
      })),
    })),
    displayOrder: formData.displayOrder,
    status: formData.status,
  };
}

export function calculateTotalDuration(stages: SeasonStage[]): number {
  return stages.reduce((sum, stage) => sum + (stage.durationDays || 0), 0);
}

export function validateSeasonForm(formData: SeasonFormData): boolean {
  if (!formData.name || formData.name.trim().length === 0) return false;
  if (!formData.domainCode) return false;
  if (formData.stages.length === 0) return false;
  for (const stage of formData.stages) {
    if (!stage.name || stage.name.trim().length === 0) return false;
  }
  return true;
}

export const SEASON_STATUS_OPTIONS: { label: string; value: SeasonStatus }[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm ngưng" },
  { value: "archived", label: "Lưu trữ" },
];

export const DOMAIN_OPTIONS: {
  label: string;
  value: SeasonDomainCode;
  description: string;
}[] = [
  {
    value: "CROP",
    label: "Vụ mùa",
    description: "Dùng cho mùa vụ của cây trồng",
  },
  {
    value: "LIVESTOCK",
    label: "Vụ nuôi",
    description: "Dùng cho mùa vụ của vật nuôi",
  },
  {
    value: "AQUACULTURE",
    label: "Vụ nuôi thủy sản",
    description: "Dùng cho mùa vụ của thủy sản",
  },
];
