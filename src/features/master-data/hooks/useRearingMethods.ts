import { useMasterData, useMasterDataById } from "./useMasterData";
import { useMasterDataMutations } from "./useMasterDataMutations";
import type { MasterDataQueryParams } from "../types/master-data.type";

export const rearingMethodKeys = {
  all: () => ["master-data", "rearing-methods"] as const,
  list: (params?: MasterDataQueryParams) =>
    ["master-data", "rearing-methods", "list", params ?? {}] as const,
  detail: (id: number | string) =>
    ["master-data", "rearing-methods", "detail", id] as const,
};

interface UseRearingMethodsOptions {
  params?: MasterDataQueryParams;
  enabled?: boolean;
}

interface UseRearingMethodByIdOptions {
  enabled?: boolean;
}

export function useRearingMethods(
  { params, enabled = true }: UseRearingMethodsOptions = {},
) {
  return useMasterData("rearing-methods", { params, enabled });
}

export function useRearingMethodById(
  id: number | string,
  { enabled = true }: UseRearingMethodByIdOptions = {},
) {
  return useMasterDataById("rearing-methods", id, { enabled });
}

export function useRearingMethodMutations() {
  return useMasterDataMutations("rearing-methods");
}
