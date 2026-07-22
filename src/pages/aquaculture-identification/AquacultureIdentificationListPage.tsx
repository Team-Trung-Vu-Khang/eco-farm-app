import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useAquacultureIdentificationListPage } from "./hooks/useAquacultureIdentificationListPage";

const AquacultureIdentificationListPage = () => {
  const {
    plants,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  } = useAquacultureIdentificationListPage();

  return (
    <AdminLayout
      isDev={true}
      title="Định danh vùng nuôi trồng"
      description="Danh sách thông tin định danh và thông số mẫu cho vùng nuôi trồng"
      actions={
        <Link href="/aquaculture-identification/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới
          </Button>
        </Link>
      }
    >
      <DataTable
        data={plants}
        columns={columns}
        selectable={false}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh mẫu này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default AquacultureIdentificationListPage;

