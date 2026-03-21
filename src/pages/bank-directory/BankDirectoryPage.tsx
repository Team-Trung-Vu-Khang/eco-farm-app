import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { type Bank } from "../../constants/banks";
import { Plus } from "lucide-react";
import { useBankDirectory } from "./hooks/useBankDirectory";
import BankFormDialog from "./components/BankFormDialog";
import BankLogo from "../bank/components/BankLogo";

export default function BankDirectoryPage() {
  const {
    data,
    formData,
    setFormData,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    logoPreview,
    handleAdd,
    handleEdit,
    handleDelete,
    handleLogoUpload,
    handleRemoveLogo,
    handleSubmit,
    handleConfirmDelete,
  } = useBankDirectory();

  const columns: Column<Bank>[] = [
    {
      key: "id",
      label: "ID",
      render: (value) => (
        <span className="font-mono text-muted-foreground">#{value}</span>
      ),
    },
    {
      key: "name",
      label: "Ngân hàng",
      render: (value, item) => (
        <div className="flex items-center gap-4 py-1">
          <BankLogo 
            bankName={value as string} 
            logo={item.logo} 
            className="rounded-xl p-2 shadow-sm group-hover:scale-105 transition-transform" 
          />
          <div className="flex flex-col">
            <span className="font-bold text-base leading-tight">{value}</span>
            <span className="text-sm text-muted-foreground line-clamp-1">
              {item.fullName}
            </span>
          </div>
        </div>
      ),
    },
  ];

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
        columns={columns}
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
        onFormUpdate={(updates) => setFormData({ ...formData, ...updates })}
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
