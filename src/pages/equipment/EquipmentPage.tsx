import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getEquipmentColumns } from "./data/columns";
import { useEquipmentPage } from "./hooks/useEquipmentPage";

export default function EquipmentPage() {
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
  } = useEquipmentPage();

  const columns = getEquipmentColumns({ onNameClick: navigateToDetail });

  return (
    <PageWrapper
      title="Quản lý thiết bị"
      description="Quản lý danh mục máy móc, công cụ và lịch bảo dưỡng"
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
