import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PesticideCategoryItem, PesticideToxicityItem } from "../types";

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

export const pesticideToxicityColumns: Column<PesticideToxicityItem>[] = [
  { key: "whoClass", label: "Nhóm WHO" },
  { key: "name", label: "Tên phân loại" },
  { key: "ld50Range", label: "Ngưỡng LD50" },
];
