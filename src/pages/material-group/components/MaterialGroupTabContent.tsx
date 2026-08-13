import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useMaterialGroupPage } from "../hooks/useMaterialGroupPage";
import { MaterialGroupFormDialog } from "./MaterialGroupFormDialog";
import { materialGroupColumns } from "../data/columns";

interface MaterialGroupTabContentProps {
  classification: string;
  title: string;
  description: string;
}

export function MaterialGroupTabContent({
  classification,
  title,
  description,
}: MaterialGroupTabContentProps) {
  const {
    data,
    loading,
    submitting,
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
  } = useMaterialGroupPage(classification);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={handleAdd} data-testid={`add-material-${classification}`}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      </div>

      <DataTable
        columns={materialGroupColumns}
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
            options: [
              { label: "Tất cả", value: "all" },
              { label: "Hoạt động", value: "active" },
              { label: "Ngừng hoạt động", value: "inactive" },
              { label: "Đã lưu trữ", value: "archived" },
            ],
          },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <MaterialGroupFormDialog
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
        description={`Bạn có chắc chắn muốn xóa nhóm vật tư "${deleteItem?.name}"?`}
      />
    </div>
  );
}
