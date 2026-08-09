import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  animalGrowthFilters,
  AnimalGrowthStatisticsCards,
  createAnimalGrowthColumns,
} from "./data/animalGrowthTable";
import { useAnimalGrowthPage } from "./hooks/useAnimalGrowthPage";

interface PlanAnimalGrowthPageProps {
  basePath?: string;
}

export default function PlanAnimalGrowthPage({
  basePath = "/plan-animal-growth",
}: PlanAnimalGrowthPageProps) {
  const [search, setSearch] = useState("");
  const {
    plans,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    goToView,
    goToEdit,
  } = useAnimalGrowthPage(basePath);

  const columns = useMemo(
    () =>
      createAnimalGrowthColumns({
        onView: (item) => goToView(item.id),
        onEdit: (item) => goToEdit(item.id),
        onDelete: handleDelete,
      }),
    [goToView, goToEdit, handleDelete],
  );

  const filteredPlans = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return plans;

    return plans.filter((plan) => {
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
  }, [plans, search]);

  return (
    <PageWrapper
      title="Quản lý chăn nuôi"
      description="Lập và quản lý kế hoạch chăn nuôi theo lứa nuôi"
      actions={
        <Link href={`${basePath}/create/workflow`}>
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Khởi tạo kế hoạch chăn nuôi mới
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <AnimalGrowthStatisticsCards
          totalCount={statistics.total}
          activeCount={statistics.active}
          draftCount={statistics.draft}
          completedCount={statistics.completed}
        />

        <DataTable
          columns={columns}
          data={filteredPlans}
          searchable
          onSearch={setSearch}
          searchPlaceholder="Tìm kiếm kế hoạch chăn nuôi..."
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
