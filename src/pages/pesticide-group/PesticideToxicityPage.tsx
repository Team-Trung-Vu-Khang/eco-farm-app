import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PesticideToxicityFormDialog } from "./components/PesticideToxicityFormDialog";
import { pesticideToxicityColumns } from "./data/columns";
import { usePesticideToxicityPage } from "./hooks/usePesticideToxicityPage";

const PesticideToxicityPage = () => {
  const {
    data,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = usePesticideToxicityPage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo độ độc tính</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý mức độ độc tính của thuốc BVTV theo tiêu chuẩn WHO
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-toxicity">
          <Plus className="w-4 h-4 mr-2" />
          Thêm mức độ độc tính
        </Button>
      </div>

      <DataTable
        columns={pesticideToxicityColumns}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo độ độc tính..."
      />

      <PesticideToxicityFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại độ độc tính này?"
      />
    </div>
  );
};

export default PesticideToxicityPage;
