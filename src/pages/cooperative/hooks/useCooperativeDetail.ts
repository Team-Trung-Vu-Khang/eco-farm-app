import { useState } from "react";
import { useRoute } from "wouter";
import useEnterpriseStore from "@/stores/useEnterpriseStore";

export function useCooperativeDetail() {
  const [, params] = useRoute("/cooperative/:id");
  const getEnterpriseById = useEnterpriseStore((state) => state.getEnterpriseById);
  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const data = params?.id ? getEnterpriseById(Number(params.id)) : undefined;

  return {
    data,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  };
}
