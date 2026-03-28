import { Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { treatmentStatCards } from "../data/soilAmendmentTreatmentConfig";

interface SoilTreatmentStatsProps {
  stats: {
    completed: number;
    inProgress: number;
    planning: number;
  };
}

export function SoilTreatmentStats({ stats }: SoilTreatmentStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {treatmentStatCards.map((item) => {
        const Icon = item.icon;
        const value = stats[item.key];

        return (
          <Card key={item.key} className={`${item.wrapperClassName} shadow-sm`}>
            <CardContent className="flex items-center gap-4 p-4">
              <div className={`rounded-full p-3 ${item.iconClassName}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold text-gray-900">
                  {value}
                </p>
                <p
                  className={`text-xs font-medium uppercase tracking-wide ${item.textClassName}`}
                >
                  {item.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
