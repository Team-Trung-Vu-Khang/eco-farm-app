import { useEffect, useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X } from "lucide-react";
import { useCrops, useCropVarieties } from "../../../features/foundation";
import type { RelatedCropForm, CropOption } from "../types/types";

export function CropVarietySelectorDialog({
  open,
  initialValue,
  onConfirm,
  onOpenChange,
}: {
  open: boolean;
  initialValue?: RelatedCropForm;
  onConfirm: (value: RelatedCropForm) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const { items: cropItems, loading: cropsLoading } = useCrops({
    params: { domainCode: "CROP" },
    enabled: open,
  });
  const { items: varietyItems, loading: varietiesLoading } = useCropVarieties({
    params: { domainCode: "CROP" },
    enabled: open,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(initialValue?.cropGroup);
  const [selectedCropId, setSelectedCropId] = useState(initialValue?.cropId);
  const [selectedVarieties, setSelectedVarieties] = useState<number[]>(
    initialValue?.varietyIds || [],
  );

  const isFetchingData = cropsLoading || varietiesLoading;

  const allCropOptions = useMemo<CropOption[]>(() => {
    return cropItems.map((crop) => ({
      cropGroupId: crop.cropGroupId || null,
      cropGroup: crop.cropGroupName || "Chưa phân loại",
      cropId: crop.id,
      crop: crop.name,
      varieties: varietyItems
        .filter((v) => v.cropId === crop.id)
        .map((v) => ({ id: v.id, name: v.name || "" })),
    }));
  }, [cropItems, varietyItems]);

  const filteredCropOptions = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return allCropOptions;

    return allCropOptions.filter((item) => {
      const searchableText = [
        item.cropGroup,
        item.crop,
        ...item.varieties.map((v) => v.name),
      ]
        .join(" ")
        .toLowerCase();
      return searchableText.includes(query);
    });
  }, [allCropOptions, searchTerm]);

  useEffect(() => {
    if (!open) return undefined;

    setTimeout(() => {
      setSearchTerm("");
      setSelectedGroup(initialValue?.cropGroup);
      setSelectedCropId(initialValue?.cropId);
      setSelectedVarieties(initialValue?.varietyIds || []);
    }, 0);
    return undefined;
  }, [initialValue, open]);

  const selectedOption =
    allCropOptions.find(
      (option) =>
        option.cropGroup === selectedGroup && option.cropId === selectedCropId,
    ) ?? null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn cây trồng - giống áp dụng
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm và chọn cây trồng, sau đó chọn các giống phù hợp cho phương thức
            canh tác.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo nhóm cây, cây trồng hoặc giống..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredCropOptions.length} kết quả</span>
            {selectedOption && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedOption.crop}
              </span>
            )}
          </div>
        </div>

        {isFetchingData ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-10 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
            <span className="text-sm">
              Đang tải dữ liệu cây trồng và giống...
            </span>
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-0 overflow-hidden lg:grid-cols-[1.1fr_0.9fr]">
            <ScrollArea className="min-h-0 border-r bg-white">
              <div className="space-y-3 p-6">
                {filteredCropOptions.map((option) => {
                  const isSelected =
                    option.cropGroup === selectedGroup &&
                    option.cropId === selectedCropId;

                  return (
                    <button
                      key={`${option.cropGroup}-${option.cropId}`}
                      type="button"
                      onClick={() => {
                        setSelectedGroup(option.cropGroup);
                        setSelectedCropId(option.cropId);
                        setSelectedVarieties(option.varieties.map((v) => v.id));
                      }}
                      className={`group flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md ${
                        isSelected
                          ? "border-primary/40 bg-primary/5 shadow-sm"
                          : "border-slate-200"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">
                              {option.crop}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                              {option.cropGroup}
                            </p>
                          </div>
                          <div
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-primary bg-primary text-white"
                                : "border-slate-300 bg-white"
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3" />}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {option.varieties.length} giống
                          </Badge>
                          <Badge variant="outline" className="border-slate-200">
                            {option.varieties[0]?.name}
                          </Badge>
                          {option.varieties.length > 1 && (
                            <Badge
                              variant="outline"
                              className="border-slate-200"
                            >
                              +{option.varieties.length - 1}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}

                {filteredCropOptions.length === 0 && (
                  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                    <X className="mb-2 h-5 w-5 text-slate-400" />
                    Không tìm thấy cây trồng phù hợp
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="min-h-0 bg-slate-50">
              <ScrollArea className="h-full">
                <div className="space-y-6 p-6">
                  {selectedOption ? (
                    <>
                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <Badge
                              variant="outline"
                              className="border-emerald-200 bg-emerald-50 text-emerald-700"
                            >
                              {selectedOption.cropGroup}
                            </Badge>
                            <h3 className="mt-3 text-xl font-semibold text-slate-900">
                              {selectedOption.crop}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              Chọn một hoặc nhiều giống áp dụng cho cây trồng
                              này.
                            </p>
                          </div>
                          <Badge
                            variant="secondary"
                            className="bg-slate-100 text-slate-700"
                          >
                            {selectedVarieties.length} giống đã chọn
                          </Badge>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <h4 className="text-sm font-semibold text-slate-900">
                            Danh sách giống
                          </h4>
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                              setSelectedVarieties(
                                selectedOption.varieties.map((v) => v.id),
                              )
                            }
                          >
                            Chọn tất cả
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedOption.varieties.map((variety) => {
                            const isActive = selectedVarieties.includes(
                              variety.id,
                            );

                            return (
                              <button
                                key={variety.id}
                                type="button"
                                onClick={() =>
                                  setSelectedVarieties((current) =>
                                    current.includes(variety.id)
                                      ? current.filter(
                                          (item) => item !== variety.id,
                                        )
                                      : [...current, variety.id],
                                  )
                                }
                                className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                                  isActive
                                    ? "border-primary bg-primary/10 text-primary"
                                    : "border-slate-200 bg-white text-slate-700 hover:border-primary/30"
                                }`}
                              >
                                {variety.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white py-16 text-center text-sm text-muted-foreground">
                      Chọn một cây trồng ở danh sách bên trái để xem giống áp
                      dụng.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="shrink-0 border-t bg-slate-50 px-6 py-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (!selectedOption || selectedVarieties.length === 0) return;

              onConfirm({
                cropGroupId: selectedOption.cropGroupId,
                cropGroup: selectedOption.cropGroup,
                cropId: selectedOption.cropId,
                crop: selectedOption.crop,
                varietyIds: selectedVarieties,
                varieties: selectedOption.varieties
                  .filter((v) => selectedVarieties.includes(v.id))
                  .map((v) => v.name)
                  .join(", "),
              });
              onOpenChange(false);
            }}
            disabled={!selectedOption || selectedVarieties.length === 0}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
