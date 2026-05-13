import type { Plan } from "@/stores/usePlanStore";
import type { Task } from "@/stores/useTaskStore";
import type { CultivationRegion } from "@/stores/useCultivationRegionStore";
import type { Region } from "@/pages/region-chart/constants";
import type { Season } from "@/pages/season/types/types";
import type { Treatment } from "@/pages/treatment/types/treatment.types";
import { getReportTemplateName } from "../data/reportTemplates";
import type {
  ReportBreakdownRow,
  ReportChartPoint,
  ReportInsight,
  ReportMaterialRow,
  ReportMetric,
  ReportRequest,
  ReportResult,
  ReportSourceRow,
  ReportTableRow,
} from "../types";

interface AggregateInput {
  request: ReportRequest;
  plans: Plan[];
  tasks: Task[];
  seasons: Season[];
  regions: Region[];
  cultivationRegions: CultivationRegion[];
  treatments: Treatment[];
}

const numberFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 1,
});

const planPurposeLabels: Record<Plan["purpose"], string> = {
  cultivation: "Canh tác",
  treatment: "Điều trị",
  amendment: "Cải tạo",
  harvest: "Thu hoạch",
  incurred: "Phát sinh",
};

const taskStatusLabels: Record<Task["status"], string> = {
  pending: "Chờ xử lý",
  "in-progress": "Đang thực hiện",
  completed: "Hoàn thành",
  overdue: "Trễ hạn",
};

