import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { materialColumns } from "../material/data/columns";
import { useAqMaterialPage } from "./hooks/useAqMaterialPage";

export default function AqMaterialPage() {
  const {
    materials,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
    navigateToDetail,
  } = useAqMaterialPage();

  return (
    <PageWrapper
      title="Quản lý vật tư thủy sản"
      description="Quản lý danh mục vật tư, dụng cụ nuôi trồng thủy sản"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm vật tư
        </Button>
      }
    >
      <DataTable
        columns={materialColumns(navigateToDetail)}
        data={materials}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm vật tư..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
