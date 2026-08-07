import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export type MedicineCategoryBaseRow = {
  code: string;
  name: string;
  description?: string;
};

export const medicineCategoryColumns = (
  codeLabel: string,
  nameLabel: string,
): Column<MedicineCategoryBaseRow>[] => [
  { key: "code", label: codeLabel },
  { key: "name", label: nameLabel },
  { key: "description", label: "Mô tả" },
];
