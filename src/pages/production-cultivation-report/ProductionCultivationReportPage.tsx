import { useMemo, useState } from "react";
import { FileSpreadsheet, FileText } from "lucide-react";
import {
  AdminLayout,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useCultivationRegionStore from "@/stores/useCultivationRegionStore";
import usePlanStore from "@/stores/usePlanStore";
import useProductionCultivationReportStore from "@/stores/useProductionCultivationReportStore";
import useRegionStore from "@/stores/useRegionStore";
import useSeasonStore from "@/stores/useSeasonStore";
import useTaskStore from "@/stores/useTaskStore";
import { useTreatmentStore } from "@/stores/useTreatmentStore";
import { ReportHistoryPanel } from "./components/ReportHistoryPanel";
import {
  EmptyReportState,
  ReportMetricSummary,
} from "./components/ReportMetricSummary";
import { ReportResultTabs } from "./components/ReportResultTabs";
import { ReportSetupPanel } from "./components/ReportSetupPanel";
import { reportTemplates } from "./data/reportTemplates";
import type {
  ReportPeriodType,
  ReportRequest,
  ReportScopeType,
  ReportTemplateId,
} from "./types";
import { aggregateProductionCultivationReport } from "./utils/aggregate";
import { exportReportToExcel, exportReportToPdf } from "./utils/export";
import {
  chartPalette,
  getDefaultPeriod,
  normalizeReportResult,
  parseDisplayNumber,
  type Option,
} from "./utils/ui";

export default function ProductionCultivationReportPage() {
  const { toast } = useToast();
  const plans = usePlanStore((state) => state.plans);
  const tasks = useTaskStore((state) => state.tasks);
  const seasons = useSeasonStore((state) => state.seasons);
  const regions = useRegionStore((state) => state.regions);
  const cultivationRegions = useCultivationRegionStore((state) => state.areas);
  const treatments = useTreatmentStore((state) => state.treatments);
  const {
    jobs,
    results,
    activeJobId,
    createJob,
    updateJob,
    completeJob,
    failJob,
    setActiveJob,
    clearHistory,
  } = useProductionCultivationReportStore();

  const [templateId, setTemplateId] =
    useState<ReportTemplateId>("executive-summary");
  const [periodType, setPeriodType] = useState<ReportPeriodType>("year");
  const defaultPeriod = useMemo(() => getDefaultPeriod("year"), []);
  const [startDate, setStartDate] = useState(defaultPeriod.startDate);
  const [endDate, setEndDate] = useState(defaultPeriod.endDate);
  const [scopeType, setScopeType] = useState<ReportScopeType>("all");
  const [scopeId, setScopeId] = useState("all");
  const [activeTab, setActiveTab] = useState("overview");

  const selectedTemplate = reportTemplates.find(
    (template) => template.id === templateId,
  );
  const activeJob = jobs.find((job) => job.id === activeJobId);
  const persistedActiveResult = activeJob?.resultId
    ? results.find((result) => result.id === activeJob.resultId)
    : undefined;
  const activeResult = normalizeReportResult(persistedActiveResult);
  const hasRunningJob = jobs.some(
    (job) => job.status === "queued" || job.status === "processing",
  );

  const scopeOptions = useMemo<Option[]>(() => {
    if (scopeType === "season") {
      return seasons.map((season) => ({ label: season.name, value: season.id }));
    }

    if (scopeType === "region") {
      return regions.map((region) => ({
        label: region.name,
        value: String(region.id),
      }));
    }

    if (scopeType === "area") {
      return regions.flatMap((region) =>
        (region.subAreas || []).map((area) => ({
          label: `${area.name} - ${region.name}`,
          value: String(area.id),
        })),
      );
    }

    if (scopeType === "plot") {
      return regions.flatMap((region) =>
        (region.subAreas || []).flatMap((area) =>
          (area.plots || []).map((plot) => ({
            label: `${plot.name} - ${area.name}`,
            value: String(plot.id),
          })),
        ),
      );
    }

    if (scopeType === "crop") {
      const crops = Array.from(new Set(plans.map((plan) => plan.crop))).filter(
        Boolean,
      );
      return crops.map((crop) => ({ label: crop, value: crop }));
    }

    if (scopeType === "plan") {
      return plans.map((plan) => ({
        label: `${plan.code} - ${plan.name}`,
        value: String(plan.id),
      }));
    }

    return [];
  }, [plans, regions, scopeType, seasons]);

  const taskStatusChartData =
    activeResult?.taskStatusRows
      .map((row, index) => ({
        name: row.label,
        value: parseDisplayNumber(row.value),
        fill: chartPalette[index % chartPalette.length],
      }))
      .filter((row) => row.value > 0) ?? [];
  const planPurposeChartData =
    activeResult?.planPurposeRows.map((row, index) => ({
      name: row.label,
      value: parseDisplayNumber(row.value),
      fill: chartPalette[index % chartPalette.length],
    })) ?? [];

  const handlePeriodTypeChange = (value: ReportPeriodType) => {
    setPeriodType(value);
    const nextPeriod = getDefaultPeriod(value);
    setStartDate(nextPeriod.startDate);
    setEndDate(nextPeriod.endDate);
  };

  const handleScopeTypeChange = (value: ReportScopeType) => {
    setScopeType(value);
    setScopeId("all");
  };

  const buildRequest = (): ReportRequest => {
    const selectedScope =
      scopeOptions.find((option) => option.value === scopeId) || null;
    const label =
      scopeType === "all"
        ? "Toàn hệ thống"
        : selectedScope?.label || "Chưa chọn phạm vi";

    return {
      templateId,
      period: {
        type: periodType,
        startDate,
        endDate,
      },
      scope: {
        type: scopeType,
        ids: scopeType === "all" || scopeId === "all" ? [] : [scopeId],
        label,
      },
      comparisonEnabled: true,
      createdAt: new Date().toISOString(),
    };
  };

  const handleSubmit = () => {
    if (scopeType !== "all" && scopeId === "all") {
      toast({
        title: "Chưa chọn phạm vi dữ liệu",
        description:
          "Vui lòng chọn một mùa vụ, vùng, lô, cây trồng hoặc kế hoạch.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startDate).getTime() > new Date(endDate).getTime()) {
      toast({
        title: "Kỳ báo cáo chưa hợp lệ",
        description: "Ngày bắt đầu cần nhỏ hơn hoặc bằng ngày kết thúc.",
        variant: "destructive",
      });
      return;
    }

    const request = buildRequest();
    const jobId = createJob(request);
    setActiveTab("overview");

    window.setTimeout(() => {
      updateJob(jobId, { status: "processing", progress: 55 });
    }, 350);

    window.setTimeout(() => {
      try {
        const result = aggregateProductionCultivationReport({
          request,
          plans,
          tasks,
          seasons,
          regions,
          cultivationRegions,
          treatments,
        });

        completeJob(jobId, result);
        toast({
          title: "Đã tổng hợp báo cáo",
          description: "Báo cáo đã sẵn sàng để xem và xuất dữ liệu.",
        });
      } catch {
        failJob(jobId, "Không thể tổng hợp dữ liệu báo cáo.");
      }
    }, 1000);
  };

  const handleExportExcel = () => {
    if (!activeResult) return;
    exportReportToExcel(activeResult);
  };

  const handleExportPdf = () => {
    if (!activeResult) return;
    exportReportToPdf(activeResult);
  };

  return (
    <AdminLayout
      title="Báo cáo sản xuất/canh tác"
      description="Tổng hợp chỉ tiêu điều hành từ kế hoạch, công việc, mùa vụ và vùng canh tác"
      actions={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExportExcel}
            disabled={!activeResult}
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Xuất Excel
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPdf}
            disabled={!activeResult}
          >
            <FileText className="w-4 h-4 mr-2" />
            Xuất PDF
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">
          <ReportSetupPanel
            templateId={templateId}
            periodType={periodType}
            startDate={startDate}
            endDate={endDate}
            scopeType={scopeType}
            scopeId={scopeId}
            scopeOptions={scopeOptions}
            selectedTemplateName={selectedTemplate?.name}
            hasRunningJob={hasRunningJob}
            onTemplateChange={setTemplateId}
            onPeriodTypeChange={handlePeriodTypeChange}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            onScopeTypeChange={handleScopeTypeChange}
            onScopeIdChange={setScopeId}
            onSubmit={handleSubmit}
          />

          <ReportHistoryPanel
            jobs={jobs}
            activeJobId={activeJobId}
            hasRunningJob={hasRunningJob}
            onSelectJob={setActiveJob}
            onClearHistory={clearHistory}
          />
        </div>

        {activeResult ? (
          <div className="space-y-6">
            <ReportMetricSummary result={activeResult} />
            <ReportResultTabs
              result={activeResult}
              activeTab={activeTab}
              taskStatusChartData={taskStatusChartData}
              planPurposeChartData={planPurposeChartData}
              onTabChange={setActiveTab}
            />
          </div>
        ) : (
          <EmptyReportState />
        )}
      </div>
    </AdminLayout>
  );
}
