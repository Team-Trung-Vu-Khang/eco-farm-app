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

export default function CropFoundationPage() {
  const {
    cropFoundations,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
  } = useCropFoundationPage();

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

      <DeleteCropFoundationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
