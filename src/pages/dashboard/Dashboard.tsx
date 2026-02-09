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
  Briefcase,
  Activity,
  User,
  Users,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

const yieldData = [
  { month: "T2/23", durian: 45, mango: 30, grapefruit: 25 },
  { month: "T3/23", durian: 52, mango: 35, grapefruit: 28 },
  { month: "T4/23", durian: 48, mango: 40, grapefruit: 32 },
  { month: "T5/23", durian: 61, mango: 45, grapefruit: 35 },
  { month: "T6/23", durian: 55, mango: 50, grapefruit: 38 },
  { month: "T7/23", durian: 67, mango: 55, grapefruit: 42 },
  { month: "T8/23", durian: 72, mango: 60, grapefruit: 45 },
  { month: "T9/23", durian: 68, mango: 65, grapefruit: 48 },
  { month: "T10/23", durian: 75, mango: 70, grapefruit: 50 },
  { month: "T11/23", durian: 82, mango: 75, grapefruit: 55 },
  { month: "T12/23", durian: 78, mango: 80, grapefruit: 58 },
  { month: "T1/24", durian: 85, mango: 85, grapefruit: 62 },
];

const cropAreaDistribution = [
  { name: "Sầu riêng", value: 40, area: 500 },
  { name: "Xoài", value: 30, area: 375 },
  { name: "Bưởi", value: 20, area: 250 },
  { name: "Khác", value: 10, area: 125 },
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
        {/* Row 1: Organizations */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Doanh nghiệp / Nông hộ / Hợp tác xã
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Tổng doanh nghiệp"
              value="45"
              change="Tổng 850 ha"
              changeType="neutral"
              icon={Building2}
              iconColor="bg-blue-100 text-blue-600"
            />
            <StatsCard
              title="Tổng hợp tác xã"
              value="12"
              change="Tổng 1,200 ha"
              changeType="neutral"
              icon={Users}
              iconColor="bg-indigo-100 text-indigo-600"
            />
            <StatsCard
              title="Tổng nông hộ"
              value="99"
              change="Tổng 300 ha"
              changeType="neutral"
              icon={User}
              iconColor="bg-sky-100 text-sky-600"
            />
          </div>
        </div>

        {/* Row 2: Vùng trồng */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Vùng trồng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsCard
              title="Tổng diện tích đang canh tác"
              value="2,350 ha"
              change="124 vùng trồng"
              changeType="positive"
              icon={MapPin}
              iconColor="bg-green-100 text-green-600"
            />
            <StatsCard
              title="Tổng diện tích đang cải tạo"
              value="150 ha"
              change="12 vùng - 30 khu vực"
              changeType="neutral"
              icon={TrendingUp}
              iconColor="bg-orange-100 text-orange-600"
            />
          </div>
        </div>

        {/* Row 3: Cây trồng */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Cây trồng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Tổng cây trồng canh tác"
              value="15.420"
              change="Tất cả loại cây"
              changeType="neutral"
              icon={Sprout}
              iconColor="bg-amber-100 text-amber-600"
            />
            <StatsCard
              title="Số lượng cây mắc bệnh"
              value="124"
              change="Cần xử lý ngay"
              changeType="negative"
              icon={Activity}
              iconColor="bg-red-100 text-red-600"
            />
            <StatsCard
              title="Số lượng cây sức khỏe tốt"
              value="14.200"
              change="Chiếm 92%"
              changeType="positive"
              icon={CheckSquare}
              iconColor="bg-emerald-100 text-emerald-600"
            />
          </div>
        </div>

        {/* Row 4: Công việc */}
        <div className="space-y-2">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Công việc
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
              title="Công việc đã thực hiện"
              value="1.245"
              change="Trong năm nay"
              changeType="positive"
              icon={CheckSquare}
              iconColor="bg-purple-100 text-purple-600"
            />
            <StatsCard
              title="Công việc đang xử lý"
              value="85"
              change="Đang triển khai"
              changeType="neutral"
              icon={Clock}
              iconColor="bg-indigo-100 text-indigo-600"
            />
            <StatsCard
              title="Công việc đang chờ"
              value="42"
              change="Sắp tới"
              changeType="neutral"
              icon={Briefcase}
              iconColor="bg-slate-100 text-slate-600"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Sản lượng thu hoạch (tấn)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={yieldData}
                    margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="hsl(140, 15%, 88%)"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      stroke="hsl(140, 10%, 45%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis
                      stroke="hsl(140, 10%, 45%)"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(0, 0%, 100%)",
                        border: "1px solid hsl(140, 15%, 88%)",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={36}
                      iconType="circle"
                      formatter={(value: string) => (
                        <span className="text-sm font-medium text-slate-600 ml-1">
                          {value}
                        </span>
                      )}
                    />
                    <Line
                      type="monotone"
                      dataKey="durian"
                      name="Sầu riêng"
                      stroke="hsl(142, 50%, 45%)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="mango"
                      name="Xoài"
                      stroke="hsl(35, 90%, 55%)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="grapefruit"
                      name="Bưởi"
                      stroke="hsl(200, 70%, 50%)"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "white", strokeWidth: 2 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Sprout className="w-5 h-5 text-primary" />
                Phân bổ diện tích cây trồng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={cropAreaDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {cropAreaDistribution.map((_, index) => (
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
                {cropAreaDistribution.map((item, index) => (
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
                    <div className="text-right">
                      <div className="font-medium">{item.value}%</div>
                      <div className="text-[10px] text-muted-foreground">
                        {item.area} ha
                      </div>
                    </div>
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
