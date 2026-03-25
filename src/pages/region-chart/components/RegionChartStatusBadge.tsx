import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface RegionChartStatusBadgeProps {
  status: "active" | "inactive";
  activeLabel?: string;
  inactiveLabel?: string;
  subtle?: boolean;
}

export function RegionChartStatusBadge({
  status,
  activeLabel = "Hoạt động",
  inactiveLabel = "Ngưng",
  subtle = false,
}: RegionChartStatusBadgeProps) {
  if (subtle) {
    return (
      <Badge
        className={
          status === "active"
            ? "bg-green-100 text-green-700 hover:bg-green-100"
            : "bg-gray-100 text-gray-700 hover:bg-gray-100"
        }
      >
        {status === "active" ? activeLabel : inactiveLabel}
      </Badge>
    );
  }

  return (
    <Badge variant={status === "active" ? "default" : "secondary"}>
      {status === "active" ? activeLabel : inactiveLabel}
    </Badge>
  );
}
