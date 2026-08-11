import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Workflow } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "wouter";
import useWorkflowStore from "@/stores/useWorkflowStore";
import type { Plan } from "@/stores/usePlanStore";
import {
  createPlanAnimalGrowthColumns,
  animalGrowthFilters,
  UNASSIGNED_WORKFLOW_ID,
} from "./data/table";
import { useAnimalGrowthPage } from "./hooks/useAnimalGrowthPage";

interface PlanAnimalGrowthWorkflowPlansPageProps {
  basePath?: string;
}

function toAnimalGrowthText(value?: string) {
  if (!value) return value;

  return value
    .replaceAll("Quy trình canh tác", "Quy trình chăn nuôi")
    .replaceAll("quy trình canh tác", "quy trình chăn nuôi")
    .replaceAll("canh tác", "chăn nuôi")
    .replaceAll("Canh tác", "Chăn nuôi")
    .replaceAll("mùa vụ", "lứa nuôi")
    .replaceAll("Mùa vụ", "Lứa nuôi")
    .replaceAll("Vụ ", "Lứa ")
    .replaceAll("vụ ", "lứa ")
    .replaceAll("vùng trồng", "khu chăn nuôi")
    .replaceAll("Vùng trồng", "Khu chăn nuôi")
    .replaceAll("cây trồng", "vật nuôi")
    .replaceAll("Cây trồng", "Vật nuôi")
    .replaceAll("Sầu riêng", "Heo thịt")
    .replaceAll("sầu riêng", "heo thịt")
    .replaceAll("Xoài", "Gà đẻ")
    .replaceAll("Bưởi", "Bò thịt")
    .replaceAll("Ri6", "Yorkshire")
    .replaceAll("Monthong", "Duroc")
    .replaceAll("Cát Hòa Lộc", "Lương Phượng")
    .replaceAll("Da Xanh", "Brahman")
    .replaceAll("Thuốc BVTV", "Thuốc thú y")
    .replaceAll("Phân bón", "Thức ăn")
    .replaceAll("Thu hoạch", "Xuất bán")
    .replaceAll("thu hoạch", "xuất bán")
    .replaceAll("Cải tạo đất", "Cải tạo chuồng trại")
    .replaceAll("cải tạo đất", "cải tạo chuồng trại");
}

function toAnimalGrowthPlan(plan: Plan): Plan {
  return {
    ...plan,
    name: toAnimalGrowthText(plan.name) || plan.name,
    description: toAnimalGrowthText(plan.description) || plan.description,
    seasonName: toAnimalGrowthText(plan.seasonName) || plan.seasonName,
    cultivationRegion:
      toAnimalGrowthText(plan.cultivationRegion) || plan.cultivationRegion,
    zone: toAnimalGrowthText(plan.zone) || plan.zone,
    plot: toAnimalGrowthText(plan.plot) || plan.plot,
    crop: toAnimalGrowthText(plan.crop) || plan.crop,
    variety: toAnimalGrowthText(plan.variety) || plan.variety,
  };
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

  const workflow = useWorkflowStore((state) =>
    state.workflows.find((item) => item.id === workflowId),
  );
  const isUnassigned = workflowId === UNASSIGNED_WORKFLOW_ID;

  const workflowPlans = useMemo(
    () =>
      plans
        .filter((plan) =>
          isUnassigned ? !plan.workflowId : plan.workflowId === workflowId,
        )
        .map(toAnimalGrowthPlan),
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
    : toAnimalGrowthText(workflow?.name) || "Sơ đồ quy trình chăn nuôi";
  const description = isUnassigned
    ? "Kế hoạch được tạo trước khi lưu sơ đồ quy trình hoặc chưa bấm Lưu quy trình."
    : toAnimalGrowthText(workflow?.description) ||
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
