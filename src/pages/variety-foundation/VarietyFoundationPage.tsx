import PageWrapper from "@/components/PageWrapper";
import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { X } from "lucide-react";
import { createPortal } from "react-dom";
import { Link } from "wouter";
import { VarietyFoundationDetailContent } from "./components/VarietyFoundationDetailContent";
import { varietyFoundationColumns } from "./data/columns";
import { useVarietyFoundationPage } from "./hooks/useVarietyFoundationPage";
import type { VarietyFoundation } from "./types/types";

function VarietyFoundationDetailModal({
  open,
  onOpenChange,
  varietyFoundation,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  varietyFoundation: VarietyFoundation | null;
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
          {varietyFoundation ? (
            <VarietyFoundationDetailContent
              varietyFoundation={varietyFoundation}
              isStandalone={false}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-muted-foreground">
                Không tìm thấy thông tin giống cây (nền tảng).
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const VarietyFoundationPage = () => {
  const {
    loading,
    varieties,
    deleteOpen,
    setDeleteOpen,
    selectedVarietyFoundation,
    detailOpen,
    setDetailOpen,
    handleDelete,
    handleConfirmDelete,
    handleView,
    handleEdit,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  } = useVarietyFoundationPage();

  useDialogBugWorkaround([deleteOpen]);

  return (
    <PageWrapper
      title="Quản lý giống cây (nền tảng)"
      description="Xem và quản lý danh sách các loại giống cây trồng (nền tảng)"
      actions={
        <div className="flex gap-2">
          <Link href="/variety-foundation/create">
            <Button className="shadow-sm hover:shadow-md transition-all active:scale-95 bg-green-600 hover:bg-green-700">
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={varietyFoundationColumns}
        data={varieties}
        selectable={false}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm giống cây (nền tảng)..."
        searchable
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        filters={filters}
        onFilterChange={handleFilterChange}
        loading={loading}
      />

      <VarietyFoundationDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        varietyFoundation={selectedVarietyFoundation}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa giống cây (nền tảng) này?"
      />
    </PageWrapper>
  );
};

export default VarietyFoundationPage;
