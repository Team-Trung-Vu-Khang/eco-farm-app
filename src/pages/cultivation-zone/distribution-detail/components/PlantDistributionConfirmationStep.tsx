import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2 } from "lucide-react";
import { type DistributionMethod, type DistributionScope, MOCK_SEEDS, type PlantEntry, type PlantLocation, type RowConfig } from "../constants";

type RegionLike = { name: string };
type AreaLike = { id: string | number; name: string };
type PlotLike = { id: string; name: string };

type Props = {
  scope: DistributionScope;
  distributionMethod: DistributionMethod;
  selectedRegion?: RegionLike;
  selectedAreas: AreaLike[];
  selectedPlots: PlotLike[];
  plantEntries: PlantEntry[];
  rowConfigs: RowConfig[];
  plantLocations: PlantLocation[];
  totalPlants: number;
};

export const PlantDistributionConfirmationStep = ({
  scope,
  distributionMethod,
  selectedRegion,
  selectedAreas,
  selectedPlots,
  plantEntries,
  rowConfigs,
  plantLocations,
  totalPlants,
}: Props) => {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl mx-auto">
      <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center relative overflow-hidden">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm relative z-10">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-green-900 z-10 relative">
          Xác nhận thông tin phân bổ
        </h3>
        <p className="text-green-700/80 mt-2 z-10 relative max-w-lg mx-auto">
          Kiểm tra kỹ thông tin trước khi lưu. Hệ thống sẽ tạo {totalPlants} cây
          trồng với định vị GPS.
        </p>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-500 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-green-600 rounded-full blur-3xl" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4">
            <h4 className="font-semibold text-slate-800">Phạm vi</h4>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground w-1/3">Loại</td>
                  <td className="py-3 px-4 font-medium">
                    <Badge variant="outline" className="capitalize">
                      {scope === "region"
                        ? "Vùng trồng"
                        : scope === "area"
                          ? "Khu vực"
                          : "Lô đất"}
                    </Badge>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Vùng</td>
                  <td className="py-3 px-4 font-medium">{selectedRegion?.name}</td>
                </tr>
                {scope === "area" && (
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground">Khu vực</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {selectedAreas.map((area) => (
                          <Badge key={area.id} variant="secondary">
                            {area.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                {scope === "plot" && (
                  <tr className="border-b">
                    <td className="py-3 px-4 text-muted-foreground">Lô</td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {selectedPlots.map((plot) => (
                          <Badge key={plot.id} variant="secondary">
                            {plot.name}
                          </Badge>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4">
            <h4 className="font-semibold text-slate-800">Phân bổ</h4>
          </div>
          <div className="p-0">
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground w-1/3">
                    Phương thức
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {distributionMethod === "zone" ? "Theo vùng" : "Theo hàng"}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Hạt giống</td>
                  <td className="py-3 px-4 font-medium">
                    {
                      Array.from(
                        new Set(
                          (distributionMethod === "zone" ? plantEntries : rowConfigs)
                            .map((item) => item.seedId)
                            .filter(Boolean),
                        ),
                      ).length
                    }{" "}
                    loại
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3 px-4 text-muted-foreground">Tổng cây</td>
                  <td className="py-3 px-4 font-medium text-green-600">
                    {totalPlants} cây
                  </td>
                </tr>
                <tr>
                  <td className="py-3 px-4 text-muted-foreground">Định vị GPS</td>
                  <td className="py-3 px-4 font-medium">
                    {plantLocations.length > 0 ? (
                      <Badge className="bg-green-100 text-green-700">Đã tạo</Badge>
                    ) : (
                      <Badge variant="secondary">Chưa tạo</Badge>
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {distributionMethod === "zone" && plantEntries.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4">
            <h4 className="font-semibold text-slate-800">Chi tiết cây trồng</h4>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {plantEntries.map((entry, index) => {
                const seed = MOCK_SEEDS.find((item) => item.id === entry.seedId);

                return (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{entry.variety}</div>
                        <div className="text-xs text-muted-foreground">{seed?.name}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{entry.quantity} cây</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {distributionMethod === "row" && rowConfigs.length > 0 && (
        <Card className="border-slate-200 shadow-sm">
          <div className="bg-slate-50 border-b p-4">
            <h4 className="font-semibold text-slate-800">Chi tiết theo hàng</h4>
          </div>
          <CardContent className="pt-4">
            <div className="space-y-2">
              {rowConfigs.map((row) => {
                const seed = MOCK_SEEDS.find((item) => item.id === row.seedId);

                return (
                  <div
                    key={row.id}
                    className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-bold text-sm">
                        {row.rowNumber}
                      </div>
                      <div>
                        <div className="font-medium">{row.variety}</div>
                        <div className="text-xs text-muted-foreground">{seed?.name}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{row.quantity} cây</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
