import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  DataTable,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getConversionRuleColumns } from "./data/columns";
import { useUnitPage } from "./hooks/useUnitPage";
import type { ConversionRuleSupplyType } from "./types/types";
import type { DomainCode } from "@/features/farm-supply";

const SUPPLY_TYPE_FILTER_OPTIONS = [
  { label: "Thuốc BVTV", value: "medicine" },
  { label: "Phân bón", value: "fertilizer" },
  { label: "Vật tư", value: "material" },
];

const DOMAIN_CODE_FILTER_OPTIONS = [
  { label: "Trồng trọt", value: "CROP" },
  { label: "Chăn nuôi", value: "LIVESTOCK" },
  { label: "Thủy sản", value: "AQUACULTURE" },
];

export default function UnitPage() {
  const {
    rules,
    loading,
    totalElements,
    totalPages,

    search,
    setSearch,
    currentIndex,
    setCurrentIndex,
    pageSize,
    setPageSize,
    onlyOwner,
    setOnlyOwner,
    supplyType,
    setSupplyType,
    domainCode,
    setDomainCode,

    deleteOpen,
    setDeleteOpen,
    handleAdd,
    handleEdit,
    handleDelete,
    handleConfirmDelete,
    handleView,
    navigateToDetail,
  } = useUnitPage();

  const columns = getConversionRuleColumns(navigateToDetail);

  return (
    <PageWrapper
      title="Quản lý quy tắc quy đổi vật tư"
      description="Quản lý danh sách quy tắc quy đổi giữa các vật tư (1 vật tư A = N vật tư B)"
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
            Chỉ xem quy tắc nội bộ
          </label>
          <Button onClick={handleAdd} data-testid="add-conversion-rule">
            <Plus className="w-4 h-4 mr-2" />
            Thêm quy tắc
          </Button>
        </div>
      }
    >
      <DataTable
        columns={columns}
        data={rules}
        searchable
        searchPlaceholder="Tìm kiếm theo mã/SKU/tên vật tư..."
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
          if (key === "supplyType") {
            setSupplyType(
              val === "all" ? undefined : (val as ConversionRuleSupplyType),
            );
            setCurrentIndex(1);
          }
          if (key === "domainCode") {
            setDomainCode(val === "all" ? undefined : (val as DomainCode));
            setCurrentIndex(1);
          }
        }}
        filters={[
          {
            key: "supplyType",
            label: "Loại vật tư",
            options: SUPPLY_TYPE_FILTER_OPTIONS,
          },
          {
            key: "domainCode",
            label: "Lĩnh vực",
            options: DOMAIN_CODE_FILTER_OPTIONS,
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
