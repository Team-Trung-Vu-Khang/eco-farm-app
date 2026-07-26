import { useMutation, useQueryClient } from "@tanstack/react-query";
import { growthCycleTemplateApi } from "../api/foundation.api";
import { farmGrowthCycleSeasonApi } from "../../farm/api/growth-cycle-season.api";
import {
  growthCycleTemplateKeys,
  userGrowthCycleTemplateKeys,
} from "./useGrowthCycleTemplates";
import type {
  FoundationGrowthCycleTemplateRequest,
  FoundationGrowthCycleTemplateResponse,
} from "../types/foundation.type";

// ─── Legacy/Admin Foundation Growth Cycle Templates ────────────────────────────

export function useGrowthCycleTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: growthCycleTemplateKeys.all() });

  const createTemplate = useMutation<
    FoundationGrowthCycleTemplateResponse,
    Error,
    FoundationGrowthCycleTemplateRequest
  >({
    mutationFn: (data) => growthCycleTemplateApi.create(data),
    onSuccess: invalidateList,
  });

  const updateTemplate = useMutation<
    FoundationGrowthCycleTemplateResponse,
    Error,
    { id: number; data: FoundationGrowthCycleTemplateRequest }
  >({
    mutationFn: ({ id, data }) => growthCycleTemplateApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: growthCycleTemplateKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: growthCycleTemplateKeys.detail(id),
      });
    },
  });

  const deleteTemplate = useMutation<void, Error, number>({
    mutationFn: (id) => growthCycleTemplateApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTemplate, updateTemplate, deleteTemplate };
}

// ─── New User Seasons (Growth Cycles) ──────────────────────────────────────────

export function useUserGrowthCycleTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({
      queryKey: userGrowthCycleTemplateKeys.all(),
    });
  };

  const createTemplate = useMutation<any, Error, any>({
    mutationFn: (data) => farmGrowthCycleSeasonApi.create(data),
    onSuccess: invalidateList,
  });

  const updateTemplate = useMutation<any, Error, { id: number; data: any }>({
    mutationFn: ({ id, data }) => farmGrowthCycleSeasonApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: userGrowthCycleTemplateKeys.all(),
      });
      queryClient.invalidateQueries({
        queryKey: userGrowthCycleTemplateKeys.detail(id),
      });
    },
  });

  const deleteTemplate = useMutation<void, Error, number>({
    mutationFn: (id) =>
      farmGrowthCycleSeasonApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTemplate, updateTemplate, deleteTemplate };
}
