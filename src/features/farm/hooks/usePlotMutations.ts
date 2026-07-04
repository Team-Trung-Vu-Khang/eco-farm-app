import { useMutation, useQueryClient } from "@tanstack/react-query";
import { plotApi } from "../api/farm.api";
import { plotKeys } from "./usePlots";
import type { FarmPlotRequest, FarmPlotResponse } from "../types/farm.type";

export function usePlotMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => queryClient.invalidateQueries({ queryKey: plotKeys.all() });

  const createPlot = useMutation<FarmPlotResponse, Error, { areaId: number; data: FarmPlotRequest }>({
    mutationFn: ({ areaId, data }) => plotApi.create(areaId, data),
    onSuccess: invalidateList,
  });

  const updatePlot = useMutation<FarmPlotResponse, Error, { id: number; data: FarmPlotRequest }>({
    mutationFn: ({ id, data }) => plotApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: plotKeys.all() });
      queryClient.invalidateQueries({ queryKey: plotKeys.detail(id) });
    },
  });

  const deletePlot = useMutation<void, Error, number>({
    mutationFn: (id) => plotApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createPlot, updatePlot, deletePlot };
}
