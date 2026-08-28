import {
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { getStandardColumns } from "../data/columns";
import type {
  Certificate,
  CertificationOrganization,
} from "../types/types";

interface StandardTabProps {
  standards: Certificate[];
  organizations: CertificationOrganization[];
  onAdd: () => void;
  onEdit: (item: Certificate) => void;
  onDelete: (item: Certificate) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: any[];
  onFilterChange?: (key: string, value: string) => void;
  pageSize?: number;
  currentIndex?: number;
  totalElements?: number;
  totalPages?: number;
  onPageSize?: (size: number) => void;
  onIndexChange?: (index: number) => void;
}

export function StandardTab({
  standards,
  organizations,
  onAdd,
  onEdit,
  onDelete,
  loading,
  searchable,
  searchPlaceholder,
  onSearch,
  filters,
  onFilterChange,
  pageSize,
  currentIndex,
  totalElements,
  totalPages,
  onPageSize,
  onIndexChange,
}: StandardTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Loại tiêu chuẩn</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các loại tiêu chuẩn chứng nhận (VietGAP, GlobalGAP...)
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tiêu chuẩn
        </Button>
      </div>
      <DataTable
        columns={getStandardColumns(organizations)}
        data={standards}
        onEdit={onEdit}
        onDelete={onDelete}
        searchPlaceholder={searchPlaceholder || "Tìm kiếm tiêu chuẩn..."}
        searchable={searchable}
        onSearch={onSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalElements={totalElements}
        totalPages={totalPages}
        onPageSize={onPageSize}
        onIndexChange={onIndexChange}
        loading={loading}
      />
    </div>
  );
}
