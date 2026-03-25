import { type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link } from "wouter";
import type { Variety } from "../types/types";

export const seedColumns: Column<Variety>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value: string | File | null) => (
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-muted shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="h-full w-full object-cover"
          />
        ) : (
          <Sprout className="h-8 w-8 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "varietyCode",
    label: "Mã giống",
    render: (value: string, item: Variety) => (
      <Link href={`/seed/${item.id}`}>
        <span className="cursor-pointer text-green-600 transition-colors hover:text-green-700 hover:underline">
          {value}
        </span>
      </Link>
    ),
  },
  {
    key: "varietyName",
    label: "Tên giống",
    render: (value: string) => (
      <span className="text-sm font-bold text-foreground">{value}</span>
    ),
  },
  {
    key: "supplier",
    label: "Nhà cung cấp",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "origin",
    label: "Xuất xứ",
    render: (value: string) => (
      <span className="text-xs font-medium text-muted-foreground">{value}</span>
    ),
  },
  {
    key: "germinationRate",
    label: "Tỷ lệ nảy mầm",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
  {
    key: "uniformity",
    label: "Độ đồng đều",
    render: (value: number) => (
      <span className="font-semibold text-green-700">{value}%</span>
    ),
  },
];
