import PageWrapper from "@/components/PageWrapper";
import {
  useFarmPlans,
  useFarmWorkflowById,
  useFarmWorkflowPlans,
} from "@/features/farm-workflow/hooks";
import type { FarmPlanStatus } from "@/features/farm-workflow/types/farm-workflow.type";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import { createPlanGrowthColumns } from "./data/table";
import { planGrowthFilters, UNASSIGNED_WORKFLOW_ID } from "./data/table";
import { usePlanPage } from "./hooks/usePlanPage";
import { mapPlanResponseToPlan } from "./utils/api-mappers";

interface PlanGrowthWorkflowPlansPageProps {
  basePath?: string;
}

// Maps the (lowercase) Plan-domain status used by the filter UI to the
// FarmPlanStatus enum the /api/farm/plans and /plans list endpoints expect.
const PLAN_STATUS_TO_API: Record<string, FarmPlanStatus> = {
  active: "IN_PROGRESS",
  draft: "DRAFT",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

export default function PlanGrowthWorkflowPlansPage({
  basePath = "/plan-growth",
}: PlanGrowthWorkflowPlansPageProps) {
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId || "";
  const isUnassigned = workflowId === UNASSIGNED_WORKFLOW_ID;

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [currentIndex, setCurrentIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const {
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    goToView,
    goToEdit,
  } = usePlanPage(basePath, { includePlans: false });

  const workflowDetailQuery = useFarmWorkflowById(workflowId, {
    enabled: !isUnassigned && !!workflowId,
  });

  // Real server-side keyword/status/pagination for a specific workflow's
  // plans, via GET /api/farm/workflows/{workflowId}/plans.
  const workflowPlansQuery = useFarmWorkflowPlans(workflowId, {
    enabled: !isUnassigned && !!workflowId,
    params: {
      keyword: search.trim() || undefined,
      status: status ? PLAN_STATUS_TO_API[status] : undefined,
      page: currentIndex - 1,
      size: pageSize,
    },
  });

  // GET /api/farm/plans has no "plan has no workflow" filter, so the
  // unassigned view still narrows client-side on top of the server's
  // keyword/status filtering — pagination for this view is handled
  // entirely client-side below (see DataTable props) rather than via the
  // API's page/size, since post-fetch filtering would otherwise desync
  // the reported page counts from what's actually displayed.
  const unassignedPlansQuery = useFarmPlans({
    enabled: isUnassigned,
    params: {
      keyword: search.trim() || undefined,
      status: status ? PLAN_STATUS_TO_API[status] : undefined,
      page: 0,
      size: 100,
    },
  });

  const activeQuery = isUnassigned ? unassignedPlansQuery : workflowPlansQuery;

  const plans = useMemo(() => {
    const mapped = activeQuery.items.map(mapPlanResponseToPlan);
    return isUnassigned
      ? mapped.filter((plan) => !plan.workflowId)
      : mapped;
  }, [activeQuery.items, isUnassigned]);

  const columns = useMemo(
    () =>
      createPlanGrowthColumns({
        onView: (item) => goToView(item.id),
        onEdit: (item) => goToEdit(item.id),
        onDelete: handleDelete,
      }),
    [goToView, goToEdit, handleDelete],
  );

  const title = isUnassigned
    ? "Kế hoạch chưa gắn sơ đồ"
    : workflowDetailQuery.data?.name || "Sơ đồ quy trình";
  const description = isUnassigned
    ? "Kế hoạch được tạo trước khi lưu sơ đồ quy trình hoặc chưa bấm Lưu quy trình."
    : workflowDetailQuery.data?.description ||
      "Danh sách kế hoạch thuộc sơ đồ quy trình này";

  return (
    <PageWrapper
      title={title}
      description={description}
      actions={
        <div className="flex flex-wrap gap-2">
          <Link href={basePath}>
            <Button variant="outline" className="h-9 px-3">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại
            </Button>
          </Link>
          {!isUnassigned && (
            <Link href={`${basePath}/create/workflow/${workflowId}`}>
              <Button className="h-9 px-3">
                <Workflow className="mr-2 h-4 w-4" />
                Mở workflow
              </Button>
            </Link>
          )}
        </div>
      }
    >
      <div className="space-y-6">
        <DataTable
          columns={columns}
          data={plans}
          loading={activeQuery.loading}
          searchable
          onSearch={(value) => {
            setSearch(value);
            setCurrentIndex(1);
          }}
          searchPlaceholder="Tìm kiếm kế hoạch..."
          filters={planGrowthFilters}
          onFilterChange={(key, value) => {
            if (key === "status") {
              setStatus(value === "all" ? "" : value);
              setCurrentIndex(1);
            }
          }}
          pageSize={pageSize}
          onPageSize={(size) => {
            setPageSize(size);
            setCurrentIndex(1);
          }}
          {...(isUnassigned
            ? {}
            : {
                currentIndex,
                onIndexChange: setCurrentIndex,
                totalElements: workflowPlansQuery.response?.totalElements ?? 0,
                totalPages: workflowPlansQuery.response?.totalPages ?? 1,
              })}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
