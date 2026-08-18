import { useMutation, useQueryClient } from "@tanstack/react-query";
import { farmPlanApi, farmWorkflowApi } from "../api/farm-workflow.api";
import { farmPlanKeys, farmWorkflowKeys } from "./useFarmWorkflows";
import type {
  FarmPlanRequest,
  FarmPlanResponse,
  FarmWorkflowRequest,
  FarmWorkflowResponse,
} from "../types/farm-workflow.type";

export function useFarmWorkflowMutations() {
  const queryClient = useQueryClient();

  const invalidateWorkflows = () =>
    queryClient.invalidateQueries({ queryKey: farmWorkflowKeys.all() });

  const createWorkflow = useMutation<
    FarmWorkflowResponse,
    Error,
    FarmWorkflowRequest
  >({
    mutationFn: (payload) => farmWorkflowApi.create(payload),
    onSuccess: invalidateWorkflows,
  });

  const updateWorkflow = useMutation<
    FarmWorkflowResponse,
    Error,
    { id: number; payload: FarmWorkflowRequest }
  >({
    mutationFn: ({ id, payload }) => farmWorkflowApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmWorkflowKeys.all() });
      queryClient.invalidateQueries({ queryKey: farmWorkflowKeys.detail(id) });
    },
  });

  const deleteWorkflow = useMutation<void, Error, number>({
    mutationFn: (id) => farmWorkflowApi.delete(id).then(() => undefined),
    onSuccess: invalidateWorkflows,
  });

  return { createWorkflow, updateWorkflow, deleteWorkflow };
}

export function useFarmPlanMutations() {
  const queryClient = useQueryClient();

  const invalidatePlans = () =>
    queryClient.invalidateQueries({ queryKey: farmPlanKeys.all() });

  const createPlan = useMutation<
    FarmPlanResponse,
    Error,
    { workflowId: number; payload: FarmPlanRequest }
  >({
    mutationFn: ({ workflowId, payload }) =>
      farmPlanApi.create(workflowId, payload),
    onSuccess: (_, { workflowId }) => {
      queryClient.invalidateQueries({ queryKey: farmWorkflowKeys.all() });
      queryClient.invalidateQueries({
        queryKey: farmWorkflowKeys.plans(workflowId),
      });
      invalidatePlans();
    },
  });

  const updatePlan = useMutation<
    FarmPlanResponse,
    Error,
    { id: number; payload: FarmPlanRequest }
  >({
    mutationFn: ({ id, payload }) => farmPlanApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: farmWorkflowKeys.all() });
      queryClient.invalidateQueries({ queryKey: farmPlanKeys.detail(id) });
      invalidatePlans();
    },
  });

  const deletePlan = useMutation<void, Error, number>({
    mutationFn: (id) => farmPlanApi.delete(id).then(() => undefined),
    onSuccess: invalidatePlans,
  });

  return { createPlan, updatePlan, deletePlan };
}
