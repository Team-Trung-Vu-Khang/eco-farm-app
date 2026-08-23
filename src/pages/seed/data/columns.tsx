import type { FarmSeedResponse } from "@/features/farm";
import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import { Link } from "wouter";
import { CodeBadge } from "@/components/CodeBadge";

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
    key: "code",
    label: "Mã hạt giống",
    render: (_, item) => (
      <Link href={`/seed/${item.id}`}>
        <span className="cursor-pointer hover:opacity-80">
          <CodeBadge value={item.code || item.cropVariety?.code} />
        </span>
      </Link>
    ),
  },
  {
    key: "name",
    label: "Tên hạt giống",
    render: (_, item) => (
      <span className="text-sm font-bold text-foreground">
        {item.name || item.cropVariety?.name || ""}
      </span>
    ),
  },
  {
    key: "cropVariety",
    label: "Giống cây trồng",
    render: (_, item) => (
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-700">
          {item.cropVariety?.name || ""}
        </span>
        <span className="font-mono text-[10px] text-slate-400">
          {item.cropVariety?.code || ""}
        </span>
      </div>
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
