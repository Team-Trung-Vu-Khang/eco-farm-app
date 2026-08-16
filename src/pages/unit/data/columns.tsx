import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { SupplyConversionRuleResponse } from "../types/types";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";

const SUPPLY_TYPE_LABELS: Record<string, string> = {
  medicine: "Thuốc BVTV",
  fertilizer: "Phân bón",
  material: "Vật tư",
  MEDICINE: "Thuốc BVTV",
  FERTILIZER: "Phân bón",
  MATERIAL: "Vật tư",
};

export function getConversionRuleColumns(
  onEditNavigate: (id: number) => void,
): Column<SupplyConversionRuleResponse>[] {
  return [
    {
      key: "fromSupplyItem" as any,
      label: "Vật tư quy đổi",
      render: (_value, row) => (
        <span
          className="font-medium text-primary cursor-pointer hover:underline"
          onClick={() => onEditNavigate(row.id)}
        >
          {row.fromSupplyItem.name}
          <span className="text-xs text-slate-400 ml-1">
            ({row.fromSupplyItem.code})
          </span>
        </span>
      ),
    },
    {
      key: "equals" as any,
      label: "=",
      render: () => <span className="text-slate-400 font-bold">=</span>,
    },
    {
      key: "quantity",
      label: "Số lượng",
      render: (value) => (
        <span className="font-semibold text-slate-800">
          {Number(value).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      key: "toSupplyItem" as any,
      label: "Vật tư",
      render: (_value, row) => (
        <span className="text-slate-700">
          {row.toSupplyItem.name}
          <span className="text-xs text-slate-400 ml-1">
            ({row.toSupplyItem.code})
          </span>
        </span>
      ),
    },
    {
      key: "supplyType",
      label: "Loại",
      render: (value) => (
        <span className="text-xs text-slate-500">
          {SUPPLY_TYPE_LABELS[String(value)] ?? String(value)}
        </span>
      ),
    },
    {
      key: "source",
      label: "Nguồn",
      render: (value) => (
        <Badge
          variant={value === "MASTER" ? "secondary" : "default"}
          className="text-xs"
        >
          {value === "MASTER" ? "Hệ thống" : "Nội bộ"}
        </Badge>
      ),
    },
  ];
}
