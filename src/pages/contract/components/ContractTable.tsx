import {
  Card,
  CardContent,
  Button,
  DataTable,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import type { Contract } from "../types";
import { contractTypes } from "../data/constants";
import { StatusBadge } from "./StatusBadge";

interface ContractTableProps {
  contracts: Contract[];
  onView: (contract: Contract) => void;
  onEdit: (contract: Contract) => void;
  onDelete: (contract: Contract) => void;
  onCreate: () => void;
}

export const ContractTable = ({
  contracts,
  onView,
  onEdit,
  onDelete,
  onCreate,
}: ContractTableProps) => {
  const getTypeName = (typeId: string) => {
    return contractTypes.find((t) => t.id === typeId)?.name || typeId;
  };

  const columns = [
    {
      key: "code",
      label: "Mã hợp đồng",
      accessorKey: "code",
      cell: (row: Contract) => (
        <div className="font-mono font-medium">{row.code}</div>
      ),
    },
    {
      key: "name",
      label: "Tên hợp đồng",
      accessorKey: "name",
      cell: (row: Contract) => (
        <div className="max-w-[300px]">
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {getTypeName(row.type)}
          </div>
        </div>
      ),
    },
    {
      key: "partyA",
      label: "Bên A",
      accessorKey: "partyA",
      cell: (row: Contract) => (
        <div className="text-sm">
          {typeof row.partyA === "string" ? row.partyA : row.partyA?.name}
        </div>
      ),
    },
    {
      key: "partyB",
      label: "Bên B",
      accessorKey: "partyB",
      cell: (row: Contract) => (
        <div className="text-sm">
          {typeof row.partyB === "string" ? row.partyB : row.partyB?.name}
        </div>
      ),
    },
    {
      key: "signDate",
      label: "Ngày ký",
      accessorKey: "signDate",
      cell: (row: Contract) => <div className="text-sm">{row.signDate}</div>,
    },
    {
      key: "status",
      label: "Trạng thái",
      accessorKey: "status",
      cell: (row: Contract) => <StatusBadge status={row.status} />,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold">Danh sách hợp đồng</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý tất cả hợp đồng trong hệ thống
            </p>
          </div>
          <Button onClick={onCreate}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo hợp đồng mới
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={contracts}
          searchPlaceholder="Tìm kiếm hợp đồng..."
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </CardContent>
    </Card>
  );
};
