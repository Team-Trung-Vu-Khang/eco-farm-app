import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X } from "lucide-react";
import { useCrops } from "../../../features/foundation";
import type { RelatedCropForm, CropOption } from "../types/types";
import { useDebounce } from "@/shared/hooks/useDebounce";

export function CropVarietySelectorDialog({
  open,
  initialValues = [],
  onConfirm,
  onOpenChange,
}: {
  open: boolean;
  initialValues?: RelatedCropForm[];
  onConfirm: (values: RelatedCropForm[]) => void;
  onOpenChange: (open: boolean) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [page, setPage] = useState(0);
  const [allCrops, setAllCrops] = useState<any[]>([]);

  // Multi-select state: Map cropId -> RelatedCropForm
  const [selectedCrops, setSelectedCrops] = useState<
    Record<number, RelatedCropForm>
  >({});

  const {
    items: cropItems,
    response,
    loading: cropsLoading,
  } = useCrops({
    enabled: open,
    params: {
      domainCode: "CROP",
      status: "active",
      keyword: debouncedSearch.trim() || undefined,
      page,
      size: 15,
    },
  });

  const isFetchingData = cropsLoading && page === 0;

  useEffect(() => {
    setPage(0);
    if (open) {
      setAllCrops(cropItems || []);
    } else {
      setAllCrops([]);
    }
  }, [debouncedSearch, open]);

  useEffect(() => {
    if (!cropItems) return;
    if (page === 0) {
      setAllCrops(cropItems);
    } else {
      setAllCrops((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newItems = cropItems.filter((c) => !existingIds.has(c.id));
        return [...prev, ...newItems];
      });
    }
  }, [cropItems, page]);

  const allCropOptions = useMemo<CropOption[]>(() => {
    return allCrops.map((crop) => ({
      cropId: crop.id,
      crop: crop.name,
      cropGroupId: crop?.subjectGroup?.id || null,
      cropGroup: crop?.subjectGroup?.name || "Chưa phân loại",
      varieties: [],
    }));
  }, [allCrops]);

  const filteredCropOptions = allCropOptions;

  // Initialize selected crops when dialog opens
  useEffect(() => {
    if (!open) return undefined;

    setTimeout(() => {
      setSearchTerm("");
      const initialMap: Record<number, RelatedCropForm> = {};
      (initialValues || []).forEach((item) => {
        if (item.cropId > 0) {
          initialMap[item.cropId] = item;
        }
      });
      setSelectedCrops(initialMap);
    }, 0);
    return undefined;
  }, [initialValues, open]);

  const handleToggleCrop = (option: CropOption) => {
    setSelectedCrops((prev) => {
      const next = { ...prev };
      if (next[option.cropId]) {
        delete next[option.cropId];
      } else {
        next[option.cropId] = {
          cropGroupId: option.cropGroupId,
          cropGroup: option.cropGroup,
          cropId: option.cropId,
          crop: option.crop,
          varietyIds: [],
          varieties: "",
        };
      }
      return next;
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (target.scrollHeight - target.scrollTop <= target.clientHeight + 50) {
      if (!cropsLoading && response && page < response.totalPages - 1) {
        setPage((p) => p + 1);
      }
    }
  };

  const selectedCount = Object.keys(selectedCrops).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-5xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn cây trồng áp dụng
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Tìm và chọn một hoặc nhiều cây trồng cho phương thức canh tác.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo nhóm cây, cây trồng..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{filteredCropOptions.length} kết quả</span>
            {selectedCount > 0 && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-primary font-medium">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedCount} cây trồng
              </span>
            )}
          </div>
        </div>

        {isFetchingData ? (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 p-10 text-slate-400">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
            <span className="text-sm">Đang tải dữ liệu cây trồng...</span>
          </div>
        ) : (
          <div
            onScroll={handleScroll}
            className="min-h-0 bg-white overflow-y-auto h-full max-h-[calc(90vh-11rem)]"
          >
            <div className="grid grid-cols-2 gap-3 p-6">
              {filteredCropOptions.map((option) => {
                const isSelected = !!selectedCrops[option.cropId];

                return (
                  <button
                    key={`${option.cropGroup}-${option.cropId}`}
                    type="button"
                    onClick={() => handleToggleCrop(option)}
                    className={`group flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md ${
                      isSelected
                        ? "border-primary/40 bg-primary/5 shadow-xs"
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
                    </div>
                  </button>
                );
              })}

              {cropsLoading && page > 0 && (
                <div className="flex justify-center py-2">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
                </div>
              )}

              {filteredCropOptions.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                  <X className="mb-2 h-5 w-5 text-slate-400" />
                  Không tìm thấy cây trồng phù hợp
                </div>
              )}
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
              onConfirm(Object.values(selectedCrops));
              onOpenChange(false);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
