import { DataTable, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { IrrigationSystemFormDialog } from "./IrrigationSystemFormDialog";
import { irrigationSystemColumns } from "../data/columns";
import { IRRIGATION_SYSTEM_STATUS_OPTIONS } from "../data/constants";
import type { useIrrigationSystemPage } from "../hooks/useIrrigationSystemPage";

interface Props {
  /** State từ useIrrigationSystemPage, được khởi tạo ở IrrigationSystemPage
   *  để nút "Thêm phương pháp" có thể đặt trong actions của PageWrapper. */
  page: ReturnType<typeof useIrrigationSystemPage>;
}

export const IrrigationSystemTabContent = ({ page }: Props) => {
  const {
    data,
    loading,
    submitting,
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
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  } = page;

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={irrigationSystemColumns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm phương pháp..."
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
        loading={submitting}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phương pháp"
        description={`Bạn có chắc chắn muốn xóa phương pháp "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};
