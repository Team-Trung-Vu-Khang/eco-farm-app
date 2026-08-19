import PageWrapper from "@/components/PageWrapper";
import { useFarmPlans, useFarmWorkflowById } from "@/features/farm-workflow/hooks";
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
// FarmPlanStatus enum GET /api/farm/plans expects.
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

  // GET /api/farm/plans handles keyword/status/pagination server-side, and
  // filters to a single workflow via `workflowId` when one is set. There's
  // no "plan has no workflow" filter, so the unassigned view omits
  // `workflowId` (gets every plan) and narrows to unassigned client-side
  // below — pagination for that view is likewise handled client-side by
  // DataTable rather than via the API's page/size, since post-fetch
  // filtering would otherwise desync the reported page counts.
  const plansQuery = useFarmPlans({
    params: {
      workflowId: isUnassigned ? undefined : Number(workflowId) || undefined,
      keyword: search.trim() || undefined,
      status: status ? PLAN_STATUS_TO_API[status] : undefined,
      page: isUnassigned ? 0 : currentIndex - 1,
      size: isUnassigned ? 100 : pageSize,
    },
  });

  const plans = useMemo(() => {
    const mapped = plansQuery.items.map(mapPlanResponseToPlan);
    return isUnassigned ? mapped.filter((plan) => !plan.workflowId) : mapped;
  }, [plansQuery.items, isUnassigned]);

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
          loading={plansQuery.loading}
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
                totalElements: plansQuery.response?.totalElements ?? 0,
                totalPages: plansQuery.response?.totalPages ?? 1,
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
