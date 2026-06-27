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
}

export function StandardTab({
  standards,
  organizations,
  onAdd,
  onEdit,
  onDelete,
  loading,
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
        searchPlaceholder="Tìm kiếm tiêu chuẩn..."
        loading={loading}
      />
    </div>
  );
}
