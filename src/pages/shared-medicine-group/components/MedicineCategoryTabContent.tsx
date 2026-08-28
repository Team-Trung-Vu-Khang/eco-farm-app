import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMedicineCategoryPage } from "../hooks/useMedicineCategoryPage";
import { MedicineCategoryFormDialog } from "./MedicineCategoryFormDialog";
import { medicineCategoryColumns } from "../data/columns";
import { MEDICINE_CATEGORY_STATUS_OPTIONS } from "../data/constants";

interface MedicineCategoryTabContentProps {
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  classification: string;
  title: string;
  description: string;
}

export function MedicineCategoryTabContent({
  domainCode,
  classification,
  title,
  description,
}: MedicineCategoryTabContentProps) {
  const {
    data,
    loading,
    submitting,
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
    deleteItem,
    handleAdd,
    handleEdit,
    handleDelete,
    handleSubmit,
    handleConfirmDelete,
    handleSearch,
    handleFilterChange,
  } = useMedicineCategoryPage(domainCode, classification);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button
          onClick={handleAdd}
          data-testid={`add-${domainCode}-${classification}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phân loại
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={medicineCategoryColumns("Mã phân loại", "Tên phân loại")}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm..."
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
              options: [...MEDICINE_CATEGORY_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <MedicineCategoryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description={`Bạn có chắc chắn muốn xóa phân loại "${deleteItem?.name}"?`}
      />
    </div>
  );
}
