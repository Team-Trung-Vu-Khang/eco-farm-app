import { useMutation, useQueryClient } from "@tanstack/react-query";
import { lifecycleTemplateApi, userLifecycleTemplateApi } from "../api/foundation.api";
import { lifecycleTemplateKeys, userLifecycleTemplateKeys } from "./useLifecycleTemplates";
import type {
  LifecycleTemplate,
} from "../types/foundation.type";

export function useLifecycleTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () =>
    queryClient.invalidateQueries({ queryKey: lifecycleTemplateKeys.all() });

  const createTemplate = useMutation<
    LifecycleTemplate,
    Error,
    LifecycleTemplate
  >({
    mutationFn: (data) => lifecycleTemplateApi.create(data),
    onSuccess: invalidateList,
  });

  const updateTemplate = useMutation<
    LifecycleTemplate,
    Error,
    { id: number; data: LifecycleTemplate }
  >({
    mutationFn: ({ id, data }) => lifecycleTemplateApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: lifecycleTemplateKeys.all() });
      queryClient.invalidateQueries({
        queryKey: lifecycleTemplateKeys.detail(id),
      });
    },
  });

  const deleteTemplate = useMutation<void, Error, number>({
    mutationFn: (id) =>
      lifecycleTemplateApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTemplate, updateTemplate, deleteTemplate };
}

export function useUserLifecycleTemplateMutations() {
  const queryClient = useQueryClient();

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: userLifecycleTemplateKeys.all() });
  };

  const createTemplate = useMutation<
    LifecycleTemplate,
    Error,
    LifecycleTemplate
  >({
    mutationFn: (data) => userLifecycleTemplateApi.create(data),
    onSuccess: invalidateList,
  });

  const updateTemplate = useMutation<
    LifecycleTemplate,
    Error,
    { id: number; data: LifecycleTemplate }
  >({
    mutationFn: ({ id, data }) => userLifecycleTemplateApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: userLifecycleTemplateKeys.all() });
      queryClient.invalidateQueries({
        queryKey: userLifecycleTemplateKeys.detail(id),
      });
    },
  });

  const deleteTemplate = useMutation<void, Error, number>({
    mutationFn: (id) =>
      userLifecycleTemplateApi.delete(id).then(() => undefined),
    onSuccess: invalidateList,
  });

  return { createTemplate, updateTemplate, deleteTemplate };
}

