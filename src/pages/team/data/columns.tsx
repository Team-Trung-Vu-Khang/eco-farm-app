import type { Team, TeamMember } from "@/stores/useTeamStore";
import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export const teamColumns: Column<Team>[] = [
  { key: "code", label: "Mã đội" },
  { key: "name", label: "Tên đội nhóm" },
  {
    key: "leader",
    label: "Trưởng nhóm",
    render(value: any) {
      return <span>{value?.name}</span>;
    },
  },
  {
    key: "department",
    label: "Phòng ban",
    render(value: any) {
      return <span>{value?.name}</span>;
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

export const teamMemberColumns: Column<TeamMember>[] = [
  {
    key: "fullName",
    label: "Thành viên",
    render: (value, item) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
          <img
            src={item.avatar}
            alt={value}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-medium">{value}</span>
          <span className="text-xs text-muted-foreground">{item.email}</span>
        </div>
      </div>
    ),
  },
  { key: "position", label: "Chức vụ" },
  { key: "phone", label: "Điện thoại" },
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
