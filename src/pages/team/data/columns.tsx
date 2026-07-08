import type {
  FarmPersonnelResponse,
  FarmTeamResponse,
} from "@/features/master-data";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const teamColumns: Column<FarmTeamResponse>[] = [
  { key: "code", label: "Mã đội" },
  { key: "name", label: "Tên đội nhóm" },
  {
    key: "leaderId",
    label: "Trưởng nhóm",
    render: (value, item) => {
      const leaderLabel =
        item.leader?.name ||
        item.leader?.fullName ||
        (typeof value === "object" && value !== null
          ? (value as any).name || (value as any).fullName
          : "") ||
        item.managerId ||
        "-";

      return <span>{leaderLabel}</span>;
    },
  },
  {
    key: "departmentId",
    label: "Phòng ban",
    render: (value, item) => {
      const departmentLabel =
        item.department?.name ||
        (typeof value === "object" && value !== null
          ? (value as any).name
          : "") ||
        item.departmentId ||
        "-";

      return <span>{departmentLabel}</span>;
    },
  },
  { key: "memberCount", label: "Số lượng thành viên" },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Ngừng hoạt động"}
      </Badge>
    ),
  },
];

export const teamMemberColumns: Column<FarmPersonnelResponse>[] = [
  {
    key: "fullName",
    label: "Thành viên",
    render: (value, item) => {
      const initials = String(value || "U")
        .split(" ")
        .map((name) => name[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
            <img
              src={
                item.avatarUrl ||
                item.metadataJson?.avatarUrl ||
                `https://placehold.co/64x64?text=${encodeURIComponent(initials)}`
              }
              alt={String(value)}
              className="w-full h-full object-cover"
              onError={(event) => {
                (event.target as HTMLImageElement).src =
                  `https://placehold.co/64x64?text=${encodeURIComponent(initials)}`;
              }}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{value}</span>
            <span className="text-xs text-muted-foreground">{item.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    key: "positionId",
    label: "Chức vụ",
    render: (value, item) =>
      item.position?.name ||
      item.positionName ||
      item.metadataJson?.positionName ||
      item.positionId ||
      "-",
  },
  {
    key: "phone",
    label: "Điện thoại",
  },
  {
    key: "status",
    label: "Trạng thái",
    render: (value) => (
      <Badge variant={value === "active" ? "default" : "outline"}>
        {value === "active" ? "Hoạt động" : "Nghỉ việc"}
      </Badge>
    ),
  },
];
