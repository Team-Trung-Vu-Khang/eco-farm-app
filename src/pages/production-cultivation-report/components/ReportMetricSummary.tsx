import { BarChart3, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReportResult } from "../types";
import { getToneClass } from "../utils/ui";

interface ReportMetricSummaryProps {
  result: ReportResult;
}

export function ReportMetricSummary({ result }: ReportMetricSummaryProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {result.metrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">
                    {metric.value}
                  </p>
                </div>
                <div
                  className={`rounded-md border p-2 ${getToneClass(
                    metric.tone,
                  )}`}
                >
                  <TrendingUp className="w-4 h-4" />
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-l-4 border-l-primary">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-md bg-primary/10 p-2 text-primary">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-900">Tóm tắt điều hành</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {result.executiveSummary}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function EmptyReportState() {
  return (
    <Card>
      <CardContent className="p-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BarChart3 className="w-6 h-6" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-900">
            Chưa có báo cáo được tổng hợp
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Chọn mẫu báo cáo, kỳ báo cáo và phạm vi dữ liệu rồi gửi yêu cầu
            tổng hợp để xem KPI, biểu đồ, nhận định và bảng chi tiết.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
