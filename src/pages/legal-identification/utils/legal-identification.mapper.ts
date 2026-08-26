import type { GeographicalSelection } from "@/pages/cultivation-zone/cultivation-region/components/types";
import {
  createEmptyLegalDocuments,
  LEGAL_FILE_GROUPS,
  type LegalFileGroupId,
  type LegalIdentificationFileMeta,
  type LegalIdentificationRecord,
} from "../data/constants";
import type {
  LegalIdentificationDocumentRequest,
  LegalIdentificationDocumentResponse,
  LegalIdentificationResponse,
  LegalIdentificationScopeRequest,
  LegalIdentificationScopeResponse,
  LegalIdentificationUpsertRequest,
} from "@/features/legal-identification";

type LegalIdentificationMetadata = {
  address?: string;
  regionName?: string;
  areaName?: string;
  ownerName?: string;
  scopeSelections?: GeographicalSelection[];
  [key: string]: unknown;
};

const DOCUMENT_GROUP_BY_RESPONSE_KEY: Record<
  LegalFileGroupId,
  keyof Pick<
    LegalIdentificationResponse,
    "legalDocuments" | "surveyDocuments" | "purposeDocuments"
  >
> = {
  landProof: "legalDocuments",
  boundaryProof: "surveyDocuments",
  soilSuitability: "purposeDocuments",
};

function asMetadataJson(
  value: Record<string, unknown> | null | undefined,
): LegalIdentificationMetadata {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as LegalIdentificationMetadata;
}

function getScopeName(selection: GeographicalSelection) {
  if (selection.type === "region") {
    return selection.regionName || selection.name || "Vùng trồng";
  }
  return selection.regionName || selection.name || "Vùng trồng";
}

function mapScopeResponseToSelection(
  scope: LegalIdentificationScopeResponse,
  index: number,
): GeographicalSelection | null {
  if (scope.scopeType === "REGION" && scope.region) {
    return {
      id: `scope-region-${scope.region.id}-${index}`,
      type: "region",
      regionId: String(scope.region.id),
      name: scope.region.name,
      regionName: scope.region.name,
    };
  }

  if (scope.scopeType === "AREA" && scope.area) {
    return {
      id: `scope-region-${scope.area.region?.id ?? scope.region?.id ?? index}-${index}`,
      type: "region",
      regionId: String(scope.area.region?.id ?? scope.region?.id ?? ""),
      name: scope.area.region?.name ?? scope.region?.name ?? scope.area.name,
      regionName:
        scope.area.region?.name ?? scope.region?.name ?? scope.area.name,
    };
  }

  if (scope.scopeType === "PLOT" && scope.plot) {
    return {
      id: `scope-region-${scope.plot.area?.region?.id ?? scope.area?.region?.id ?? scope.region?.id ?? index}-${index}`,
      type: "region",
      regionId: String(
        scope.plot.area?.region?.id ?? scope.area?.region?.id ?? scope.region?.id ?? "",
      ),
      name:
        scope.plot.area?.region?.name ??
        scope.area?.region?.name ??
        scope.region?.name ??
        scope.plot.name,
      regionName:
        scope.plot.area?.region?.name ??
        scope.area?.region?.name ??
        scope.region?.name ??
        scope.plot.name,
    };
  }

  return null;
}

function uniqueRegionSelections(selections: GeographicalSelection[]) {
  const seen = new Set<string>();

  return selections.filter((selection) => {
    if (selection.type !== "region") return false;

    if (seen.has(selection.regionId)) return false;

    seen.add(selection.regionId);
    return true;
  });
}

function mapDocumentResponseToFileMeta(
  document: LegalIdentificationDocumentResponse,
): LegalIdentificationFileMeta {
  return {
    id: String(document.id),
    name: document.fileName || document.name,
    size: document.sizeBytes,
    type: document.mimeType,
    uploadedAt: document.createdAt || document.updatedAt,
    fileUrl: document.fileUrl,
  };
}

