import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { pesticideColumns } from "../pesticide/data/columns";
import { useAqPesticidePage } from "./hooks/useAqPesticidePage";

export default function AqPesticidePage() {
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
  } = useAqPesticidePage();

  return (
    <PageWrapper
      title="Quản lý thuốc thủy sản"
      description="Quản lý danh mục thuốc, hóa chất và chế phẩm sinh học nuôi trồng thủy sản"
      actions={
        <Button onClick={handleAdd} data-testid="add-aq-pesticide">
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
