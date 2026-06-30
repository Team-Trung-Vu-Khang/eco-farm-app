import { Link } from "wouter";
import { Plus } from "lucide-react";
import {
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { groupColumns } from "../../data/columns";
import type { ContactGroup } from "../../types/types";

interface GroupTabProps {
  groups: ContactGroup[];
  loading?: boolean;
  pageSize: number;
  currentIndex: number;
  totalPages?: number;
  totalElements?: number;
  filters: Array<{
    key: string;
    label: string;
    options: Array<{ label: string; value: string }>;
  }>;
  onAdd: () => void;
  onEdit: (item: ContactGroup) => void;
  onDelete: (item: ContactGroup) => void;
  onSearch: (value: string) => void;
  onIndexChange: (value: number) => void;
  onPageSize: (value: number) => void;
  onFilterChange: (key: string, value: string) => void;
}

export function GroupTab({
  groups,
  loading,
  pageSize,
  currentIndex,
  totalPages,
  totalElements,
  filters,
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  onIndexChange,
  onPageSize,
  onFilterChange,
}: GroupTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Nhóm danh bạ</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các nhóm để phân loại danh bạ
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/contact/create">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Tạo liên hệ
            </Button>
          </Link>
          <Button onClick={onAdd}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm nhóm
          </Button>
        </div>
      </div>
      <DataTable
        columns={groupColumns}
        data={groups}
        searchable
        onEdit={onEdit}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm nhóm danh bạ..."
        filters={filters}
        loading={loading}
        pageSize={pageSize}
        currentIndex={currentIndex}
        totalPages={totalPages}
        totalElements={totalElements}
        onSearch={onSearch}
        onIndexChange={onIndexChange}
        onPageSize={onPageSize}
        onFilterChange={onFilterChange}
      />
    </div>
  );
}
