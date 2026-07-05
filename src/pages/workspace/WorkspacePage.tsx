import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { WorkspaceFormDialog } from "./components/WorkspaceFormDialog";
import { workspaceColumns } from "./data/columns";
import { useWorkspacePage } from "./hooks/useWorkspacePage";

export default function WorkspacePage() {
  const {
    workspaceItems,
    workspaceLoading,
    workspaceError,
    filters,
    pageSize,
    currentIndex,
    setPageSize,
    setCurrentIndex,
    handleFilterChange,
    setSearch,
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
    savingWorkspace,
    totalPages,
    totalElements,
  } = useWorkspacePage();

  return (
    <AdminLayout
      title="Danh sách workspace"
      description="Quản lý danh sách workspace"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm workspace
        </Button>
      }
    >
      {workspaceError ? (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {workspaceError}
        </div>
      ) : null}

      <DataTable
        columns={workspaceColumns}
        data={workspaceItems}
        searchable
        searchPlaceholder="Tìm workspace theo mã, tên, brand..."
        loading={workspaceLoading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={setSearch}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        filters={filters}
        onFilterChange={handleFilterChange}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <WorkspaceFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        loading={savingWorkspace}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa workspace này không?"
      />
    </AdminLayout>
  );
}
