import {
  AdminLayout,
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";

import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";
import { DeleteCropFoundationDialog } from "./components/DeleteCropFoundationDialog";
import { COLUMNS } from "./data/tableConfig";
import { useCropFoundationPage } from "./hooks/useCropFoundationPage";

export default function CropFoundationPage() {
  const {
    cropFoundations,
    loading,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
    isPending,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  } = useCropFoundationPage();

  useDialogBugWorkaround([deleteOpen]);

  return (
    <AdminLayout
      title="Quản lý cây trồng"
      description="Danh mục các loại cây trồng có trên thị trường"
      actions={
        <div className="flex items-center gap-2">
          <Link href="/crop-foundation/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      <DataTable
        columns={COLUMNS}
        data={cropFoundations}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        searchPlaceholder="Tìm kiếm cây trồng..."
        selectable={false}
        filters={filters}
        onFilterChange={handleFilterChange}
        searchable
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        loading={loading}
      />

      <DeleteCropFoundationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </AdminLayout>
  );
}
