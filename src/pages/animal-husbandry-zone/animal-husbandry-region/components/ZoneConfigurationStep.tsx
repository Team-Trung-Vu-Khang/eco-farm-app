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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Droplets,
  Leaf,
  Search,
  Sprout,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useState, useMemo, useEffect, useRef } from "react";
import { useCatalog } from "@/features/foundation/hooks/useCatalog";
import { useIrrigationSystems } from "@/features/master-data/hooks/useIrrigationSystems";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import { useCropVarieties } from "@/features/foundation/hooks/useCropVarieties";
import { useFarmingMethodCrops } from "@/features/foundation/hooks/useFarmingMethodCrops";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
import { mapSeedToBreed } from "../constants";
import type { FoundationCropVarietyResponse } from "@/features/foundation/types/foundation.type";
import type { FarmSeedResponse } from "@/features/farm/types/farm.type";

const MOCK_BREEDS = [
  { name: "Heo Yorkshire", cropName: "Heo", origin: "Đan Mạch" },
  { name: "Heo Landrace", cropName: "Heo", origin: "Hà Lan" },
  { name: "Bò Holstein Friesian", cropName: "Bò", origin: "Mỹ" },
  { name: "Bò Brahman", cropName: "Bò", origin: "Ấn Độ" },
  { name: "Gà Ta thả vườn", cropName: "Gà", origin: "Việt Nam" },
  { name: "Gà Ri", cropName: "Gà", origin: "Việt Nam" },
  { name: "Vịt Bầu", cropName: "Vịt", origin: "Việt Nam" },
];

const mapVarietyToBreed = (variety: any): any => {
  if (!variety) return variety;
  const index = variety.id % MOCK_BREEDS.length;
  const breed = MOCK_BREEDS[index];
  return {
    ...variety,
    name: breed.name,
    origin: variety.origin || breed.origin,
    cropName: breed.cropName,
  };
};

interface BreedSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cropVarietyId: number;
  cropVarietyName: string;
  farmingMethodId?: number;
  selectedSeedIds: number[];
  onConfirm: (
    selectedIds: number[],
    selectedSeedObjects: FarmSeedResponse[],
  ) => void;
}

