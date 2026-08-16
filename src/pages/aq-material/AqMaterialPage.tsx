import PageWrapper from "@/components/PageWrapper";
import { Button, DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { materialColumns } from "../material/data/columns";
import { useAqMaterialPage } from "./hooks/useAqMaterialPage";
import { DeletionImpactDialog } from "@/components/DeletionImpactDialog";

export default function AqMaterialPage() {
  const {
    materials,
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

    deleteImpactItem,
    deleteImpactOpen,
    setDeleteImpactOpen,
    supplyType,
  } = useAqMaterialPage();

  return (
    <PageWrapper
      title="Quản lý vật tư thủy sản"
      description="Quản lý danh mục vật tư thủy sản hệ thống và nội bộ"
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
            Thêm vật tư thủy sản
          </Button>
        </div>
      }
    >
      <DataTable
        columns={materialColumns(navigateToDetail)}
        data={materials}
        searchable
        searchPlaceholder="Tìm kiếm vật tư thủy sản..."
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
        scope="farm"
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
