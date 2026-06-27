import { Plus } from "lucide-react";
import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PlanTypeFormDialog } from "./components/PlanTypeFormDialog";
import { PLAN_TYPE_STATUS_OPTIONS } from "./data/constants";
import { planTypeColumns } from "./data/columns";
import { usePlanTypePage } from "./hooks/usePlanTypePage";

const PlanTypePage = () => {
  const {
    planTypes,
    planGroupOptions,
    loading,
    error,
    response,
    handleSearch,
    handleFilterChange,
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
    formData,
    setFormData,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
  } = usePlanTypePage();

  return (
    <AdminLayout
      isDev={true}
      title="Loại Kế Hoạch"
      description="Quản lý các loại hình kế hoạch sản xuất, kinh doanh trong nông trại"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm loại kế hoạch
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={planTypeColumns}
          data={planTypes}
          searchable
          searchPlaceholder="Tìm kiếm loại kế hoạch..."
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
              options: [...PLAN_TYPE_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <PlanTypeFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        isEdit={Boolean(editItem)}
        formData={formData}
        setFormData={setFormData}
        planGroupOptions={planGroupOptions}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa loại kế hoạch"
        description={`Bạn có chắc chắn muốn xóa loại kế hoạch "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </AdminLayout>
  );
};

export default PlanTypePage;
