import {
  Button,
  DataTable,
  Badge,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import type {
  Certificate,
  CertificationOrganization,
} from "../hooks/useCertificate";

interface StandardTabProps {
  standards: Certificate[];
  organizations: CertificationOrganization[];
  onAdd: () => void;
  onEdit: (item: Certificate) => void;
  onDelete: (item: Certificate) => void;
}

export function StandardTab({
  standards,
  organizations,
  onAdd,
  onEdit,
  onDelete,
}: StandardTabProps) {
  const standardColumns: Column<Certificate>[] = [
    { key: "code", label: "Mã số" },
    { key: "name", label: "Tên tiêu chuẩn" },
    {
      key: "stampUrl",
      label: "Dấu mộc",
      render: (value) =>
        value ? (
          <img
            src={value as string}
            alt="Stamp"
            className="w-8 h-8 object-contain"
          />
        ) : (
          <span>-</span>
        ),
    },
    {
      key: "organizationIds",
      label: "Tổ chức cấp",
      render: (value) => {
        const orgIds = value as number[];
        const orgNames = organizations
          .filter((org) => orgIds.includes(org.id))
          .map((org) => org.name);

        if (orgNames.length === 0) return <span>-</span>;
        if (orgNames.length === 1) return <span>{orgNames[0]}</span>;

        return (
          <div className="flex flex-wrap gap-1">
            <Badge variant="secondary">{orgNames[0]}</Badge>
            {orgNames.length > 1 && (
              <Badge variant="outline">+{orgNames.length - 1}</Badge>
            )}
          </div>
        );
      },
    },
  ];

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
        columns={standardColumns}
        data={standards}
        onEdit={onEdit}
        onDelete={onDelete}
        searchPlaceholder="Tìm kiếm tiêu chuẩn..."
      />
    </div>
  );
}
