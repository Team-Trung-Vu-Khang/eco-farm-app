import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useBankDirectory } from "./hooks/useBankDirectory";
import BankFormDialog from "./components/BankFormDialog";
import { bankDirectoryColumns } from "./data/columns";

export default function BankDirectoryPage() {
  const {
    data,
    formData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    updateFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  } = useBankDirectory();

  return (
    <AdminLayout
      title="Danh mục ngân hàng"
      description="Quản lý danh sách các ngân hàng được hỗ trợ trong hệ thống"
      actions={
        <Button onClick={handleAdd} data-testid="add-bank">
          <Plus className="w-4 h-4 mr-2" />
          Thêm ngân hàng
        </Button>
      }
    >
      <DataTable
        columns={bankDirectoryColumns}
        data={data}
        pageSize={10}
        searchPlaceholder="Tìm kiếm tên ngân hàng..."
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <BankFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        formData={formData}
        onFormUpdate={updateFormData}
        logoPreview={logoPreview}
        onLogoUpload={handleLogoUpload}
        onRemoveLogo={handleRemoveLogo}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa ngân hàng này khỏi danh sách?"
      />
    </AdminLayout>
  );
}
