import { BarChart3, ClipboardList } from "lucide-react";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReportBreakdownRow } from "../types";
import { getToneClass } from "../utils/ui";

interface ReportAnalysisPanelProps {
  taskStatusRows: ReportBreakdownRow[];
  planPurposeRows: ReportBreakdownRow[];
}

export function ReportAnalysisPanel({
  taskStatusRows,
  planPurposeRows,
}: ReportAnalysisPanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardList className="w-5 h-5 text-primary" />
            Phân bổ trạng thái công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {taskStatusRows.map((row) => (
              <BreakdownCard key={row.id} row={row} />
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BarChart3 className="w-5 h-5 text-primary" />
            Phân bổ mục đích kế hoạch
          </CardTitle>
        </CardHeader>
        <CardContent>
          {planPurposeRows.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
              Không có kế hoạch trong phạm vi đã chọn.
            </div>
          ) : (
            <div className="space-y-3">
              {planPurposeRows.map((row) => (
                <BreakdownCard key={row.id} row={row} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function BreakdownCard({ row }: { row: ReportBreakdownRow }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium text-slate-900">{row.label}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {row.description}
          </p>
        </div>
        <Badge variant="outline" className={getToneClass(row.tone)}>
          {row.value}
        </Badge>
      </div>
    </div>
  );
}
