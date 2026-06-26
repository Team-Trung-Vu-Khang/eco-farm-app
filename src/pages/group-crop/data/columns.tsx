import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Hash, Leaf } from "lucide-react";
import type { CatalogRecordResponse } from "../../../features/foundation";

export const groupCropColumns: Column<CatalogRecordResponse>[] = [
  {
    key: "code",
    label: "Mã nhóm cây",
    render: (value: string) => (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
        <Hash className="w-3 h-3 opacity-60" />
        {value || "—"}
      </div>
    ),
  },
  {
    key: "name",
    label: "Tên nhóm cây",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <Leaf className="w-4 h-4 text-green-600" />
        <span className="font-bold text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "attributes",
    label: "Đặc tính sinh học",
    render: (value: Record<string, unknown>) => (
      <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
        {(value?.biological as string) || "—"}
      </p>
    ),
  },
  {
    key: "description",
    label: "Ghi chú",
    render: (value: string) => (
      <p className="text-sm text-muted-foreground line-clamp-2 max-w-[300px]">
        {value || "—"}
      </p>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value: string) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active"
          ? "Hoạt động"
          : value === "inactive"
            ? "Không hoạt động"
            : "Lưu trữ"}
      </Badge>
    ),
  },
  {
    key: "createdAt",
    label: "Ngày tạo",
    render: (value: string) => (
      <span className="text-sm text-muted-foreground">
        {value ? new Date(value).toLocaleDateString("vi-VN") : "—"}
      </span>
    ),
  },
];

