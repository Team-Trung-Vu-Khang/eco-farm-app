import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { planColumns, planFilters, PlanStatisticsCards } from "./data/table";
import { usePlanPage } from "./hooks/usePlanPage";

export default function PlanPage() {
  const {
    plans,
    statistics,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
    handleDuplicate,
    goToView,
    goToEdit,
  } = usePlanPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý canh tác"
      description="Lập và quản lý kế hoạch theo mùa vụ"
      actions={
        <Link href="/plan/create">
          <Button data-testid="add-plan">
            <Plus className="w-4 h-4 mr-2" />
            Khởi tạo kế hoạch mới
          </Button>
        </Link>
      }
    >
      <div className="space-y-6">
        <PlanStatisticsCards
          activeCount={statistics.active}
          draftCount={statistics.draft}
          completedCount={statistics.completed}
        />

        <DataTable
          columns={planColumns}
          data={plans}
          onView={(item) => goToView(item.id)}
          onEdit={(item) => goToEdit(item.id)}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
          searchPlaceholder="Tìm kiếm kế hoạch..."
          filters={planFilters}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
