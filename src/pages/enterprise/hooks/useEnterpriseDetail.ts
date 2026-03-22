import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import useEnterpriseStore from "../../../stores/useEnterpriseStore";

export function useEnterpriseDetail() {
  const [, params] = useRoute("/enterprise/:id");
  const [, setLocation] = useLocation();
  const getEnterpriseById = useEnterpriseStore(
    (state) => state.getEnterpriseById,
  );

  const [bankSearchQuery, setBankSearchQuery] = useState("");
  const [branchSearchQuery, setBranchSearchQuery] = useState("");

  const data = params?.id ? getEnterpriseById(Number(params.id)) : undefined;

  return {
    data,
    setLocation,
    bankSearchQuery,
    setBankSearchQuery,
    branchSearchQuery,
    setBranchSearchQuery,
  };
}
