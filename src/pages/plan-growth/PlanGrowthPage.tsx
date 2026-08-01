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
  createPlanGrowthColumns,
  planGrowthFilters,
  PlanGrowthStatisticsCards,
} from "./data/table";
import { usePlanPage } from "./hooks/usePlanPage";

interface PlanGrowthPageProps {
  basePath?: string;
}

export default function PlanGrowthPage({
  basePath = "/plan-growth",
}: PlanGrowthPageProps) {
  const [search, setSearch] = useState("");
  const {
    plans,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    goToView,
  } = usePlanPage(basePath);

  const columns = useMemo(
    () =>
      createPlanGrowthColumns({
        onView: (item) => goToView(item.id),
        onDelete: handleDelete,
      }),
    [goToView, handleDelete],
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
      title="Quản lý canh tác"
      description="Lập và quản lý kế hoạch theo mùa vụ"
      actions={
        <Link href={`${basePath}/create`}>
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Khởi tạo kế hoạch mới
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <PlanGrowthStatisticsCards
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
          searchPlaceholder="Tìm kiếm kế hoạch thủy sản..."
          filters={planGrowthFilters}
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
