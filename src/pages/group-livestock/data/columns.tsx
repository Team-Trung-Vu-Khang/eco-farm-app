import type { Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PiggyBank } from "lucide-react";
import { CodeBadge } from "@/components/CodeBadge";
import type { ProductionSubjectGroupResponse } from "../../../features/foundation";

export const groupLivestockColumns: Column<ProductionSubjectGroupResponse>[] = [
  {
    key: "code",
    label: "Mã nhóm vật nuôi",
    render: (value: string) => <CodeBadge value={value} />,
  },
  {
    key: "name",
    label: "Tên nhóm vật nuôi",
    render: (value: string) => (
      <div className="flex items-center gap-2">
        <PiggyBank className="w-4 h-4 text-green-600" />
        <span className="font-bold text-foreground">{value}</span>
      </div>
    ),
  },
  {
    key: "biological",
    label: "Đặc tính sinh học",
    render: (value: string) => (
      <p className="text-sm text-muted-foreground line-clamp-2 max-w-[200px]">
        {value || "—"}
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
