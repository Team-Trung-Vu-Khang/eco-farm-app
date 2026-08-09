import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getEquipmentColumns } from "../equipment/data/columns";
import { useAqEquipmentPage } from "./hooks/useAqEquipmentPage";

export default function AqEquipmentPage() {
  const {
    equipments,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleView,
    handleConfirmDelete,
    navigateToDetail,
  } = useAqEquipmentPage();

  const columns = getEquipmentColumns({ onNameClick: navigateToDetail });

  return (
    <PageWrapper
      title="Quản lý thiết bị thủy sản"
      description="Quản lý danh mục máy móc, công cụ nuôi trồng thủy sản và lịch bảo dưỡng"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm thiết bị
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={equipments}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thiết bị..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
