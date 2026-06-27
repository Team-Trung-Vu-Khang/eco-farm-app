import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { pesticideCategoryColumns } from "./data/columns";
import { PESTICIDE_GROUP_STATUS_OPTIONS } from "./data/constants";
import { PesticideOriginFormDialog } from "./components/PesticideOriginFormDialog";
import { usePesticideOriginPage } from "./hooks/usePesticideOriginPage";

const PesticideOriginPage = () => {
  const {
    data,
    loading,
    error,
    response,
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
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
    handleSearch,
    handleFilterChange,
  } = usePesticideOriginPage();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Phân loại theo nguồn gốc</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý nguồn gốc và thành phần của thuốc BVTV
          </p>
        </div>
        <Button onClick={handleAdd} data-testid="add-pesticide-origin">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nguồn gốc
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={pesticideCategoryColumns("Mã nguồn gốc", "Tên nguồn gốc")}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm theo nguồn gốc..."
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
              options: [...PESTICIDE_GROUP_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <PesticideOriginFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa phân loại nguồn gốc này?"
      />
    </div>
  );
};

export default PesticideOriginPage;
