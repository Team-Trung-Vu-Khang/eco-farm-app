import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Link } from "wouter";
import { Calendar, Hash, Leaf, Sprout } from "lucide-react";
import { dateFormat } from "@/utils/commons";
import type { Docs } from "../types";

export const DOCS_COLUMNS: Column<Docs>[] = [
  {
    key: "illustration",
    label: "Hình ảnh",
    render: (value) => (
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden border shadow-sm">
        {value ? (
          <img
            src={value instanceof File ? URL.createObjectURL(value) : value}
            className="w-full h-full object-cover"
          />
        ) : (
          <Sprout className="w-6 h-6 text-muted-foreground/30" />
        )}
      </div>
    ),
  },
  {
    key: "id",
    label: "Mã mẫu",
    render: (value) => (
      <Link href={`/docs/${value}`}>
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
          <Hash className="w-3 h-3 opacity-60" />
          {value}
        </div>
      </Link>
    ),
  },
  {
    key: "crop",
    label: "Cây trồng",
    render: (_, rowValue) => (
      <Link href={`/docs/${rowValue.id}`}>
        <div className="flex flex-col cursor-pointer group">
          <div className="flex items-center gap-1.5">
            <Leaf className="w-3.5 h-3.5 text-green-600 group-hover:text-primary transition-colors" />
            <span className="font-semibold text-foreground group-hover:text-primary transition-colors tracking-tight">
              {rowValue.crop}
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground ml-5 group-hover:text-primary/70 transition-colors">
            {rowValue.variety}
          </span>
        </div>
      </Link>
    ),
  },
  {
    key: "season",
    label: "Mùa vụ",
    render: (value) => (
      <div className="flex flex-wrap gap-1.5 max-w-[200px]">
        {value?.map((item: string) => (
          <Badge
            key={item}
            variant="secondary"
            className="text-xs px-2.5 py-0.5 font-semibold bg-blue-50 text-blue-700 border-blue-100 shadow-sm"
          >
            {item}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    key: "applyLevel",
    label: "Áp dụng",
    render: (value) => (
      <div className="flex items-center gap-2">
        <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden md:block">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${value ?? 0}%` }}
          />
        </div>
        <span className="text-[11px] font-bold text-muted-foreground">
          {value ?? 0}%
        </span>
      </div>
    ),
  },
  {
    key: "updatedAt",
    label: "Cập nhật",
    render: (value) => (
      <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-medium">
        <Calendar className="w-3 h-3 opacity-60" />
        {dateFormat(value)}
      </div>
    ),
  },
];
