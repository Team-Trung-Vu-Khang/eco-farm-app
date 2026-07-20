import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useCultivationRegionPage } from "./hooks/useCultivationRegionPage";

const CultivationRegionPage = () => {
  const {
    areas,
    columns,
    isLoading,
    response,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleView,
    handleEdit,
    handleWorkflow,
    handleDelete,
    handleConfirmDelete,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
  } = useCultivationRegionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Vùng canh tác"
      description="Quản lý các thiết lập canh tác cho Vùng, Khu vực hoặc Lô"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thiết lập mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={areas}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm vùng canh tác..."
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onView={(item) => handleView(item.id)}
        onEdit={(item) => handleEdit(item.id)}
        onWorkflow={(item) => handleWorkflow(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng canh tác này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default CultivationRegionPage;
