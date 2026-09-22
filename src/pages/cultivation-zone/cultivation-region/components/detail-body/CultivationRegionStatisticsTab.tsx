import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, BarChart3, FlaskConical } from "lucide-react";
import type { CultivationRegionDetailBodyCommonProps } from "./types";

const formatNumber = (value?: number | null) =>
  value == null ? "—" : value.toLocaleString("vi-VN");

const formatDecimal = (value?: number | null, suffix = "") =>
  value == null ? "—" : `${value.toLocaleString("vi-VN")}${suffix}`;

export const CultivationRegionStatisticsTab = ({
  details,
}: CultivationRegionDetailBodyCommonProps) => {
  const { regionStats } = details;
  const soil = regionStats.soil;

  const hasHealthData = regionStats.total > 0;
  const healthyPct =
    regionStats.total > 0
      ? ((regionStats.healthy / regionStats.total) * 100).toFixed(1)
      : null;

  return (
    <div className="space-y-6">
      {/* Health counts */}
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Tình trạng sinh trưởng
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!hasHealthData ? (
            <div className="text-sm text-muted-foreground italic">
              Chưa có dữ liệu thống kê cho vùng canh tác này.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Tổng số</div>
                <div className="mt-1 text-2xl font-bold text-slate-900">
                  {formatNumber(regionStats.total)}
                </div>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50/50 p-4">
                <div className="text-xs text-emerald-700">Khỏe mạnh</div>
                <div className="mt-1 text-2xl font-bold text-emerald-700">
                  {formatNumber(regionStats.healthy)}
                </div>
                {healthyPct && (
                  <div className="text-xs text-emerald-600">{healthyPct}%</div>
                )}
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-4">
                <div className="text-xs text-amber-700">Đang xử lý</div>
                <div className="mt-1 text-2xl font-bold text-amber-700">
                  {formatNumber(regionStats.treating)}
                </div>
              </div>
              <div className="rounded-lg border border-sky-100 bg-sky-50/50 p-4">
                <div className="text-xs text-sky-700">Đã thu hoạch</div>
                <div className="mt-1 text-2xl font-bold text-sky-700">
                  {formatNumber(regionStats.harvested)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Soil metrics */}
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Chỉ số đất
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {!soil ? (
            <div className="text-sm text-muted-foreground italic">
              Chưa có dữ liệu chỉ số đất.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Độ pH</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.ph)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Nhiệt độ</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.temperature, "°C")}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Độ ẩm</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.moisturePct, "%")}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Chất hữu cơ</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.organicMatterPct, "%")}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Đạm (N)</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.nitrogen)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Lân (P)</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.phosphorus)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Kali (K)</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.potassium)}
                </div>
              </div>
              <div className="rounded-lg border p-4">
                <div className="text-xs text-muted-foreground">Độ nén</div>
                <div className="mt-1 text-lg font-bold text-slate-900">
                  {formatDecimal(soil.compaction)}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Harvest volumes are not yet available from a zone-scoped API */}
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Sản lượng thu hoạch
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground italic">
            Đang cập nhật — chưa có API sản lượng theo vùng canh tác.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
