import { DataTable } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { CooperativeRow } from "../hooks/useCooperative";

interface CooperativeTableProps {
  columns: Column<CooperativeRow>[];
  data: CooperativeRow[];
  filters: {
    key: string;
    label: string;
    options: { label: string; value: string }[];
  }[];
  loading?: boolean;
  searchPlaceholder: string;
  pageSize: number;
  currentIndex: number;
  totalPages?: number;
  totalElements?: number;
  onSearch: (value: string) => void;
  onFilterChange: (key: string, value: string) => void;
  onPageSize: (value: number) => void;
  onIndexChange: (value: number) => void;
  onView: (item: CooperativeRow) => void;
  onEdit: (item: CooperativeRow) => void;
  onDelete: (item: CooperativeRow) => void;
}

export function CooperativeTable({
  columns,
  data,
  filters,
  loading,
  searchPlaceholder,
  pageSize,
  currentIndex,
  totalPages,
  totalElements,
  onSearch,
  onFilterChange,
  onPageSize,
  onIndexChange,
  onView,
  onEdit,
  onDelete,
}: CooperativeTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      searchable
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
      searchPlaceholder={searchPlaceholder}
      filters={filters}
      selectable={false}
      loading={loading}
      pageSize={pageSize}
      currentIndex={currentIndex}
      totalPages={totalPages}
      totalElements={totalElements}
      onSearch={onSearch}
      onFilterChange={onFilterChange}
      onPageSize={onPageSize}
      onIndexChange={onIndexChange}
    />
  );
}
