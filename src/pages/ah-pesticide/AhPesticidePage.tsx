import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { pesticideColumns } from "../pesticide/data/columns";
import { useAhPesticidePage } from "./hooks/useAhPesticidePage";

export default function AhPesticidePage() {
  const {
    pesticides,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
    handleConfirmDelete,
    navigateToDetail,
  } = useAhPesticidePage();

  return (
    <PageWrapper
      title="Quản lý thuốc chăn nuôi"
      description="Quản lý danh mục thuốc thú y, vaccine và chế phẩm sinh học"
      actions={
        <Button onClick={handleAdd} data-testid="add-ah-pesticide">
          <Plus className="w-4 h-4 mr-2" />
          Thêm thuốc
        </Button>
      }
    >
      <DataTable
        columns={pesticideColumns(navigateToDetail)}
        data={pesticides}
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm thuốc..."
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
