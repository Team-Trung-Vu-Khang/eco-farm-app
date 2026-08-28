import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useIoTDeviceGroupPage } from "../hooks/useIoTDeviceGroupPage";
import { IoTDeviceGroupFormDialog } from "./IoTDeviceGroupFormDialog";
import { iotDeviceGroupColumns } from "../data/columns";

interface IoTDeviceGroupTabContentProps {
  classification: string;
  title: string;
  description: string;
}

export function IoTDeviceGroupTabContent({
  classification,
  title,
  description,
}: IoTDeviceGroupTabContentProps) {
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
  } = useIoTDeviceGroupPage(classification);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <Button onClick={handleAdd} data-testid={`add-iot-${classification}`}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm nhóm
        </Button>
      </div>

      <DataTable
        columns={iotDeviceGroupColumns}
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

      <IoTDeviceGroupFormDialog
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
        description={`Bạn có chắc chắn muốn xóa nhóm IoT "${deleteItem?.name}"?`}
      />
    </div>
  );
}
