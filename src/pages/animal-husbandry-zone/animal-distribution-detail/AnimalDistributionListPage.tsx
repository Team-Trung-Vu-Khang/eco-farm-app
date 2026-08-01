import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { animalDistributionColumns } from "./data/columns";
import { useAnimalDistributionListPage } from "./hooks/useAnimalDistributionListPage";

const AnimalDistributionListPage = () => {
  const {
    data,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = useAnimalDistributionListPage();

  return (
    <PageWrapper
      title="Phân bổ vật nuôi"
      description="Quản lý phân bổ và định vị GPS cho vật nuôi"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo phân bổ mới
        </Button>
      }
    >
      <DataTable
        columns={animalDistributionColumns as any}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân bổ vật nuôi này? Tất cả dữ liệu định vị GPS sẽ bị xóa."
      />
    </PageWrapper>
  );
};

export default AnimalDistributionListPage;