export const BreedSelectorDialog = ({
  open,
  onOpenChange,
  cropVarietyId,
  cropVarietyName,
  farmingMethodId,
  selectedSeedIds,
  onConfirm,
}: BreedSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(0);
  const [loadedSeeds, setLoadedSeeds] = useState<FarmSeedResponse[]>([]);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [tempSelectedObjects, setTempSelectedObjects] = useState<
    Record<number, FarmSeedResponse>
  >({});

  // Call API useSeeds with domainCode LIVESTOCK
  const {
    items: newSeeds,
    response,
    loading,
  } = useSeeds({
    params: {
      cropVarietyId,
      farmingMethodId,
      keyword: debouncedSearch.trim() || undefined,
      page,
      size: 20,
      status: "active" as any,
      domainCode: "LIVESTOCK",
    },
    enabled: open && !!cropVarietyId,
  });

  // Reset page and loaded items when search keyword or variety changes
  useEffect(() => {
    setPage(0);
    setLoadedSeeds([]);
  }, [debouncedSearch, cropVarietyId]);

  // Sync tempSelectedIds when dialog opens
  useEffect(() => {
    if (open) {
      setTempSelectedIds(selectedSeedIds);
    }
  }, [open, selectedSeedIds]);

  // Append new items to loadedSeeds list when they arrive
  useEffect(() => {
    if (newSeeds && newSeeds.length > 0) {
      const mapped = newSeeds.map(mapSeedToBreed);
      setLoadedSeeds((prev) => {
        const existingIds = new Set(prev.map((item) => item.id));
        const filtered = mapped.filter((item) => !existingIds.has(item.id));
        return [...prev, ...filtered];
      });

      // Also cache newly loaded seeds in tempSelectedObjects mapping so we can retrieve full objects on confirm
      setTempSelectedObjects((prev) => {
        const next = { ...prev };
        mapped.forEach((seed) => {
          next[seed.id] = seed;
        });
        return next;
      });
    }
  }, [newSeeds]);

  // IntersectionObserver for infinite scroll trigger
  const observerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!observerRef.current || !response || response.last || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, [response, loading]);

  const toggleSeed = (seed: FarmSeedResponse) => {
    setTempSelectedIds((prev) => {
      const isSelected = prev.includes(seed.id);
      if (isSelected) {
        return prev.filter((id) => id !== seed.id);
      } else {
        // Cache the full object to pass back on confirm
        setTempSelectedObjects((prevObjs) => ({
          ...prevObjs,
          [seed.id]: seed,
        }));
        return [...prev, seed.id];
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        onOpenChange(val);
        if (!val) {
          setSearchTerm("");
        }
      }}
    >
      <DialogContent className="max-w-xl p-0 overflow-hidden rounded-2xl border-none shadow-2xl flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 bg-slate-50 border-b shrink-0">
          <DialogTitle className="flex items-center gap-2 text-slate-800">
            <Sprout className="w-5 h-5 text-green-600" />
            <span>Chọn con giống cho {cropVarietyName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn các con giống/vật nuôi phù hợp để đưa vào phương án sản xuất
            của vùng chăn nuôi này.
          </p>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm con giống/vật nuôi..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 h-80">
          <div className="p-6 space-y-2">
            {loadedSeeds.map((seed) => {
              const isSelected = tempSelectedIds.includes(seed.id);
              return (
                <div
                  key={seed.id}
                  onClick={() => toggleSeed(seed)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all bg-white",
                    isSelected
                      ? "bg-green-50/50 border-green-300 shadow-sm"
                      : "border-slate-200 hover:border-green-200 hover:shadow-sm",
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                    {seed.imageUrl ? (
                      <img
                        src={seed.imageUrl}
                        alt={seed.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Leaf className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-semibold truncate",
                        isSelected ? "text-green-900" : "text-slate-700",
                      )}
                    >
                      {seed.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {seed.supplier?.name} {seed.origin && `• ${seed.origin}`}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      isSelected
                        ? "bg-green-500 border-green-500"
                        : "border-slate-300",
                    )}
                  >
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Anchor for IntersectionObserver */}
            <div ref={observerRef} className="h-2 w-full bg-transparent" />

            {loading && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-5 w-5 animate-spin text-green-600" />
              </div>
            )}

            {loadedSeeds.length === 0 && !loading && (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                Không tìm thấy con giống phù hợp
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 bg-slate-50 border-t flex justify-end gap-3 shrink-0">
          <Button
            variant="outline"
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={() => {
              // Extract the selected seed objects
              const selectedSeedObjs = tempSelectedIds
                .map((id) => tempSelectedObjects[id])
                .filter(Boolean);
              onConfirm(tempSelectedIds, selectedSeedObjs);
              onOpenChange(false);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold"
          >
            Xong
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const ZoneConfigurationStep = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CultivationZoneFormValues>();

  const [varietySearch, setVarietySearch] = useState("");
  const debouncedVarietySearch = useDebounce(varietySearch, 500);

  // ─── Reference data ────────────────────────────────────────────────────
  const { items: farmingMethods, loading: fmLoading } = useCatalog(
    "farming-methods",
    { params: { size: 100, status: "active" } },
  );
  const { items: irrigationSystems, loading: irLoading } = useIrrigationSystems(
    { params: { size: 100 } },
  );

  const selectedFarmingMethodId = watch("farmingMethodId");
  const selectedSeedIds = watch("seedIds") ?? [];

  // Fetch crop varieties and farming method crop assignments
  const { items: allCropVarieties, loading: varietiesLoading } =
    useCropVarieties({
      params: {
        size: 100,
        keyword: debouncedVarietySearch.trim() || undefined,
        status: "active",
      },
      enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
    });

  const { items: farmingMethodCrops, loading: fmcLoading } =
    useFarmingMethodCrops({
      params: {
        size: 100,
        status: "active",
      },
      enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
    });

  // Fetch all seeds (first 100 on load) to resolve seed names
  const { items: rawSeeds } = useSeeds({
    params: {
      size: 100,
      domainCode: "LIVESTOCK",
    },
    enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });
  const allSeeds = useMemo(() => rawSeeds.map(mapSeedToBreed), [rawSeeds]);

  // Dialog State
  const [activeVariety, setActiveVariety] =
    useState<FoundationCropVarietyResponse | null>(null);

  // Cache selected seeds' details locally to display outside the dialog
  const [selectedSeedsMap, setSelectedSeedsMap] = useState<
    Record<number, FarmSeedResponse>
  >({});

  // Merge loaded seeds from hook into state cache
  useEffect(() => {
    if (allSeeds && allSeeds.length > 0) {
      setSelectedSeedsMap((prev) => {
        const next = { ...prev };
        allSeeds.forEach((seed) => {
          next[seed.id] = seed;
        });
        return next;
      });
    }
  }, [allSeeds]);

  // Client-side filter crop varieties based on selected farming method
  const filteredCropVarieties = useMemo(() => {
    if (!selectedFarmingMethodId || selectedFarmingMethodId <= 0) return [];

    const activeMethodCrop = farmingMethodCrops.find(
      (item) => item.farmingMethodId === selectedFarmingMethodId,
    );

    if (!activeMethodCrop) return [];

    const allowedVarietyIds = new Set<number>();
    activeMethodCrop.crops?.forEach((crop) => {
      crop.varieties?.forEach((v) => {
        allowedVarietyIds.add(v.id);
      });
    });

    const mappedVarieties = allCropVarieties.map(mapVarietyToBreed);

    return mappedVarieties.filter((variety) =>
      allowedVarietyIds.has(variety.id),
    );
  }, [allCropVarieties, farmingMethodCrops, selectedFarmingMethodId]);

  const handleConfirmSeeds = (
    selectedIds: number[],
    selectedSeedObjects: FarmSeedResponse[],
  ) => {
    setValue("seedIds", selectedIds, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Add confirmed seeds to our details map
    setSelectedSeedsMap((prev) => {
      const next = { ...prev };
      selectedSeedObjects.forEach((seed) => {
        next[seed.id] = seed;
      });
      return next;
    });
  };

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
              <span>Phương pháp chăn nuôi</span>
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
                    Phương pháp chăn nuôi{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    disabled={fmLoading}
                    value={field.value > 0 ? field.value.toString() : ""}
                    onValueChange={(val) => {
                      field.onChange(parseInt(val, 10));
                      // Reset seeds when farming method changes
                      setValue("seedIds", []);
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
                    Quyết định tiêu chuẩn chăn nuôi áp dụng
                  </p>
                </div>
              )}
            />

            {/* Irrigation System */}
            {/* <Controller
              control={control}
              name="irrigationSystemId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Phương pháp tưới tiêu{" "}
                    <span className="text-red-500">*</span>
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
            /> */}
          </CardContent>
        </Card>

        {/* ── Seed Selection ── */}
        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <span>Con giống / Vật nuôi</span>
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
                  Vui lòng chọn phương pháp chăn nuôi trước
                </span>
              </div>
            ) : (
              <>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    value={varietySearch}
                    placeholder="Tìm kiếm giống vật nuôi..."
                    onChange={(e) => setVarietySearch(e.target.value)}
                    className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                  />
                </div>
                <ScrollArea className="flex-1 h-80">
                  {varietiesLoading || fmcLoading ? (
                    <div className="flex items-center justify-center text-muted-foreground text-sm py-10">
                      Đang tải...
                    </div>
                  ) : filteredCropVarieties.length > 0 ? (
                    <div className="w-full space-y-2">
                      {filteredCropVarieties.map((variety) => {
                        const varietySeeds = selectedSeedIds
                          .map((id) => selectedSeedsMap[id])
                          .filter(Boolean)
                          .filter(
                            (seed) => seed.cropVariety?.id === variety.id,
                          );

                        const hasSelected = varietySeeds.length > 0;

                        return (
                          <div
                            key={variety.id}
                            onClick={() => setActiveVariety(variety)}
                            className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                              hasSelected
                                ? "bg-green-50/30 border-green-300 shadow-sm"
                                : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                {variety.documents?.[0]?.fileUrl ? (
                                  <img
                                    src={variety.documents[0].fileUrl}
                                    alt={variety.name}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <Leaf className="w-4 h-4 text-slate-400" />
                                )}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate text-slate-700">
                                  {variety.name}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  Mã: {variety.code || "---"}{" "}
                                  {variety.origin &&
                                    `• Nguồn gốc: ${variety.origin}`}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {hasSelected && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 border-none font-semibold text-xs animate-in scale-in duration-200"
                                  >
                                    {varietySeeds.length} con giống
                                  </Badge>
                                )}
                                <ChevronRight className="w-4 h-4 text-slate-400" />
                              </div>
                            </div>

                            {hasSelected && (
                              <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                                {varietySeeds.map((seed) => (
                                  <Badge
                                    key={seed.id}
                                    variant="outline"
                                    className="bg-white border-slate-200 text-slate-600 text-[11px] py-1 px-2.5 rounded-md flex items-center gap-1.5 shadow-xs"
                                  >
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span>{seed.name}</span>
                                    {seed.origin && (
                                      <span className="text-[10px] text-slate-400">
                                        ({seed.origin})
                                      </span>
                                    )}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex items-center justify-center text-muted-foreground text-sm italic py-10">
                      Không có giống vật nuôi phù hợp
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {activeVariety && (
        <BreedSelectorDialog
          open={!!activeVariety}
          onOpenChange={(open) => {
            if (!open) setActiveVariety(null);
          }}
          cropVarietyId={activeVariety.id}
          cropVarietyName={activeVariety.name}
          farmingMethodId={selectedFarmingMethodId}
          selectedSeedIds={selectedSeedIds}
          onConfirm={(ids, seedObjects) => handleConfirmSeeds(ids, seedObjects)}
        />
      )}
    </div>
  );
};
