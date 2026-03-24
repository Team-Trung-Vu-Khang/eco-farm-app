import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PesticideCategoryFormDialog } from "./components/PesticideCategoryFormDialog";
import {
  emptyPesticideCategoryFormData,
  initialPesticidePurposes,
} from "./data/constants";
import { pesticideCategoryColumns } from "./data/columns";
import { usePesticideCategoryPage } from "./hooks/usePesticideCategoryPage";

const PesticidePurposePage = () => {
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
  } = usePesticideCategoryPage({
    initialData: initialPesticidePurposes,
    emptyFormData: emptyPesticideCategoryFormData,
    createSuccessMessage: "Đã thêm phân loại công dụng mới",
    updateSuccessMessage: "Đã cập nhật phân loại công dụng",
    deleteSuccessMessage: "Đã xóa phân loại công dụng",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo công dụng</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý các loại công dụng của thuốc BVTV
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-purpose">
          <Plus className="w-4 h-4 mr-2" />
          Thêm công dụng
        </Button>
      </div>

      <DataTable
        columns={pesticideCategoryColumns("Mã công dụng", "Tên công dụng")}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo công dụng..."
      />

      <PesticideCategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        title="phân loại công dụng"
        codeLabel="Mã công dụng"
        nameLabel="Tên công dụng"
        codePlaceholder="VD: INSECTICIDE, HERBICIDE..."
        namePlaceholder="VD: Thuốc trừ sâu..."
        descriptionPlaceholder="Mô tả chi tiết về công dụng..."
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại công dụng này?"
      />
    </div>
  );
};

export default PesticidePurposePage;
