import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PesticideCategoryFormDialog } from "./components/PesticideCategoryFormDialog";
import {
  emptyPesticideCategoryFormData,
  initialPesticideOrigins,
} from "./data/constants";
import { pesticideCategoryColumns } from "./data/columns";
import { usePesticideCategoryPage } from "./hooks/usePesticideCategoryPage";

const PesticideOriginPage = () => {
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
    initialData: initialPesticideOrigins,
    emptyFormData: emptyPesticideCategoryFormData,
    createSuccessMessage: "Đã thêm phân loại nguồn gốc mới",
    updateSuccessMessage: "Đã cập nhật phân loại nguồn gốc",
    deleteSuccessMessage: "Đã xóa phân loại nguồn gốc",
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo nguồn gốc</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý nguồn gốc và thành phần của thuốc BVTV
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-origin">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nguồn gốc
        </Button>
      </div>

      <DataTable
        columns={pesticideCategoryColumns("Mã nguồn gốc", "Tên nguồn gốc")}
        data={data}
        onEdit={handleEdit}
        onDelete={handleDelete}
        searchPlaceholder="Tìm kiếm theo nguồn gốc..."
      />

      <PesticideCategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={!!editItem}
        title="phân loại nguồn gốc"
        codeLabel="Mã nguồn gốc"
        nameLabel="Tên nguồn gốc"
        codePlaceholder="VD: CHEMICAL, BIOLOGICAL..."
        namePlaceholder="VD: Thuốc hóa học..."
        descriptionPlaceholder="Mô tả chi tiết về nguồn gốc và thành phần..."
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại nguồn gốc này?"
      />
    </div>
  );
};

export default PesticideOriginPage;
