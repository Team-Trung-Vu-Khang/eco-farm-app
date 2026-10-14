import { useAuth, useIsAdmin } from "@/features/auth";
import { useSelectedWorkspaceId, useWorkspaceById } from "@/features/workspace";
import { formatAppWorkspaceFeatureName } from "@/shared/constants/workspace.constants";
import { useWorkspace } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function MobileHeaderSubtitle() {
  const { currentUser } = useAuth();
  const { isAdmin } = useIsAdmin();
  const { currentWorkspace } = useWorkspace();
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { data: workspaceData } = useWorkspaceById(selectedWorkspaceId ?? "");

  const adminLabel = isAdmin ? "Admin" : null;

  const rawFacilityName =
    (
      (workspaceData?.metadataJson as Record<string, unknown>)
        ?.farmDisplayName as string
    )?.trim() ||
    currentWorkspace?.farmDisplayName?.trim() ||
    workspaceData?.brandName?.trim() ||
    workspaceData?.name?.trim();

  const facilityName = rawFacilityName
    ? formatAppWorkspaceFeatureName(rawFacilityName, "farm")
    : undefined;

  const ownerName =
    workspaceData?.owner?.fullName?.trim() ||
    currentWorkspace?.ownerName ||
    currentWorkspace?.representativeName ||
    currentWorkspace?.organizationName ||
    (isAdmin ? undefined : currentUser?.fullName);

  const workspaceLabel =
    facilityName?.trim() ||
    ownerName?.trim() ||
    currentUser?.fullName?.trim() ||
    "Nông trại";

  if (adminLabel) {
    return (
      <span className="block whitespace-normal leading-tight">
        <span className="block truncate font-medium text-primary">
          {adminLabel}
        </span>
        <span className="block truncate text-slate-500">{workspaceLabel}</span>
      </span>
    );
  }

  return <span className="truncate">{workspaceLabel}</span>;
}
