import {
  Badge,
  Card,
  CardContent,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar, MapPin, Sprout } from "lucide-react";
import type { Plan } from "../../../stores/usePlanStore";
import { CodeBadge } from "@/components/CodeBadge";
import { getPlanStatusBadge } from "../utils/status";

export const planColumns: Column<Plan>[] = [
  { key: "code", label: "Mã", render: (value) => <CodeBadge value={value} /> },
  { key: "name", label: "Tên kế hoạch" },
  { key: "seasonName", label: "Mùa vụ" },
  {
    key: "crop",
    label: "Cây trồng",
    render: (_, row) => (
      <span>
        {row.crop} {row.variety ? `- ${row.variety}` : ""}
      </span>
    ),
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (_, row) => getPlanStatusBadge(row.status),
  },
  { key: "startDate", label: "Bắt đầu" },
  { key: "endDate", label: "Kết thúc" },
];

export const planFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Đang thực hiện", value: "active" },
      { label: "Bản nháp", value: "draft" },
      { label: "Hoàn thành", value: "completed" },
      { label: "Đã hủy", value: "cancelled" },
    ],
  },
  {
    key: "seasonName",
    label: "Mùa vụ",
    options: [
      { label: "Vụ Xuân 2025", value: "Vụ Xuân 2025" },
      { label: "Vụ Hè 2025", value: "Vụ Hè 2025" },
      { label: "Vụ Thu 2025", value: "Vụ Thu 2025" },
    ],
  },
  {
    key: "crop",
    label: "Cây trồng",
    options: [
      { label: "Sầu riêng", value: "Sầu riêng" },
      { label: "Xoài", value: "Xoài" },
      { label: "Bưởi", value: "Bưởi" },
    ],
  },
];

export function PlanStatisticsCards({
  activeCount,
  draftCount,
  completedCount,
}: {
  activeCount: number;
  draftCount: number;
  completedCount: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-green-100 text-green-600">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">{activeCount}</p>
            <p className="text-sm text-muted-foreground">Đang thực hiện</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">{draftCount}</p>
            <p className="text-sm text-muted-foreground">Bản nháp</p>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold font-display">{completedCount}</p>
            <p className="text-sm text-muted-foreground">Hoàn thành</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
