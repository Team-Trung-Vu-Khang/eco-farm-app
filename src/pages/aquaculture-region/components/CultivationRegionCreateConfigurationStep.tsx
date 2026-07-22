import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import type { CultivationRegionConfig } from "../../../stores/useCultivationRegionStore";
import type { SeedVarietySelection } from "../hooks/useCultivationRegionCreatePage";
import { SeedSelectorDialog } from "./index";

type Props = {
  entitiesCount: number;
  commonConfig: CultivationRegionConfig;
  availableCrops: Array<{
    id: string;
    crop: string;
    varietyName: string;
    illustration: string | File | null;
    seedType?: string;
  }>;
  cropSearchTerm: string;
  farmingMethods: Array<{ id: string; name: string }>;
  irrigationSystems: Array<{ id: string; name: string }>;
  seeds: Array<{ id: string; varietyName: string }>;
  seedDialogOpen: boolean;
  activeSeedVariety: SeedVarietySelection | null;
  applyToAllDialogOpen: boolean;
  setSeedDialogOpen: (open: boolean) => void;
  setApplyToAllDialogOpen: (open: boolean) => void;
  setCropSearchTerm: (value: string) => void;
  onUpdateConfig: (partial: Partial<CultivationRegionConfig>) => void;
  onToggleCrop: (cropId: string) => void;
  onSelectSeeds: (seedIds: string[]) => void;
  onApplyToAll: () => void;
};

export const CultivationRegionCreateConfigurationStep = ({
  entitiesCount,
  commonConfig,
  availableCrops,
  cropSearchTerm,
  farmingMethods,
  irrigationSystems,
  seeds,
  seedDialogOpen,
  activeSeedVariety,
  applyToAllDialogOpen,
  setSeedDialogOpen,
  setApplyToAllDialogOpen,
  setCropSearchTerm,
  onUpdateConfig,
  onToggleCrop,
  onSelectSeeds,
  onApplyToAll,
}: Props) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 gap-6">
        <div className="flex-1 min-w-0 space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Loại hình canh tác <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={commonConfig.farmingMethodId}
                    onValueChange={(value) =>
                      onUpdateConfig({ farmingMethodId: value })
                    }
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn phương pháp..." />
                    </SelectTrigger>
                    <SelectContent>
                      {farmingMethods.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <span className="font-medium">{method.name}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Quyết định danh sách cây trồng phù hợp
                  </p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hệ thống tưới tiêu <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={commonConfig.irrigationMethodId}
                    onValueChange={(value) =>
                      onUpdateConfig({ irrigationMethodId: value })
                    }
                  >
                    <SelectTrigger className="h-11 bg-white">
                      <SelectValue placeholder="Chọn phương pháp tưới..." />
                    </SelectTrigger>
                    <SelectContent>
                      {irrigationSystems.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            <Droplets className="w-4 h-4 text-blue-500" />
                            <span>{method.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setApplyToAllDialogOpen(true)}
                  disabled={entitiesCount <= 1}
                >
                  Đồng bộ cho tất cả mục
                </Button>

                <Dialog
                  open={applyToAllDialogOpen}
                  onOpenChange={setApplyToAllDialogOpen}
                >
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Sprout className="w-5 h-5 text-green-600" />
                        Xác nhận đồng bộ cấu hình
                      </DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                      <p className="text-sm text-slate-600 leading-relaxed">
                        Bạn có chắc chắn muốn áp dụng phương pháp canh tác, hệ
                        thống tưới và danh sách cây trồng hiện tại cho{" "}
                        <span className="font-bold text-slate-900">
                          tất cả {entitiesCount - 1} mục còn lại
                        </span>{" "}
                        không?
                      </p>
                      <p className="text-xs text-amber-600 mt-3 flex gap-2 items-start bg-amber-50 p-3 rounded-lg border border-amber-100">
                        <span className="shrink-0 font-bold italic">
                          Lưu ý:
                        </span>
                        Hành động này sẽ ghi đè lên các cấu hình đã thiết lập
                        trước đó của các mục khác.
                      </p>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                      <Button
                        variant="ghost"
                        onClick={() => setApplyToAllDialogOpen(false)}
                      >
                        Hủy bỏ
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={onApplyToAll}
                      >
                        Đồng ý áp dụng
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md bg-white flex flex-col xl:row-span-1">
              <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
                <CardTitle className="flex items-center gap-2 text-base">
                  <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <span>Giống cây trồng</span>
                  {commonConfig.farmingMethodId && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {availableCrops.length} loại
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 flex-1 flex flex-col min-h-0">
                {!commonConfig.farmingMethodId ? (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3 py-12">
                    <Sprout className="w-10 h-10 opacity-50" />
                    <span className="text-sm text-center px-4">
                      Vui lòng chọn phương pháp canh tác trước
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="mb-4 relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                      <Input
                        value={cropSearchTerm}
                        placeholder="Tìm kiếm giống cây trồng..."
                        onChange={(event) =>
                          setCropSearchTerm(event.target.value)
                        }
                        className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                      />
                    </div>
                    <ScrollArea className="flex-1 h-100">
                      {availableCrops.length > 0 ? (
                        <div className="w-full space-y-2">
                          {availableCrops.map((crop) => {
                            const isSelected = (
                              commonConfig.selectedCrops || []
                            ).includes(crop.id);

                            return (
                              <div
                                key={crop.id}
                                onClick={() => onToggleCrop(crop.id)}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                  isSelected
                                    ? "bg-green-50 border-green-300 shadow-sm"
                                    : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                                }`}
                              >
                                <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                  {crop.illustration ? (
                                    <img
                                      src={crop.illustration as string}
                                      alt={crop.varietyName}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <Leaf className="w-5 h-5" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col flex-1 shrink min-w-0">
                                  <div
                                    className={`text-sm shrink font-semibold truncate ${
                                      isSelected
                                        ? "text-green-900"
                                        : "text-slate-700"
                                    }`}
                                  >
                                    {crop.varietyName}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5 shrink">
                                    {crop.crop}
                                    {crop.seedType && (
                                      <span className="ml-1 text-slate-500">
                                        • {crop.seedType}
                                      </span>
                                    )}
                                  </div>
                                  {commonConfig.seedSelections?.[crop.id] &&
                                    commonConfig.seedSelections[crop.id]
                                      .length > 0 && (
                                      <div className="mt-1.5 flex flex-wrap gap-1.5 min-w-0">
                                        {commonConfig.seedSelections[
                                          crop.id
                                        ].map((seedId) => {
                                          const seed = seeds.find(
                                            (item) => item.id === seedId,
                                          );
                                          if (!seed) return null;

                                          return (
                                            <Badge
                                              key={seedId}
                                              variant="secondary"
                                              className="whitespace-normal wrap-break-word h-auto py-0.5 leading-tight bg-primary/5 text-primary border-primary/20 text-[10px] px-1.5 font-semibold max-w-full truncate"
                                            >
                                              Hạt giống: {seed.varietyName}
                                            </Badge>
                                          );
                                        })}
                                      </div>
                                    )}
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
                          Không có giống cây phù hợp
                        </div>
                      )}
                    </ScrollArea>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <SeedSelectorDialog
        isOpen={seedDialogOpen}
        onOpenChange={setSeedDialogOpen}
        variety={activeSeedVariety}
        selectedSeedIds={
          activeSeedVariety?.id
            ? commonConfig.seedSelections?.[activeSeedVariety?.id]
            : []
        }
        onSelect={onSelectSeeds}
      />
    </div>
  );
};
