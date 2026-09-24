import { DeletionImpactDialog } from "@/components/DeletionImpactDialog";
import PageWrapper from "@/components/PageWrapper";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { byProductColumns } from "./data/columns";
import { useByProductPage } from "./hooks/useByProductPage";

export default function ByProductPage() {
  const {
    byProducts,
    handleAdd,
    handleEdit,
    handleView,
    handleDelete,
    handleConfirmDelete,
    navigateToDetail,

    pageSize,
    setPageSize,
    currentIndex,
    setCurrentIndex,
    totalElements,
    totalPages,
    setSearch,
    setStatus,
    onlyOwner,
    setOnlyOwner,
    loading,

    deleteImpactOpen,
    setDeleteImpactOpen,
    deleteImpactItem,
    supplyType,
    scope,
  } = useByProductPage();

  return (
    <PageWrapper
      title="Quản lý phụ phẩm"
      description="Quản lý danh mục phụ phẩm sử dụng trong trồng trọt và sản xuất nông nghiệp"
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
            Thêm phụ phẩm
          </Button>
        </div>
      }
    >
      <DataTable
        columns={byProductColumns(navigateToDetail, scope as "farm" | "admin")}
        data={byProducts}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={totalElements}
        totalPages={totalPages}
        searchable
        searchPlaceholder="Tìm kiếm phụ phẩm..."
        onPageSize={(size) => {
          setPageSize(size);
          setCurrentIndex(1);
        }}
        onIndexChange={setCurrentIndex}
        onSearch={(val) => {
          setSearch(val);
          setCurrentIndex(1);
        }}
        onFilterChange={(key, val) => {
          if (key === "status") {
            setStatus(val);
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

      <DeletionImpactDialog
        scope={scope as "farm" | "admin"}
        supplyType={supplyType}
        open={deleteImpactOpen}
        itemName={deleteImpactItem?.name}
        onOpenChange={setDeleteImpactOpen}
        itemId={deleteImpactItem?.id ?? null}
        onConfirmDelete={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
