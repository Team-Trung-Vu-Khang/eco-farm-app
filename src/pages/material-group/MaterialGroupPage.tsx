import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { MaterialGroupFormDialog } from "./components/MaterialGroupFormDialog";
import { materialGroupColumns } from "./data/columns";
import { useMaterialGroupPage } from "./hooks/useMaterialGroupPage";

const MATERIAL_GROUP_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
] as const;

const MaterialGroupPage = () => {
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
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  } = useMaterialGroupPage();

  return (
    <PageWrapper
      title="Danh mục vật tư"
      description="Quản lý danh sách các nhóm vật tư (Master Data)"
      actions={
        <Button onClick={handleAdd} data-testid="add-material-group">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      }
    >
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={materialGroupColumns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm nhóm vật tư..."
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
              options: [...MATERIAL_GROUP_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <MaterialGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa nhóm vật tư này?"
      />
    </PageWrapper>
  );
};

export default MaterialGroupPage;