function mapDocumentsResponseToRecord(
  response: LegalIdentificationResponse,
): Record<LegalFileGroupId, LegalIdentificationFileMeta[]> {
  return LEGAL_FILE_GROUPS.reduce(
    (acc, group) => {
      const key = DOCUMENT_GROUP_BY_RESPONSE_KEY[group.id];
      acc[group.id] = response[key].map(mapDocumentResponseToFileMeta);
      return acc;
    },
    createEmptyLegalDocuments(),
  );
}

function mapDocumentMetaToRequest(
  document: LegalIdentificationFileMeta,
  displayOrder: number,
): LegalIdentificationDocumentRequest {
  return {
    documentType: document.type || "string",
    name: document.name,
    fileUrl: document.fileUrl || document.previewUrl || "",
    fileName: document.name,
    mimeType: document.type || "application/octet-stream",
    sizeBytes: document.size,
    displayOrder,
    content: "",
  };
}

function mapSelectionToScopeRequest(
  selection: GeographicalSelection,
): LegalIdentificationScopeRequest | null {
  const scopeType =
    selection.type === "region"
      ? "REGION"
      : selection.type === "area"
        ? "AREA"
        : "PLOT";

  const scopeId = Number(
    selection.type === "region"
      ? selection.regionId
      : selection.type === "area"
        ? selection.areaId
        : selection.plotId,
  );

  if (!Number.isFinite(scopeId) || scopeId <= 0) {
    return null;
  }

  return { scopeType, scopeId };
}

export function mapLegalIdentificationResponseToRecord(
  response: LegalIdentificationResponse,
): LegalIdentificationRecord {
  const metadata = asMetadataJson(response.metadataJson);
  const scopeSelections =
    metadata.scopeSelections && metadata.scopeSelections.length > 0
      ? uniqueRegionSelections(metadata.scopeSelections)
      : response.scopes
          .map(mapScopeResponseToSelection)
          .filter((selection): selection is GeographicalSelection => Boolean(selection));

  const primaryScope = scopeSelections[0];

  return {
    id: response.id,
    code: response.code,
    name: response.name,
    scopeSelections,
    regionName:
      metadata.regionName ||
      primaryScope?.regionName ||
      primaryScope?.name ||
      "",
    areaName:
      metadata.areaName ||
      primaryScope?.areaName ||
      (primaryScope?.type !== "region" ? primaryScope?.name : "") ||
      "",
    address: response.plotAddress || metadata.address || "",
    ownerName: metadata.ownerName ? String(metadata.ownerName) : "",
    note: response.notes || "",
    status: response.status === "draft"
      ? "draft"
      : response.status === "pending"
        ? "pending"
        : "approved",
    documents: mapDocumentsResponseToRecord(response),
    createdAt: response.createdAt,
    updatedAt: response.updatedAt,
  };
}

export function mapLegalIdentificationRecordToUpsertRequest(
  record: Omit<LegalIdentificationRecord, "id" | "createdAt" | "updatedAt">,
): LegalIdentificationUpsertRequest {
  return {
    code: record.code,
    name: record.name,
    plotAddress: record.address,
    status: record.status,
    scopes: record.scopeSelections
      .map(mapSelectionToScopeRequest)
      .filter((scope): scope is LegalIdentificationScopeRequest => scope !== null),
    legalDocuments: record.documents.landProof.map(mapDocumentMetaToRequest),
    surveyDocuments: record.documents.boundaryProof.map(mapDocumentMetaToRequest),
    purposeDocuments: record.documents.soilSuitability.map(mapDocumentMetaToRequest),
    notes: record.note || "",
    displayOrder: 0,
    metadataJson: {},
  };
}

export function getLegalIdentificationScopeSummary(
  scopeSelections: GeographicalSelection[],
) {
  return scopeSelections.map(getScopeName);
}
