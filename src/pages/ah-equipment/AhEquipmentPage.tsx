import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getEquipmentColumns } from "../equipment/data/columns";
import { useAhEquipmentPage } from "./hooks/useAhEquipmentPage";

export default function AhEquipmentPage() {
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
  } = useAhEquipmentPage();

  const columns = getEquipmentColumns({ onNameClick: navigateToDetail });

  return (
    <PageWrapper
      title="Quản lý thiết bị chăn nuôi"
      description="Quản lý danh mục máy móc, công cụ chăn nuôi và lịch bảo dưỡng"
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
