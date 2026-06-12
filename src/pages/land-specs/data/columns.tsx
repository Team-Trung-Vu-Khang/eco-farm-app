import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LandSpec } from "../../../stores/useLandSpecStore";
import { Hash } from "lucide-react";

export const landSpecsColumns: Column<LandSpec>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => {
      return (
        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-1 rounded-md border w-fit">
          <Hash className="w-3 h-3 opacity-60" />
          {value}
        </div>
      );
    },
  },
  { key: "name", label: "Tên thông số" },
  { key: "description", label: "Mô tả" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "secondary"}>
        {value === "active" ? "Hoạt động" : "Không hoạt động"}
      </Badge>
    ),
  },
  { key: "createdAt", label: "Ngày tạo" },
];
