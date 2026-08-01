import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";

import { useRegionBasicDistributionLivestockPage } from "./hooks/useRegionBasicDistributionLivestockPage";

const RegionBasicDistributionLivestockPage = () => {
  const {
    regions,
    columns,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    confirmDelete,
    isLoading,
    response,
    handleSearch,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
  } = useRegionBasicDistributionLivestockPage();

  return (
    <PageWrapper
      title="Phân bố vùng cơ bản"
      description="Quản lý danh sách vùng chăn nuôi với thông tin cơ bản"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm vùng chăn nuôi
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={regions}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm vùng chăn nuôi..."
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onEdit={(item) => handleEdit(item.id)}
        onDelete={(item) => handleDelete(item.id)}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description="Bạn có chắc chắn muốn xóa vùng chăn nuôi này?"
      />
    </PageWrapper>
  );
};

export default RegionBasicDistributionLivestockPage;
