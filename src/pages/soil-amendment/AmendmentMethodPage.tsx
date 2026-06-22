import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { AmendmentMethodDetailDialog } from "./components/AmendmentMethodDetailDialog";
import { AmendmentMethodFormDialog } from "./components/AmendmentMethodFormDialog";
import { amendmentMethodColumns } from "./data/amendmentMethodColumns";
import { amendmentMethodFilters } from "./data/amendmentMethodData";
import { useAmendmentMethodPage } from "./hooks/useAmendmentMethodPage";

const AmendmentMethodPage = () => {
  const {
    data,
    deleteOpen,
    detailOpen,
    formData,
    formOpen,
    handleAdd,
    handleConfirmDelete,
    handleDelete,
    handleEdit,
    handleSubmit,
    handleViewDetail,
    selectedItem,
    setDeleteOpen,
    setDetailOpen,
    setFormData,
    setFormOpen,
  } = useAmendmentMethodPage();

  return (
    <AdminLayout
      isRice
      title="Phương pháp cải tạo đất"
      description="Quản lý thư viện các biện pháp kỹ thuật xử lý đất"
      actions={
        <Button onClick={handleAdd} className="shadow-sm">
          <Plus className="mr-2 h-4 w-4" />
          Thêm mới
        </Button>
      }
    >
      <div className="space-y-4">
        <DataTable
          columns={amendmentMethodColumns}
          data={data}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetail}
          searchPlaceholder="Tìm kiếm..."
          filters={amendmentMethodFilters}
        />
        {data.length === 0 && (
          <div className="p-8 text-center text-slate-500">
            <p>Không tìm thấy kết quả phù hợp cho bộ lọc hiện tại.</p>
          </div>
        )}
      </div>

      <AmendmentMethodFormDialog
        formData={formData}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        open={formOpen}
        selectedItem={selectedItem}
        setFormData={setFormData}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phương pháp"
        description={`Bạn có chắc chắn muốn xóa phương pháp "${selectedItem?.name}"?`}
      />

      <AmendmentMethodDetailDialog
        onEdit={handleEdit}
        onOpenChange={setDetailOpen}
        open={detailOpen}
        selectedItem={selectedItem}
      />
    </AdminLayout>
  );
};

export default AmendmentMethodPage;
