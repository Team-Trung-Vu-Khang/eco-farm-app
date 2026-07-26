import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmGrowthCycleSeasonApi } from "../api/growth-cycle-season.api";
import { growthCycleSeasonKeys } from "./useGrowthCycleSeasons";

export function useGrowthCycleSeasonMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: growthCycleSeasonKeys.all() });
  };

  const createSeason = useMutation<any, Error, any>({
    mutationFn: (data) => farmGrowthCycleSeasonApi.create(data),
    onSuccess: invalidateList,
  });

  const updateSeason = useMutation<any, Error, { id: string | number; data: any }>({
    mutationFn: ({ id, data }) => farmGrowthCycleSeasonApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: growthCycleSeasonKeys.all() });
      queryClient.invalidateQueries({ queryKey: growthCycleSeasonKeys.userDetail(id) });
    },
  });

  const deleteSeason = useMutation<void, Error, string | number>({
    mutationFn: (id) => farmGrowthCycleSeasonApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createSeason, updateSeason, deleteSeason };
}
