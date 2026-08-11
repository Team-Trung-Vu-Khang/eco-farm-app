import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import useAnimalGrowthWorkflowStore from "@/stores/useAnimalGrowthWorkflowStore";
import {
  createPlanAnimalGrowthColumns,
  animalGrowthFilters,
  UNASSIGNED_WORKFLOW_ID,
} from "./data/table";
import { useAnimalGrowthPage } from "./hooks/useAnimalGrowthPage";

interface PlanAnimalGrowthWorkflowPlansPageProps {
  basePath?: string;
}

export default function PlanAnimalGrowthWorkflowPlansPage({
  basePath = "/plan-animal-growth",
}: PlanAnimalGrowthWorkflowPlansPageProps) {
  const params = useParams<{ workflowId: string }>();
  const workflowId = params.workflowId || "";
  const [search, setSearch] = useState("");

  const {
    plans,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    goToView,
    goToEdit,
  } = useAnimalGrowthPage(basePath);

  const workflow = useAnimalGrowthWorkflowStore((state) =>
    state.workflows.find((item) => item.id === workflowId),
  );
  const isUnassigned = workflowId === UNASSIGNED_WORKFLOW_ID;

  const workflowPlans = useMemo(
    () =>
      plans.filter((plan) =>
        isUnassigned ? !plan.workflowId : plan.workflowId === workflowId,
      ),
    [plans, workflowId, isUnassigned],
  );

  const columns = useMemo(
    () =>
      createPlanAnimalGrowthColumns({
        onView: (item) => goToView(item.id),
        onEdit: (item) => goToEdit(item.id),
        onDelete: handleDelete,
      }),
    [goToView, goToEdit, handleDelete],
  );

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return workflowPlans;

    return workflowPlans.filter((plan) => {
      const searchable = [
        plan.code,
        plan.name,
        plan.description,
        plan.seasonName,
        plan.startDate,
        plan.endDate,
        plan.cultivationRegion,
        plan.zone,
        plan.crop,
        plan.variety,
        plan.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [workflowPlans, search]);

  const title = isUnassigned
    ? "Kế hoạch chưa gắn sơ đồ"
    : workflow?.name || "Sơ đồ quy trình chăn nuôi";
  const description = isUnassigned
    ? "Kế hoạch được tạo trước khi lưu sơ đồ quy trình hoặc chưa bấm Lưu quy trình."
    : workflow?.description ||
      "Danh sách kế hoạch chăn nuôi thuộc sơ đồ quy trình này";

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
          data={filteredPlans}
          searchable
          onSearch={setSearch}
          searchPlaceholder="Tìm kiếm kế hoạch..."
          filters={animalGrowthFilters}
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
