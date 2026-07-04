import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { irrigationSystemColumns } from "./data/columns";
import { IrrigationSystemFormDialog } from "./components/IrrigationSystemFormDialog";
import { IRRIGATION_SYSTEM_STATUS_OPTIONS } from "./data/constants";
import { useIrrigationSystemPage } from "./hooks/useIrrigationSystemPage";

export default function IrrigationSystemPage() {
  const {
    data,
    loading,
    error,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    formOpen,
    setFormOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    deleteItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  } = useIrrigationSystemPage();

  return (
    <AdminLayout
      isDev={true}
      title="Hệ thống tưới"
      description="Quản lý danh sách hệ thống tưới"
      actions={
        <Button onClick={handleAdd} data-testid="add-irrigation-system">
          <Plus className="w-4 h-4 mr-2" />
          Thêm hệ thống
        </Button>
      }
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={irrigationSystemColumns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm hệ thống tưới..."
          pageSize={pageSize}
          currentIndex={currentIndex}
          totalElements={response?.totalElements}
          totalPages={response?.totalPages}
          onSearch={handleSearch}
          onPageSize={setPageSize}
          onIndexChange={setCurrentIndex}
          onFilterChange={handleFilterChange}
          filters={[
            {
              key: "status",
              label: "Trạng thái",
              options: [...IRRIGATION_SYSTEM_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <IrrigationSystemFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa hệ thống tưới"
        description={`Bạn có chắc chắn muốn xóa hệ thống tưới "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
}
