import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataTable,
  Badge,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  FileText,
  Clock,
  PlayCircle,
  CheckCircle,
  AlertTriangle,
  User,
  Calendar,
} from "lucide-react";
import { mockDomainData } from "../constants/mockDomainData";

interface PlanWorkReportProps {
  domainType: "crops" | "livestock" | "aqua";
}

export const PlanWorkReport: React.FC<PlanWorkReportProps> = ({
  domainType,
}) => {
  const data = mockDomainData[domainType];

  const totalPlans =
    data.plansStats.completed +
    data.plansStats.inProgress +
    data.plansStats.pending;
  const completedPlansPercent =
    totalPlans > 0
      ? Math.round((data.plansStats.completed / totalPlans) * 100)
      : 0;

  const totalTasks =
    data.tasksStats.completed +
    data.tasksStats.inProgress +
    data.tasksStats.pending;
  const completedTasksPercent =
    totalTasks > 0
      ? Math.round((data.tasksStats.completed / totalTasks) * 100)
      : 0;

  // Table columns definition
  const planColumns = [
    {
      key: "name",
      label: "Tên Kế Hoạch",
      render: (val: any) => (
        <span className="font-bold text-slate-700 text-sm block max-w-md truncate">
          {val as string}
        </span>
      ),
    },
    {
      key: "type",
      label: "Thể Loại",
      render: (val: any) => {
        const type = val as string;
        let badgeColor = "text-slate-700 bg-slate-50 border-slate-200";
        if (type.includes("Bón phân")) {
          badgeColor = "text-orange-700 bg-orange-50 border-orange-200";
        } else if (type.includes("Phun") || type.includes("Thuốc")) {
          badgeColor = "text-rose-700 bg-rose-50 border-rose-200";
        } else if (
          type.includes("Gieo") ||
          type.includes("Xuống giống") ||
          type.includes("Trồng") ||
          type.includes("Thả nuôi")
        ) {
          badgeColor = "text-emerald-700 bg-emerald-50 border-emerald-200";
        } else if (type.includes("Tưới") || type.includes("Cho ăn")) {
          badgeColor = "text-blue-700 bg-blue-50 border-blue-200";
        }
        return (
          <Badge variant="outline" className={`font-semibold ${badgeColor}`}>
            {type}
          </Badge>
        );
      },
    },
    {
      key: "date",
      label: "Hạn Triển Khai",
      render: (val: any) => (
        <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {val as string}
        </span>
      ),
    },
    {
      key: "status",
      label: "Trạng Thái",
      render: (val: any) => {
        const status = val as string;
        const color =
          status === "Đang chạy"
            ? "text-blue-600 bg-blue-50 border-blue-100"
            : "text-amber-600 bg-amber-50 border-amber-100";
        return (
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${color}`}
          >
            {status}
          </span>
        );
      },
    },
  ];

  const taskColumns = [
    {
      key: "name",
      label: "Tên Công Việc",
      render: (val: any) => (
        <span className="font-bold text-slate-700 text-sm block max-w-md truncate">
          {val as string}
        </span>
      ),
    },
    {
      key: "assignee",
      label: "Người Thực Hiện",
      render: (val: any) => (
        <span className="flex items-center gap-1.5 text-slate-650 text-xs font-semibold">
          <User className="w-3.5 h-3.5 text-slate-400" />
          {val as string}
        </span>
      ),
    },
    {
      key: "date",
      label: "Hạn Chót",
      render: (val: any) => (
        <span className="font-mono text-xs text-slate-500 flex items-center gap-1">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          {val as string}
        </span>
      ),
    },
    {
      key: "priority",
      label: "Độ Ưu Tiên",
      render: (val: any) => {
        const priority = val as "HIGH" | "MEDIUM" | "LOW";
        const color =
          priority === "HIGH"
            ? "text-rose-600 bg-rose-50 border-rose-100"
            : priority === "MEDIUM"
              ? "text-amber-600 bg-amber-50 border-amber-100"
              : "text-slate-600 bg-slate-50 border-slate-100";
        return (
          <span
            className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${color}`}
          >
            {priority}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 2-row layout: Kế hoạch & Công việc */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Thống kê kế hoạch */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <FileText className="w-4.5 h-4.5 text-emerald-600" />
              <span>Kế hoạch canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-center">
                <Clock className="w-4.5 h-4.5 text-slate-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chờ duyệt
                </p>
                <p className="text-2xl font-display font-extrabold text-slate-700 font-mono">
                  {data.plansStats.pending}
                </p>
              </div>
              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50 space-y-1 text-center">
                <PlayCircle className="w-4.5 h-4.5 text-blue-500 mx-auto" />
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                  Đang chạy
                </p>
                <p className="text-2xl font-display font-extrabold text-slate-600 font-mono">
                  {data.plansStats.inProgress}
                </p>
              </div>
              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-50 space-y-1 text-center relative overflow-hidden flex flex-col justify-between">
                <div>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 mx-auto" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Hoàn thành
                  </p>
                  <p className="text-2xl font-display font-extrabold text-emerald-700 font-mono">
                    {data.plansStats.completed}
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-emerald-650 bg-emerald-100/40 rounded px-1 py-0.5 mt-1">
                  {completedPlansPercent}% tổng số
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thống kê công việc chi tiết */}
        <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
          <CardHeader className="pb-3 border-b border-slate-50 p-4">
            <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
              <span>Tiến độ Công việc thực địa</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-center">
                <Clock className="w-4.5 h-4.5 text-slate-400 mx-auto" />
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Chờ làm
                </p>
                <p className="text-2xl font-display font-extrabold text-slate-700 font-mono">
                  {data.tasksStats.pending}
                </p>
              </div>
              <div className="p-3 bg-blue-50/30 rounded-xl border border-blue-50 space-y-1 text-center">
                <PlayCircle className="w-4.5 h-4.5 text-blue-500 mx-auto" />
                <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                  Đang làm
                </p>
                <p className="text-2xl font-display font-extrabold text-blue-600 font-mono">
                  {data.tasksStats.inProgress}
                </p>
              </div>
              <div className="p-3 bg-emerald-50/30 rounded-xl border border-emerald-50 space-y-1 text-center relative overflow-hidden flex flex-col justify-between">
                <div>
                  <CheckCircle className="w-4.5 h-4.5 text-emerald-600 mx-auto" />
                  <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                    Đã xong
                  </p>
                  <p className="text-2xl font-display font-extrabold text-emerald-700 font-mono">
                    {data.tasksStats.completed}
                  </p>
                </div>
                <div className="text-[9px] font-extrabold text-emerald-650 bg-emerald-100/40 rounded px-1 py-0.5 mt-1">
                  {completedTasksPercent}% tổng số
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actual vs Plan Progress Bar Card */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <CheckCircle className="w-4.5 h-4.5 text-emerald-600" />
            <span>Tiến độ hoàn thành kế hoạch & công việc thực tế</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plans Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Tỷ lệ hoàn thành kế hoạch</span>
                <span className="font-mono text-emerald-600">
                  {completedPlansPercent}% ({data.plansStats.completed}/
                  {totalPlans} Kế hoạch)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${completedPlansPercent}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>

            {/* Tasks Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                <span>Tỷ lệ hoàn thành công việc</span>
                <span className="font-mono text-blue-600">
                  {completedTasksPercent}% ({data.tasksStats.completed}/
                  {totalTasks} Công việc)
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  style={{ width: `${completedTasksPercent}%` }}
                  className="bg-blue-500 h-full rounded-full transition-all duration-500"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Plans Table */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl flex flex-col justify-between">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <FileText className="w-4.5 h-4.5 text-emerald-600" />
            <span>Kế hoạch đang hoạt động</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-1">
          <DataTable
            columns={planColumns}
            data={data.activePlans}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm kế hoạch..."
            pageSize={5}
          />
        </CardContent>
      </Card>

      {/* Due Tasks Table */}
      <Card className="border border-slate-100 shadow-xs bg-white rounded-xl flex flex-col justify-between">
        <CardHeader className="pb-3 border-b border-slate-50 p-4">
          <CardTitle className="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
            <AlertTriangle className="w-4.5 h-4.5 text-rose-500 animate-pulse" />
            <span>Công việc sắp đến hạn / quá hạn</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 flex-1">
          <DataTable
            columns={taskColumns}
            data={data.dueTasks}
            selectable={false}
            searchable={true}
            searchPlaceholder="Tìm công việc..."
            pageSize={5}
          />
        </CardContent>
      </Card>
    </div>
  );
};
