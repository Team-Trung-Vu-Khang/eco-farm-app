import PageWrapper from "@/components/PageWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import type { FarmWorkflowRequestStatus } from "@/features/farm-workflow/types/farm-workflow.type";
import {
  createWorkflowColumns,
  PlanGrowthStatisticsCards,
  UNASSIGNED_WORKFLOW_ID,
  type WorkflowRow,
} from "./data/table";
import { usePlanPage } from "./hooks/usePlanPage";
import { usePlanWorkflowDraftStore } from "./hooks/usePlanWorkflowDraftStore";

interface PlanGrowthPageProps {
  basePath?: string;
}

export default function PlanGrowthPage({
  basePath = "/plan-growth",
}: PlanGrowthPageProps) {
  const [, setLocation] = useLocation();
  const {
    plans,
    workflows,
    statistics,
    handleCloneWorkflow,
    setSearch,
    setStatus,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    totalElements,
    totalPages,
    loading,
  } = usePlanPage(basePath);
  const resetWorkflowDraft = usePlanWorkflowDraftStore(
    (state) => state.resetDraft,
  );
  const [workflowToClone, setWorkflowToClone] = useState<WorkflowRow | null>(
    null,
  );

  const handleCreatePlan = () => {
    // Start a clean canvas — otherwise a workflow opened earlier via
    // "Mở workflow" would still be sitting in the draft store.
    resetWorkflowDraft();
    setLocation(`${basePath}/create/workflow`);
  };

  const workflowRows = useMemo<WorkflowRow[]>(() => {
    const rows = workflows.map((workflow) => ({
      id: workflow.id,
      name: workflow.name,
      description: workflow.description,
      totalCount: workflow.planCount ?? 0,
      activeCount: workflow.statusBreakdown?.inProgress ?? 0,
      draftCount: workflow.statusBreakdown?.draft ?? 0,
      completedCount: workflow.statusBreakdown?.completed ?? 0,
      cancelledCount: workflow.statusBreakdown?.cancelled ?? 0,
    }));

    const unassignedPlans =
      currentIndex === 1 ? plans.filter((plan) => !plan.workflowId) : [];
    if (unassignedPlans.length) {
      rows.push({
        id: UNASSIGNED_WORKFLOW_ID,
        name: "Kế hoạch chưa gắn sơ đồ",
        description:
          "Kế hoạch được tạo trước khi lưu sơ đồ quy trình hoặc chưa bấm Lưu quy trình.",
        totalCount: unassignedPlans.length,
        activeCount: unassignedPlans.filter((p) => p.status === "active")
          .length,
        draftCount: unassignedPlans.filter((p) => p.status === "draft").length,
        completedCount: unassignedPlans.filter((p) => p.status === "completed")
          .length,
        cancelledCount: unassignedPlans.filter((p) => p.status === "cancelled")
          .length,
      });
    }

    return rows;
  }, [workflows, plans, currentIndex]);

  const handleConfirmClone = () => {
    if (!workflowToClone) return;
    const workflow = workflows.find((w) => w.id === workflowToClone.id);
    if (workflow) void handleCloneWorkflow(workflow);
    setWorkflowToClone(null);
  };

  const columns = useMemo(
    () =>
      createWorkflowColumns({
        onView: (row) => setLocation(`${basePath}/workflow/${row.id}`),
        onOpenWorkflow: (row) =>
          setLocation(`${basePath}/create/workflow/${row.id}`),
        onClone: (row) => setWorkflowToClone(row),
      }),
    [basePath, setLocation],
  );

  return (
    <PageWrapper
      title="Quản lý canh tác"
      description="Lập và quản lý kế hoạch theo mùa vụ"
      actions={
        <Button data-testid="add-plan" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4 mr-2" />
          Khởi tạo quy trình
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
          data={workflowRows}
          loading={loading}
          searchable
          onSearch={(value) => {
            setSearch(value);
            setCurrentIndex(1);
          }}
          searchPlaceholder="Tìm kiếm sơ đồ quy trình..."
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={totalElements}
          totalPages={totalPages}
          onIndexChange={setCurrentIndex}
          onPageSize={(size) => {
            setPageSize(size);
            setCurrentIndex(1);
          }}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatus((value as FarmWorkflowRequestStatus) || "");
              setCurrentIndex(1);
            }
          }}
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [
                { label: "Hoạt động", value: "ACTIVE" },
                { label: "Không hoạt động", value: "INACTIVE" },
                { label: "Đã lưu trữ", value: "ARCHIVED" },
              ],
            },
          ]}
        />
      </div>

      <AlertDialog
        open={workflowToClone !== null}
        onOpenChange={(open) => {
          if (!open) setWorkflowToClone(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Nhân bản sơ đồ quy trình?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này sẽ tạo một bản sao của sơ đồ
              {workflowToClone?.name ? ` "${workflowToClone.name}"` : ""} với
              toàn bộ nội dung hiện có.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmClone}>
              Nhân bản
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
}
