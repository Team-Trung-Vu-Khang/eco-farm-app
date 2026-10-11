import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Image as ImageIcon } from "lucide-react";
import { Link } from "wouter";

import { categories, cropTypeOptions } from "./mocks";
import type { Crop } from "../types/types";

export const TABLE_FILTERS = [
  {
    key: "cropGroup",
    label: "Nhóm cây",
    options: categories.map((c) => ({ label: c, value: c })),
  },
  {
    key: "cropType",
    label: "Loại cây",
    options: cropTypeOptions,
  },
];

export const COLUMNS: Column<Crop>[] = [
  {
    key: "code",
    label: "Mã cây",
    mobilePriority: "badge",
    render: (value: string, item: Crop) => (
      <Link href={`/crop/${item.id}`}>
        <span className="text-green-600 hover:text-green-700 hover:underline cursor-pointer transition-colors">
          {value}
        </span>
      </Link>
    ),
  },
  {
    key: "illustration",
    label: "Hình ảnh",
    mobilePriority: "hidden",
    render: (value: string | null) => (
      <div className="w-12 h-12 rounded-lg border bg-muted overflow-hidden flex items-center justify-center shrink-0">
        {value ? (
          <img
            src={value}
            alt="Crop"
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
    mobilePriority: "primary",
    render: (value: string) => (
      <div className="flex flex-col">
        <span className="font-bold text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "cropGroup",
    label: "Nhóm cây trồng",
    mobilePriority: "secondary",
    render: (value: string) => (
      <span className="text-sm text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "origin",
    label: "Nguồn gốc",
    mobilePriority: "secondary",
    render: (_: any, item: Crop) => (
      <span className="text-sm text-foreground">
        {item.technicalSpecs?.origin || "---"}
      </span>
    ),
  },
];
