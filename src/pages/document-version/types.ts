import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export type VersionStatus = "draft" | "pending" | "active" | "expired";

export interface VersionLog {
  id: string;
  versionId: string;
  action: "created" | "updated" | "approved";
  user: string;
  at: string;
  detail: string;
}

export interface DocumentVersion {
  id: string;
  version: string;
  effectiveFrom: string;
  effectiveTo: string | null;
  status: VersionStatus;
  fileName: string;
  changeSummary: string;
  updatedBy: string;
  updatedAt: string;
  basedOnVersionId: string | null;
}

export interface DocumentRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  scope: string;
  ownerRole: string;
  approverRole: string;
  currentVersionId: string | null;
  versions: DocumentVersion[];
  logs: VersionLog[];
}

export interface VersionFormState {
  documentId: string;
  baseVersionId: string;
  version: string;
  effectiveFrom: string;
  effectiveTo: string;
  fileName: string;
  changeSummary: string;
  status: Extract<VersionStatus, "draft" | "pending">;
}

export interface DocumentTableRow {
  id: string;
  code: string;
  name: string;
  type: string;
  scope: string;
  currentVersion: string;
  status: "active" | "review" | "expired";
}

export type DocumentTableColumn = Column<DocumentTableRow>;