function parseNumber(value: string | number | undefined) {
  if (typeof value === "number") return value;
  if (!value) return 0;
  const parsed = Number(String(value).replace(",", ".").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function overlapsPeriod(startDate: string, endDate: string, periodStart: string, periodEnd: string) {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();
  const filterStart = new Date(periodStart).getTime();
  const filterEnd = new Date(periodEnd).getTime();

  if ([start, end, filterStart, filterEnd].some(Number.isNaN)) {
    return true;
  }

  return start <= filterEnd && end >= filterStart;
}

function matchesScope(plan: Plan, request: ReportRequest) {
  const ids = request.scope.ids;

  if (request.scope.type === "all" || ids.length === 0) return true;
  if (request.scope.type === "season") return ids.includes(plan.seasonId);
  if (request.scope.type === "region") {
    return plan.selectedRegionIds.some((id) => ids.includes(String(id)));
  }
  if (request.scope.type === "area") {
    return plan.selectedZoneIds.some((id) => ids.includes(String(id)));
  }
  if (request.scope.type === "plot") {
    return plan.selectedPlotIds.some((id) => ids.includes(String(id)));
  }
  if (request.scope.type === "crop") {
    return ids.includes(plan.crop) || ids.includes(plan.variety);
  }
  if (request.scope.type === "plan") {
    return ids.includes(String(plan.id));
  }

  return true;
}

function formatArea(value: number) {
  return `${numberFormatter.format(value)} ha`;
}

function formatYield(value: number) {
  return `${numberFormatter.format(value)} tấn`;
}

function getProgress(tasks: Task[]) {
  if (tasks.length === 0) return 0;
  return Math.round(
    (tasks.filter((task) => task.status === "completed").length / tasks.length) *
      100,
  );
}

function buildTrendRows(plans: Plan[], tasks: Task[]) {
  const buckets = new Map<string, ReportChartPoint>();

  plans.forEach((plan) => {
    const label = plan.startDate.slice(0, 7);
    const current = buckets.get(label) || {
      label,
      yield: 0,
      tasks: 0,
      materials: 0,
    };

    current.yield += parseNumber(plan.expectedYield);
    current.materials += plan.materialAllocations.length;
    buckets.set(label, current);
  });

  tasks.forEach((task) => {
    const label = task.startDate.slice(0, 7);
    const current = buckets.get(label) || {
      label,
      yield: 0,
      tasks: 0,
      materials: 0,
    };

    current.tasks += 1;
    buckets.set(label, current);
  });

  return Array.from(buckets.values())
    .sort((first, second) => first.label.localeCompare(second.label))
    .slice(-8);
}

function buildTableRows(plans: Plan[], tasks: Task[]) {
  return plans.map<ReportTableRow>((plan) => {
    const planTasks = tasks.filter((task) => task.plan === plan.name);
    const progress = getProgress(planTasks);
    const hasOverdue = planTasks.some((task) => task.status === "overdue");
    const hasTreatment = plan.purpose === "treatment";

    return {
      id: String(plan.id),
      name: plan.name,
      scope: plan.seasonName,
      crop: [plan.crop, plan.variety].filter(Boolean).join(" - "),
      period: `${plan.startDate} đến ${plan.endDate}`,
      progress: `${progress}%`,
      yield: formatYield(parseNumber(plan.expectedYield)),
      material: `${plan.materialAllocations.length} nhóm`,
      risk: hasOverdue ? "Có việc trễ" : hasTreatment ? "Đang xử lý" : "Ổn định",
    };
  });
}

function buildInsights(plans: Plan[], tasks: Task[], treatments: Treatment[]) {
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;
  const activeTreatments = treatments.filter(
    (treatment) => treatment.status === "active",
  ).length;
  const harvestPlans = plans.filter((plan) => plan.purpose === "harvest").length;

  const insights: ReportInsight[] = [
    {
      id: "progress",
      title: overdueTasks > 0 ? "Cần xử lý công việc trễ" : "Tiến độ vận hành ổn định",
      description:
        overdueTasks > 0
          ? `${overdueTasks} công việc đang trễ hạn trong phạm vi báo cáo, nên ưu tiên rà soát nguồn lực.`
          : "Không ghi nhận công việc trễ hạn trong phạm vi báo cáo.",
      tone: overdueTasks > 0 ? "negative" : "positive",
    },
    {
      id: "harvest",
      title: "Kế hoạch thu hoạch",
      description:
        harvestPlans > 0
          ? `${harvestPlans} kế hoạch thu hoạch nằm trong phạm vi báo cáo.`
          : "Chưa có kế hoạch thu hoạch trong phạm vi đã chọn.",
      tone: harvestPlans > 0 ? "warning" : "neutral",
    },
    {
      id: "health",
      title: "Sức khỏe cây trồng",
      description:
        activeTreatments > 0
          ? `${activeTreatments} phác đồ/xử lý đang hoạt động, cần theo dõi hiệu quả sau can thiệp.`
          : "Không có phác đồ điều trị đang hoạt động trong phạm vi dữ liệu hiện tại.",
      tone: activeTreatments > 0 ? "warning" : "positive",
    },
  ];

  return insights;
}

function buildTaskStatusRows(tasks: Task[]): ReportBreakdownRow[] {
  const total = tasks.length || 1;
  const statuses: Task["status"][] = [
    "completed",
    "in-progress",
    "pending",
    "overdue",
  ];

  return statuses.map((status) => {
    const count = tasks.filter((task) => task.status === status).length;
    const percent = Math.round((count / total) * 100);

    return {
      id: status,
      label: taskStatusLabels[status],
      value: `${count} việc`,
      description: `${percent}% trong tổng số công việc thuộc kỳ báo cáo`,
      tone:
        status === "completed"
          ? "positive"
          : status === "overdue"
            ? "negative"
            : status === "in-progress"
              ? "warning"
              : "neutral",
    };
  });
}

function buildPlanPurposeRows(plans: Plan[]): ReportBreakdownRow[] {
  const purposes: Plan["purpose"][] = [
    "cultivation",
    "harvest",
    "treatment",
    "amendment",
    "incurred",
  ];

  return purposes
    .map((purpose) => {
      const purposePlans = plans.filter((plan) => plan.purpose === purpose);
      const area = purposePlans.reduce(
        (sum, plan) => sum + parseNumber(plan.area),
        0,
      );
      const expectedYield = purposePlans.reduce(
        (sum, plan) => sum + parseNumber(plan.expectedYield),
        0,
      );

      return {
        id: purpose,
        label: planPurposeLabels[purpose],
        value: `${purposePlans.length} kế hoạch`,
        description: `${formatArea(area)} · ${formatYield(expectedYield)}`,
        tone:
          purpose === "cultivation" || purpose === "harvest"
            ? "positive"
            : purpose === "treatment" || purpose === "incurred"
              ? "warning"
              : "neutral",
      } satisfies ReportBreakdownRow;
    })
    .filter((row) => row.value !== "0 kế hoạch");
}

function buildMaterialRows(plans: Plan[]): ReportMaterialRow[] {
  return plans
    .flatMap((plan) =>
      plan.materialAllocations.map((material) => ({
        id: `${plan.id}-${material.id}`,
        planName: plan.name,
        stage: material.stageId,
        category: material.materialCategory,
        materialName: material.materialName,
        quantity: material.quantity,
        unit: material.unit,
      })),
    )
    .slice(0, 40);
}

function buildSourceRows(
  plans: Plan[],
  tasks: Task[],
  seasons: Season[],
  regions: Region[],
  cultivationRegions: CultivationRegion[],
  treatments: Treatment[],
): ReportSourceRow[] {
  const rows: ReportSourceRow[] = [
    {
      id: "plans",
      source: "Kế hoạch canh tác",
      records: `${plans.length} bản ghi`,
      coverage: plans.length > 0 ? "Có dữ liệu" : "Thiếu dữ liệu",
      note: "Nguồn chính cho diện tích, sản lượng, cây trồng, vật tư và thời gian.",
      tone: plans.length > 0 ? "positive" : "negative",
    },
    {
      id: "tasks",
      source: "Công việc",
      records: `${tasks.length} bản ghi`,
      coverage: tasks.length > 0 ? "Có dữ liệu" : "Thiếu dữ liệu",
      note: "Dùng để tính tiến độ vận hành và cảnh báo trễ hạn.",
      tone: tasks.length > 0 ? "positive" : "warning",
    },
    {
      id: "seasons",
      source: "Mùa vụ",
      records: `${seasons.length} bản ghi`,
      coverage: seasons.length > 0 ? "Có dữ liệu" : "Thiếu dữ liệu",
      note: "Dùng để đối chiếu kỳ sản xuất và phạm vi mùa vụ.",
      tone: seasons.length > 0 ? "positive" : "warning",
    },
    {
      id: "regions",
      source: "Vùng/Khu/Lô",
      records: `${regions.length} vùng · ${cultivationRegions.length} vùng canh tác`,
      coverage: regions.length > 0 ? "Có dữ liệu" : "Thiếu dữ liệu",
      note: "Dùng để đọc phạm vi địa lý và độ phủ canh tác.",
      tone: regions.length > 0 ? "positive" : "warning",
    },
    {
      id: "treatments",
      source: "Điều trị cây trồng",
      records: `${treatments.length} phác đồ`,
      coverage: treatments.length > 0 ? "Có dữ liệu" : "Chưa phát sinh",
      note: "Dùng cho cảnh báo sức khỏe cây trồng và xử lý bệnh hại.",
      tone: treatments.length > 0 ? "warning" : "neutral",
    },
  ];

  return rows;
}

function buildExecutiveSummary(
  plans: Plan[],
  tasks: Task[],
  treatments: Treatment[],
) {
  const expectedYield = plans.reduce(
    (sum, plan) => sum + parseNumber(plan.expectedYield),
    0,
  );
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;
  const activeTreatments = treatments.filter(
    (treatment) => treatment.status === "active",
  ).length;

  return `Kỳ báo cáo ghi nhận ${plans.length} kế hoạch, ${tasks.length} công việc và ${formatYield(expectedYield)} sản lượng dự kiến. Có ${completedTasks} công việc đã hoàn thành, ${overdueTasks} công việc trễ hạn và ${activeTreatments} xử lý cây trồng đang hoạt động.`;
}

function buildMetrics(
  plans: Plan[],
  tasks: Task[],
  treatments: Treatment[],
  cultivationRegions: CultivationRegion[],
) {
  const totalArea = plans.reduce(
    (sum, plan) => sum + parseNumber(plan.area),
    0,
  );
  const expectedYield = plans.reduce(
    (sum, plan) => sum + parseNumber(plan.expectedYield),
    0,
  );
  const progress = getProgress(tasks);
  const overdueTasks = tasks.filter((task) => task.status === "overdue").length;
  const activeTreatments = treatments.filter(
    (treatment) => treatment.status === "active",
  ).length;

  const metrics: ReportMetric[] = [
    {
      id: "area",
      label: "Diện tích trong phạm vi",
      value: formatArea(totalArea),
      change: `${cultivationRegions.length} vùng canh tác liên quan`,
      tone: "neutral",
    },
    {
      id: "yield",
      label: "Sản lượng dự kiến",
      value: formatYield(expectedYield),
      change: plans.some((plan) => plan.purpose === "harvest")
        ? "Có kế hoạch thu hoạch"
        : "Theo kế hoạch hiện tại",
      tone: "positive",
    },
    {
      id: "progress",
      label: "Tiến độ công việc",
      value: `${progress}%`,
      change: `${tasks.length} công việc được tổng hợp`,
      tone: progress >= 80 ? "positive" : progress >= 50 ? "warning" : "negative",
    },
    {
      id: "risk",
      label: "Cảnh báo cần xử lý",
      value: String(overdueTasks + activeTreatments),
      change: `${overdueTasks} việc trễ, ${activeTreatments} xử lý cây trồng`,
      tone: overdueTasks + activeTreatments > 0 ? "warning" : "positive",
    },
  ];

  return metrics;
}

function filterTreatments(treatments: Treatment[], plans: Plan[]) {
  const crops = new Set(plans.map((plan) => plan.crop).filter(Boolean));
  if (crops.size === 0) return treatments;
  return treatments.filter((treatment) => crops.has(treatment.crop));
}

function getPeriodLabel(request: ReportRequest) {
  return `${request.period.startDate} đến ${request.period.endDate}`;
}

export function aggregateProductionCultivationReport({
  request,
  plans,
  tasks,
  seasons,
  regions,
  cultivationRegions,
  treatments,
}: AggregateInput): ReportResult {
  const periodPlans = plans.filter(
    (plan) =>
      overlapsPeriod(
        plan.startDate,
        plan.endDate,
        request.period.startDate,
        request.period.endDate,
      ) && matchesScope(plan, request),
  );
  const planNames = new Set(periodPlans.map((plan) => plan.name));
  const periodTasks = tasks.filter(
    (task) =>
      overlapsPeriod(
        task.startDate,
        task.endDate,
        request.period.startDate,
        request.period.endDate,
      ) &&
      (planNames.size === 0 || planNames.has(task.plan)),
  );
  const filteredTreatments = filterTreatments(treatments, periodPlans);
  const filteredCultivationRegions = cultivationRegions.filter((region) => {
    if (request.scope.type === "all") return true;
    return region.targetIds.some((id) => request.scope.ids.includes(String(id)));
  });
  const tableRows = buildTableRows(periodPlans, periodTasks);
  const chartData = buildTrendRows(periodPlans, periodTasks);

  return {
    id: `result-${Date.now()}`,
    templateId: request.templateId,
    title: getReportTemplateName(request.templateId),
    generatedAt: new Date().toISOString(),
    periodLabel: getPeriodLabel(request),
    scopeLabel: request.scope.label,
    metrics: buildMetrics(
      periodPlans,
      periodTasks,
      filteredTreatments,
      filteredCultivationRegions,
    ),
    chartData,
    tableRows,
    insights: buildInsights(periodPlans, periodTasks, filteredTreatments),
    taskStatusRows: buildTaskStatusRows(periodTasks),
    planPurposeRows: buildPlanPurposeRows(periodPlans),
    materialRows: buildMaterialRows(periodPlans),
    sourceRows: buildSourceRows(
      periodPlans,
      periodTasks,
      seasons,
      regions,
      filteredCultivationRegions,
      filteredTreatments,
    ),
    executiveSummary: buildExecutiveSummary(
      periodPlans,
      periodTasks,
      filteredTreatments,
    ),
  };
}
