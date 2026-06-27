import {
  AdminLayout,
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileDown, Plus } from "lucide-react";
import { Link } from "wouter";

import { DeleteCropFoundationDialog } from "./components/DeleteCropFoundationDialog";
import { COLUMNS, TABLE_FILTERS } from "./data/tableConfig";
import { useCropFoundationPage } from "./hooks/useCropFoundationPage";
import { useDialogBugWorkaround } from "@/shared/hooks/useDialogBugWorkaround";

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
  } = useCropFoundationPage();

  useDialogBugWorkaround([deleteOpen]);

  return (
    <AdminLayout
      isDev={true}
      title="Quản lý cây trồng"
      description="Danh mục các loại cây trồng có trên thị trường"
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white">
            <FileDown className="w-4 h-4 mr-2 text-green-600" />
            Xuất Excel
          </Button>
          <Link href="/crop-foundation/create">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Thêm mới
            </Button>
          </Link>
        </div>
      }
    >
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <div className="h-8 w-8 rounded-full border-2 border-slate-200 border-t-green-500 animate-spin" />
          <span className="text-sm">Đang tải danh sách cây trồng...</span>
        </div>
      ) : (
        <DataTable
          columns={COLUMNS}
          data={cropFoundations}
          onDelete={handleDelete}
          onView={handleView}
          onEdit={handleEdit}
          searchPlaceholder="Tìm kiếm cây trồng..."
          selectable={false}
          filters={TABLE_FILTERS}
        />
      )}

      <DeleteCropFoundationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        isPending={isPending}
      />
    </AdminLayout>
  );
}
