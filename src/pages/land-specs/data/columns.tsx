import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { LandSpec } from "../../../stores/useLandSpecStore";
import { CodeBadge } from "@/components/CodeBadge";

export const landSpecsColumns: Column<LandSpec>[] = [
  {
    key: "code",
    label: "Mã",
    render: (value) => <CodeBadge value={value} />,
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
