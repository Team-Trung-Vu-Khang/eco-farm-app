import type { SeasonDomainCode } from "@/features/master-data/types/master-data.type";
import type {
  SeasonFormData,
  SeasonStage,
  SeasonStatus,
} from "../types/types";

export const EMPTY_SEASON_FORM: SeasonFormData = {
  code: "",
  name: "",
  description: "",
  domainCode: "CROP",
  selectedPrimaryId: undefined,
  selectedChildId: undefined,
  productionSubjectId: undefined,
  productionSubjectVariantId: undefined,
  stages: [],
  displayOrder: 0,
  status: "active",
};

export const SEASON_STATUS_OPTIONS: {
  label: string;
  value: SeasonStatus;
}[] = [
  { value: "active", label: "Đang hoạt động" },
  { value: "inactive", label: "Tạm ngưng" },
  { value: "archived", label: "Lưu trữ" },
];

export const DOMAIN_OPTIONS: { value: SeasonDomainCode; label: string }[] = [
  { value: "CROP", label: "Vụ mùa" },
  { value: "LIVESTOCK", label: "Vụ nuôi" },
  { value: "AQUACULTURE", label: "Thủy sản" },
];

export function getDomainLabel(domainCode: SeasonDomainCode): string {
  const labels: Record<SeasonDomainCode, string> = {
    CROP: "Vụ mùa",
    LIVESTOCK: "Vụ nuôi",
    AQUACULTURE: "Vụ nuôi thủy sản",
  };
  return labels[domainCode] || domainCode;
}

export function getDomainIcon(domainCode: SeasonDomainCode) {
  return domainCode === "CROP" ? "trees" : "paw-print";
}

export function calculateTotalDuration(stages: SeasonStage[]): number {
  return stages.reduce((sum, stage) => sum + (stage.durationDays || 0), 0);
}

export function createEmptyStage(displayOrder: number): SeasonStage {
  return {
    name: "",
    description: "",
    durationDays: 0,
    displayOrder,
    documents: [],
  };
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
