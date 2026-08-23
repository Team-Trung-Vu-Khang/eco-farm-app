import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin, Target } from "lucide-react";
import type { CultivationRegionDetailBodyCommonProps } from "./types";

const getScopeLabel = (scope: string) => {
  if (scope === "region") return "Vùng trồng";
  if (scope === "area") return "Khu vực";
  return "Lô đất";
};

export const CultivationRegionOverviewTab = ({
  area,
  details,
  primaryManager,
}: CultivationRegionDetailBodyCommonProps) => {
  const primaryCrops = Array.from(
    new Set(details.technicalConfig.crops.map((crop) => crop.crop)),
  ).join(", ");

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b bg-slate-50">
          <CardTitle className="text-lg">Thông tin chi tiết</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-muted-foreground">Tên vùng</div>
              <div className="font-medium mt-1 text-slate-900">{area.name}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Mã số</div>
              <div className="font-mono mt-1 text-slate-900">{area.id}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Địa chỉ</div>
              <div className="font-medium mt-1 text-slate-900">
                {details.region?.address ||
                  details.enterprise?.address ||
                  "Đang cập nhật"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Phạm vi vùng canh tác
              </div>
              <Badge variant="outline" className="mt-1 capitalize">
                {getScopeLabel(area.scope)}
              </Badge>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">
                Tổng diện tích
              </div>
              <div className="font-medium mt-1 text-lg text-blue-600">
                {details.totalArea} ha
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">DT canh tác</div>
              <div className="font-medium mt-1 text-lg text-green-600">
                {(details.totalArea * 0.9).toFixed(1)} ha
              </div>
            </div>
            {/* <div>
              <div className="text-sm text-muted-foreground">Cây trồng chính</div>
              <div className="font-medium mt-1 text-slate-900">
                {primaryCrops || "Chưa xác định"}
              </div>
            </div> */}
            <div>
              <div className="text-sm text-muted-foreground">Loại đất</div>
              <div className="font-medium mt-1 text-slate-900">
                Đất đỏ Bazan
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Hệ thống tưới</div>
              <div className="font-medium mt-1 text-slate-900">
                {details.technicalConfig.irrigationMethod?.name ||
                  "Chưa thiết lập"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Người quản lý</div>
              <div className="font-medium mt-1 text-slate-900">
                {primaryManager?.fullName || "Chưa phân công"}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Ngày tạo</div>
              <div className="font-medium mt-1 text-slate-900">
                {new Date(area.createdAt).toLocaleDateString("vi-VN")}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Trạng thái</div>
              <div className="mt-1">
                <Badge
                  variant={area.status === "active" ? "default" : "secondary"}
                >
                  {area.status === "active" ? "Đang hoạt động" : "Tạm ngưng"}
                </Badge>
              </div>
            </div>
          </div>

          {area.note && (
            <div className="pt-4 border-t">
              <div className="text-sm text-muted-foreground">Ghi chú</div>
              <p className="mt-1 text-slate-700">{area.note}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {details.enterprise && (
          <Card>
            <CardHeader className="border-b bg-slate-50 py-3">
              <CardTitle className="text-base">Đơn vị sở hữu</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="font-semibold text-slate-900">
                {details.enterprise.name}
              </div>
              <div className="text-sm text-muted-foreground">
                {details.enterprise.code}
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {details.enterprise.address}
              </div>
            </CardContent>
          </Card>
        )}

        {details.selectedEntities.length > 0 && (
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="border-b bg-slate-50/50 py-3 px-4 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                Phạm vi vùng canh tác ({details.selectedEntities.length} mục)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="space-y-8">
                  {Object.values(details.groupedSelections).map((group) => (
                    <div key={group.region.id} className="relative">
                      <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shadow-sm">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-[10px] text-primary font-bold uppercase tracking-wider leading-none mb-1">
                            Vùng trồng
                          </div>
                          <div className="text-sm font-bold text-slate-900">
                            {group.region.name}
                          </div>
                        </div>
                      </div>

                      {area.scope !== "region" && (
                        <div className="ml-5 border-l-2 border-slate-100 pl-6 space-y-8">
                          {Object.values(group.areas).map((areaGroup) => (
                            <div
                              key={areaGroup.area?.id || "none"}
                              className="relative"
                            >
                              <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-5" />

                              {areaGroup.area ? (
                                <>
                                  <div className="flex items-center gap-3 mb-4 relative z-10">
                                    <div className="w-9 h-9 rounded-lg bg-blue-500 text-white flex items-center justify-center shadow-sm">
                                      <Layers className="w-4.5 h-4.5" />
                                    </div>
                                    <div>
                                      <div className="text-[10px] text-blue-500 font-bold uppercase tracking-wider leading-none mb-1">
                                        Khu vực
                                      </div>
                                      <div className="text-sm font-bold text-slate-900">
                                        {areaGroup.area.name}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="ml-4.5 border-l-2 border-slate-100 pl-6 space-y-4">
                                    {areaGroup.entities
                                      .filter(
                                        (entity) => entity.typeCode === "plot",
                                      )
                                      .map((plot) => (
                                        <div
                                          key={plot.id}
                                          className="relative flex items-center gap-3 py-1"
                                        >
                                          <div className="absolute -left-6.5 w-6 h-px bg-slate-200 top-1/2" />
                                          <div className="w-8 h-8 rounded-lg bg-green-500 text-white flex items-center justify-center shadow-xs">
                                            <Target className="w-4 h-4" />
                                          </div>
                                          <div className="flex-1">
                                            <div className="text-[10px] text-green-600 font-bold uppercase tracking-wider leading-none mb-1">
                                              Lô đất
                                            </div>
                                            <div className="text-sm font-bold text-slate-900">
                                              {plot.name}
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </>
                              ) : (
                                <div className="flex items-center gap-3 relative z-10 py-1">
                                  <div className="w-9 h-9 rounded-lg bg-slate-200 text-slate-700 flex items-center justify-center shadow-xs">
                                    <MapPin className="w-4.5 h-4.5" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider leading-none mb-1">
                                      Vùng trồng
                                    </div>
                                    <div className="text-sm font-bold text-slate-900">
                                      {group.region.name}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
