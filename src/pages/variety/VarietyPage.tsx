import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { VarietyDetailContent } from "./components/VarietyDetailContent";
import { varietyColumns } from "./data/columns";
import { varietyFilters } from "./data/constants";
import { useVarietyPage } from "./hooks/useVarietyPage";
import type { Variety } from "./types/types";

function VarietyDetailModal({
  open,
  onOpenChange,
  variety,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variety: Variety | null;
}) {
  if (!open || typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 py-6"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition-colors hover:bg-slate-200 hover:text-slate-800"
          aria-label="Đóng chi tiết"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-6 sm:p-8">
          {variety ? (
            <VarietyDetailContent variety={variety} isStandalone={false} />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground">
                Không tìm thấy thông tin giống cây.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const VarietyPage = () => {
  const {
    varieties,
    deleteOpen,
    setDeleteOpen,
    selectedVariety,
    detailOpen,
    setDetailOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
  } = useVarietyPage();

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý giống cây"
      description="Xem và quản lý danh sách các loại giống cây trồng"
      actions={
        <div className="flex gap-2">
          <Link href="/variety/create">
            <Button className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={varietyColumns}
        data={varieties}
        selectable
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây..."
        filters={varietyFilters}
      />

      <VarietyDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        variety={selectedVariety}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa giống cây này?"
      />
    </AdminLayout>
  );
};

export default VarietyPage;
