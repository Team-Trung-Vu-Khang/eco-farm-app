import React, { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Sprout,
  Globe,
  CheckCircle2,
  Beaker,
  AlertTriangle,
  Droplets,
  Leaf,
  Maximize2,
  Layers,
  ChevronRight,
} from "lucide-react";
import type { CultivationRegionDetails } from "../../useCultivationRegionDetail";

interface CropsTabProps {
  details: CultivationRegionDetails;
}

export const CropsTab = ({ details }: CropsTabProps) => {
  const groupedCrops = useMemo(() => {
    const crops = details?.technicalConfig?.crops;
    if (!crops) return {};

    return crops.reduce(
      (acc: Record<string, any[]>, crop: any) => {
        const cropName = crop.crop || "Khác";
        if (!acc[cropName]) acc[cropName] = [];
        acc[cropName].push(crop);
        return acc;
      },
      {} as Record<string, any[]>,
    );
  }, [details]);

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b py-4 px-6 flex flex-row items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-sm border border-primary/20">
          <Sprout className="w-6 h-6" />
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
        {/* Region-Level Crop Health Overview */}
        {/* <div className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)]" />
            Tổng quan tình trạng cây trồng (Toàn vùng)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Tổng số cây
                </div>
                <div className="text-3xl font-black text-slate-800 tabular-nums mb-1">
                  {details?.regionStats.total.toLocaleString()}
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  Toàn bộ diện tích canh tác
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-green-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Số cây khỏe
                </div>
                <div className="text-3xl font-black text-green-600 tabular-nums mb-1">
                  {details?.regionStats.healthy.toLocaleString()}
                </div>
                <Badge className="bg-green-50 text-green-600 border-green-100 text-[9px] font-black h-4 px-1.5">
                  {details &&
                    Math.round(
                      (details.regionStats.healthy /
                        details.regionStats.total) *
                        100,
                    )}
                  %
                </Badge>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-blue-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-[10px] text-blue-400 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <Beaker className="w-3.5 h-3.5" />
                  Đang chữa trị
                </div>
                <div className="text-3xl font-black text-blue-500 tabular-nums mb-1">
                  {details?.regionStats.treating.toLocaleString()}
                </div>
                <div className="text-[9px] text-slate-400 font-medium">
                  Theo dõi phục hồi
                </div>
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-50 rounded-full opacity-50 group-hover:scale-150 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="text-[10px] text-orange-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Số cây bệnh
                </div>
                <div className="text-3xl font-black text-orange-600 tabular-nums mb-1">
                  {details?.regionStats.diseased.toLocaleString()}
                </div>
                <Badge className="bg-orange-50 text-orange-600 border-orange-100 text-[9px] font-black h-4 px-1.5">
                  Cảnh báo
                </Badge>
              </div>
            </div>
          </div>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Technical Configs */}
          <div className="lg:col-span-3 space-y-6">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-primary" />
              Cấu hình kỹ thuật
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl border bg-blue-50/30 border-blue-100 shadow-sm transition-all hover:shadow-md">
                <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5" />
                  Hệ thống tưới tiêu
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-inner">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-base">
                      {details.technicalConfig.irrigationMethod?.name ||
                        "Chưa thiết lập"}
                    </div>
                    <div className="text-[10px] text-blue-600/70 font-medium">
                      Tiêu chuẩn hệ thống
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl border bg-orange-50/30 border-orange-100 shadow-sm transition-all hover:shadow-md">
                <div className="text-xs text-orange-600 font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Sprout className="w-3.5 h-3.5" />
                  Phương pháp canh tác
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center text-orange-600 shadow-inner">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-base">
                      {details.technicalConfig.farmingMethod?.name ||
                        "Chưa thiết lập"}
                    </div>
                    <div className="text-[10px] text-orange-600/70 font-medium">
                      Quy trình canh tác
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Selected Crops */}
          <div className="lg:col-span-9 space-y-8">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-green-500" />
              Danh sách giống cây trồng & Hạt giống (
              {details.technicalConfig.crops.length})
            </div>

            {Object.entries(groupedCrops).map(([cropName, crops]) => (
              <div key={cropName} className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-widest">
                    {cropName}
                  </div>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-4">
                  {crops.map((crop) => (
                    <div key={crop.id} className="relative group">
                      <div className="flex flex-col border rounded-2xl bg-white hover:border-primary/40 hover:bg-slate-50/50 transition-all shadow-sm hover:shadow-md overflow-hidden">
                        <div className="flex items-start gap-4 p-4 relative">
                          <div className="w-16 h-16 rounded-2xl bg-slate-50 overflow-hidden shrink-0 border relative">
                            {crop.illustration ? (
                              <img
                                src={crop.illustration as string}
                                alt={crop.varietyName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Leaf className="w-6 h-6 text-slate-300 m-auto absolute inset-0" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start">
                              <div className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-primary transition-colors">
                                {crop.varietyName}
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-400 hover:text-primary -mt-1 -mr-1"
                                onClick={() =>
                                  window.open(`/variety/${crop.id}`, "_blank")
                                }
                              >
                                <Maximize2 className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex items-center gap-2">
                              {crop.seedType && (
                                <Badge
                                  variant="outline"
                                  className="text-[9px] px-1.5 py-0 h-4 border-primary/20 text-primary font-medium"
                                >
                                  {crop.seedType}
                                </Badge>
                              )}
                              <span className="text-[10px] text-muted-foreground italic">
                                Mã: {crop.varietyCode || crop.id}
                              </span>
                            </div>
                          </div>
                        </div>

                        {crop.selectedSeeds &&
                          crop.selectedSeeds.length > 0 && (
                            <div className="bg-slate-50/80 border-t border-slate-100 p-4 space-y-3">
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-2">
                                <Layers className="w-3 h-3 text-primary" />
                                Hạt giống sử dụng
                              </div>
                              <div className="space-y-2">
                                {crop.selectedSeeds.map((seed: any) => (
                                  <div
                                    key={seed.id}
                                    className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-100 group/seed hover:border-primary/30 transition-all cursor-pointer"
                                    onClick={() =>
                                      window.open(`/seed/${seed.id}`, "_blank")
                                    }
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                                    <div className="flex-1">
                                      <div className="text-xs font-bold text-slate-800 group-hover/seed:text-primary transition-colors">
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
                                        className="text-[8px] bg-slate-50 border h-4 px-1 text-slate-500"
                                      >
                                        Chi tiết
                                      </Badge>
                                      <ChevronRight className="w-3 h-3 text-slate-300 group-hover/seed:text-primary transition-colors" />
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

            {details.technicalConfig.crops.length === 0 && (
              <div className="py-12 text-center text-muted-foreground italic border-2 border-dashed rounded-3xl bg-slate-50/50">
                Chưa chọn giống cây trồng cho vùng này
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
