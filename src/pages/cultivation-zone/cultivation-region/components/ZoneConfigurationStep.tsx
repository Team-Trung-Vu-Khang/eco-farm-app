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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Leaf,
  Search,
  Sprout,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import { useProductionMethods } from "@/features/foundation";
import { useRearingMethods } from "@/features/master-data/hooks/useRearingMethods";
import { useSeeds } from "@/features/farm/hooks/useSeeds";
import type { FarmSeedResponse } from "@/features/farm/types/farm.type";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";
type SubjectVariantOption = {
  id: number;
  code?: string;
  name?: string;
};

type SeedSubjectGroup = {
  subjectId: number;
  subjectName?: string;
  subjectCode?: string;
  variants: FarmSeedResponse[];
};

interface VariantSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  variants: SubjectVariantOption[];
  selectedVariantIds: number[];
  onConfirm: (selectedIds: number[]) => void;
}

export const VariantSelectorDialog = ({
  open,
  onOpenChange,
  subjectName,
  variants = [],
  selectedVariantIds = [],
  onConfirm,
}: VariantSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const [tempSelectedIds, setTempSelectedIds] =
    useState<number[]>(selectedVariantIds);

  const filteredVariants = useMemo(() => {
    const keyword = debouncedSearch.toLowerCase().trim();
    if (!keyword) return variants;
    return variants.filter(
      (v) =>
        v.name?.toLowerCase().includes(keyword) ||
        v.code?.toLowerCase().includes(keyword),
    );
  }, [variants, debouncedSearch]);

  const toggleVariant = (id: number) => {
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
            <span>Chọn giống cây trồng cho {subjectName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn các giống phù hợp thuộc cây trồng này để đưa vào
            phương án sản xuất.
          </p>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm giống cây trồng..."
              className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-all rounded-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1 overflow-y-auto min-h-0 h-80">
          <div className="p-6 space-y-2">
            {filteredVariants.map((variant) => {
              const isSelected = tempSelectedIds.includes(variant.id);
              return (
                <div
                  key={variant.id}
                  onClick={() => toggleVariant(variant.id)}
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
                      {variant.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5 truncate">
                      Mã giống: {variant.code || "---"}
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
            {filteredVariants.length === 0 && (
              <div className="text-center py-10 text-muted-foreground text-sm italic">
                Không tìm thấy giống phù hợp
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
              onConfirm(tempSelectedIds);
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

interface ZoneConfigurationStepProps {
  bypassSeedSelection?: boolean;
}

export const ZoneConfigurationStep: React.FC<ZoneConfigurationStepProps> = ({
  bypassSeedSelection = false,
}) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CultivationZoneFormValues>();

  const [varietySearch, setVarietySearch] = useState("");
  const debouncedVarietySearch = useDebounce(varietySearch, 500);
  const [farmingMethodSearch, setFarmingMethodSearch] = useState("");
  const [rearingMethodSearch, setRearingMethodSearch] = useState("");
  const debouncedFarmingMethodSearch = useDebounce(farmingMethodSearch, 300);
  const debouncedRearingMethodSearch = useDebounce(rearingMethodSearch, 300);

  // Dialog State
  const [activeSubject, setActiveSubject] =
    useState<SeedSubjectGroup | null>(null);

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
  const selectedSeedIds = watch("seedIds") ?? [];

  // Giống / Hạt giống áp dụng cho phương pháp canh tác đang chọn.
  // API: GET /api/farm/subject-variants?productionMethodId=&domainCode=CROP&status=active
  const { items: seedItems, loading: fmcLoading } = useSeeds({
    params: {
      productionMethodId: selectedFarmingMethodId,
      domainCode: "CROP",
      status: "active",
      size: 100,
    },
    enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
  });

  const subjects = useMemo<SeedSubjectGroup[]>(() => {
    const groups = new Map<number, SeedSubjectGroup>();
    seedItems.forEach((seed) => {
      const subject = seed.productionSubject ?? seed.crop;
      if (!subject?.id) return;
      if (!groups.has(subject.id)) {
        groups.set(subject.id, {
          subjectId: subject.id,
          subjectName: subject.name,
          variants: [],
        });
      }
      groups.get(subject.id)!.variants.push(seed);
    });
    return Array.from(groups.values());
  }, [seedItems]);

  const filteredSubjects = useMemo(() => {
    const keyword = debouncedVarietySearch.toLowerCase().trim();
    if (!keyword) return subjects;
    return subjects.filter(
      (s) =>
        s.subjectName?.toLowerCase().includes(keyword) ||
        s.subjectCode?.toLowerCase().includes(keyword),
    );
  }, [subjects, debouncedVarietySearch]);

  const variants = useMemo(() => {
    return activeSubject?.variants ?? [];
  }, [activeSubject]);

  const handleConfirmVariants = (selectedIds: number[]) => {
    if (!activeSubject) return;

    // Replace only variants belonging to the subject currently being edited.
    const variantIds = activeSubject.variants?.map((v) => v.id) || [];

    const otherSubjectVariantIds = selectedSeedIds.filter(
      (id) => !variantIds.includes(id),
    );

    const nextIds = [...otherSubjectVariantIds, ...selectedIds];

    setValue("seedIds", nextIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div
        className={cn(
          "grid gap-6",
          bypassSeedSelection
            ? "grid-cols-1"
            : "grid-cols-1 xl:grid-cols-2",
        )}
      >
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
                      // Reset seeds when farming method changes
                      setValue("seedIds", []);
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
                      {errors.rearingMethodId.message}
                    </p>
                  )}
                </div>
              )}
            />
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
                <>
                  <div className="mb-4 relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                    <Input
                      value={varietySearch}
                      placeholder="Tìm kiếm cây trồng..."
                      onChange={(e) => setVarietySearch(e.target.value)}
                      className="pl-10 bg-slate-50/50 border-slate-200 focus:bg-white transition-all rounded-lg"
                    />
                  </div>
                  <ScrollArea className="flex-1 h-80">
                    {fmcLoading ? (
                      <div className="flex items-center justify-center text-muted-foreground text-sm py-10">
                        Đang tải...
                      </div>
                    ) : filteredSubjects.length > 0 ? (
                      <div className="w-full space-y-2">
                        {filteredSubjects.map((subject) => {
                          const subjectSelectedVariants =
                            subject.variants?.filter((variant) =>
                              selectedSeedIds.includes(variant.id),
                            ) ?? [];
                          const hasSelected =
                            subjectSelectedVariants.length > 0;

                          return (
                            <div
                              key={subject.subjectId}
                              onClick={() => setActiveSubject(subject)}
                              className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                                hasSelected
                                  ? "bg-green-50/30 border-green-300 shadow-sm"
                                  : "bg-white border-slate-200 hover:border-green-200 hover:shadow-sm"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                  <Leaf className="w-4 h-4 text-slate-400" />
                                </div>
                                <div className="flex flex-col flex-1 min-w-0">
                                  <div className="text-sm font-semibold truncate text-slate-700">
                                    {subject.subjectName}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {subject.variants.length} giống/hạt giống
                                    khả dụng
                                  </div>
                                </div>
                                <div className="shrink-0 flex items-center gap-2">
                                  {hasSelected && (
                                    <Badge
                                      variant="secondary"
                                      className="bg-green-100 text-green-800 border-none font-semibold text-xs animate-in scale-in duration-200"
                                    >
                                      {subjectSelectedVariants.length} giống
                                    </Badge>
                                  )}
                                  <ChevronRight className="w-4 h-4 text-slate-400" />
                                </div>
                              </div>

                              {hasSelected && (
                                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                                  {subjectSelectedVariants.map((variant) => (
                                    <Badge
                                      key={variant.id}
                                      variant="outline"
                                      className="bg-white border-slate-200 text-slate-600 text-[11px] py-1 px-2.5 rounded-md flex items-center gap-1.5 shadow-xs"
                                    >
                                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                      <span>{variant.name}</span>
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
                        Không có cây trồng phù hợp
                      </div>
                    )}
                  </ScrollArea>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {activeSubject && (
        <VariantSelectorDialog
          key={activeSubject.subjectId}
          open={!!activeSubject}
          onOpenChange={(open) => {
            if (!open) setActiveSubject(null);
          }}
          subjectName={activeSubject.subjectName || ""}
          variants={variants}
          selectedVariantIds={selectedSeedIds.filter((id) =>
            activeSubject.variants?.some((variant) => variant.id === id),
          )}
          onConfirm={handleConfirmVariants}
        />
      )}
    </div>
  );
};
