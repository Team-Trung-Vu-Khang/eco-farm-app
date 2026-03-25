import {
  Badge,
  Button,
  Card,
  Label,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  FlaskConical,
  Sprout,
} from "lucide-react";
import { SoilMetricStatusBadge } from "./SoilMetricStatusBadge";
import {
  getMetricAnalysis,
  getSuggestionItems,
  hasOnlyHealthyMetrics,
  METRIC_CONFIG,
} from "../utils";
import type { SelectedSoilFeature, SoilMetric } from "../types";

interface SoilDetailsSidebarProps {
  activeMetric: SoilMetric;
  isCollapsed: boolean;
  onCreatePlan: () => void;
  selectedFeature: SelectedSoilFeature | null;
}

export function SoilDetailsSidebar({
  activeMetric,
  isCollapsed,
  onCreatePlan,
  selectedFeature,
}: SoilDetailsSidebarProps) {
  const activeAnalysis = selectedFeature
    ? getMetricAnalysis(activeMetric, selectedFeature.data[activeMetric])
    : null;
  const suggestionItems = selectedFeature ? getSuggestionItems(selectedFeature) : [];
  const allMetricsHealthy = selectedFeature
    ? hasOnlyHealthyMetrics(selectedFeature)
    : false;

  return (
    <div
      className={`h-full shrink-0 border-r bg-card transition-all duration-300 ${
        isCollapsed ? "w-0 overflow-hidden border-none" : "w-[350px]"
      }`}
    >
      <Card
        className={`flex h-full flex-col border-none bg-white/80 shadow-md backdrop-blur transition-all duration-300 ${
          selectedFeature ? "" : "pointer-events-none opacity-50 grayscale"
        }`}
      >
        <div className="border-b bg-muted/30 p-4">
          {selectedFeature ? (
            <>
              <div className="mb-2 flex items-start justify-between">
                <Badge variant="outline" className="bg-background">
                  {selectedFeature.type}
                </Badge>
                <span className="rounded-full border bg-white px-2 py-1 text-[10px] text-muted-foreground">
                  ID: {selectedFeature.id}
                </span>
              </div>
              <h2 className="text-xl font-bold leading-tight text-foreground">
                {selectedFeature.name}
              </h2>
              <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <ClipboardList className="h-3 w-3" />
                Cập nhật: {selectedFeature.data.lastUpdated}
              </p>
            </>
          ) : (
            <div className="flex h-16 items-center justify-center text-muted-foreground">
              Select a region
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 p-4">
          {selectedFeature && activeAnalysis && (
            <div className="space-y-6">
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-2 flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Chỉ số đang xem
                  </Label>
                  <SoilMetricStatusBadge analysis={activeAnalysis} />
                </div>

                <div className="group relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 p-4">
                  <div className="absolute right-0 top-0 p-2 opacity-10 transition-opacity group-hover:opacity-20">
                    <FlaskConical className="h-16 w-16" />
                  </div>
                  <div className="relative z-10">
                    <div className="text-3xl font-black text-slate-800">
                      {selectedFeature.data[activeMetric]}
                      <span className="ml-1 text-sm font-normal text-muted-foreground">
                        {METRIC_CONFIG[activeMetric].unit}
                      </span>
                    </div>
                    <div className="mb-1 text-sm font-medium text-slate-600">
                      {METRIC_CONFIG[activeMetric].label}
                    </div>
                    <p className="mt-2 rounded-lg border border-slate-100 bg-white/50 p-2 text-xs text-slate-500">
                      {activeAnalysis.message}
                    </p>
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-blue-100/50 bg-blue-50/50 p-3 text-xs text-slate-600">
                  <div className="mb-2 flex items-center gap-1.5 border-b border-blue-100 pb-1 font-semibold text-blue-700">
                    <ClipboardList className="h-3.5 w-3.5" />
                    Tham chiếu chuẩn (Research)
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Ngưỡng tối ưu:</span>
                      <span className="rounded border border-blue-100 bg-white px-2 py-0.5 font-medium text-slate-800">
                        {METRIC_CONFIG[activeMetric].details.ideal}
                      </span>
                    </div>
                    <div className="grid gap-1.5 pt-1">
                      <div className="flex items-start gap-2">
                        <span className="w-12 shrink-0 whitespace-nowrap font-medium text-amber-600">
                          Thấp:
                        </span>
                        <span className="leading-tight">
                          {METRIC_CONFIG[activeMetric].details.lowEffect}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="w-12 shrink-0 whitespace-nowrap font-medium text-red-500">
                          Cao:
                        </span>
                        <span className="leading-tight">
                          {METRIC_CONFIG[activeMetric].details.highEffect}
                        </span>
                      </div>
                    </div>
                    {METRIC_CONFIG[activeMetric].details.source && (
                      <div className="mt-1 text-right text-[10px] italic text-muted-foreground">
                        Nguồn: {METRIC_CONFIG[activeMetric].details.source}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
                  <Sprout className="h-4 w-4 text-green-600" />
                  Đề xuất cải tạo
                </h3>
                <div className="space-y-2">
                  {suggestionItems.map(({ metric, analysis, value }) => (
                    <div
                      key={metric}
                      className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50/50 p-3"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                      <div className="flex-1">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          {METRIC_CONFIG[metric].label}
                          <span className="font-normal text-slate-500">
                            ({value})
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-slate-600">
                          {analysis.message}
                        </div>
                        {analysis.action && (
                          <div className="mt-2 inline-flex items-center gap-1 rounded bg-amber-100/50 px-2 py-1 text-xs font-medium text-amber-700">
                            <ArrowRight className="h-3 w-3" />
                            {analysis.action}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {allMetricsHealthy && (
                    <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-sm text-green-700">
                      <CheckCircle2 className="h-5 w-5" />
                      Chất lượng đất rất tốt! Không cần cải tạo.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ScrollArea>

        <div className="border-t bg-slate-50 p-4">
          <Button
            className="w-full bg-emerald-600 text-white shadow-lg shadow-emerald-200 transition-all hover:scale-[1.02] hover:bg-emerald-700"
            onClick={onCreatePlan}
          >
            <Sprout className="mr-2 h-4 w-4" />
            Tạo kế hoạch cải tạo
          </Button>
        </div>
      </Card>
    </div>
  );
}
