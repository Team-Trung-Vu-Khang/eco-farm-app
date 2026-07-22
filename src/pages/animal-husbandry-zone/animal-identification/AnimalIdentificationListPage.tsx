import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useAnimalIdentificationListPage } from "./hooks/useAnimalIdentificationListPage";

const AnimalIdentificationListPage = () => {
  const {
    animals,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleDelete,
    handleConfirmDelete,
  } = useAnimalIdentificationListPage();

  return (
    <AdminLayout
      isDev={true}
      title="Định danh cá thể/vật nuôi"
      description="Danh sách thông tin định danh và thông số sinh trưởng của vật nuôi"
      actions={
        <Link href="/animal-identification/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới vật nuôi
          </Button>
        </Link>
      }
    >
      <DataTable
        data={animals as any}
        columns={columns as any}
        selectable={false}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh của vật nuôi này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default AnimalIdentificationListPage;
