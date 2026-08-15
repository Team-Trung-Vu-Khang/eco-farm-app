import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { materialColumns } from "./data/columns";
import { useMaterialPage } from "./hooks/useMaterialPage";

export default function MaterialPage() {
  const {
    materials,
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
  } = useMaterialPage();

  return (
    <PageWrapper
      title="Quản lý vật liệu"
      description="Quản lý danh mục vật tư, thiết bị, dụng cụ"
      actions={
        <div className="flex items-center gap-3">
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
          <Button onClick={handleAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm vật liệu
          </Button>
        </div>
      }
    >
      <DataTable
        columns={materialColumns(navigateToDetail)}
        data={materials}
        searchable
        searchPlaceholder="Tìm kiếm vật tư..."
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
