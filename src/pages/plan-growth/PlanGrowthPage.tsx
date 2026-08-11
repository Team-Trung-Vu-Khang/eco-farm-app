import PageWrapper from "@/components/PageWrapper";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import useWorkflowStore from "@/stores/useWorkflowStore";
import { usePlanWorkflowDraftStore } from "./hooks/usePlanWorkflowDraftStore";
import {
  createWorkflowColumns,
  PlanGrowthStatisticsCards,
  UNASSIGNED_WORKFLOW_ID,
  type WorkflowRow,
} from "./data/table";
import { usePlanPage } from "./hooks/usePlanPage";

interface PlanGrowthPageProps {
  basePath?: string;
}

export default function PlanGrowthPage({
  basePath = "/plan-growth",
}: PlanGrowthPageProps) {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { plans, statistics } = usePlanPage(basePath);
  const workflows = useWorkflowStore((state) => state.workflows);
  const resetWorkflowDraft = usePlanWorkflowDraftStore(
    (state) => state.resetDraft,
  );

  const handleCreatePlan = () => {
    // Start a clean canvas — otherwise a workflow opened earlier via
    // "Mở workflow" would still be sitting in the draft store.
    resetWorkflowDraft();
    setLocation(`${basePath}/create/workflow`);
  };

  const workflowRows = useMemo<WorkflowRow[]>(() => {
    const rows = workflows.map((workflow) => {
      const workflowPlans = plans.filter(
        (plan) => plan.workflowId === workflow.id,
      );
      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        totalCount: workflowPlans.length,
        activeCount: workflowPlans.filter((p) => p.status === "active")
          .length,
        draftCount: workflowPlans.filter((p) => p.status === "draft").length,
        completedCount: workflowPlans.filter((p) => p.status === "completed")
          .length,
        cancelledCount: workflowPlans.filter((p) => p.status === "cancelled")
          .length,
      };
    });

    const unassignedPlans = plans.filter((plan) => !plan.workflowId);
    if (unassignedPlans.length) {
      rows.push({
        id: UNASSIGNED_WORKFLOW_ID,
        name: "Kế hoạch chưa gắn sơ đồ",
        description:
          "Kế hoạch được tạo trước khi lưu sơ đồ quy trình hoặc chưa bấm Lưu quy trình.",
        totalCount: unassignedPlans.length,
        activeCount: unassignedPlans.filter((p) => p.status === "active")
          .length,
        draftCount: unassignedPlans.filter((p) => p.status === "draft")
          .length,
        completedCount: unassignedPlans.filter(
          (p) => p.status === "completed",
        ).length,
        cancelledCount: unassignedPlans.filter(
          (p) => p.status === "cancelled",
        ).length,
      });
    }

    return rows;
  }, [workflows, plans]);

  const columns = useMemo(
    () =>
      createWorkflowColumns({
        onView: (row) => setLocation(`${basePath}/workflow/${row.id}`),
        onOpenWorkflow: (row) =>
          setLocation(`${basePath}/create/workflow/${row.id}`),
      }),
    [basePath, setLocation],
  );

  const filteredWorkflowRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return workflowRows;

    return workflowRows.filter((row) =>
      [row.name, row.description].filter(Boolean).join(" ").toLowerCase().includes(query),
    );
  }, [workflowRows, search]);

  return (
    <PageWrapper
      title="Quản lý canh tác"
      description="Lập và quản lý kế hoạch theo mùa vụ"
      actions={
        <Button data-testid="add-plan" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4 mr-2" />
          Khởi tạo kế hoạch mới
        </Button>
      }
    >
      <div className="space-y-6">
        <PlanGrowthStatisticsCards
          totalCount={statistics.total}
          activeCount={statistics.active}
          draftCount={statistics.draft}
          completedCount={statistics.completed}
          cancelledCount={statistics.cancelled}
        />

        <DataTable
          columns={columns}
          data={filteredWorkflowRows}
          searchable
          onSearch={setSearch}
          searchPlaceholder="Tìm kiếm sơ đồ quy trình..."
        />
      </div>
    </PageWrapper>
  );
}
