import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";

import { categories, cropFoundationTypeOptions } from "./mocks";
import type { CropFoundation } from "../types/types";

export const TABLE_FILTERS = [
  {
    key: "cropFoundationGroup",
    label: "Nhóm cây",
    options: categories.map((c) => ({ label: c, value: c })),
  },
  {
    key: "cropFoundationType",
    label: "Loại cây",
    options: cropFoundationTypeOptions,
  },
];

export const COLUMNS: Column<CropFoundation>[] = [
  {
    key: "code",
    label: "Mã cây",
    render: (value: string, item: CropFoundation) => (
      <Link href={`/crop-foundation/${item.id}`}>
        <span className="text-green-600 hover:text-green-700 hover:underline cursor-pointer transition-colors">
          {value}
        </span>
      </Link>
    ),
  },
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | null) => (
      <div className="w-12 h-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center shrink-0">
        {value ? (
          <img
            src={value}
            alt="CropFoundation"
            className="w-full h-full object-cover transition-transform hover:scale-110"
          />
        ) : (
          <ImageIcon className="w-5 h-5 text-muted-foreground/40" />
        )}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên cây",
    render: (value: string) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "cropFoundationGroup",
    label: "Nhóm cây trồng",
    render: (value: string) => (
      <span className="text-sm text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "origin",
    label: "Nguồn gốc",
    render: (_: any, item: CropFoundation) => (
      <span className="text-sm text-foreground">
        {item.technicalSpecs?.origin || "---"}
      </span>
    ),
  },
];
