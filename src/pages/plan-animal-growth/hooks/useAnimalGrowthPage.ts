import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  useFarmPlanMutations,
  useFarmWorkflowMutations,
} from "@/features/farm-workflow/hooks";
import type {
  FarmPlanRequest,
  FarmWorkflowRequest,
  FarmWorkflowRequestStatus,
} from "@/features/farm-workflow/types/farm-workflow.type";
import {
  useFarmPlans,
  useFarmWorkflows,
  useFarmWorkflowStats,
} from "@/features/farm-workflow/hooks";
import {
  mapPlanResponseToPlan,
  mapWorkflowResponseToWorkflow,
} from "../utils/api-mappers";
import type { Plan, Workflow } from "../types";

const WORKFLOW_DOMAIN_CODE = "LIVESTOCK" as const;

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

export function mapStatus(planStatus: Plan["status"]): FarmPlanRequest["status"] {
  if (planStatus === "active") return "IN_PROGRESS";
  if (planStatus === "completed") return "COMPLETED";
  if (planStatus === "cancelled") return "CANCELLED";
  return "DRAFT";
}

export function mapPurpose(planPurpose: Plan["purpose"]): FarmPlanRequest["purpose"] {
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
    scopeNote: plan.scopeNote || undefined,
    purpose: mapPurpose(plan.purpose),
    durationDays: getPlanDurationDays(plan.startDate, plan.endDate),
    personnel: undefined,
    stages: undefined,
    status: mapStatus(plan.status),
  };
}

function toFarmWorkflowRequest(workflow: Workflow): FarmWorkflowRequest {
  return {
    domainCode: "LIVESTOCK",
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
    seasonIds: workflow.seasonIds,
    status: workflow.isActive ? "ACTIVE" : "INACTIVE",
  };
}

interface UseAnimalGrowthPageOptions {
  // The workflow list page only needs the workflow API — plans are only
  // fetched for pages that actually list/derive plan rows (workflow detail,
  // unassigned-plans view).
  includePlans?: boolean;
}

export function useAnimalGrowthPage(
  basePath = "/plan-animal-growth",
  { includePlans = true }: UseAnimalGrowthPageOptions = {},
) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<FarmWorkflowRequestStatus | "">("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const planQuery = useFarmPlans({ enabled: includePlans });
  const workflowQuery = useFarmWorkflows({
    params: {
      domainCode: WORKFLOW_DOMAIN_CODE,
      keyword: search.trim() || undefined,
      status: status || undefined,
      page: currentIndex - 1,
      size: pageSize,
    },
  });
  const statsQuery = useFarmWorkflowStats({
    params: { domainCode: WORKFLOW_DOMAIN_CODE },
  });
  const { deletePlan, createPlan } = useFarmPlanMutations();
  const { createWorkflow, deleteWorkflow } = useFarmWorkflowMutations();

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

  const plans = apiPlans;
  const workflows = apiWorkflows;
  const statistics = statsQuery.data
    ? {
        total: statsQuery.data.totalPlans,
        active: statsQuery.data.inProgressPlans,
        draft: statsQuery.data.draftPlans,
        completed: statsQuery.data.completedPlans,
        cancelled: statsQuery.data.cancelledPlans,
      }
    : getPlanStatistics(plans);

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
      toast({ title: "Thành công", description: "Đã xóa kế hoạch" });
    } catch {
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
    if (!item.workflowId) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể nhân bản kế hoạch chưa gắn sơ đồ quy trình",
      });
      return;
    }

    try {
      await createPlan.mutateAsync({
        workflowId: item.workflowId,
        payload: toFarmPlanRequest(item),
      });
      toast({ title: "Thành công", description: "Đã nhân bản kế hoạch" });
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể nhân bản kế hoạch",
      });
    }
  };

  const handleDeleteWorkflow = async (workflow: Workflow) => {
    try {
      await deleteWorkflow.mutateAsync(workflow.id);
      toast({
        title: "Đã xóa sơ đồ",
        description: `Đã xóa "${workflow.name}".`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa sơ đồ quy trình",
      });
    }
  };

  const handleCloneWorkflow = async (workflow: Workflow) => {
    try {
      await createWorkflow.mutateAsync(toFarmWorkflowRequest(workflow));
      toast({
        title: "Đã nhân bản sơ đồ",
        description: `Đã tạo bản sao của "${workflow.name}".`,
      });
    } catch {
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
    handleDeleteWorkflow,
    goToCreate: () => setLocation(`${basePath}/create/workflow`),
    goToView: (id: number) => setLocation(`${basePath}/${id}`),
    goToEdit: (id: number) =>
      setLocation(`${basePath}/create/workflow/plan/${id}/edit`),

    // Workflow list — pagination / search / status filter (API-driven)
    search,
    setSearch,
    status,
    setStatus,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    totalElements: workflowQuery.response?.totalElements ?? workflows.length,
    totalPages: workflowQuery.response?.totalPages ?? 1,
    loading: workflowQuery.loading,
  };
}
