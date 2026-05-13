import { Activity, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { ReportInsight } from "../types";
import { getInsightToneIconName, getToneClass } from "../utils/ui";

interface ReportInsightsPanelProps {
  insights: ReportInsight[];
}

export function ReportInsightsPanel({ insights }: ReportInsightsPanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {insights.map((insight) => {
        const Icon = getInsightIcon(insight);

        return (
          <Card key={insight.id}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3">
                <div
                  className={`rounded-md border p-2 ${getToneClass(
                    insight.tone,
                  )}`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">
                    {insight.title}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {insight.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function getInsightIcon(insight: ReportInsight) {
  const iconName = getInsightToneIconName(insight);
  if (iconName === "success") return CheckCircle2;
  if (iconName === "alert") return AlertTriangle;
  return Activity;
}
