import { useDeferredValue, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useContactGroups } from "@/features/contact-group";
import {
  useFarmDepartmentOptions,
  useFarmPositionOptions,
} from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { organizationApi } from "@/features/organization";
import { emptyContactFormData } from "../data/constants";
import { mapOrganizationToEnterprise } from "../utils/mapOrganizationToEnterprise";

export function useContactCreate() {
  const [, setLocation] = useLocation();
  const workspaceId = useSelectedWorkspaceId();
  const [enterpriseSearch, setEnterpriseSearch] = useState("");
  const deferredEnterpriseSearch = useDeferredValue(enterpriseSearch.trim());

  const groupsQuery = useContactGroups({
    params: { status: "active", size: 100 },
  });
  const organizationsQuery = useInfiniteQuery({
    queryKey: ["contact-enterprise-selector", workspaceId, deferredEnterpriseSearch],
    initialPageParam: 0,
    queryFn: ({ pageParam, signal }) =>
      organizationApi.search(
        {
          status: "active",
          keyword: deferredEnterpriseSearch || undefined,
          page: pageParam,
          size: 8,
        },
        workspaceId ?? "missing",
        signal,
      ),
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    enabled: workspaceId !== null && workspaceId !== undefined && workspaceId !== "",
    staleTime: 5 * 60 * 1000,
  });
  const departmentsQuery = useFarmDepartmentOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const positionsQuery = useFarmPositionOptions({
    params: { size: 100 },
    workspaceId: typeof workspaceId === "number" ? workspaceId : undefined,
  });
  const enterprises = useMemo(
    () =>
      organizationsQuery.data?.pages
        .flatMap((page) => page.content)
        .map(mapOrganizationToEnterprise) ?? [],
    [organizationsQuery.data],
  );

  return {
    defaultValues: emptyContactFormData,
    enterprises,
    enterpriseSearch,
    setEnterpriseSearch,
    loadMoreEnterprises: () => organizationsQuery.fetchNextPage(),
    hasMoreEnterprises: organizationsQuery.hasNextPage,
    // isFetching also covers a new deferred search request while previous
    // query data is still in the cache.
    enterprisesLoading: organizationsQuery.isFetching,
    groups: groupsQuery.items,
    departments: departmentsQuery.items,
    positions: positionsQuery.items,
    goBack: () => setLocation("/contact"),
    loading:
      organizationsQuery.isLoading ||
      groupsQuery.loading ||
      departmentsQuery.loading ||
      positionsQuery.isLoading,
  };
}
