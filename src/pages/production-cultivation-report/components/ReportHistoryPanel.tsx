import { CalendarDays, RefreshCcw } from "lucide-react";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Progress,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { reportTemplates } from "../data/reportTemplates";
import type { ReportJob } from "../types";
import { formatDateTime, getToneClass, statusLabels } from "../utils/ui";

interface ReportHistoryPanelProps {
  jobs: ReportJob[];
  activeJobId: string | null;
  hasRunningJob: boolean;
  onSelectJob: (id: string) => void;
  onClearHistory: () => void;
}

export function ReportHistoryPanel({
  jobs,
  activeJobId,
  hasRunningJob,
  onSelectJob,
  onClearHistory,
}: ReportHistoryPanelProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CalendarDays className="w-5 h-5 text-primary" />
          Lịch sử yêu cầu
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearHistory}
          disabled={jobs.length === 0 || hasRunningJob}
        >
          <RefreshCcw className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {jobs.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
            Chưa có yêu cầu tổng hợp nào.
          </div>
        ) : (
          <ScrollArea className="h-[420px] pr-3">
            <div className="space-y-3">
              {jobs.map((job) => (
                <button
                  key={job.id}
                  type="button"
                  onClick={() => onSelectJob(job.id)}
                  className={`w-full rounded-lg border p-3 text-left transition-colors ${
                    job.id === activeJobId
                      ? "border-primary bg-primary/5"
                      : "border-slate-200 hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold">
                        {
                          reportTemplates.find(
                            (template) => template.id === job.request.templateId,
                          )?.name
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(job.createdAt)}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        job.status === "completed"
                          ? getToneClass("positive")
                          : job.status === "failed"
                            ? getToneClass("negative")
                            : getToneClass("warning")
                      }
                    >
                      {statusLabels[job.status]}
                    </Badge>
                  </div>
                  <Progress value={job.progress} className="mt-3 h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {job.request.scope.label} · {job.request.period.startDate} đến{" "}
                    {job.request.period.endDate}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
