import { useState } from "react";
import { useRoute } from "wouter";
import { useOrganizationById } from "@/features/organization";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { toCooperativeRow } from "../utils/cooperative.mapper";

export function useCooperativeDetail() {
  const [, params] = useRoute("/cooperative/:id");
  const workspaceId = useSelectedWorkspaceId();
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const cooperativeQuery = useOrganizationById(
    params?.id ?? "",
    workspaceId ?? "missing",
    {
      enabled: workspaceId !== null && Boolean(params?.id),
    },
  );

  return {
    data: cooperativeQuery.item
      ? toCooperativeRow(cooperativeQuery.item)
      : undefined,
    loading: cooperativeQuery.loading,
    error: cooperativeQuery.error,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  };
}
