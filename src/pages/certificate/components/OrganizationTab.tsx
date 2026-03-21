import {
  Button,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import type { CertificationOrganization } from "../hooks/useCertificate";

interface OrganizationTabProps {
  organizations: CertificationOrganization[];
  onAdd: () => void;
  onEdit: (item: CertificationOrganization) => void;
  onDelete: (item: CertificationOrganization) => void;
}

export function OrganizationTab({
  organizations,
  onAdd,
  onEdit,
  onDelete,
}: OrganizationTabProps) {
  const orgColumns: Column<CertificationOrganization>[] = [
    { key: "code", label: "Mã tổ chức" },
    { key: "name", label: "Tên tổ chức" },
    { key: "phone", label: "Điện thoại" },
    { key: "email", label: "Email" },
    { key: "website", label: "Website" },
  ];

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
        columns={orgColumns}
        data={organizations}
        onEdit={onEdit}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm tổ chức..."
      />
    </div>
  );
}
