import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useFarmPlanMutations, useFarmWorkflowMutations } from "@/features/farm-workflow/hooks";
import type {
  FarmPlanRequest,
  FarmWorkflowRequest,
} from "@/features/farm-workflow/types/farm-workflow.type";
import { useFarmPlans, useFarmWorkflows } from "@/features/farm-workflow/hooks";
import {
  deleteFallbackPlan,
  duplicateFallbackPlan,
  duplicateFallbackWorkflow,
  getFallbackPlans,
  getFallbackWorkflows,
  mapPlanResponseToPlan,
  mapWorkflowResponseToWorkflow,
} from "../utils/api-mappers";
import type { Plan, Workflow } from "../types";

function getPlanStatistics(plans: Plan[]) {
  return {
    active: plans.filter((plan) => plan.status === "active").length,
    draft: plans.filter((plan) => plan.status === "draft").length,
    completed: plans.filter((plan) => plan.status === "completed").length,
    cancelled: plans.filter((plan) => plan.status === "cancelled").length,
    total: plans.length,
  };
}

function getPlanDurationDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 1;
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86400000));
}

function mapStatus(planStatus: Plan["status"]): FarmPlanRequest["status"] {
  if (planStatus === "active") return "IN_PROGRESS";
  if (planStatus === "completed") return "COMPLETED";
  if (planStatus === "cancelled") return "CANCELLED";
  return "DRAFT";
}

function mapPurpose(planPurpose: Plan["purpose"]): FarmPlanRequest["purpose"] {
  switch (planPurpose) {
    case "facility-upgrade":
      return "FACILITY_UPGRADE";
    case "treatment":
      return "TREATMENT";
    case "amendment":
      return "SOIL_IMPROVEMENT";
    case "harvest":
      return "HARVEST";
    default:
      return "CULTIVATION";
  }
}

function toFarmPlanRequest(plan: Plan): FarmPlanRequest {
  return {
    code: plan.code || null,
    name: `${plan.name} (Bản sao)`,
    description: plan.description || undefined,
    purpose: mapPurpose(plan.purpose),
    durationDays: getPlanDurationDays(plan.startDate, plan.endDate),
    scopeNote: undefined,
    personnel: undefined,
    stages: undefined,
    status: mapStatus(plan.status),
  };
}

function toFarmWorkflowRequest(workflow: Workflow): FarmWorkflowRequest {
  return {
    domainCode: "CROP",
    code: workflow.id || null,
    name: `${workflow.name} (Bản sao)`,
    description: workflow.description || undefined,
    durationDays: 1,
    scopes: workflow.selections.map((selection) => ({
      scopeType:
        selection.type === "plot"
          ? "PLOT"
          : selection.type === "area"
            ? "AREA"
            : "REGION",
      scopeId: Number(selection.plotId || selection.areaId || selection.regionId),
    })),
    status: workflow.isActive ? "ACTIVE" : "INACTIVE",
  };
}

export function usePlanPage(basePath = "/plan-growth") {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const planQuery = useFarmPlans();
  const workflowQuery = useFarmWorkflows();
  const { deletePlan, createPlan } = useFarmPlanMutations();
  const { createWorkflow } = useFarmWorkflowMutations();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteItem, setDeleteItem] = useState<Plan | null>(null);

  const apiPlans = useMemo(
    () => planQuery.items.map(mapPlanResponseToPlan),
    [planQuery.items],
  );
  const apiWorkflows = useMemo(
    () => workflowQuery.items.map(mapWorkflowResponseToWorkflow),
    [workflowQuery.items],
  );

  const plans = apiPlans.length ? apiPlans : getFallbackPlans();
  const workflows = apiWorkflows.length ? apiWorkflows : getFallbackWorkflows();
  const statistics = useMemo(() => getPlanStatistics(plans), [plans]);

  const handleDelete = (item: Plan) => {
    setDeleteItem(item);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deleteItem) {
      setDeleteOpen(false);
      return;
    }

    try {
      await deletePlan.mutateAsync(deleteItem.id);
      deleteFallbackPlan(deleteItem.id);
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    } catch {
      deleteFallbackPlan(deleteItem.id);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa kế hoạch",
      });
    } finally {
      setDeleteOpen(false);
      setDeleteItem(null);
    }
  };

  const handleDuplicate = async (item: Plan) => {
    try {
      if (item.workflowId) {
        await createPlan.mutateAsync({
          workflowId: item.workflowId,
          payload: toFarmPlanRequest(item),
        });
      } else {
        duplicateFallbackPlan(item.id);
      }
      if (!item.workflowId) {
        toast({ title: "Thành công", description: "Đã nhân bản kế hoạch" });
        return;
      }
      toast({ title: "Thành công", description: "Đã nhân bản kế hoạch" });
    } catch {
      duplicateFallbackPlan(item.id);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể nhân bản kế hoạch",
      });
    }
  };

  const handleCloneWorkflow = async (workflow: Workflow) => {
    try {
      await createWorkflow.mutateAsync(toFarmWorkflowRequest(workflow));
      duplicateFallbackWorkflow(workflow.id);
      toast({
        title: "Đã nhân bản sơ đồ",
        description: `Đã tạo bản sao của "${workflow.name}".`,
      });
    } catch {
      duplicateFallbackWorkflow(workflow.id);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể nhân bản sơ đồ quy trình",
      });
    }
  };

  return {
    plans,
    workflows,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleDuplicate,
    handleCloneWorkflow,
    goToCreate: () => setLocation(`${basePath}/create/workflow`),
    goToView: (id: number) => setLocation(`${basePath}/${id}`),
    goToEdit: (id: number) =>
      setLocation(`${basePath}/create/workflow/plan/${id}/edit`),
  };
}
