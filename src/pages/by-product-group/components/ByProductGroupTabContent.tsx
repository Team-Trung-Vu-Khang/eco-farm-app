import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { byProductGroupColumns } from "../data/columns";
import { useByProductGroupPage } from "../hooks/useByProductGroupPage";
import { ByProductGroupFormDialog } from "./ByProductGroupFormDialog";

interface ByProductGroupTabContentProps {
  classification: "origin" | "physico_chemical" | "toxicity_regulation";
  title: string;
  description: string;
}

export function ByProductGroupTabContent({
  classification,
  title,
  description,
}: ByProductGroupTabContentProps) {
  const {
    data,
    loading,
    submitting,
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
    response,
  } = useByProductGroupPage(classification);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={handleAdd} className="w-fit shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      </div>

      <DataTable
        columns={byProductGroupColumns}
        data={data}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={response?.totalElements ?? data.length}
        totalPages={response?.totalPages ?? 1}
        searchable
        searchPlaceholder="Tìm kiếm nhóm phụ phẩm..."
        onPageSize={(size) => {
          setPageSize(size);
          setCurrentIndex(1);
        }}
        onIndexChange={setCurrentIndex}
        onSearch={handleSearch}
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

      <ByProductGroupFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        editItem={editItem}
        classification={classification}
        onSubmit={handleSubmit}
        loading={submitting}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Xác nhận xóa"
        description={`Bạn có chắc chắn muốn xóa nhóm phụ phẩm "${deleteItem?.name}" không? Hành động này không thể hoàn tác.`}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
