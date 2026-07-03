import { useMasterData, useMasterDataById } from "./useMasterData";
import { useMasterDataMutations } from "./useMasterDataMutations";
import type { MasterDataQueryParams } from "../types/master-data.type";

export const irrigationSystemKeys = {
  all: () => ["master-data", "irrigation-systems"] as const,
  list: (params?: MasterDataQueryParams) =>
    ["master-data", "irrigation-systems", "list", params ?? {}] as const,
  detail: (id: number | string) =>
    ["master-data", "irrigation-systems", "detail", id] as const,
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
  return useMasterData("irrigation-systems", { params, enabled });
}

export function useIrrigationSystemById(
  id: number | string,
  { enabled = true }: UseIrrigationSystemByIdOptions = {},
) {
  return useMasterDataById("irrigation-systems", id, { enabled });
}

export function useIrrigationSystemMutations() {
  return useMasterDataMutations("irrigation-systems");
}
