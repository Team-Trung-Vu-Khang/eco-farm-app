export const yieldData = [
  { month: "T2/23", monthon: 45, ri6: 38, dona: 32 },
  { month: "T3/23", monthon: 52, ri6: 42, dona: 35 },
  { month: "T4/23", monthon: 48, ri6: 45, dona: 38 },
  { month: "T5/23", monthon: 61, ri6: 50, dona: 42 },
  { month: "T6/23", monthon: 55, ri6: 48, dona: 45 },
  { month: "T7/23", monthon: 67, ri6: 55, dona: 48 },
  { month: "T8/23", monthon: 72, ri6: 60, dona: 52 },
  { month: "T9/23", monthon: 68, ri6: 58, dona: 50 },
  { month: "T10/23", monthon: 75, ri6: 65, dona: 55 },
  { month: "T11/23", monthon: 82, ri6: 70, dona: 60 },
  { month: "T12/23", monthon: 78, ri6: 68, dona: 58 },
  { month: "T1/24", monthon: 85, ri6: 75, dona: 65 },
];

export const cropAreaDistribution = [
  { name: "Sầu riêng Monthon", value: 45, area: 562.5 },
  { name: "Sầu riêng Ri6", value: 35, area: 437.5 },
  { name: "Sầu riêng Dona", value: 20, area: 250 },
];

export const COLORS = [
  "hsl(142, 70%, 45%)", // Monthon - Xanh lá đậm
  "hsl(142, 60%, 25%)", // Ri6 - Xanh lá vừa
  "hsl(142, 50%, 95%)", // Dona - Xanh lá nhạt
];

export const recentActivities = [
  {
    id: 1,
    action: "Thêm mới nông hộ",
    user: "Nguyễn Văn A",
    time: "5 phút trước",
    type: "create",
  },
  {
    id: 2,
    action: "Cập nhật kế hoạch canh tác",
    user: "Trần Thị B",
    time: "15 phút trước",
    type: "update",
  },
  {
    id: 3,
    action: "Xóa vùng trồng",
    user: "Lê Văn C",
    time: "1 giờ trước",
    type: "delete",
  },
  {
    id: 4,
    action: "Hoàn thành công việc phun thuốc",
    user: "Phạm Thị D",
    time: "2 giờ trước",
    type: "complete",
  },
  {
    id: 5,
    action: "Thêm chứng chỉ VietGAP",
    user: "Hoàng Văn E",
    time: "3 giờ trước",
    type: "create",
  },
];

export const upcomingTasks = [
  {
    id: 1,
    title: "Bón phân đợt 2 - Vùng sầu riêng Monthon A1",
    dueDate: "Hôm nay",
    priority: "high",
    link: "/cultivation-plan",
  },
  {
    id: 2,
    title: "Kiểm tra sâu bệnh - Vùng Ri6 B3",
    dueDate: "Ngày mai",
    priority: "medium",
    link: "/cultivation-plan",
  },
  {
    id: 3,
    title: "Thu hoạch sầu riêng Dona - Vùng C2",
    dueDate: "15/02/2026",
    priority: "high",
    link: "/cultivation-plan",
  },
  {
    id: 4,
    title: "Tưới nước định kỳ - Tất cả vùng sầu riêng",
    dueDate: "16/02/2026",
    priority: "low",
    link: "/cultivation-plan",
  },
];
