import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  DataTable,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle,
  Clock,
  PlayCircle,
  FileText,
  Briefcase,
  User,
} from "lucide-react";
import { mockFarmingHistory } from "../constants/mockReportData";

const planColumns: Column<any>[] = [
  {
    key: "name",
    label: "Tên Kế Hoạch",
    render: (val) => (
      <span className="font-bold text-slate-700 text-sm block max-w-sm truncate">
        {val as string}
      </span>
    ),
  },
  {
    key: "type",
    label: "Loại",
    render: (val) => (
      <span className="text-slate-500 text-xs font-semibold">
        {val as string}
      </span>
    ),
  },
  {
    key: "date",
    label: "Ngày",
    render: (val) => (
      <span className="font-mono text-xs text-slate-500">{val as string}</span>
    ),
  },
  {
    key: "status",
    label: "Trạng Thái",
    render: (val) => (
      <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-xs font-extrabold px-2 py-0.5">
        {val as string}
      </Badge>
    ),
  },
];

const taskColumns: Column<any>[] = [
  {
    key: "name",
    label: "Công Việc",
    render: (val) => (
      <span className="font-bold text-slate-700 text-sm block max-w-sm truncate">
        {val as string}
      </span>
    ),
  },
  {
    key: "assignee",
    label: "Người Thực Hiện",
    render: (val) => (
      <span className="flex items-center gap-1.5 text-slate-650 text-sm">
        <User className="w-4 h-4 text-slate-400" />
        <span>{val as string}</span>
      </span>
    ),
  },
  {
    key: "date",
    label: "Ngày Xong",
    render: (val) => (
      <span className="font-mono text-xs text-slate-500">{val as string}</span>
    ),
  },
];

export function FarmingHistoryBlock() {
  const plans = mockFarmingHistory.plans;
  const tasks = mockFarmingHistory.tasks;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2-row layout: Kế hoạch & Công việc */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Thống kê kế hoạch */}
        <Card className="border border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-emerald-600" />
              <span>Kế hoạch canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-center">
                <Clock className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Chờ duyệt
                </p>
                <p className="text-2xl font-display font-extrabold text-slate-700 font-mono">
                  {plans.pending}
                </p>
              </div>
              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50 space-y-1 text-center">
                <PlayCircle className="w-4 h-4 text-blue-500 mx-auto" />
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Đang chạy
                </p>
                <p className="text-2xl font-display font-extrabold text-blue-600 font-mono">
                  {plans.inProgress}
                </p>
              </div>
              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-50 space-y-1 text-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Hoàn thành
                </p>
                <p className="text-2xl font-display font-extrabold text-emerald-700 font-mono">
                  {plans.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê công việc chi tiết */}
        <Card className="border border-slate-100 shadow-xs bg-white">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-600" />
              <span>Công việc canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-center">
                <Clock className="w-4 h-4 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Chờ triển khai
                </p>
                <p className="text-2xl font-display font-extrabold text-slate-700 font-mono">
                  {tasks.pending}
                </p>
              </div>
              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50 space-y-1 text-center">
                <PlayCircle className="w-4 h-4 text-blue-500 mx-auto" />
                <p className="text-xs font-bold text-blue-500 uppercase tracking-wider">
                  Đang triển khai
                </p>
                <p className="text-2xl font-display font-extrabold text-blue-600 font-mono">
                  {tasks.inProgress}
                </p>
              </div>
              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-50 space-y-1 text-center">
                <CheckCircle className="w-4 h-4 text-emerald-600 mx-auto" />
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Đã hoàn thành
                </p>
                <p className="text-2xl font-display font-extrabold text-emerald-700 font-mono">
                  {tasks.completed}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bảng hoạt động gần đây sử dụng DataTable chuyên nghiệp */}
      <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between h-full">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-base font-bold text-slate-800">
            Kế hoạch vừa hoàn thành gần nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-1">
          <DataTable
            columns={planColumns}
            data={mockFarmingHistory.recentPlans}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm kiếm kế hoạch..."
            pageSize={5}
          />
        </CardContent>
      </Card>

      <Card className="border border-slate-100 shadow-xs bg-white flex flex-col justify-between h-full">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-base font-bold text-slate-800">
            Công việc canh tác hoàn thành gần nhất
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-1">
          <DataTable
            columns={taskColumns}
            data={mockFarmingHistory.recentTasks}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm kiếm công việc..."
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
}
