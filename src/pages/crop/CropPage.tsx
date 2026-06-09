import {
  AdminLayout,
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileDown, Plus } from "lucide-react";
import { Link } from "wouter";

import { DeleteCropDialog } from "./components/DeleteCropDialog";
import { COLUMNS, TABLE_FILTERS } from "./data/tableConfig";
import { useCropPage } from "./hooks/useCropPage";

export default function CropPage() {
  const {
    crops,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleView,
    handleEdit,
    handleConfirmDelete,
  } = useCropPage();

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
          <Link href="/crop/create">
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
        data={crops}
        onDelete={handleDelete}
        onView={handleView}
        onEdit={handleEdit}
        searchPlaceholder="Tìm kiếm cây trồng..."
        selectable
        filters={TABLE_FILTERS}
      />

      <DeleteCropDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
