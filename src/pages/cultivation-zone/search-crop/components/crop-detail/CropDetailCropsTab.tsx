import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  TabsContent,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  ChevronRight,
  Droplets,
  Layers,
  Leaf,
  Maximize2,
  Sprout,
} from "lucide-react";
import type { CropDetailCropsProps } from "./types";

export const CropDetailCropsTab = ({
  details,
  filteredTechnicalCrops,
  groupedCrops,
}: CropDetailCropsProps) => {
  return (
    <TabsContent value="crops" className="space-y-6">
      <Card className="overflow-hidden border-slate-200 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 border-b bg-slate-50 px-6 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-primary/20 bg-primary/10 text-primary shadow-sm">
            <Sprout className="h-6 w-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-slate-900">
              Cấu hình kỹ thuật & Cây trồng
            </CardTitle>
            <div className="text-xs text-muted-foreground">
              Quy chuẩn kỹ thuật áp dụng thống nhất cho toàn bộ vùng canh tác
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            <div className="space-y-6 lg:col-span-3">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="h-1 w-1 rounded-full bg-primary" />
                Cấu hình kỹ thuật
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                    <Droplets className="h-3.5 w-3.5" />
                    Hệ thống tưới tiêu
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 shadow-inner">
                      <Droplets className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {details.technicalConfig.irrigationMethod?.name ||
                          "Chưa thiết lập"}
                      </div>
                      <div className="text-[10px] font-medium text-blue-600/70">
                        Tiêu chuẩn hệ thống
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-orange-50/30 p-4 shadow-sm transition-all hover:shadow-md">
                  <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600">
                    <Sprout className="h-3.5 w-3.5" />
                    Phương pháp canh tác
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-orange-600 shadow-inner">
                      <Leaf className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-900">
                        {details.technicalConfig.farmingMethod?.name ||
                          "Chưa thiết lập"}
                      </div>
                      <div className="text-[10px] font-medium text-orange-600/70">
                        Quy trình canh tác
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-8 lg:col-span-9">
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <span className="h-1 w-1 rounded-full bg-green-500" />
                Danh sách giống cây trồng & Hạt giống (
                {filteredTechnicalCrops.length})
              </div>

              {Object.entries(groupedCrops).map(([cropName, crops]) => (
                <div key={cropName} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-green-700">
                      {cropName}
                    </div>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>

                  <div className="grid grid-cols-1 gap-6 pl-4 md:grid-cols-2">
                    {crops.map((crop) => (
                      <div key={crop.id} className="group relative">
                        <div className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:border-primary/40 hover:bg-slate-50/50 hover:shadow-md">
                          <div className="relative flex items-start gap-4 p-4">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border bg-slate-50">
                              {crop.illustration ? (
                                <img
                                  src={crop.illustration}
                                  alt={crop.varietyName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Leaf className="absolute inset-0 m-auto h-6 w-6 text-slate-300" />
                              )}
                            </div>
                            <div className="flex-1 pt-1">
                              <div className="flex items-start justify-between">
                                <div className="mb-1 font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary">
                                  {crop.varietyName}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="-mr-1 -mt-1 h-8 w-8 text-slate-400 hover:text-primary"
                                  onClick={() =>
                                    window.open(`/variety/${crop.id}`, "_blank")
                                  }
                                >
                                  <Maximize2 className="h-4 w-4" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-2">
                                {crop.seedType && (
                                  <Badge
                                    variant="outline"
                                    className="h-4 border-primary/20 px-1.5 py-0 text-[9px] font-medium text-primary"
                                  >
                                    {crop.seedType}
                                  </Badge>
                                )}
                                <span className="text-[10px] italic text-muted-foreground">
                                  Mã: {crop.varietyCode || crop.id}
                                </span>
                              </div>
                            </div>
                          </div>

                          {!!crop.selectedSeeds?.length && (
                            <div className="space-y-3 border-t border-slate-100 bg-slate-50/80 p-4">
                              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                <Layers className="h-3 w-3 text-primary" />
                                Hạt giống sử dụng
                              </div>
                              <div className="space-y-2">
                                {crop.selectedSeeds.map((seed) => (
                                  <div
                                    key={seed.id}
                                    className="group/seed flex cursor-pointer items-center gap-3 rounded-xl border border-slate-100 bg-white p-2 transition-all hover:border-primary/30"
                                    onClick={() =>
                                      window.open(`/seed/${seed.id}`, "_blank")
                                    }
                                  >
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                    <div className="flex-1">
                                      <div className="text-xs font-bold text-slate-800 transition-colors group-hover/seed:text-primary">
                                        {seed.varietyName}
                                      </div>
                                      {seed.origin && (
                                        <div className="text-[9px] text-muted-foreground">
                                          Nguồn gốc: {seed.origin}
                                        </div>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="secondary"
                                        className="h-4 border bg-slate-50 px-1 text-[8px] text-slate-500"
                                      >
                                        Chi tiết
                                      </Badge>
                                      <ChevronRight className="h-3 w-3 text-slate-300 transition-colors group-hover/seed:text-primary" />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {filteredTechnicalCrops.length === 0 && (
                <div className="rounded-3xl border-2 border-dashed bg-slate-50/50 py-12 text-center italic text-muted-foreground">
                  Chưa chọn giống cây trồng cho vùng này
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};
