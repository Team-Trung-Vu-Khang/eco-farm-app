import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PesticideCategoryItem } from "../types";
import type { PesticideToxicityClassRecord } from "@/features/master-data/types/master-data.type";

type PesticideBaseRow = {
  code: string;
  name: string;
  description?: string;
};

export const pesticideCategoryColumns = (
  codeLabel: string,
  nameLabel: string,
): Column<PesticideBaseRow>[] => [
  { key: "code", label: codeLabel },
  { key: "name", label: nameLabel },
  { key: "description", label: "Mô tả" },
];

export const pesticideToxicityColumns: Column<PesticideToxicityClassRecord>[] = [
  {
    key: "whoGroup",
    label: "Nhóm WHO",
    render: (value, row) => (
      <div className="flex items-center gap-2">
        <span
          className="h-3 w-3 rounded-full shadow-sm ring-1 ring-black/10"
          style={{ backgroundColor: row.bandColor ?? "#3B82F6" }}
        />
        <Badge variant="outline" className="bg-background">
          {String(value ?? "")}
        </Badge>
      </div>
    ),
  },
  { key: "name", label: "Tên phân loại" },
  { key: "ld50Threshold", label: "Ngưỡng LD50" },
];
