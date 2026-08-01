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
  aquacultureGrowthFilters,
  createPlanAquacultureGrowthColumns,
  PlanAquacultureGrowthStatisticsCards,
} from "./data/aquacultureGrowthTable";
import { useAquacultureGrowthPage } from "./hooks/useAquacultureGrowthPage";

interface PlanAquacultureGrowthPageProps {
  basePath?: string;
}

export default function PlanAquacultureGrowthPage({
  basePath = "/plan-aquaculture-growth",
}: PlanAquacultureGrowthPageProps) {
  const [search, setSearch] = useState("");
  const {
    plans,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    goToView,
  } = useAquacultureGrowthPage(basePath);

  const columns = useMemo(
    () =>
      createPlanAquacultureGrowthColumns({
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
      title="Quản lý nuôi trồng thủy sản"
      description="Lập và quản lý kế hoạch nuôi trồng thủy sản theo vụ nuôi"
      actions={
        <Link href={`${basePath}/create`}>
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Khởi tạo kế hoạch thủy sản mới
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <PlanAquacultureGrowthStatisticsCards
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
          filters={aquacultureGrowthFilters}
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
