import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Folder } from "lucide-react";

interface TreatmentSeverityStatsProps {
  severityCounts: Record<string, number>;
  severityConfig: Record<
    string,
    {
      label: string;
      strategy: string;
      iconColor: string;
      gradient: string;
    }
  >;
}

export function TreatmentSeverityStats({
  severityCounts,
  severityConfig,
}: TreatmentSeverityStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {(Object.entries(severityConfig) as [string, (typeof severityConfig)[string]][]).map(
        ([key, config]) => (
          <Card
            key={key}
            className={`bg-gradient-to-r ${config.gradient} shadow-sm overflow-hidden border-2`}
          >
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl ${config.iconColor} ring-1`}>
                  <Folder className="w-5 h-5" />
                </div>
                <p className="text-2xl font-bold font-display text-gray-900 leading-none">
                  {severityCounts[key] || 0}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-bold text-gray-800 tracking-tight">
                  Mức độ: {config.label.split(" - ")[1]}
                </p>
                <p className="text-[10px] font-medium text-gray-500 uppercase leading-none">
                  ({config.strategy})
                </p>
              </div>
            </CardContent>
          </Card>
        ),
      )}
    </div>
  );
}
