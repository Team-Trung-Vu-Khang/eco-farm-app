import PageWrapper from "@/components/PageWrapper";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { pesticideColumns } from "../pesticide/data/columns";
import { useAqPesticidePage } from "./hooks/useAqPesticidePage";
import { DeletionImpactDialog } from "@/components/DeletionImpactDialog";

export default function AqPesticidePage() {
  const {
    pesticides,
    handleAdd,
    handleEdit,
    handleDelete,
    handleViewDetail,
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

    supplyType,
    deleteImpactItem,
    deleteImpactOpen,
    setDeleteImpactOpen,
    scope,
  } = useAqPesticidePage();

  return (
    <PageWrapper
      title="Quản lý thuốc thủy sản"
      description="Quản lý danh mục thuốc thủy sản hệ thống và nội bộ"
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
            Thêm thuốc thủy sản
          </Button>
        </div>
      }
    >
      <DataTable
        columns={pesticideColumns(navigateToDetail)}
        data={pesticides}
        searchable
        searchPlaceholder="Tìm kiếm thuốc thủy sản..."
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
        onView={handleViewDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      <DeletionImpactDialog
        supplyType={supplyType}
        open={deleteImpactOpen}
        scope={scope as "farm" | "admin"}
        itemName={deleteImpactItem?.name}
        onOpenChange={setDeleteImpactOpen}
        itemId={deleteImpactItem?.id ?? null}
        onConfirmDelete={handleConfirmDelete}
      />
    </PageWrapper>
  );
}
