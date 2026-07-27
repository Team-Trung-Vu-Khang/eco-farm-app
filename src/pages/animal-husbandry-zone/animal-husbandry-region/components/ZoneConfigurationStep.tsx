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
import { CheckCircle2, Leaf, Search, Sprout, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";
import {
  useProductionMethods,
  useMethodApplications,
  type MethodApplicationSubject,
} from "@/features/foundation";
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
            <Sprout className="w-5 h-5 text-green-600" />
            <span>Chọn giống vật nuôi cho {subjectName}</span>
          </DialogTitle>
          <p className="text-xs text-muted-foreground mt-1">
            Chọn các giống vật nuôi phù hợp để đưa vào phương án sản xuất của
            vùng chăn nuôi này.
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
                    <div className="text-xs text-muted-foreground mt-0.5">
                      Mã: {variant.code || "---"}
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
    params: { domainCode: "LIVESTOCK", size: 100, status: "active" },
  });

  const selectedFarmingMethodId = watch("farmingMethodId");
  const selectedSeedIds = watch("seedIds") ?? [];

  const { items: methodApplications, loading: fmcLoading } =
    useMethodApplications({
      params: {
        domainCode: "LIVESTOCK",
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
          </CardContent>
        </Card>

        {/* ── Breed Selection ── */}
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
                    placeholder="Tìm kiếm vật nuôi..."
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
                                  Mã: {subject.subjectCode || "---"}{" "}
                                  {subject.subjectGroupName &&
                                    `• Nhóm: ${subject.subjectGroupName}`}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center gap-2">
                                {hasSelected && (
                                  <Badge
                                    variant="secondary"
                                    className="bg-green-100 text-green-800 border-none font-semibold text-xs animate-in scale-in duration-200"
                                  >
                                    {subjectSelectedVariants.length} giống vật
                                    nuôi
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
                      Không có vật nuôi phù hợp
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
