import {
  formatAppWorkspaceFeatureName,
  type WorkspaceFeatureType,
  type FormatWorkspaceFeatureNameOptions,
} from "@/shared/constants/workspace.constants";

export function formatWorkspaceDisplayName({
  facilityName,
  ownerName,
  ownerPhoneNumber,
  fallback = "Đơn vị",
}: {
  facilityName?: string | null;
  ownerName?: string | null;
  ownerPhoneNumber?: string | null;
  fallback?: string;
}): string {
  const cleanFacilityName = facilityName?.trim();
  const accountDetails = [
    ownerName?.trim(),
    ownerPhoneNumber?.trim() ? `(${ownerPhoneNumber.trim()})` : null,
  ]
    .filter(Boolean)
    .join(" ");

  if (cleanFacilityName && accountDetails) {
    return `${cleanFacilityName} - ${accountDetails}`;
  }
  return cleanFacilityName || accountDetails || fallback;
}

export function formatWorkspaceLabel(
  workspace?: {
    brandName?: string | null;
    name?: string | null;
    representative?: string | null;
    ownerName?: string | null;
    ownerPhoneNumber?: string | null;
    owner?: { fullName?: string | null; phoneNumber?: string | null } | null;
    metadataJson?: Record<string, unknown> | null;
  } | null,
  fallback = "Đơn vị",
  feature: WorkspaceFeatureType = "farm",
  options?: FormatWorkspaceFeatureNameOptions,
): string {
  if (!workspace) return fallback;

  const meta = workspace.metadataJson;
  const rawFacilityName =
    (feature === "factory"
      ? (meta?.factoryDisplayName as string)?.trim()
      : (meta?.farmDisplayName as string)?.trim()) ||
    (meta?.farmDisplayName as string)?.trim() ||
    (meta?.factoryDisplayName as string)?.trim() ||
    workspace.brandName?.trim() ||
    workspace.name?.trim();

  const facilityName = rawFacilityName
    ? formatAppWorkspaceFeatureName(rawFacilityName, feature, options)
    : undefined;

  const ownerName =
    workspace.owner?.fullName ||
    workspace.ownerName ||
    workspace.representative;

  const ownerPhoneNumber =
    workspace.owner?.phoneNumber || workspace.ownerPhoneNumber;

  return formatWorkspaceDisplayName({
    facilityName,
    ownerName,
    ownerPhoneNumber,
    fallback,
  });
}
