import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PieChart as PieChartIcon } from "lucide-react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { HARVEST_COLORS, top20FarmersHarvestShare } from "../constants";

export function FarmerHarvestShareChart() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="font-display flex items-center gap-2 text-base">
          <PieChartIcon className="w-5 h-5 text-emerald-600" />
          <span>Tỷ lệ sản lượng thu hoạch theo nông hộ</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Donut Chart (Left Column) */}
          <div className="md:col-span-5 h-[280px] w-full relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top20FarmersHarvestShare}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={105}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {top20FarmersHarvestShare.map((_, index) => (
                    <Cell
                      key={`harvest-cell-${index}`}
                      fill={HARVEST_COLORS[index % HARVEST_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, _name: string, props: any) => [
                    `${value}% (${props.payload.yieldTons} tấn)`,
                    props.payload.name,
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend List - Top 20 + Others (Right Column) */}
          <div className="md:col-span-7 space-y-1.5 max-h-[280px] overflow-y-auto pr-2 text-xs divide-y divide-slate-100 border-l pl-4 relative">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider py-1.5 flex items-center justify-between sticky top-0 bg-white z-10 border-b border-slate-100 shadow-xs">
              <span>Nông hộ / Hợp tác xã</span>
              <span>Tỷ lệ % (Sản lượng)</span>
            </div>
            {top20FarmersHarvestShare.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between pt-1.5 first:pt-1 hover:bg-slate-50 px-1 rounded transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{
                      backgroundColor:
                        HARVEST_COLORS[index % HARVEST_COLORS.length],
                    }}
                  />
                  <span
                    className="truncate font-medium text-slate-700"
                    title={item.name}
                  >
                    {item.name}
                  </span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-semibold text-slate-900">
                    {item.value}%
                  </span>
                  <span className="text-[11px] text-muted-foreground ml-1.5 font-medium">
                    ({item.yieldTons} tấn)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
