import { Download } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReportResult } from "../types";
import { ReportAnalysisPanel } from "./ReportAnalysisPanel";
import { ReportInsightsPanel } from "./ReportInsightsPanel";
import { ReportOverviewCharts } from "./ReportOverviewCharts";
import {
  ReportDetailTable,
  ReportMaterialsTable,
  ReportSourcesPanel,
} from "./ReportTables";

interface ChartDatum {
  name: string;
  value: number;
  fill: string;
}

interface ReportResultTabsProps {
  result: ReportResult;
  activeTab: string;
  taskStatusChartData: ChartDatum[];
  planPurposeChartData: ChartDatum[];
  onTabChange: (value: string) => void;
}

export function ReportResultTabs({
  result,
  activeTab,
  taskStatusChartData,
  planPurposeChartData,
  onTabChange,
}: ReportResultTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <TabsList>
          <TabsTrigger value="overview">Tổng quan</TabsTrigger>
          <TabsTrigger value="analysis">Phân tích</TabsTrigger>
          <TabsTrigger value="detail">Bảng chi tiết</TabsTrigger>
          <TabsTrigger value="materials">Vật tư</TabsTrigger>
          <TabsTrigger value="sources">Nguồn dữ liệu</TabsTrigger>
          <TabsTrigger value="insight">Nhận định</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Download className="w-4 h-4" />
          {result.title} · {result.periodLabel}
        </div>
      </div>

      <TabsContent value="overview" className="mt-4">
        <ReportOverviewCharts
          result={result}
          taskStatusChartData={taskStatusChartData}
          planPurposeChartData={planPurposeChartData}
        />
      </TabsContent>

      <TabsContent value="analysis" className="mt-4">
        <ReportAnalysisPanel
          taskStatusRows={result.taskStatusRows}
          planPurposeRows={result.planPurposeRows}
        />
      </TabsContent>

      <TabsContent value="detail" className="mt-4">
        <ReportDetailTable rows={result.tableRows} />
      </TabsContent>

      <TabsContent value="materials" className="mt-4">
        <ReportMaterialsTable rows={result.materialRows} />
      </TabsContent>

      <TabsContent value="sources" className="mt-4">
        <ReportSourcesPanel rows={result.sourceRows} />
      </TabsContent>

      <TabsContent value="insight" className="mt-4">
        <ReportInsightsPanel insights={result.insights} />
      </TabsContent>
    </Tabs>
  );
}
