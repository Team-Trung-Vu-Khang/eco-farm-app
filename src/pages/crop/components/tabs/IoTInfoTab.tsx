import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, History, TrendingUp } from "lucide-react";
import type { Crop } from "../../types/types";

interface IoTInfoTabProps {
  crop: Crop;
}

export function IoTInfoTab({ crop }: IoTInfoTabProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Chỉ số thời gian thực
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {crop.iotData?.current.map((metric, idx) => (
            <Card
              key={idx}
              className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl overflow-hidden"
            >
              <CardContent className="p-6">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  {metric.label}
                </p>
                <div className="flex items-end gap-2">
                  <h4 className="text-3xl font-bold text-slate-900">
                    {metric.value}
                  </h4>
                  <span className="text-sm font-medium text-slate-400 mb-1.5">
                    {metric.unit}
                  </span>
                </div>
                {metric.trend && (
                  <div
                    className={`mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider ${
                      metric.trend === "up"
                        ? "text-emerald-600"
                        : metric.trend === "down"
                          ? "text-rose-600"
                          : "text-slate-400"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : metric.trend === "down" ? (
                      <TrendingUp className="w-3 h-3 rotate-180" />
                    ) : (
                      <TrendingUp className="w-3 h-3 rotate-90" />
                    )}
                    Xu hướng:{" "}
                    {metric.trend === "up"
                      ? "Tăng"
                      : metric.trend === "down"
                        ? "Giảm"
                        : "Ổn định"}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div>
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <History className="w-4 h-4" />
          Lịch sử so sánh
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: "Cách đây 3 ngày",
              data: crop.iotData?.history3Days,
            },
            {
              label: "Cách đây 1 tuần",
              data: crop.iotData?.history1Week,
            },
            {
              label: "Cách đây 1 tháng",
              data: crop.iotData?.history1Month,
            },
          ].map((comparative, idx) => (
            <Card
              key={idx}
              className="border-none shadow-sm ring-1 ring-slate-200/50 bg-slate-50/50 rounded-xl"
            >
              <CardHeader className="pb-2 border-b border-slate-100">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {comparative.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-3">
                {comparative.data?.map((m, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold text-slate-400 uppercase">
                      {m.label}
                    </p>
                    <p className="text-sm font-bold text-slate-700">
                      {m.value}
                      {m.unit}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
