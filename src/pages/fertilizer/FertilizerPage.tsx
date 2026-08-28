import PageWrapper from "@/components/PageWrapper";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { fertilizerColumns } from "./data/columns";
import { useFertilizerPage } from "./hooks/useFertilizerPage";
import { DeletionImpactDialog } from "@/components/DeletionImpactDialog";

export default function FertilizerPage() {
  const {
    fertilizers,
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
    setSearch,
    setStatus,
    onlyOwner,
    setOnlyOwner,
    loading,

    // Deletion Impact
    deleteImpactOpen,
    setDeleteImpactOpen,
    deleteImpactItem,
    supplyType,
    scope,
  } = useFertilizerPage();

  return (
    <PageWrapper
      title="Quản lý phân bón"
      description="Quản lý danh mục phân bón sử dụng trong trồng trọt"
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
            Thêm phân bón
          </Button>
        </div>
      }
    >
      <DataTable
        columns={fertilizerColumns(navigateToDetail)}
        data={fertilizers}
        searchable
        searchPlaceholder="Tìm kiếm phân bón..."
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
