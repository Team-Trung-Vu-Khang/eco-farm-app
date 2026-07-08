import { useMemo } from "react";
import { useLocation } from "wouter";
import { useContactGroups } from "@/features/contact-group";
import {
  useFarmDepartmentOptions,
  useFarmPositionOptions,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { useOrganizations } from "@/features/organization";
import { emptyContactFormData } from "../data/constants";
import { mapOrganizationToEnterprise } from "../utils/mapOrganizationToEnterprise";

export function useContactCreate() {
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();

  const groupsQuery = useContactGroups({
    params: { status: "active", size: 100 },
  });
  const organizationsQuery = useOrganizations(
    { status: "active", size: 100 },
    workspaceId ?? "missing",
    { enabled: workspaceId !== null && workspaceId !== undefined && workspaceId !== "" },
  );
  const departmentsQuery = useFarmDepartmentOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const positionsQuery = useFarmPositionOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const enterprises = useMemo(
    () => organizationsQuery.items.map(mapOrganizationToEnterprise),
    [organizationsQuery.items],
  );

  return {
    defaultValues: emptyContactFormData,
    enterprises,
      groups: groupsQuery.items,
      departments: departmentsQuery.items,
      positions: positionsQuery.items,
    goBack: () => setLocation("/contact"),
    loading:
      organizationsQuery.loading ||
      groupsQuery.loading ||
      departmentsQuery.loading ||
      positionsQuery.isLoading,
  };
}
