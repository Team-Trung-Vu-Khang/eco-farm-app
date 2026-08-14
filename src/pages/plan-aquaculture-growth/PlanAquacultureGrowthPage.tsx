import PageWrapper from "@/components/PageWrapper";
import useAquacultureGrowthWorkflowStore from "@/stores/useAquacultureGrowthWorkflowStore";
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
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  createWorkflowColumns,
  PlanAquacultureGrowthStatisticsCards,
  UNASSIGNED_WORKFLOW_ID,
  type WorkflowRow,
} from "./data/table";
import { useAquacultureGrowthPage } from "./hooks/useAquacultureGrowthPage";
import { useAquacultureGrowthWorkflowDraftStore } from "./hooks/useAquacultureGrowthWorkflowDraftStore";

interface PlanAquacultureGrowthPageProps {
  basePath?: string;
}

export default function PlanAquacultureGrowthPage({
  basePath = "/plan-aquaculture-growth",
}: PlanAquacultureGrowthPageProps) {
  const [search, setSearch] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { plans, statistics } = useAquacultureGrowthPage(basePath);
  const workflows = useAquacultureGrowthWorkflowStore(
    (state) => state.workflows,
  );
  const cloneWorkflow = useAquacultureGrowthWorkflowStore(
    (state) => state.cloneWorkflow,
  );
  const resetWorkflowDraft = useAquacultureGrowthWorkflowDraftStore(
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
    const rows = workflows.map((workflow) => {
      const workflowPlans = plans.filter(
        (plan) => plan.workflowId === workflow.id,
      );
      return {
        id: workflow.id,
        name: workflow.name,
        description: workflow.description,
        totalCount: workflowPlans.length,
        activeCount: workflowPlans.filter((p) => p.status === "active").length,
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
        draftCount: unassignedPlans.filter((p) => p.status === "draft").length,
        completedCount: unassignedPlans.filter((p) => p.status === "completed")
          .length,
        cancelledCount: unassignedPlans.filter((p) => p.status === "cancelled")
          .length,
      });
    }

    return rows;
  }, [workflows, plans]);

  const handleConfirmClone = () => {
    if (!workflowToClone) return;
    cloneWorkflow(workflowToClone.id);
    toast({
      title: "Đã nhân bản sơ đồ",
      description: `Đã tạo bản sao của "${workflowToClone.name}".`,
    });
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

  const filteredWorkflowRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return workflowRows;

    return workflowRows.filter((row) =>
      [row.name, row.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [workflowRows, search]);

  return (
    <PageWrapper
      title="Quản lý nuôi trồng thủy sản"
      description="Lập và quản lý kế hoạch nuôi trồng thủy sản theo vụ nuôi"
      actions={
        <Button data-testid="add-plan" onClick={handleCreatePlan}>
          <Plus className="w-4 h-4 mr-2" />
          Khởi tạo quy trình
        </Button>
      }
    >
      <div className="space-y-6">
        <PlanAquacultureGrowthStatisticsCards
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
          searchPlaceholder="Tìm kiếm sơ đồ quy trình nuôi trồng thủy sản..."
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
