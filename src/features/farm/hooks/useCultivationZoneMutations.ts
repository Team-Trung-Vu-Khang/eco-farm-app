import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cultivationZoneApi } from "../api/farm.api";
import type { FarmCultivationZoneRequest } from "../types/farm.type";
import { cultivationZoneKeys } from "./useCultivationZones";

export function useCultivationZoneMutations() {
  const queryClient = useQueryClient();

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: cultivationZoneKeys.all() });

  const createCultivationZone = useMutation({
    mutationFn: (data: FarmCultivationZoneRequest) =>
      cultivationZoneApi.create(data),
    onSuccess: invalidate,
  });

  const updateCultivationZone = useMutation({
    mutationFn: ({ id, data }: { id: number; data: FarmCultivationZoneRequest }) =>
      cultivationZoneApi.update(id, data),
    onSuccess: invalidate,
  });

  const deleteCultivationZone = useMutation({
    mutationFn: (id: number) => cultivationZoneApi.delete(id),
    onSuccess: invalidate,
  });

  return {
    createCultivationZone,
    updateCultivationZone,
    deleteCultivationZone,
  };
}
