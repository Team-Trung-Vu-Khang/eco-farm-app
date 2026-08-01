import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { useAquacultureRegionPage } from "./hooks/useAquacultureRegionPage";

const AquacultureRegionPage = () => {
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
  } = useAquacultureRegionPage();

  return (
    <PageWrapper
      title="Vùng nuôi trồng"
      description="Quản lý các thiết lập nuôi trồng cho Vùng, Khu vực hoặc Lô"
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
        searchPlaceholder="Tìm kiếm vùng nuôi trồng..."
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
        description="Bạn có chắc chắn muốn xóa vùng nuôi trồng này? Hành động này không thể hoàn tác."
      />
    </PageWrapper>
  );
};

export default AquacultureRegionPage;
