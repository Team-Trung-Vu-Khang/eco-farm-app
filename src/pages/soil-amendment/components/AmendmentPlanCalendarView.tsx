import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar as CalendarIcon, Eye, MapPin } from "lucide-react";
import type { AmendmentPlan } from "../../../stores/useAmendmentPlanStore";

interface AmendmentPlanCalendarViewProps {
  onViewDetail: (item: AmendmentPlan) => void;
  plans: AmendmentPlan[];
}

const STATUS_COLORS: Record<AmendmentPlan["status"], string> = {
  planning: "bg-blue-100 border-blue-300 text-blue-700",
  in_progress: "bg-green-500 text-white border-green-600",
  completed: "bg-slate-300 text-slate-700 border-slate-400",
  cancelled: "bg-red-100 border-red-300 text-red-700",
};

const MONTH_LABELS = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

export function AmendmentPlanCalendarView({
  onViewDetail,
  plans,
}: AmendmentPlanCalendarViewProps) {
  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="border-b bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-900">
              Lịch biểu thực hiện
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              Xem tiến độ các kế hoạch cải tạo theo thời gian
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded border border-blue-300 bg-blue-100" />
              <span className="text-slate-600">Đang lập</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span className="text-slate-600">Đang thực hiện</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-slate-300" />
              <span className="text-slate-600">Hoàn thành</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto p-6">
        <div className="min-w-[800px]">
          <div className="mb-4 flex border-b pb-2">
            <div className="w-48 flex-shrink-0" />
            <div className="grid flex-1 grid-cols-12 gap-1">
              {MONTH_LABELS.map((month) => (
                <div
                  className="text-center text-xs font-medium text-slate-500"
                  key={month}
                >
                  {month}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {plans.map((plan) => {
              const startDate = new Date(plan.startDate);
              const endDate = new Date(plan.endDate);
              const startMonth = startDate.getMonth();
              const endMonth = endDate.getMonth();
              const duration = endMonth - startMonth + 1;

              return (
                <div
                  className="-mx-2 flex items-center rounded px-2 py-1 transition-colors hover:bg-slate-50 group"
                  key={plan.id}
                >
                  <div className="w-48 flex-shrink-0 pr-4">
                    <div
                      className="truncate text-sm font-medium text-slate-900"
                      title={plan.name}
                    >
                      {plan.name}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{plan.zone}</span>
                    </div>
                  </div>

                  <div className="relative h-12 flex-1">
                    <div className="absolute inset-0 grid grid-cols-12 gap-1">
                      {Array.from({ length: 12 }).map((_, index) => (
                        <div
                          className="border-r border-slate-100 last:border-r-0"
                          key={index}
                        />
                      ))}
                    </div>

                    <div
                      className={`absolute top-1/2 flex h-8 -translate-y-1/2 cursor-pointer items-center rounded border-2 px-2 shadow-sm transition-all hover:shadow-md ${STATUS_COLORS[plan.status]}`}
                      onClick={() => onViewDetail(plan)}
                      style={{
                        left: `${(startMonth / 12) * 100}%`,
                        minWidth: "60px",
                        width: `${(duration / 12) * 100}%`,
                      }}
                      title={`${plan.name}\n${plan.startDate} → ${plan.endDate}`}
                    >
                      <div className="flex w-full items-center justify-between text-xs font-medium">
                        <span className="truncate">{plan.code}</span>
                        <span className="ml-1 opacity-75">{plan.area}ha</span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-3 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      className="h-7 w-7 p-0"
                      onClick={() => onViewDetail(plan)}
                      size="sm"
                      variant="ghost"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {plans.length === 0 && (
            <div className="py-12 text-center text-slate-400">
              <CalendarIcon className="mx-auto mb-3 h-12 w-12 opacity-50" />
              <p className="text-sm">Chưa có kế hoạch nào</p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t bg-slate-50 px-6 py-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>Hiển thị {plans.length} kế hoạch</span>
          <span>Năm 2025</span>
        </div>
      </div>
    </div>
  );
}
