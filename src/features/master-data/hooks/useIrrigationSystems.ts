import { useMasterData, useMasterDataById } from "./useMasterData";
import { useMasterDataMutations } from "./useMasterDataMutations";
import type { MasterDataQueryParams } from "../types/master-data.type";

export const irrigationSystemKeys = {
  all: () => ["master-data", "rearing-methods"] as const,
  list: (params?: MasterDataQueryParams) =>
    ["master-data", "rearing-methods", "list", params ?? {}] as const,
  detail: (id: number | string) =>
    ["master-data", "rearing-methods", "detail", id] as const,
};

interface UseIrrigationSystemsOptions {
  params?: MasterDataQueryParams;
  enabled?: boolean;
}

interface UseIrrigationSystemByIdOptions {
  enabled?: boolean;
}

export function useIrrigationSystems(
  { params, enabled = true }: UseIrrigationSystemsOptions = {},
) {
  return useMasterData("rearing-methods", { params, enabled });
}

export function useIrrigationSystemById(
  id: number | string,
  { enabled = true }: UseIrrigationSystemByIdOptions = {},
) {
  return useMasterDataById("rearing-methods", id, { enabled });
}

export function useIrrigationSystemMutations() {
  return useMasterDataMutations("rearing-methods");
}
