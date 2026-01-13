import {
  AdminLayout,
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  StatsCard,
} from "@tankhang1/eco-shared-ui";
import {
  Building2,
  MapPin,
  Sprout,
  CheckSquare,
  TrendingUp,
  Calendar,
  AlertTriangle,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const areaData = [
  { month: "T1", value: 45 },
  { month: "T2", value: 52 },
  { month: "T3", value: 48 },
  { month: "T4", value: 61 },
  { month: "T5", value: 55 },
  { month: "T6", value: 67 },
  { month: "T7", value: 72 },
  { month: "T8", value: 68 },
  { month: "T9", value: 75 },
  { month: "T10", value: 82 },
  { month: "T11", value: 78 },
  { month: "T12", value: 85 },
];

const cropData = [
  { name: "Sầu riêng", value: 35 },
  { name: "Xoài", value: 25 },
  { name: "Bưởi", value: 20 },
  { name: "Thanh long", value: 15 },
  { name: "Khác", value: 5 },
];

const taskData = [
  { status: "Hoàn thành", count: 45 },
  { status: "Đang thực hiện", count: 23 },
  { status: "Chờ xử lý", count: 12 },
  { status: "Quá hạn", count: 5 },
];

const COLORS = [
  "hsl(142, 50%, 45%)",
  "hsl(35, 90%, 55%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
];

const recentActivities = [
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

const upcomingTasks = [
  {
    id: 1,
    title: "Bón phân đợt 2 - Vùng A1",
    dueDate: "Hôm nay",
    priority: "high",
  },
  {
    id: 2,
    title: "Kiểm tra sâu bệnh - Vùng B3",
    dueDate: "Ngày mai",
    priority: "medium",
  },
  {
    id: 3,
    title: "Thu hoạch sầu riêng - Vùng C2",
    dueDate: "15/01/2026",
    priority: "high",
  },
  {
    id: 4,
    title: "Tưới nước định kỳ - Tất cả vùng",
    dueDate: "16/01/2026",
    priority: "low",
  },
];

export default function Dashboard() {
  return (
    <AdminLayout
      title="Dashboard"
      description="Tổng quan hệ thống quản lý nông trại"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard
            title="Doanh nghiệp / Nông hộ"
            value="156"
            change="+12 trong tháng này"
            changeType="positive"
            icon={Building2}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Vùng canh tác"
            value="324"
            change="Tổng 1,250 ha"
            changeType="neutral"
            icon={MapPin}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Cây trồng đang canh tác"
            value="18"
            change="5 loại chính"
            changeType="neutral"
            icon={Sprout}
            iconColor="bg-amber-100 text-amber-600"
          />
          <StatsCard
            title="Công việc đang xử lý"
            value="85"
            change="5 quá hạn"
            changeType="negative"
            icon={CheckSquare}
            iconColor="bg-purple-100 text-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Sản lượng theo tháng (tấn)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={areaData}>
                    <defs>
                      <linearGradient
                        id="colorValue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(142, 50%, 45%)"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(142, 50%, 45%)"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(140, 15%, 88%)"
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(140, 10%, 45%)"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(140, 10%, 45%)" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(140, 15%, 88%)",
                        borderRadius: "8px",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="hsl(142, 50%, 45%)"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorValue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Phân bố cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cropData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-2">
                {cropData.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Hoạt động gần đây
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "create"
                          ? "bg-green-500"
                          : activity.type === "update"
                          ? "bg-blue-500"
                          : activity.type === "delete"
                          ? "bg-red-500"
                          : "bg-amber-500"
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Công việc sắp tới
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{task.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {task.dueDate}
                      </p>
                    </div>
                    <Badge
                      variant={
                        task.priority === "high"
                          ? "destructive"
                          : task.priority === "medium"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {task.priority === "high"
                        ? "Cao"
                        : task.priority === "medium"
                        ? "Trung bình"
                        : "Thấp"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Cảnh báo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                <p className="font-medium text-red-800">
                  Chứng chỉ sắp hết hạn
                </p>
                <p className="text-sm text-red-600 mt-1">
                  3 chứng chỉ VietGAP hết hạn trong 30 ngày
                </p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <p className="font-medium text-amber-800">Vật tư sắp hết</p>
                <p className="text-sm text-amber-600 mt-1">
                  5 loại phân bón cần bổ sung
                </p>
              </div>
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                <p className="font-medium text-blue-800">
                  Hợp đồng cần gia hạn
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  2 hợp đồng hết hạn trong tuần này
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
