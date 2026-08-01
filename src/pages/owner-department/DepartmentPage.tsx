import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { DepartmentFormDialog } from "./components/DepartmentFormDialog";
import { MasterDepartmentImportDialog } from "./components/MasterDepartmentImportDialog";
import { DEPARTMENT_COLUMNS } from "./data/columns";
import { useDepartment } from "./hooks/useDepartment";

const DEPARTMENT_STATUS_OPTIONS = [
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

const DepartmentPage = () => {
  const {
    departments,
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
    importOpen,
    setImportOpen,
    deleteOpen,
    setDeleteOpen,
    editItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    workspaceId,
    refetchDepartments,
  } = useDepartment();

  return (
    <PageWrapper
      title="Quản lý phòng ban"
      description="Quản lý phòng ban theo đơn vị sở hữu"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm từ hệ thống
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm phòng ban
          </Button>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl bg-red-50 border border-red-200 p-4 text-red-700 text-sm font-medium">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={DEPARTMENT_COLUMNS}
          data={departments}
          searchable
          searchPlaceholder="Tìm kiếm phòng ban..."
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
              options: DEPARTMENT_STATUS_OPTIONS,
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <DepartmentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <MasterDepartmentImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        workspaceId={workspaceId}
        onImportSuccess={refetchDepartments}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phòng ban này?"
      />
    </PageWrapper>
  );
};

export default DepartmentPage;
