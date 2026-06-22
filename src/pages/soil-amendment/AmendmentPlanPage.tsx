import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ArrowUpRight,
  Calendar as CalendarIcon,
  ClipboardCheck,
  List,
  Plus,
  Sprout,
} from "lucide-react";
import { AmendmentPlanCalendarView } from "./components/AmendmentPlanCalendarView";
import { AmendmentPlanDetailDialog } from "./components/AmendmentPlanDetailDialog";
import { createAmendmentPlanColumns } from "./data/amendmentPlanColumns";
import { useAmendmentPlanPage } from "./hooks/useAmendmentPlanPage";

export default function AmendmentPlanPage() {
  const {
    deleteOpen,
    detailOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleViewDetail,
    plans,
    selectedItem,
    setDeleteOpen,
    setDetailOpen,
    setViewMode,
    stats,
    tableFilters,
    viewMode,
  } = useAmendmentPlanPage();

  const columns = createAmendmentPlanColumns({
    onDelete: handleDelete,
    onEdit: handleEdit,
    onViewDetail: handleViewDetail,
  });

  return (
    <AdminLayout
      isRice
      title="Kế hoạch cải tạo đất"
      description="Lập và theo dõi tiến độ các dự án cải tạo đất theo từng khu vực"
      actions={
        <div className="flex items-center gap-2">
          <div className="mr-2 flex rounded-lg border border-slate-200 bg-slate-100 p-1">
            <button
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "list"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => setViewMode("list")}
              title="Xem danh sách"
              type="button"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className={`rounded-md p-1.5 transition-all ${
                viewMode === "calendar"
                  ? "bg-white text-primary shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
              onClick={() => setViewMode("calendar")}
              title="Xem lịch biểu"
              type="button"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </div>
          <Button className="shadow-sm" onClick={handleAdd}>
            <Plus className="mr-2 h-4 w-4" />
            Lập kế hoạch
          </Button>
        </div>
      }
    >
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
              <ClipboardCheck className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.planning}
              </p>
              <p className="text-xs font-medium uppercase text-slate-500">
                Đang lập
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-green-50 p-2 text-green-600">
              <ArrowUpRight className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.inProgress}
              </p>
              <p className="text-xs font-medium uppercase text-slate-500">
                Đang thực hiện
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.completed}
              </p>
              <p className="text-xs font-medium uppercase text-slate-500">
                Hoàn thành
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="rounded-lg bg-amber-50 p-2 text-amber-600">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">
                {stats.totalArea} ha
              </p>
              <p className="text-xs font-medium uppercase text-slate-500">
                Tổng diện tích
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {viewMode === "list" ? (
        <DataTable
          columns={columns}
          data={plans}
          filters={tableFilters}
          onDelete={handleDelete}
          onEdit={handleEdit}
          searchPlaceholder="Tìm kiếm kế hoạch, khu vực, vấn đề..."
        />
      ) : (
        <AmendmentPlanCalendarView
          onViewDetail={handleViewDetail}
          plans={plans}
        />
      )}

      <DeleteDialog
        description="Bạn có chắc chắn muốn xóa kế hoạch cải tạo này?"
        onConfirm={handleConfirmDelete}
        onOpenChange={setDeleteOpen}
        open={deleteOpen}
        title="Xóa kế hoạch"
      />

      <AmendmentPlanDetailDialog
        onClose={() => setDetailOpen(false)}
        onEdit={handleEdit}
        onOpenChange={setDetailOpen}
        open={detailOpen}
        selectedItem={selectedItem}
      />
    </AdminLayout>
  );
}
