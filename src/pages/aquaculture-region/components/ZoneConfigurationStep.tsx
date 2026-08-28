import { useFormContext, Controller } from "react-hook-form";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Combobox,
  Input,
  Label,
  ScrollArea,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  Fish,
  Search,
  Waves,
  ChevronRight,
} from "lucide-react";
import { useState, useMemo } from "react";
import {
  useProductionMethods,
  useMethodApplications,
  type MethodApplicationSubject,
} from "@/features/foundation";
import { useRearingMethods } from "@/features/master-data/hooks/useRearingMethods";
import { useDebounce } from "@/shared/hooks/useDebounce";
import type { CultivationZoneFormValues } from "../data/cultivation-zone-form.schema";

interface VariantSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subjectName: string;
  variants: Array<{ id: number; code?: string; name?: string }>;
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
            <Fish className="w-5 h-5 text-cyan-600" />
            <span>Chọn giống thủy sản cho {subjectName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn các giống thủy sản phù hợp để đưa vào phương án sản xuất của
            vùng nuôi trồng này.
          </p>
        </DialogHeader>

        <div className="px-6 pb-4 pt-4 border-b shrink-0 bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
            <Input
              placeholder="Tìm kiếm giống..."
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
                      ? "border-cyan-300 bg-cyan-50/20 shadow-sm"
                      : "border-slate-200 hover:border-cyan-200 hover:shadow-sm",
                  )}
                >
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                    <Fish className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-sm font-semibold truncate",
                        isSelected ? "text-cyan-900" : "text-slate-700",
                      )}
                    >
                      {variant.name}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Mã: {variant.code || "---"}
                    </div>
                  </div>
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0",
                      isSelected
                        ? "bg-cyan-500 border-cyan-500"
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
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
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

  // Dialog State
  const [activeSubject, setActiveSubject] =
    useState<MethodApplicationSubject | null>(null);

  // ─── Reference data ────────────────────────────────────────────────────
  const { items: farmingMethods, loading: fmLoading } = useProductionMethods({
    params: { domainCode: "AQUACULTURE", size: 100, status: "active" },
  });
  const { items: rearingMethods, loading: irLoading } = useRearingMethods({
    params: { domainCode: "AQUACULTURE", size: 100 },
  });
  const filteredRearingMethods = useMemo(() => {
    return rearingMethods.filter((item) => item.domainCode === "AQUACULTURE");
  }, [rearingMethods]);

  const selectedFarmingMethodId = watch("farmingMethodId");
  const selectedSeedIds = watch("seedIds") ?? [];

  const { items: methodApplications, loading: fmcLoading } =
    useMethodApplications({
      params: {
        domainCode: "AQUACULTURE",
        size: 100,
        status: "active",
      },
      enabled: !!selectedFarmingMethodId && selectedFarmingMethodId > 0,
    });

  const activeMethodApp = useMemo(() => {
    if (!selectedFarmingMethodId || selectedFarmingMethodId <= 0) return null;
    return methodApplications.find(
      (item) => item.productionMethod?.id === selectedFarmingMethodId,
    );
  }, [methodApplications, selectedFarmingMethodId]);

  const subjects = useMemo(() => {
    return activeMethodApp?.subjects ?? [];
  }, [activeMethodApp]);

  const filteredSubjects = useMemo(() => {
    const keyword = debouncedVarietySearch.toLowerCase().trim();
    if (!keyword) return subjects;
    return subjects.filter(
      (s) =>
        s.subjectName?.toLowerCase().includes(keyword) ||
        s.subjectCode?.toLowerCase().includes(keyword),
    );
  }, [subjects, debouncedVarietySearch]);

  const handleConfirmVariants = (selectedIds: number[]) => {
    if (!activeSubject) return;
    const currentSubjectVariantIds =
      activeSubject.variants?.map((v) => v.id) ?? [];

    // Filter out variants of the CURRENT subject, then add back the newly selected ones
    const otherSubjectVariantIds = selectedSeedIds.filter(
      (id) => !currentSubjectVariantIds.includes(id),
    );

    const nextIds = [...otherSubjectVariantIds, ...selectedIds];

    setValue("seedIds", nextIds, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Farming Method & Water System ── */}
        <Card className="border-none shadow-md bg-white">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-cyan-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Waves className="w-4 h-4 text-cyan-600" />
              </div>
              <span>Cấu hình nuôi trồng</span>
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
                    Loại hình nuôi <span className="text-red-500">*</span>
                  </Label>
                  <Combobox
                    disabled={fmLoading}
                    className="w-full"
                    options={farmingMethods.map((method) => ({
                      label: method.name ?? "",
                      value: method.id.toString(),
                    }))}
                    value={field.value > 0 ? field.value.toString() : ""}
                    onChange={(value) => {
                      const methodId = parseInt(value, 10);
                      if (Number.isNaN(methodId)) return;

                      field.onChange(methodId);
                      // Reset seeds when farming method changes
                      setValue("seedIds", []);
                    }}
                    placeholder="Chọn loại hình nuôi..."
                    searchPlaceholder="Tìm kiếm loại hình nuôi..."
                    emptyText="Không tìm thấy loại hình nuôi"
                  />
                  {errors.farmingMethodId && (
                    <p className="text-xs font-medium text-red-500 mt-1">
                      {errors.farmingMethodId.message}
                    </p>
                  )}
                </div>
              )}
            />

            {/* Water System */}
            <Controller
              control={control}
              name="rearingMethodId"
              render={({ field }) => (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Hình thức nuôi thả
                  </Label>
                  <Combobox
                    disabled={irLoading}
                    className="w-full"
                    options={filteredRearingMethods.map((method) => ({
                      label: method.name ?? "",
                      value: method.id.toString(),
                    }))}
                    value={
                      field.value && field.value > 0
                        ? field.value.toString()
                        : ""
                    }
                    onChange={(value) => {
                      const methodId = parseInt(value, 10);
                      if (!Number.isNaN(methodId)) field.onChange(methodId);
                    }}
                    placeholder="Chọn hình thức nuôi thả..."
                    searchPlaceholder="Tìm kiếm hình thức nuôi thả..."
                    emptyText="Không tìm thấy hình thức nuôi thả"
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

        {/* ── Breed Selection ── */}
        <Card className="border-none shadow-md bg-white flex flex-col">
          <CardHeader className="pb-3 border-b bg-linear-to-r from-cyan-50/50 to-white">
            <CardTitle className="flex items-center gap-2 text-base">
              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                <Fish className="w-4 h-4 text-cyan-600" />
              </div>
              <span>Loài nuôi / con giống</span>
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
                <Waves className="w-10 h-10 opacity-50 text-cyan-500" />
                <span className="text-sm text-center px-4">
                  Vui lòng chọn loại hình nuôi trước
                </span>
              </div>
            ) : (
              <>
                <div className="mb-4 relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground z-10" />
                  <Input
                    value={varietySearch}
                    placeholder="Tìm kiếm giống thủy sản..."
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
                          subject.variants?.filter((v) =>
                            selectedSeedIds.includes(v.id),
                          ) ?? [];
                        const hasSelected = subjectSelectedVariants.length > 0;

                        return (
                          <div
                            key={subject.subjectId}
                            onClick={() => setActiveSubject(subject)}
                            className={`flex flex-col p-4 rounded-xl border cursor-pointer transition-all ${
                              hasSelected
                                ? "border-cyan-300 bg-cyan-50/20 shadow-sm"
                                : "bg-white border-slate-200 hover:border-cyan-200 hover:shadow-sm"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200 overflow-hidden">
                                <Fish className="w-4 h-4 text-slate-400" />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <div className="text-sm font-semibold truncate text-slate-700">
                                  {subject.subjectName}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  Mã: {subject.subjectCode || "---"}{" "}
                                  {subject.subjectGroupName &&
                                    `• Nhóm: ${subject.subjectGroupName}`}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {hasSelected && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-cyan-100 text-cyan-800 border-none font-semibold text-xs animate-in scale-in duration-200"
                                  >
                                    {subjectSelectedVariants.length} giống thủy
                                    sản
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
                                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
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
                      Không có thủy sản phù hợp
                    </div>
                  )}
                </ScrollArea>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {activeSubject && (
        <VariantSelectorDialog
          key={activeSubject.subjectId}
          open={!!activeSubject}
          onOpenChange={(open) => {
            if (!open) setActiveSubject(null);
          }}
          subjectName={activeSubject.subjectName || ""}
          variants={activeSubject.variants || []}
          selectedVariantIds={selectedSeedIds.filter((id) =>
            activeSubject.variants?.some((v) => v.id === id),
          )}
          onConfirm={handleConfirmVariants}
        />
      )}
    </div>
  );
};
