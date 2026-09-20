import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { usePlantIdentificationListPage } from "./hooks/usePlantIdentificationListPage";

const PlantIdentificationListPage = () => {
  const {
    plants,
    columns,
    isLoading,
    response,
    deleteOpen,
    setDeleteOpen,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    filters,
    handleFilterChange,
    handleSearch,
    handleView,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
  } = usePlantIdentificationListPage();

  return (
    <PageWrapper
      title="Định danh cây trồng"
      description="Danh sách thông tin định danh và thông số sinh trưởng của cây trồng"
      actions={
        <Link href="/plant-identification/create">
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" /> Thêm mới cây
          </Button>
        </Link>
      }
    >
      {/* Cùng nguồn totalElements với footer phân trang của DataTable */}
      {!isLoading && (
        <p className="mb-3 text-sm text-slate-500">
          Đã tìm thấy{" "}
          <span className="font-bold text-primary">
            {response?.totalElements ?? 0}
          </span>{" "}
          cây trồng
        </p>
      )}

      <DataTable
        data={plants}
        columns={columns}
        loading={isLoading}
        selectable={false}
        searchable={true}
        searchPlaceholder="Tìm kiếm mã định danh..."
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
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh của cây này? Hành động này không thể hoàn tác."
      />
    </PageWrapper>
  );
};

export default PlantIdentificationListPage;
