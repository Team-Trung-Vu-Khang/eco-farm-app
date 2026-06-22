import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { seasonColumns } from "./data/columns";
import { useSeasonPage } from "./hooks/useSeasonPage";

export default function SeasonPage() {
  const {
    deleteOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    seasons,
    setDeleteOpen,
  } = useSeasonPage();

  return (
    <AdminLayout
      isRice
      title="Quản lý mùa vụ"
      description="Quản lý kế hoạch mùa vụ và quy trình canh tác"
      actions={
        <Button
          className="bg-green-600 shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
          onClick={handleAdd}
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      }
    >
      <DataTable
        data={seasons}
        selectable
        columns={seasonColumns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm mã, tên mùa vụ..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
