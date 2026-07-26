import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";

import { useRegionBasicDistributionAquaculturePage } from "./hooks/useRegionBasicDistributionAquaculturePage";

const RegionBasicDistributionAquaculturePage = () => {
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
  } = useRegionBasicDistributionAquaculturePage();

  return (
    <AdminLayout
      isDev={true}
      title="Phân bố vùng cơ bản"
      description="Quản lý danh sách vùng nuôi trồng thuỷ sản với thông tin cơ bản"
      actions={
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Thêm vùng nuôi trồng
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={regions}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm vùng nuôi trồng..."
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
        description="Bạn có chắc chắn muốn xóa vùng nuôi trồng thuỷ sản này?"
      />
    </AdminLayout>
  );
};

export default RegionBasicDistributionAquaculturePage;
