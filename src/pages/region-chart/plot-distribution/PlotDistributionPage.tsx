import {
  AdminLayout,
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { usePlotDistributionPage } from "../hooks/usePlotDistributionPage";

const PlotDistributionPage = () => {
  const {
    plots,
    columns,
    deleteOpen,
    setDeleteOpen,
    deletingItem,
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
  } = usePlotDistributionPage();

  return (
    <AdminLayout
      isDev={true}
      title="Phân bố lô"
      description="Quản lý danh sách và bản đồ phân bố các lô trồng"
      actions={
        <Button
          className="bg-green-600 shadow-sm transition-all hover:bg-green-700 hover:shadow-md active:scale-95"
          onClick={handleAdd}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm mới
        </Button>
      }
    >
      <DataTable
        columns={columns}
        data={plots}
        loading={isLoading}
        searchable
        searchPlaceholder="Tìm kiếm mã lô, tên lô..."
        onSearch={handleSearch}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements}
        totalPages={response?.totalPages}
        onPageSize={setPageSize}
        onIndexChange={setCurrentIndex}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
        description={
          deletingItem
            ? `Bạn có chắc chắn muốn xóa lô ${deletingItem.code} không?`
            : "Bạn có chắc chắn muốn xóa lô này?"
        }
      />
    </AdminLayout>
  );
};
export default PlotDistributionPage;
