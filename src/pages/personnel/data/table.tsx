import { Badge, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { FarmPersonnelResponse } from "@/features/master-data";

export const personnelColumns: Column<FarmPersonnelResponse>[] = [
  {
    key: "fullName",
    label: "Họ và tên",
    render: (value, item) => {
      const initials = value
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

      return (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 min-w-[2rem] rounded-full overflow-hidden bg-gray-200">
            <img
              alt={value}
              src={
                item.avatarUrl ||
                item.metadataJson?.avatarUrl ||
                `https://placehold.co/400?text=${encodeURIComponent(initials)}`
              }
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/400?text=${encodeURIComponent(initials)}`;
              }}
            />
          </div>
          <span>{value}</span>
        </div>
      );
    },
  },
  { key: "phone", label: "Điện thoại" },
  {
    key: "positionName",
    label: "Chức vụ",
    render: (value, item) => value || item.position?.name || "-",
  },
  {
    key: "departmentName",
    label: "Phòng ban",
    render: (value, item) => value || item.department?.name || "-",
  },
  {
    key: "teamName",
    label: "Đội nhóm",
    render: (value, item) => value || item.team?.name || "-",
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

export const personnelFilters = [
  {
    key: "status",
    label: "Trạng thái",
    options: [
      { label: "Hoạt động", value: "active" },
      { label: "Nghỉ việc", value: "inactive" },
    ],
  },
  {
    key: "department",
    label: "Phòng ban",
    options: [
      { label: "Phòng Kỹ Thuật", value: "Phòng Kỹ Thuật" },
      { label: "Phòng Sản Xuất", value: "Phòng Sản Xuất" },
      { label: "Phòng Nghiên Cứu", value: "Phòng Nghiên Cứu" },
      { label: "Kinh doanh", value: "Kinh doanh" },
      { label: "Kế toán", value: "Kế toán" },
    ],
  },
  {
    key: "position",
    label: "Chức vụ",
    options: [
      { label: "Kỹ sư nông nghiệp", value: "Kỹ sư nông nghiệp" },
      { label: "Kỹ sư trồng trọt", value: "Kỹ sư trồng trọt" },
      { label: "Kỹ thuật viên canh tác", value: "Kỹ thuật viên canh tác" },
      { label: "Kỹ sư bảo vệ thực vật", value: "Kỹ sư bảo vệ thực vật" },
      {
        label: "Chuyên viên dinh dưỡng cây trồng",
        value: "Chuyên viên dinh dưỡng cây trồng",
      },
      { label: "Kỹ sư thổ nhưỡng", value: "Kỹ sư thổ nhưỡng" },
      { label: "Kỹ thuật viên phân bón", value: "Kỹ thuật viên phân bón" },
      {
        label: "Kỹ thuật viên cơ điện nông nghiệp",
        value: "Kỹ thuật viên cơ điện nông nghiệp",
      },
      { label: "Thợ máy nông nghiệp", value: "Thợ máy nông nghiệp" },
      { label: "Công nhân thời vụ", value: "Công nhân thời vụ" },
    ],
  },
];
