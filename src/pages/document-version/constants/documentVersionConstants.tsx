import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  DocumentRecord,
  DocumentTableRow,
  DocumentVersion,
  VersionStatus,
} from "../types";
import { CodeBadge } from "@/components/CodeBadge";

export function formatDate(value: string | null) {
  if (!value) return "Không giới hạn";
  const date = new Date(value);
  return date.toLocaleDateString("vi-VN");
}

export function formatDateTime(value: string) {
  const date = new Date(value);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function suggestNextVersion(previousVersion?: string) {
  if (!previousVersion) return "v1.0";
  const match = previousVersion.match(/^v?(\d+)(?:\.(\d+))?$/i);
  if (!match) return `${previousVersion}.1`;

  const major = Number(match[1]);
  const minor = Number(match[2] || 0) + 1;
  return `v${major}.${minor}`;
}

export function compareDateDesc(a: string, b: string) {
  return new Date(b).getTime() - new Date(a).getTime();
}

export function sortVersions(versions: DocumentVersion[]) {
  return [...versions].sort((a, b) => compareDateDesc(a.effectiveFrom, b.effectiveFrom));
}

export function getCurrentVersion(document: DocumentRecord) {
  return (
    document.versions.find((version) => version.id === document.currentVersionId) ||
    null
  );
}

export function getDocumentStatus(document: DocumentRecord): DocumentTableRow["status"] {
  if (document.currentVersionId) return "active";
  if (
    document.versions.some(
      (version) => version.status === "draft" || version.status === "pending",
    )
  ) {
    return "review";
  }
  return "expired";
}

export function getStatusBadge(status: VersionStatus | DocumentTableRow["status"]) {
  const map = {
    draft: {
      label: "Nháp",
      className: "bg-slate-100 text-slate-700 hover:bg-slate-100",
    },
    pending: {
      label: "Chờ duyệt",
      className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
    },
    active: {
      label: "Hiệu lực",
      className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
    },
    expired: {
      label: "Hết hiệu lực",
      className: "bg-rose-100 text-rose-700 hover:bg-rose-100",
    },
    review: {
      label: "Đang rà soát",
      className: "bg-sky-100 text-sky-800 hover:bg-sky-100",
    },
  } as const;

  const config = map[status];
  return <Badge className={config.className}>{config.label}</Badge>;
}

export function createDocumentRows(documents: DocumentRecord[]): DocumentTableRow[] {
  return documents.map((document) => {
    const currentVersion = getCurrentVersion(document);
    return {
      id: document.id,
      code: document.code,
      name: document.name,
      type: document.type,
      scope: document.scope,
      currentVersion: currentVersion?.version || "Chưa có bản hiệu lực",
      status: getDocumentStatus(document),
    };
  });
}

export function hasDateOverlap(
  startA: string,
  endA: string | null,
  startB: string,
  endB: string | null,
) {
  const startATime = new Date(startA).getTime();
  const endATime = endA ? new Date(endA).getTime() : Number.POSITIVE_INFINITY;
  const startBTime = new Date(startB).getTime();
  const endBTime = endB ? new Date(endB).getTime() : Number.POSITIVE_INFINITY;

  return startATime <= endBTime && startBTime <= endATime;
}

export const DOCUMENT_COLUMNS: Column<DocumentTableRow>[] = [
  { key: "code", label: "Mã tài liệu", render: (value) => <CodeBadge value={value} /> },
  { key: "name", label: "Tên tài liệu" },
  { key: "type", label: "Loại" },
  { key: "currentVersion", label: "Phiên bản hiện tại" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => getStatusBadge(value as DocumentTableRow["status"]),
  },
  { key: "scope", label: "Phạm vi áp dụng" },
];
