export type DiaryDomainCode = "CROP" | "LIVESTOCK" | "AQUACULTURE";

export type DiaryWorkType =
  | "cultivation"
  | "facility-upgrade"
  | "treatment"
  | "amendment"
  | "harvest";

export type DiaryStatus = "TODO" | "DOING" | "DONE" | "CANCELLED";

export interface DiaryWorkflowRef {
  id: number;
  code: string;
  name: string;
  domainCode: DiaryDomainCode;
  seasonLabel: string;
  scopeLabel: string;
  plannedStartDate: string;
  plannedEndDate: string;
}

export interface DiaryPlanRef {
  id: number;
  code: string;
  name: string;
  purpose: string;
  status: "DRAFT" | "ACTIVE" | "COMPLETED";
  plannedStartDate: string;
  plannedEndDate: string;
  durationDays: number;
  scopeNote: string;
}

export interface DiaryPersonnel {
  id: number;
  fullName: string;
  role: "ASSIGNEE" | "SUPERVISOR";
}

export interface DiaryMaterialAllocation {
  stageId: string;
  materialName: string;
  materialType: string;
  quantity: string;
  unit: string;
}

export interface DiaryHarvestDetail {
  targetLabel: string;
  quantity: string;
  unitBase: string;
}

export interface DiaryEntry {
  id: number;
  code: string;
  name: string;
  workType: DiaryWorkType;
  taskCategory: { id: number; code: string; name: string };
  workflow: DiaryWorkflowRef;
  plan: DiaryPlanRef;
  region: string;
  area: string | null;
  plot: string | null;
  location: { lat: number; lng: number };
  startDate: string;
  endDate: string;
  description: string;
  images: string[];
  stages: string[];
  materialAllocations: DiaryMaterialAllocation[];
  harvest: {
    scope: "region" | "crop";
    details: DiaryHarvestDetail[];
  } | null;
  personnel: DiaryPersonnel[];
  status: DiaryStatus;
  createdAt: string;
  updatedAt: string;
}
