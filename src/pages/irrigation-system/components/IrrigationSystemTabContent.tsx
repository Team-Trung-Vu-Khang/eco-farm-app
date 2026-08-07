import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { IrrigationSystemFormDialog } from "./IrrigationSystemFormDialog";
import { irrigationSystemColumns } from "../data/columns";
import { IRRIGATION_SYSTEM_STATUS_OPTIONS } from "../data/constants";
import { useIrrigationSystemPage } from "../hooks/useIrrigationSystemPage";

interface Props {
  domainCode: "CROP" | "LIVESTOCK" | "AQUACULTURE";
  title: string;
  description: string;
}

export const IrrigationSystemTabContent = ({
  domainCode,
  title,
  description,
}: Props) => {
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
  } = useIrrigationSystemPage(domainCode);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <Button
          onClick={handleAdd}
          data-testid={`add-${domainCode.toLowerCase()}-method`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phương pháp
        </Button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : (
        <DataTable
          columns={irrigationSystemColumns}
          data={data}
          searchable
          searchPlaceholder="Tìm kiếm phương pháp..."
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
              options: [...IRRIGATION_SYSTEM_STATUS_OPTIONS],
            },
          ]}
          onEdit={handleEdit}
          onDelete={handleDelete}
          loading={loading}
        />
      )}

      <IrrigationSystemFormDialog
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
        title="Xóa phương pháp"
        description={`Bạn có chắc chắn muốn xóa phương pháp "${deleteItem?.name}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
};
