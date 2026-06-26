import { useMutation, useQueryClient } from "@tanstack/react-query";
import { growthCycleTemplateApi } from "../api/foundation.api";
import { growthCycleTemplateKeys } from "./useGrowthCycleTemplates";
import type {
  FoundationGrowthCycleTemplateRequest,
  FoundationGrowthCycleTemplateResponse,
} from "../types/foundation.type";

/**
 * Mutation hooks cho Foundation Growth Cycle Templates.
 * Sau mỗi mutation thành công → tự động invalidate list templates.
 *
 * @example
 * const { createTemplate, updateTemplate, deleteTemplate } = useGrowthCycleTemplateMutations();
 *
 * createTemplate.mutate({ name: "Chu kỳ lúa vụ đông", cropId: 1, expectedDays: 90, stages: [...] });
 * updateTemplate.mutate({ id: 2, data: { expectedDays: 95 } });
 * deleteTemplate.mutate(2);
 */
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
      queryClient.invalidateQueries({ queryKey: growthCycleTemplateKeys.all() });
      queryClient.invalidateQueries({
        queryKey: growthCycleTemplateKeys.detail(id),
      });
    },
  });

  const deleteTemplate = useMutation<void, Error, number>({
    mutationFn: (id) =>
      growthCycleTemplateApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTemplate, updateTemplate, deleteTemplate };
}
