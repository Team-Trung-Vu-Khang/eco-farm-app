import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { Unit } from "../types/types";
import type { Material } from "../../material/types/types";

interface GetUnitColumnsOptions {
  units: Unit[];
  materialMap: Record<number, Material>;
  onEditNavigate: (id: number) => void;
}

export function getUnitColumns({
  units,
  materialMap,
  onEditNavigate,
}: GetUnitColumnsOptions): Column<Unit>[] {
  return [
    {
      key: "stt",
      label: "STT",
      render: (_, row) => {
        const index = units.findIndex((u) => u.id === row.id);
        return (
          <span className="text-slate-500 font-medium">
            {index !== -1 ? index + 1 : "-"}
          </span>
        );
      },
    },
    {
      key: "sourceMaterialId",
      label: "Vật tư quy đổi",
      render: (value, row) => {
        const material = materialMap[Number(value) || 0];
        return (
          <span
            className="font-medium text-primary cursor-pointer hover:underline"
            onClick={() => onEditNavigate(row.id)}
          >
            {material?.name || `Vật tư #${value}`}
          </span>
        );
      },
    },
    {
      key: "equals",
      label: "=",
      render: () => <span className="text-slate-400 font-bold">=</span>,
    },
    {
      key: "conversionFactor",
      label: "Số lượng",
      render: (value) => (
        <span className="font-semibold text-slate-800">
          {Number(value).toLocaleString("vi-VN")}
        </span>
      ),
    },
    {
      key: "targetMaterialId",
      label: "Vật tư",
      render: (value) => {
        const material = materialMap[Number(value) || 0];
        return (
          <span className="text-slate-700">
            {material?.name || `Vật tư #${value}`}
          </span>
        );
      },
    },
  ];
}
