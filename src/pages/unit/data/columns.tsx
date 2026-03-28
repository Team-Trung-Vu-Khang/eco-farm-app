import { ArrowRightLeft } from "lucide-react";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { TYPE_LABELS } from "./constants";
import type { Unit } from "../types/types";

interface GetUnitColumnsOptions {
  unitMap: Record<number, Unit>;
  onEditNavigate: (id: number) => void;
}

export function getUnitColumns({
  unitMap,
  onEditNavigate,
}: GetUnitColumnsOptions): Column<Unit>[] {
  return [
    { key: "code", label: "Mã" },
    {
      key: "name",
      label: "Tên đơn vị",
      render: (value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => onEditNavigate(row.id)}
        >
          {value}
        </span>
      ),
    },
    {
      key: "type",
      label: "Loại",
      render: (value) => (
        <Badge variant="outline" className="capitalize">
          {TYPE_LABELS[value as keyof typeof TYPE_LABELS] || value}
        </Badge>
      ),
    },
    {
      key: "conversionFactor",
      label: "Quy đổi (Chuẩn)",
      render: (_, row) => {
        if (row.isBaseUnit) {
          return (
            <Badge className="bg-emerald-600 hover:bg-emerald-700">
              Đơn vị chuẩn
            </Badge>
          );
        }

        if (row.baseUnitId && unitMap[row.baseUnitId]) {
          const baseUnit = unitMap[row.baseUnitId];
          return (
            <div className="flex items-center gap-1 text-sm font-medium text-muted-foreground">
              <ArrowRightLeft className="w-3 h-3" />
              <span>
                1 {row.code} = {row.conversionFactor.toLocaleString("vi-VN")}{" "}
                {baseUnit.code}
              </span>
            </div>
          );
        }

        return <span className="text-muted-foreground">-</span>;
      },
    },
    {
      key: "status",
      label: "Trạng thái",
      render: (value) => (
        <Badge variant={value === "active" ? "default" : "secondary"}>
          {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Badge>
      ),
    },
  ];
}
