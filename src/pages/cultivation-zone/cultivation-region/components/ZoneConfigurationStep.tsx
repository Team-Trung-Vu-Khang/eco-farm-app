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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  cn,
  RemoteAutoCompleteSelect,
  Checkbox,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, Leaf, Search, Sprout } from "lucide-react";
import { useState, useMemo, useEffect, useCallback } from "react";
import {
  useProductionMethods,
  useMethodApplications,
  useCropVarieties,
} from "@/features/foundation";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import { useRearingMethods } from "@/features/master-data/hooks/useRearingMethods";
import { useDebounce } from "@/shared/hooks/useDebounce";

type SubjectVariantOption = {
  id: number;
  code?: string;
  name?: string;
};

type SeedSubjectGroup = {
  subjectId: number;
  subjectName?: string;
  subjectCode?: string;
  variants: SubjectVariantOption[];
};

interface SeedSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  varietyId: number;
  varietyName: string;
  selectedSeedIds: number[];
  onConfirm: (seedIds: number[], seedIdNameMap: Record<number, string>) => void;
}

export const SeedSelectorDialog = ({
  open,
  onOpenChange,
  varietyId,
  varietyName,
  selectedSeedIds = [],
  onConfirm,
}: SeedSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);

  // Fetch seeds of this variety
  const { items: seeds, loading } = useSeeds({
    params: {
      foundationSubjectVariantId: varietyId,
      status: "active",
      size: 100,
    },
    enabled: open && !!varietyId,
  });

  // Initialize tempSelectedIds with current selected seeds of this variety when dialog opens
  useEffect(() => {
    if (open && seeds.length > 0) {
      const seedIdsOfVariety = seeds.map((s) => s.id);
      const activeSeedIds = selectedSeedIds.filter((id) =>
        seedIdsOfVariety.includes(id),
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTempSelectedIds(activeSeedIds);
    }
  }, [open, seeds, selectedSeedIds]);

  const filteredSeeds = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase().trim();
    if (!keyword) return seeds;
    return seeds.filter(
      (s) =>
        s.name?.toLowerCase().includes(keyword) ||
        s.code?.toLowerCase().includes(keyword),
    );
  }, [seeds, debouncedSearch]);

  const toggleSeed = (id: number) => {
    setTempSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
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
            <span>Chọn hạt giống cho giống {varietyName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn các hạt giống cụ thể thuộc giống cây trồng này.
          </p>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm hạt giống..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 h-80">
          <div className="p-6 space-y-2">
            {loading ? (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                Đang tải danh sách hạt giống...
              </div>
            ) : (
              filteredSeeds.map((seed) => {
                const isSelected = tempSelectedIds.includes(seed.id);
                return (
                  <div
                    key={seed.id}
                    onClick={() => toggleSeed(seed.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all bg-white",
                      isSelected
                        ? "bg-green-50/50 border-green-300 shadow-sm"
                        : "border-slate-200 hover:border-green-200 hover:shadow-sm",
                    )}
                  >
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                      <Leaf className="w-4 h-4 text-slate-400" />
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
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        Nhà cung cấp: {seed.supplier?.name || "---"}
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
              })
            )}
            {!loading && filteredSeeds.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                Không tìm thấy hạt giống phù hợp
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
              const idNameMap: Record<number, string> = {};
              seeds.forEach((s) => {
                if (tempSelectedIds.includes(s.id)) {
                  idNameMap[s.id] = s.name || "";
                }
              });
              onConfirm(tempSelectedIds, idNameMap);
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

interface VarietyItemProps {
  varietyId: number;
  varietyName: string;
  showSeedSelection: boolean;
  useSpecificSeeds: boolean;
  selectedSeedIds: number[];
  onSelectSeeds: (
    seedIds: number[],
    allSeedsOfVariety: number[],
    seedIdNameMap: Record<number, string>,
  ) => void;
  isChecked: boolean;
  onToggle: (checked: boolean) => void;
  onValidityChange: (varietyId: number, isValid: boolean) => void;
}

export const VarietyItem = ({
  varietyId,
  varietyName,
  showSeedSelection,
  useSpecificSeeds,
  selectedSeedIds,
  onSelectSeeds,
  isChecked,
  onToggle,
  onValidityChange,
}: VarietyItemProps) => {
  const { items: seeds } = useSeeds({
    params: {
      foundationSubjectVariantId: varietyId,
      status: "active",
      size: 100,
    },
    enabled: isChecked && showSeedSelection && useSpecificSeeds,
  });

  const selectedSeedsForThisVariety = useMemo(() => {
    return seeds.filter((s) => selectedSeedIds.includes(s.id));
  }, [seeds, selectedSeedIds]);

  const isValid = useMemo(() => {
    return (
      !isChecked ||
      !showSeedSelection ||
      !useSpecificSeeds ||
      selectedSeedsForThisVariety.length > 0
    );
  }, [
    isChecked,
    showSeedSelection,
    useSpecificSeeds,
    selectedSeedsForThisVariety,
  ]);

  useEffect(() => {
    onValidityChange(varietyId, isValid);
    return () => {
      onValidityChange(varietyId, true);
    };
  }, [varietyId, isValid, onValidityChange]);

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleToggle = (checked: boolean) => {
    onToggle(checked);
    if (!checked) {
      const seedIdsOfVariety = seeds.map((s) => s.id);
      onSelectSeeds([], seedIdsOfVariety, {});
    }
  };

  return (
    <div className="space-y-2 border-t border-slate-100 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Checkbox
            checked={isChecked}
            onCheckedChange={(c) => handleToggle(!!c)}
          />
          <span className="text-xs font-semibold text-slate-700">
            {varietyName}
          </span>
        </div>
        {isChecked && showSeedSelection && useSpecificSeeds && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="text-[11px] font-bold text-green-700 border-green-200 hover:bg-green-50 rounded-md py-0.5 px-2 h-7"
          >
            Chọn hạt giống
          </Button>
        )}
      </div>

      {isChecked && showSeedSelection && useSpecificSeeds && (
        <div className="flex flex-wrap gap-2 pl-7 pt-1">
          {selectedSeedsForThisVariety.length > 0 ? (
            selectedSeedsForThisVariety.map((seed) => (
              <Badge
                key={seed.id}
                variant="outline"
                className="bg-white border-slate-200 text-slate-600 text-[10px] py-0.5 px-2 rounded flex items-center gap-1 shadow-xs cursor-pointer hover:border-green-300 transition-all"
                onClick={() => setDialogOpen(true)}
              >
                <div className="w-1 h-1 rounded-full bg-green-500" />
                <span>{seed.name}</span>
              </Badge>
            ))
          ) : (
            <span className="text-[11px] text-red-500 italic font-semibold flex items-center gap-1">
              ⚠️ Bắt buộc chọn hạt giống cụ thể
            </span>
          )}
        </div>
      )}

      {dialogOpen && (
        <SeedSelectorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          varietyId={varietyId}
          varietyName={varietyName}
          selectedSeedIds={selectedSeedIds}
          onConfirm={(newSeedIds, idNameMap) => {
            const seedIdsOfVariety = seeds.map((s) => s.id);
            onSelectSeeds(newSeedIds, seedIdsOfVariety, idNameMap);
          }}
        />
      )}
    </div>
  );
};

interface CropCardProps {
  cropId: number;
  cropName: string;
  showSeedSelection: boolean;
  useSpecificSeeds: boolean;
  selectedVarietyIds: number[];
  onToggleVariety: (
    varietyId: number,
    varietyName: string,
    checked: boolean,
    cropId: number,
  ) => void;
  selectedSeedIds: number[];
  onSelectSeedsForVariety: (
    varietyId: number,
    seedIds: number[],
    allSeedsOfVariety: number[],
    seedIdNameMap: Record<number, string>,
  ) => void;
  onVarietyValidityChange: (varietyId: number, isValid: boolean) => void;
  onRemoveCrop: () => void;
}

export const CropCard = ({
  cropId,
  cropName,
  showSeedSelection,
  useSpecificSeeds,
  selectedVarietyIds,
  onToggleVariety,
  selectedSeedIds,
  onSelectSeedsForVariety,
  onVarietyValidityChange,
  onRemoveCrop,
}: CropCardProps) => {
  const [varietySearch, setVarietySearch] = useState("");
  const debouncedVarietySearch = useDebounce(varietySearch, 250);

  const { items: varieties, loading } = useCropVarieties({
    params: {
      size: 100,
      status: "active",
      subjectId: cropId,
      domainCode: "CROP",
    },
    enabled: !!cropId,
  });

  const filteredVarieties = useMemo(() => {
    const kw = debouncedVarietySearch.toLowerCase().trim();
    if (!kw) return varieties;
    return varieties.filter(
      (v) =>
        v.name?.toLowerCase().includes(kw) ||
        v.code?.toLowerCase().includes(kw),
    );
  }, [varieties, debouncedVarietySearch]);

  return (
    <Card className="border border-slate-200 shadow-xs rounded-xl overflow-hidden bg-white">
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center shrink-0 border border-green-100 overflow-hidden">
              <Leaf className="w-4 h-4 text-green-600" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold truncate text-slate-700">
                {cropName}
              </span>
              <span className="text-xs text-muted-foreground mt-0.5">
                {varieties.length} giống cây trồng khả dụng
              </span>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemoveCrop}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg text-xs"
          >
            Xóa cây trồng
          </Button>
        </div>

        {loading ? (
          <div className="text-xs text-slate-400 italic">
            Đang tải giống cây trồng...
          </div>
        ) : varieties.length > 0 ? (
          <div className="space-y-3 pt-1">
            {/* Search input */}
            {varieties.length > 4 && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <Input
                  value={varietySearch}
                  onChange={(e) => setVarietySearch(e.target.value)}
                  placeholder="Tìm kiếm giống..."
                  className="pl-7 h-8 text-xs border-slate-200 bg-slate-50/50 focus:bg-white"
                />
              </div>
            )}

            <div className="space-y-0">
              {filteredVarieties.length > 0 ? (
                filteredVarieties.map((variety) => (
                  <VarietyItem
                    key={variety.id}
                    varietyId={variety.id}
                    varietyName={variety.name}
                    showSeedSelection={showSeedSelection}
                    useSpecificSeeds={useSpecificSeeds}
                    selectedSeedIds={selectedSeedIds}
                    isChecked={selectedVarietyIds.includes(variety.id)}
                    onToggle={(checked) =>
                      onToggleVariety(variety.id, variety.name, checked, cropId)
                    }
                    onSelectSeeds={(newSeedIds, allSeedsOfVariety, idNameMap) =>
                      onSelectSeedsForVariety(
                        variety.id,
                        newSeedIds,
                        allSeedsOfVariety,
                        idNameMap,
                      )
                    }
                    onValidityChange={onVarietyValidityChange}
                  />
                ))
              ) : (
                <div className="text-xs text-slate-400 italic py-2">
                  Không tìm thấy giống phù hợp
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            Không có giống cây trồng nào khả dụng
          </div>
        )}
      </div>
    </Card>
  );
};

interface ZoneConfigurationStepProps {
  bypassSeedSelection?: boolean;
  showSeedSelection?: boolean;
}

export const ZoneConfigurationStep: React.FC<ZoneConfigurationStepProps> = ({
  bypassSeedSelection = false,
  showSeedSelection = true,
}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useFormContext<Record<string, any>>();

  const [farmingMethodSearch, setFarmingMethodSearch] = useState("");
  const [rearingMethodSearch, setRearingMethodSearch] = useState("");
  const [cropSearch, setCropSearch] = useState("");
  const debouncedFarmingMethodSearch = useDebounce(farmingMethodSearch, 300);
  const debouncedRearingMethodSearch = useDebounce(rearingMethodSearch, 300);
  const debouncedCropSearch = useDebounce(cropSearch, 300);

  const watchedVarietyIds = watch("varietyIds");
  const useSpecificSeeds = watch("useSpecificSeeds") ?? false;
  const selectedVarietyIds: number[] = useMemo(
    () => watchedVarietyIds ?? [],
    [watchedVarietyIds],
  );

  const [invalidVarieties, setInvalidVarieties] = useState<
    Record<number, boolean>
  >({});

  const handleVarietyValidityChange = useCallback(
    (varietyId: number, isValid: boolean) => {
      setInvalidVarieties((prev) => {
        if (prev[varietyId] === !isValid) return prev;
        return { ...prev, [varietyId]: !isValid };
      });
    },
    [],
  );

  const hasInvalidVarieties = useMemo(() => {
    return Object.values(invalidVarieties).some((invalid) => invalid);
  }, [invalidVarieties]);

  useEffect(() => {
    setValue("isSeedSelectionValid", !hasInvalidVarieties);
  }, [hasInvalidVarieties, setValue]);

  // ─── Reference data ────────────────────────────────────────────────────
  const {
    items: farmingMethods,
    loading: fmLoading,
    isFetching: isFetchingFarmingMethods,
  } = useProductionMethods({
    params: {
      domainCode: "CROP",
      size: 100,
      status: "active",
      keyword: debouncedFarmingMethodSearch.trim() || undefined,
    },
  });
  const {
    items: rearingMethods,
    loading: irLoading,
    isFetching: isFetchingRearingMethods,
  } = useRearingMethods({
    params: {
      domainCode: "CROP",
      size: 100,
      keyword: debouncedRearingMethodSearch.trim() || undefined,
    },
  });
  const filteredRearingMethods = useMemo(() => {
    return rearingMethods.filter((item) => item.domainCode === "CROP");
  }, [rearingMethods]);

  const selectedFarmingMethodId = watch("farmingMethodId");
  const watchedSeedIds = watch("seedIds");
  const selectedSeedIds: number[] = useMemo(
    () => watchedSeedIds ?? [],
    [watchedSeedIds],
  );
  const watchedCropIds = watch("cropIds");
  const selectedCropIds: string[] = useMemo(
    () => watchedCropIds ?? [],
    [watchedCropIds],
  );

  const { items: methodApplications, loading: fmcLoading } =
    useMethodApplications({
      params: {
        domainCode: "CROP",
        size: 100,
        status: "active",
      },
      enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
    });

  const activeMethodApps = useMemo(() => {
    if (!selectedFarmingMethodId || selectedFarmingMethodId <= 0) return [];
    return methodApplications.filter(
      (item) => item.productionMethod?.id === selectedFarmingMethodId,
    );
  }, [methodApplications, selectedFarmingMethodId]);

  const subjects = useMemo<SeedSubjectGroup[]>(() => {
    const mergedMap = new Map<number, SeedSubjectGroup>();

    activeMethodApps.forEach((app) => {
      (app.subjects ?? []).forEach((subj) => {
        if (!subj.subjectId) return;
        if (!mergedMap.has(subj.subjectId)) {
          mergedMap.set(subj.subjectId, {
            subjectId: subj.subjectId,
            subjectName: subj.subjectName,
            subjectCode: subj.subjectCode,
            variants: [],
          });
        }

        const currentGroup = mergedMap.get(subj.subjectId)!;
        const variantMap = new Map<number, SubjectVariantOption>();
        currentGroup.variants.forEach((v) => variantMap.set(v.id, v));
        (subj.variants ?? []).forEach((v) => {
          if (!v.id) return;
          variantMap.set(v.id, {
            id: v.id,
            code: v.code,
            name: v.name,
          });
        });
        currentGroup.variants = Array.from(variantMap.values());
      });
    });

    return Array.from(mergedMap.values());
  }, [activeMethodApps]);

  const selectedCrops = useMemo(() => {
    return subjects.filter((s) =>
      selectedCropIds.includes(String(s.subjectId)),
    );
  }, [subjects, selectedCropIds]);

  const availableCropOptions = useMemo(() => {
    const list = subjects.filter(
      (s) => !selectedCropIds.includes(String(s.subjectId)),
    );
    const keyword = debouncedCropSearch.toLowerCase().trim();
    const filtered = keyword
      ? list.filter(
          (s) =>
            s.subjectName?.toLowerCase().includes(keyword) ||
            s.subjectCode?.toLowerCase().includes(keyword),
        )
      : list;

    return filtered.map((s) => ({
      label: s.subjectName || "",
      value: String(s.subjectId),
    }));
  }, [subjects, selectedCropIds, debouncedCropSearch]);

  const handleSelectCrop = (cropIdStr: string) => {
    if (!cropIdStr) return;
    if (selectedCropIds.includes(cropIdStr)) return;
    const nextCropIds = [...selectedCropIds, cropIdStr];
    setValue("cropIds", nextCropIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setCropSearch("");
  };

  const handleRemoveCrop = (cropIdStr: string) => {
    const nextCropIds = selectedCropIds.filter((id) => id !== cropIdStr);
    setValue("cropIds", nextCropIds, {
      shouldValidate: true,
      shouldDirty: true,
    });

    const cropId = parseInt(cropIdStr, 10);
    const cropGroup = subjects.find((s) => s.subjectId === cropId);
    if (cropGroup) {
      const varietyIdsOfCrop = cropGroup.variants.map((v) => v.id);
      const nextVarietyIds = selectedVarietyIds.filter(
        (id) => !varietyIdsOfCrop.includes(id),
      );
      setValue("varietyIds", nextVarietyIds, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Clear any seeds associated with the varieties of this crop
      const nextSeedIds = selectedSeedIds.filter(
        (id: number) => !varietyIdsOfCrop.includes(id),
      );
      setValue("seedIds", nextSeedIds, {
        shouldValidate: true,
        shouldDirty: true,
      });

      // Clean up labels, crop mapping, seed map, and seed labels
      const nextLabels = { ...selectedVarietyLabels };
      const nextCropMap = { ...watch("varietyCropMap") };
      const nextVarietySeedMap = { ...watch("varietySeedMap") };
      const nextSeedLabels = { ...watch("seedLabels") };

      varietyIdsOfCrop.forEach((vId) => {
        delete nextLabels[String(vId)];
        delete nextCropMap[String(vId)];
        const seedIdsOfVariety = nextVarietySeedMap[String(vId)] || [];
        seedIdsOfVariety.forEach((sId: number) => {
          delete nextSeedLabels[String(sId)];
        });
        delete nextVarietySeedMap[String(vId)];
      });
      setValue("varietyLabels", nextLabels, { shouldDirty: true });
      setValue("varietyCropMap", nextCropMap, { shouldDirty: true });
      setValue("varietySeedMap", nextVarietySeedMap, { shouldDirty: true });
      setValue("seedLabels", nextSeedLabels, { shouldDirty: true });
    }
  };

  const watchedVarietyLabels = watch("varietyLabels");
  const selectedVarietyLabels: Record<string, string> = useMemo(
    () => watchedVarietyLabels ?? {},
    [watchedVarietyLabels],
  );

  const handleToggleVariety = (
    varietyId: number,
    varietyName: string,
    checked: boolean,
    cropId: number,
  ) => {
    if (checked) {
      const nextVarietyIds = [...selectedVarietyIds, varietyId];
      setValue("varietyIds", nextVarietyIds, {
        shouldValidate: true,
        shouldDirty: true,
      });
      // Store name for display in confirmation step
      setValue(
        "varietyLabels",
        { ...selectedVarietyLabels, [String(varietyId)]: varietyName },
        { shouldDirty: true },
      );
      // Store crop mapping
      const nextCropMap = { ...watch("varietyCropMap"), [String(varietyId)]: String(cropId) };
      setValue("varietyCropMap", nextCropMap, { shouldDirty: true });
    } else {
      const nextVarietyIds = selectedVarietyIds.filter(
        (id) => id !== varietyId,
      );
      setValue("varietyIds", nextVarietyIds, {
        shouldValidate: true,
        shouldDirty: true,
      });
      // Remove label, crop mapping, seed map and seed labels
      const nextLabels = { ...selectedVarietyLabels };
      delete nextLabels[String(varietyId)];
      setValue("varietyLabels", nextLabels, { shouldDirty: true });

      const nextCropMap = { ...watch("varietyCropMap") };
      delete nextCropMap[String(varietyId)];
      setValue("varietyCropMap", nextCropMap, { shouldDirty: true });

      const nextVarietySeedMap = { ...watch("varietySeedMap") };
      const nextSeedLabels = { ...watch("seedLabels") };
      const seedIdsOfVariety = nextVarietySeedMap[String(varietyId)] || [];
      seedIdsOfVariety.forEach((sId: number) => {
        delete nextSeedLabels[String(sId)];
      });
      delete nextVarietySeedMap[String(varietyId)];
      setValue("varietySeedMap", nextVarietySeedMap, { shouldDirty: true });
      setValue("seedLabels", nextSeedLabels, { shouldDirty: true });
    }
  };

  const handleSelectSeedsForVariety = (
    varietyId: number,
    newSeedIdsOfVariety: number[],
    allSeedsOfVariety: number[],
    idNameMap: Record<number, string>,
  ) => {
    const otherSeedIds = selectedSeedIds.filter(
      (id) => !allSeedsOfVariety.includes(id),
    );
    const nextSeedIds = [...otherSeedIds, ...newSeedIdsOfVariety];
    setValue("seedIds", nextSeedIds, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Update varietySeedMap
    const watchedVarietySeedMap = watch("varietySeedMap") || {};
    const nextVarietySeedMap = {
      ...watchedVarietySeedMap,
      [String(varietyId)]: newSeedIdsOfVariety,
    };
    setValue("varietySeedMap", nextVarietySeedMap, { shouldDirty: true });

    // Update seedLabels
    const watchedSeedLabels = watch("seedLabels") || {};
    const nextSeedLabels = { ...watchedSeedLabels, ...idNameMap };
    // Clear labels of unselected seeds for this variety
    allSeedsOfVariety.forEach((id) => {
      if (!newSeedIdsOfVariety.includes(id)) {
        delete nextSeedLabels[String(id)];
      }
    });
    setValue("seedLabels", nextSeedLabels, { shouldDirty: true });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* ── Farming Method & Irrigation System (Horizontal top card) ── */}
      <Card className="border-none shadow-md bg-white">
        <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
          <CardTitle className="flex items-center gap-2 text-base">
            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
              <Sprout className="w-4 h-4 text-green-600" />
            </div>
            <span>Phương pháp canh tác & tưới tiêu</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Farming Method */}
            <Controller
              control={control}
              name="farmingMethodId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Phương pháp canh tác <span className="text-red-500">*</span>
                  </Label>
                  <RemoteAutoCompleteSelect
                    disabled={fmLoading}
                    options={farmingMethods.map((method) => ({
                      label: method.name,
                      value: method.id.toString(),
                    }))}
                    value={field.value > 0 ? field.value.toString() : ""}
                    onChange={(value) => {
                      if (!value) return;
                      field.onChange(Number(value));
                      // Reset seeds and crops when farming method changes
                      setValue("seedIds", []);
                      setValue("cropIds", []);
                      setValue("cropSeedToggles", {});
                    }}
                    onSearch={setFarmingMethodSearch}
                    placeholder="Chọn phương pháp..."
                    searchPlaceholder="Tìm kiếm phương pháp canh tác..."
                    emptyText="Không tìm thấy phương pháp canh tác"
                    loading={isFetchingFarmingMethods}
                    clearable={false}
                  />
                  {errors.farmingMethodId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.farmingMethodId.message as string}
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
              name="rearingMethodId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Phương pháp tưới tiêu
                  </Label>
                  <RemoteAutoCompleteSelect
                    disabled={irLoading}
                    options={filteredRearingMethods.map((method) => ({
                      label: method.name,
                      value: method.id.toString(),
                    }))}
                    value={
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    onChange={(value) => {
                      field.onChange(value ? Number(value) : undefined);
                    }}
                    onSearch={setRearingMethodSearch}
                    placeholder="Chọn phương pháp tưới..."
                    searchPlaceholder="Tìm kiếm phương pháp tưới..."
                    emptyText="Không tìm thấy phương pháp tưới"
                    loading={isFetchingRearingMethods}
                  />
                  {errors.rearingMethodId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors?.rearingMethodId?.message as unknown as string}
                    </p>
                  )}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Subject Selection ── */}
      {!bypassSeedSelection && (
        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-green-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                <Leaf className="w-4 h-4 text-green-600" />
              </div>
              <span>Giống / Hạt giống</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 flex-1 flex flex-col min-h-0 space-y-6">
            {!selectedFarmingMethodId || selectedFarmingMethodId <= 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-3 py-12">
                <Sprout className="w-10 h-10 opacity-50" />
                <span className="text-sm text-center px-4">
                  Vui lòng chọn phương pháp canh tác trước
                </span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                  {/* Autocomplete crop selector */}
                  <div
                    className={cn(
                      "space-y-2",
                      !showSeedSelection && "md:col-span-2",
                    )}
                  >
                    <Label className="text-sm font-medium">
                      Chọn cây trồng
                    </Label>
                    <RemoteAutoCompleteSelect
                      options={availableCropOptions}
                      value=""
                      onChange={handleSelectCrop}
                      onSearch={setCropSearch}
                      placeholder="Tìm kiếm và chọn cây trồng..."
                      loading={fmcLoading}
                      emptyText="  Không tồn tại dữ liệu cây trồng  "
                      clearable={false}
                    />
                  </div>

                  {showSeedSelection && (
                    <div className="flex items-center gap-2.5 bg-slate-50 px-4 rounded-xl border border-slate-200 h-[42px] select-none">
                      <Checkbox
                        id="useSpecificSeeds"
                        checked={useSpecificSeeds}
                        onCheckedChange={(checked) => {
                          setValue("useSpecificSeeds", !!checked, {
                            shouldDirty: true,
                          });
                          // Clear selected seeds if we turn it off
                          if (!checked) {
                            setValue("seedIds", []);
                          }
                        }}
                      />
                      <label
                        htmlFor="useSpecificSeeds"
                        className="text-xs font-semibold text-slate-700 cursor-pointer select-none"
                      >
                        Chọn hạt giống cụ thể (Nếu tắt: chỉ gán giống cơ bản)
                      </label>
                    </div>
                  )}
                </div>

                {/* List of Crop Cards */}
                {fmcLoading ? (
                  <div className="flex items-center justify-center text-muted-foreground text-sm py-10">
                    Đang tải...
                  </div>
                ) : selectedCrops.length > 0 ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 space-y-0">
                    {selectedCrops.map((subject) => (
                      <CropCard
                        key={subject.subjectId}
                        cropId={subject.subjectId}
                        cropName={subject.subjectName || ""}
                        showSeedSelection={showSeedSelection}
                        useSpecificSeeds={useSpecificSeeds}
                        selectedVarietyIds={selectedVarietyIds}
                        onToggleVariety={handleToggleVariety}
                        selectedSeedIds={selectedSeedIds}
                        onSelectSeedsForVariety={handleSelectSeedsForVariety}
                        onVarietyValidityChange={handleVarietyValidityChange}
                        onRemoveCrop={() =>
                          handleRemoveCrop(String(subject.subjectId))
                        }
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-xl bg-slate-50 text-slate-400 gap-2 py-10">
                    <Leaf className="w-8 h-8 opacity-40" />
                    <span className="text-xs italic text-center px-4">
                      Chưa chọn cây trồng nào
                    </span>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
