import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useAnimalHusbandryRegionPage } from "./hooks/useAnimalHusbandryRegionPage";

const AnimalHusbandryRegionPage = () => {
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
  } = useAnimalHusbandryRegionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Vùng chăn nuôi"
      description="Quản lý các thiết lập chăn nuôi cho Vùng, Khu vực hoặc Lô"
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
        searchPlaceholder="Tìm kiếm vùng chăn nuôi..."
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
        description="Bạn có chắc chắn muốn xóa vùng chăn nuôi này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default AnimalHusbandryRegionPage;
