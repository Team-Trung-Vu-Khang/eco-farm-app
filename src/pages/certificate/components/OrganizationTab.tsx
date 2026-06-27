import {
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { organizationColumns } from "../data/columns";
import type { CertificationOrganization } from "../types/types";

interface OrganizationTabProps {
  organizations: CertificationOrganization[];
  onAdd: () => void;
  onEdit: (item: CertificationOrganization) => void;
  onDelete: (item: CertificationOrganization) => void;
  loading?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: Array<{
    key: string;
    label: string;
    options: Array<{ value: string; label: string }>;
  }>;
  onFilterChange?: (key: string, value: string) => void;
}

export function OrganizationTab({
  organizations,
  onAdd,
  onEdit,
  onDelete,
  loading,
  searchable = true,
  searchPlaceholder = "Tìm kiếm tổ chức...",
  onSearch,
  filters,
  onFilterChange,
}: OrganizationTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-lg font-semibold">Tổ chức chứng nhận</h3>
          <p className="text-sm text-muted-foreground">
            Quản lý các tổ chức có thẩm quyền cấp chứng nhận
          </p>
        </div>
        <Button onClick={onAdd}>
          <Plus className="w-4 h-4 mr-2" />
          Thêm tổ chức
        </Button>
      </div>
      <DataTable
        columns={organizationColumns}
        data={organizations}
        onEdit={onEdit}
        onDelete={onDelete}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        onSearch={onSearch}
        filters={filters}
        onFilterChange={onFilterChange}
        loading={loading}
      />
    </div>
  );
}
