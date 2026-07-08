import type { FarmRegionResponse } from "@/features/farm/types/farm.type";
import type { CertificateStandardRecord } from "@/features/master-data";
import type {
  FarmCertificateCreateRequest,
  FarmCertificateRecord,
} from "@/features/farm-certificate";
import type {
  Area,
  EnterpriseCertificate,
  Standard,
} from "../../stores/useEnterpriseCertificateStore";
import type { EnterpriseCertificateFormValues } from "./data/enterprise-certificate-form.schema";

export type EnterpriseCertificateViewData = EnterpriseCertificate;

export type EnterpriseCertificateFormData = EnterpriseCertificateFormValues;

const toNumericId = (value: number | string | undefined | null) => {
  if (value === undefined || value === null || value === "") return "";
  return String(value);
};

const calculateStatus = (expiryDate: string, apiStatus?: string) => {
  if (apiStatus === "revoked") return "revoked" as const;
  if (apiStatus === "expired") return "expired" as const;

  const today = new Date();
  const expiry = new Date(expiryDate);
  const daysUntilExpiry = Math.ceil(
    (expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );

  if (daysUntilExpiry < 0) return "expired" as const;
  if (daysUntilExpiry <= 30) return "expiring_soon" as const;
  return "valid" as const;
};

export const mapStandardRecordToOption = (
  record: CertificateStandardRecord,
): Standard => ({
  code: record.code,
  name: record.name,
  organizations:
    record.issuers?.map((issuer) => issuer.name).filter(Boolean) ?? [],
});

export const mapRegionRecordToArea = (record: FarmRegionResponse): Area => ({
  id: toNumericId(record.id),
  code: record.code ?? String(record.id),
  name: record.name ?? record.code ?? String(record.id),
  enterpriseId: toNumericId(record.metadataJson?.enterpriseId),
});

export const mapFarmCertificateRecordToFormData = (
  record: FarmCertificateRecord,
): EnterpriseCertificateFormValues => {
  const primaryDocument = record.documents?.[0];
  const targetType = record.targetType === "region" ? "region" : "workspace";
  const targetSource =
    targetType === "workspace"
      ? record.targetOrganization
      : record.targetRegion;

  return {
    code: record.code,
    name: record.name,
    standardType: record.agricultureCertificate?.code ?? record.standardType ?? "",
    organization: record.issuer?.name ?? record.organization ?? "",
    issuedDate: record.issuedDate,
    expiryDate: record.expiryDate,
    entityType: targetType,
    entityId: toNumericId(record.targetId ?? targetSource?.code ?? targetSource?.id),
    entityName:
      targetType === "workspace"
        ? "Workspace hiện tại"
        : targetSource?.name ?? "",
    content: primaryDocument?.content ?? "",
    contentType: primaryDocument?.documentType === "file" ? "file" : "editor",
    fileUrl: primaryDocument?.fileUrl ?? "",
    attachments: record.documents?.map((doc) => doc.fileName || doc.name) ?? [],
  };
};

export const mapFarmCertificateRecordToView = (
  record: FarmCertificateRecord,
): EnterpriseCertificateViewData => {
  const formData = mapFarmCertificateRecordToFormData(record);

  return {
    id: Number(record.id),
    ...formData,
    entityType: formData.entityType,
    status: calculateStatus(record.expiryDate, record.status),
    createdAt: record.createdAt,
  };
};

export const buildFarmCertificatePayload = (
  formData: EnterpriseCertificateFormValues,
  context: {
    standards: CertificateStandardRecord[];
    areas: Area[];
    workspaceId: number | string;
  },
): FarmCertificateCreateRequest => {
  const standard = context.standards.find(
    (item) => item.code === formData.standardType,
  );

  if (!standard) {
    throw new Error("Vui lòng chọn đúng loại tiêu chuẩn.");
  }

  const issuer = standard.issuers?.find(
    (organization) => organization.name === formData.organization,
  );

  if (!issuer) {
    throw new Error("Vui lòng chọn tổ chức cấp hợp lệ.");
  }

  const selectedArea =
    formData.entityType === "region"
      ? context.areas.find(
          (item) =>
            item.code === formData.entityId || item.id === formData.entityId,
        )
      : null;

  if (formData.entityType === "region" && !selectedArea) {
    throw new Error("Vui lòng chọn đúng đối tượng cấp chứng nhận.");
  }

  const documents =
    formData.contentType === "file"
      ? [
          {
            id: undefined,
            documentType: "file",
            name: formData.content.trim() || formData.name.trim(),
            fileUrl: formData.fileUrl.trim() || undefined,
            fileName: formData.content.trim() || formData.name.trim(),
            mimeType: undefined,
            sizeBytes: undefined,
            displayOrder: 1,
            content: formData.content.trim(),
          },
        ]
      : [
          {
            id: undefined,
            documentType: "editor",
            name: formData.name.trim(),
            fileUrl: undefined,
            fileName: undefined,
            mimeType: undefined,
            sizeBytes: undefined,
            displayOrder: 1,
            content: formData.content.trim(),
          },
        ];

  const targetId =
    formData.entityType === "workspace"
      ? context.workspaceId
      : selectedArea?.id;

  if (targetId === null || targetId === undefined || targetId === "") {
    throw new Error("Vui lòng chọn đúng đối tượng cấp chứng nhận.");
  }

  return {
    code: formData.code.trim(),
    name: formData.name.trim(),
    agricultureCertificateId: standard.id,
    issuerId: issuer.id,
    issuedDate: formData.issuedDate,
    expiryDate: formData.expiryDate,
    targetType: formData.entityType === "region" ? "region" : "workspace",
    targetId,
    displayOrder: 1,
    documents,
    metadataJson: null,
  };
};

export const isCertificateViewExpired = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry.getTime() < today.getTime();
};
