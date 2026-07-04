import type { FarmSeedResponse } from "@/features/farm";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link } from "wouter";

export const seedColumns: Column<FarmSeedResponse>[] = [
  {
    key: "imageUrl",
    label: "Hình ảnh",
    render: (value: unknown) => (
      <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border bg-muted shadow-sm">
        {value ? (
          <img
            src={typeof value === "string" ? value : ""}
            className="h-full w-full object-cover"
          />
        ) : (
          <Sprout className="h-8 w-8 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "cropVariety",
    label: "Mã giống",
    render: (_, item) => (
      <Link href={`/seed/${item.id}`}>
        <span className="cursor-pointer text-green-600 transition-colors hover:text-green-700 hover:underline">
          {item.cropVariety?.code || ""}
        </span>
      </Link>
    ),
  },
  {
    key: "varietyName",
    label: "Tên giống",
    render: (_, item) => (
      <span className="text-sm font-bold text-foreground">
        {item.cropVariety?.name || ""}
      </span>
    ),
  },
  {
    key: "supplier",
    label: "Nhà cung cấp",
    render: (_, item) => (
      <span className="text-xs font-medium text-muted-foreground">
        {item.supplier?.name || ""}
      </span>
    ),
  },
  {
    key: "origin",
    label: "Xuất xứ",
    render: (value: unknown) => (
      <span className="text-xs font-medium text-muted-foreground">
        {value as string}
      </span>
    ),
  },
  {
    key: "germinationRate",
    label: "Tỷ lệ nảy mầm",
    render: (value: unknown) => (
      <span className="font-semibold text-green-700">{value as number}%</span>
    ),
  },
  {
    key: "purityRate",
    label: "Độ sạch",
    render: (value: unknown) => (
      <span className="font-semibold text-green-700">{value as number}%</span>
    ),
  },
];
