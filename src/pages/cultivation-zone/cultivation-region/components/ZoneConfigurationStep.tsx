import { useFormContext, Controller } from "react-hook-form";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  ScrollArea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Droplets, Leaf, Search, Sprout } from "lucide-react";
import { useState } from "react";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useIrrigationSystems } from "@/features/master-data/hooks/useIrrigationSystems";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";

export const ZoneConfigurationStep = () => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext<CultivationZoneFormValues>();

  const [seedSearch, setSeedSearch] = useState("");
  const debouncedSearch = useDebounce(seedSearch, 500);

  // ─── Reference data ────────────────────────────────────────────────────
  const { items: farmingMethods, loading: fmLoading } = useCatalog(
    "farming-methods",
    { params: { size: 100, status: "active" } },
  );
  const { items: irrigationSystems, loading: irLoading } = useIrrigationSystems(
    { params: { size: 100 } },
  );
  const { items: allSeeds, loading: seedLoading } = useSeeds({
    params: {
      size: 100,
      keyword: debouncedSearch.trim() || undefined,
    },
  });

  const selectedFarmingMethodId = watch("farmingMethodId");
  const selectedSeedIds = watch("seedIds") ?? [];

  // Filter seeds from API
  const filteredSeeds = allSeeds;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Farming Method & Irrigation System ── */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Sprout className="w-4 h-4 text-green-600" />
              </div>
              <span>Phương pháp canh tác</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-5">
            {/* Farming Method */}
            <Controller
              control={control}
              name="farmingMethodId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Loại hình canh tác <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    disabled={fmLoading}
                    value={field.value > 0 ? field.value.toString() : ""}
                    onValueChange={(val) => {
                      field.onChange(parseInt(val, 10));
                    }}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn phương pháp..." />
                    </SelectTrigger>
                    <SelectContent>
                      {farmingMethods.map((method) => (
                        <SelectItem
                          key={method.id}
                          value={method.id.toString()}
                        >
                          <span className="font-medium">{method.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.farmingMethodId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.farmingMethodId.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Quyết định tiêu chuẩn sản xuất áp dụng
                  </p>
                </div>
              )}
            />

            {/* Irrigation System */}
            <Controller
              control={control}
              name="irrigationSystemId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hệ thống tưới tiêu <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    disabled={irLoading}
                    value={field.value > 0 ? field.value.toString() : ""}
                    onValueChange={(val) => {
                      field.onChange(parseInt(val, 10));
                    }}
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn phương pháp tưới..." />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationSystems.map((system) => (
                        <SelectItem
                          key={system.id}
                          value={system.id.toString()}
                        >
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span>{system.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.irrigationSystemId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.irrigationSystemId.message}
                    </p>
                  )}
                </div>
              )}
            />
          </CardContent>
        </Card>

        {/* ── Seed Selection ── */}
        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <span>Giống / Hạt giống</span>
              {selectedSeedIds.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-xs">
                  {selectedSeedIds.length} đã chọn
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
            {!selectedFarmingMethodId || selectedFarmingMethodId <= 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3 py-12">
                <Sprout className="w-10 h-10 opacity-50" />
                <span className="text-sm text-center px-4">
                  Vui lòng chọn phương pháp canh tác trước
                </span>
              </div>
            ) : (
              <Controller
                control={control}
                name="seedIds"
                render={({ field }) => {
                  const selectedIds = field.value ?? [];
                  const toggleSeed = (seedId: number) => {
                    field.onChange(
                      selectedIds.includes(seedId)
                        ? selectedIds.filter((id) => id !== seedId)
                        : [...selectedIds, seedId],
                    );
                  };

                  return (
                    <>
                      <div className="mb-4 relative">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                        <Input
                          value={seedSearch}
                          placeholder="Tìm kiếm hạt giống..."
                          onChange={(e) => setSeedSearch(e.target.value)}
                          className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                        />
                      </div>
                      <ScrollArea className="flex-1 h-80">
                        {seedLoading ? (
                          <div className="flex items-center justify-center text-muted-foreground text-sm py-10">
                            Đang tải...
                          </div>
                        ) : filteredSeeds.length > 0 ? (
                          <div className="w-full space-y-2">
                            {filteredSeeds.map((seed) => {
                              const isSelected = selectedIds.includes(seed.id);
                              return (
                                <div
                                  key={seed.id}
                                  onClick={() => toggleSeed(seed.id)}
                                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected
                                      ? "bg-green-50 border-green-300 shadow-sm"
                                      : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                                  }`}
                                >
                                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                    {seed.imageUrl ? (
                                      <img
                                        src={seed.imageUrl}
                                        alt={seed.cropVariety?.name ?? ""}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Leaf className="w-4 h-4 text-slate-400" />
                                    )}
                                  </div>
                                  <div className="flex flex-col flex-1 min-w-0">
                                    <div
                                      className={`text-sm font-semibold truncate ${
                                        isSelected
                                          ? "text-green-900"
                                          : "text-slate-700"
                                      }`}
                                    >
                                      {seed.cropVariety?.name ??
                                        `Seed #${seed.id}`}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-0.5">
                                      {seed.crop?.name}
                                      {seed.origin && (
                                        <span className="ml-1 text-slate-500">
                                          • {seed.origin}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${
                                      isSelected
                                        ? "bg-green-500 border-green-500"
                                        : "border-slate-300"
                                    }`}
                                  >
                                    {isSelected && (
                                      <CheckCircle2 className="w-4 h-4 text-white" />
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center text-muted-foreground text-sm italic py-10">
                            Không có hạt giống phù hợp
                          </div>
                        )}
                      </ScrollArea>
                    </>
                  );
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
