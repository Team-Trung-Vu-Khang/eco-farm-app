import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { MasterPositionImportDialog } from "./components/MasterPositionImportDialog";
import { OwnerPositionFormDialog } from "./components/OwnerPositionFormDialog";
import { positionColumns } from "./data/columns";
import { useOwnerPositionPage } from "./hooks/useOwnerPositionPage";

const POSITION_FILTER_STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "active", label: "Hoạt động" },
  { value: "inactive", label: "Ngừng hoạt động" },
  { value: "archived", label: "Đã lưu trữ" },
];

const OwnerPositionPage = () => {
  const {
    positions,
    groupOptions,
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
    handleView,
    workspaceId,
    refetchPositions,
  } = useOwnerPositionPage();

  return (
    <PageWrapper
      title="Quản lý chức vụ"
      description="Quản lý chức vụ theo nhóm chức vụ"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setImportOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm từ hệ thống
          </Button>
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm chức vụ
          </Button>
        </div>
      }
    >
      {error ? (
        <div className="mb-4 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : null}

      <DataTable
        columns={positionColumns}
        data={positions}
        searchable
        searchPlaceholder="Tìm kiếm chức vụ..."
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
            options: POSITION_FILTER_STATUS_OPTIONS,
          },
        ]}
        onView={(item) => handleView(item)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <OwnerPositionFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        groupOptions={groupOptions}
        onSubmit={handleSubmit}
      />

      <MasterPositionImportDialog
        open={importOpen}
        onOpenChange={setImportOpen}
        workspaceId={workspaceId}
        onImportSuccess={refetchPositions}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa chức vụ này?"
      />
    </PageWrapper>
  );
};

export default OwnerPositionPage;
