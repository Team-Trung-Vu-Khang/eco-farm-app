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

const readMetadataValue = (
  metadata: Record<string, unknown> | undefined,
  key: string,
) => {
  const value = metadata?.[key];
  if (typeof value === "string" || typeof value === "number") {
    return value;
  }
  return undefined;
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
  enterpriseId: toNumericId(readMetadataValue(record.metadataJson, "enterpriseId")),
});

export const mapFarmCertificateRecordToFormData = (
  record: FarmCertificateRecord,
): EnterpriseCertificateFormValues => {
  const primaryDocument = record.documents?.[0];
  const targetType = record.targetType === "region" ? "region" : "workspace";
  const targetRegions =
    record.targetRegions && record.targetRegions.length > 0
      ? record.targetRegions
      : record.targetRegion
        ? [record.targetRegion]
        : [];
  const workspaceTargetSource = record.targetOrganization;
  const regionTargetSource = record.targetRegion ?? targetRegions[0];
  const regionTargetIds = targetRegions.map((item) => toNumericId(item.id));
  const regionTargetNames = targetRegions.map((item) => item.name);

  return {
    code: record.code,
    name: record.name,
    standardType: record.agricultureCertificate?.code ?? record.standardType ?? "",
    organization: record.issuer?.name ?? record.organization ?? "",
    issuedDate: record.issuedDate,
    expiryDate: record.expiryDate,
    entityType: targetType,
    entityId: toNumericId(
      record.targetId ??
        (targetType === "workspace"
          ? workspaceTargetSource?.code ?? workspaceTargetSource?.id
          : regionTargetSource?.code ?? regionTargetSource?.id),
    ),
    entityName:
      targetType === "workspace"
        ? workspaceTargetSource?.name ?? "Workspace hiện tại"
        : regionTargetNames.join(", ") ||
          regionTargetSource?.name ||
          "",
    targetIds:
      targetType === "region"
        ? regionTargetIds
        : record.targetId
          ? [toNumericId(record.targetId)]
          : [],
    targetNames:
      targetType === "region"
        ? regionTargetNames
        : workspaceTargetSource?.name
          ? [workspaceTargetSource.name]
          : [],
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
  const targetRegions =
    record.targetRegions && record.targetRegions.length > 0
      ? record.targetRegions
      : record.targetRegion
        ? [record.targetRegion]
        : [];

  return {
    id: Number(record.id),
    ...formData,
    agricultureCertificate: record.agricultureCertificate,
    entityType: formData.entityType,
    targetRegions,
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

  const targetIds =
    formData.entityType === "workspace"
      ? undefined
      : formData.targetIds
          .map((value) =>
            context.areas.find(
              (item) => item.id === value || item.code === value,
            ),
          )
          .filter((item): item is Area => Boolean(item))
          .map((item) => item.id);

  if (formData.entityType === "region" && (!targetIds || targetIds.length === 0)) {
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
    ...(targetIds ? { targetIds } : {}),
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
