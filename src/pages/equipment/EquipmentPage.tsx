import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { equipmentColumns } from "./data/columns";
import { useEquipmentPage } from "./hooks/useEquipmentPage";

export default function EquipmentPage() {
  const {
    equipments,
    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
    navigateToDetail,

    // Pagination/Filter states
    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    totalElements,
    totalPages,
    search,
    setSearch,
    status,
    setStatus,
    onlyOwner,
    setOnlyOwner,
    loading,
  } = useEquipmentPage();

  return (
    <PageWrapper
      title="Quản lý dụng cụ - máy móc"
      description="Quản lý danh mục dụng cụ, máy móc thiết bị dùng trong trồng trọt"
      actions={
        <div className="flex items-center gap-3">
          {!window.location.pathname.startsWith("/admin") && (
            <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyOwner}
                onChange={(e) => {
                  setOnlyOwner(e.target.checked);
                  setCurrentIndex(1);
                }}
                className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
              />
              Chỉ xem vật tư nội bộ
            </label>
          )}
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm dụng cụ - máy móc
          </Button>
        </div>
      }
    >
      <DataTable
        columns={equipmentColumns(navigateToDetail)}
        data={equipments}
        searchable
        searchPlaceholder="Tìm kiếm thiết bị..."
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={totalElements}
        totalPages={totalPages}
        onSearch={(val) => {
          setSearch(val);
          setCurrentIndex(1);
        }}
        onPageSize={(size) => {
          setPageSize(size);
          setCurrentIndex(1);
        }}
        onIndexChange={setCurrentIndex}
        onFilterChange={(key, val) => {
          if (key === "status") {
            setStatus(val as any);
            setCurrentIndex(1);
          }
        }}
        filters={[
          {
            key: "status",
            label: "Trạng thái",
            options: [
              { label: "Hoạt động", value: "active" },
              { label: "Không hoạt động", value: "inactive" },
              { label: "Đã lưu trữ", value: "archived" },
            ],
          },
        ]}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
