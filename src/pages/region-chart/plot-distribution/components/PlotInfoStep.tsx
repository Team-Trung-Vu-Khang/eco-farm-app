import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Badge,
  Button,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Layers, MapPin, Trash2 } from "lucide-react";
import { useFormContext } from "react-hook-form";
import type { PlotFormValues } from "../data/plot-form.schema";
import { useRegions } from "@/features/farm/hooks/useRegions";
import { useAreaById } from "@/features/farm/hooks/useAreas";
import { OrganizationSelector } from "@/pages/cultivation-zone/cultivation-region/components";
import { PlotLocationSelector } from "./PlotLocationSelector";

interface PlotInfoStepProps {
  showEnterprise?: boolean;
}

export function PlotInfoStep({
  showEnterprise = false,
}: PlotInfoStepProps = {}) {
  const { control, watch, setValue } = useFormContext<PlotFormValues>();
  const enterpriseId = watch("enterpriseId");
  const regionId = watch("regionId");
  const areaId = watch("areaId");

  const { data: regionsData } = useRegions({
    params: { size: 100 },
  });
  const regions = regionsData?.content || [];

  const { data: selectedArea } = useAreaById(areaId || 0, {
    enabled: !!areaId,
  });

  const mappedRegions = useMemo(() => {
    return regions.map((r) => ({
      ...r,
      subAreas: (r.areas || []).map((a) => ({
        ...a,
        area: a.acreage,
        coordinates: (a.boundary || []).map((b) => ({
          lat: b.latitude || 0,
          lng: b.longitude || 0,
        })),
        plots: (a.plots || []).map((p) => ({
          ...p,
          area: p.acreage,
          coordinates: (p.boundary || []).map((pb) => ({
            lat: pb.latitude || 0,
            lng: pb.longitude || 0,
          })),
        })),
      })),
    }));
  }, [regions]);

  const region = useMemo(() => {
    return mappedRegions.find((r) => r.id === regionId);
  }, [mappedRegions, regionId]);

  return (
    <Card className="overflow-hidden shadow-md bg-white">
      <CardHeader>
        <CardTitle>Thông tin lô</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Cột 1: Vùng trồng & Khu vực (và Đơn vị sở hữu nếu có) */}
          <div className="space-y-4">
            {showEnterprise && (
              <FormField
                control={control}
                name="enterpriseId"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-bold text-slate-700">
                      Đơn vị sở hữu <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <OrganizationSelector
                        selectedId={field.value?.toString() ?? ""}
                        onSelect={(val) => {
                          field.onChange(val ? Number(val) : undefined);
                          setValue("regionId", undefined as any);
                          setValue("areaId", undefined as any);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="space-y-2">
              <Label className="text-sm font-bold text-slate-700">
                Vùng trồng &amp; Khu vực <span className="text-red-500">*</span>
              </Label>
              <PlotLocationSelector
                regions={regions}
                showEnterprise={showEnterprise}
                selectedRegionId={regionId}
                enterpriseId={enterpriseId ?? null}
                selectedAreaId={areaId ? String(areaId) : null}
                selectedAreaName={selectedArea?.name}
                onSelect={(selectedRegId, selectedArId) => {
                  setValue("regionId", selectedRegId);
                  setValue("areaId", Number(selectedArId));
                }}
              />
            </div>

            {/* Selection card + map preview */}
            {regionId && areaId && (
              <div className="space-y-3">
                {/* SelectionCard */}
                <div className="bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition-all group animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                  <div className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2.5 rounded-xl shrink-0 bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors duration-300">
                        <Layers className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <Badge
                            variant="outline"
                            className="text-[10px] uppercase font-bold tracking-wider py-0 px-1.5 h-4 border-primary/20 text-primary bg-primary/5"
                          >
                            Khu vực
                          </Badge>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                            onClick={() => {
                              setValue("regionId", undefined as any);
                              setValue("areaId", undefined as any);
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                        <div className="font-bold text-slate-900 text-sm mb-1">
                          {selectedArea?.name || "—"}
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate uppercase tracking-wider font-medium">
                          ID: {areaId}
                        </div>
                      </div>
                    </div>

                    {/* Hierarchy tree */}
                    <div className="mt-4 pt-3 border-t border-slate-100">
                      <div className="mt-2 ml-3 relative">
                        <div className="absolute left-0 top-0 bottom-4 w-px bg-slate-200" />
                        <div className="space-y-4">
                          {/* Region Level */}
                          <div className="flex items-center gap-3 relative z-10 pl-4">
                            <div className="absolute left-0 w-4 h-px bg-slate-200 top-1/2" />
                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shadow-xs shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            </div>
                            <div>
                              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none mb-1">
                                Vùng trồng
                              </div>
                              <div className="text-xs font-bold text-slate-700">
                                {region?.name}
                              </div>
                            </div>
                          </div>

                          {/* Area Level */}
                          <div className="relative pl-4">
                            <div className="absolute left-0 w-4 h-px bg-slate-200 top-4" />
                            <div className="pl-4">
                              <div className="flex items-center gap-3 relative z-10 py-1">
                                <div className="w-8 h-8 rounded-lg border bg-primary/5 border-primary/20 flex items-center justify-center shadow-xs shrink-0">
                                  <Layers className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div>
                                  <div className="text-[10px] text-primary/60 font-bold uppercase tracking-wider leading-none mb-1">
                                    Khu vực
                                  </div>
                                  <div className="text-xs font-bold text-slate-900">
                                    {selectedArea?.name}
                                  </div>
                                </div>
                                {selectedArea?.acreage != null && (
                                  <Badge className="ml-auto bg-emerald-100 text-emerald-700 border-none text-[10px]">
                                    {selectedArea.acreage} ha
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state when nothing selected */}
            {(!regionId || !areaId) && (
              <div className="flex flex-col items-center justify-center py-6 px-4 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50 text-center gap-2 animate-in fade-in duration-500">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-slate-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="text-[11px] font-bold text-slate-500">
                  Chưa chọn vùng trồng và khu vực
                </div>
              </div>
            )}
          </div>

          {/* Cột 2: Tên lô và Diện tích */}
          <div className="space-y-4">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-slate-700">
                    Tên lô <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Ví dụ: Lô Sầu Riêng 1" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="acreage"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-sm font-bold text-slate-700">
                    Diện tích (ha) <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="contourInterval"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold text-slate-700">
                  Đường bình độ
                </FormLabel>
                <FormControl>
                  <Input {...field} placeholder="100m" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="elevation"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="text-sm font-bold text-slate-700">
                  Độ cao (m)
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || undefined)
                    }
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
