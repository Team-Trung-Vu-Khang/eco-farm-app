import { useState, useEffect, useRef, useCallback } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search, X, Sprout } from "lucide-react";
import { useCrops } from "@/features/foundation";
import type { FoundationCropResponse } from "@/features/foundation";

interface CropSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cropGroupId: number;
  selectedId?: number | string | null;
  onSelect: (crop: FoundationCropResponse) => void;
}

export function CropSelectorDialog({
  open,
  onOpenChange,
  cropGroupId,
  selectedId = null,
  onSelect,
}: CropSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loadedCrops, setLoadedCrops] = useState<FoundationCropResponse[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [tempSelectedId, setTempSelectedId] = useState<number | string | null>(
    selectedId ? Number(selectedId) : null,
  );

  // Debounce search term to minimize API calls
  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, open]);

  const cropsQuery = useCrops({
    params: {
      cropGroupId: cropGroupId,
      keyword: debouncedSearchTerm.trim() || undefined,
      page: page,
      size: 20,
    },
    enabled: open,
  });

  // Accumulate loaded crops as page increases
  useEffect(() => {
    if (!open) {
      setLoadedCrops([]);
      return;
    }

    if (cropsQuery.data) {
      const rawItems = cropsQuery.data.content ?? [];
      const newItems = rawItems.filter(
        (item) => item.cropGroupId === cropGroupId,
      );
      const totalPages = cropsQuery.data.totalPages ?? 0;
      const currentPage = cropsQuery.data.page ?? 0;

      if (currentPage === 0) {
        setLoadedCrops(newItems);
      } else {
        setLoadedCrops((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNewItems = newItems.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewItems];
        });
      }
      setHasMore(currentPage < totalPages - 1);
    }
  }, [cropsQuery.data, open, cropGroupId]);

  // Reset or initialize state when Dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setDebouncedSearchTerm("");
      setPage(0);
      setHasMore(true);
      setTempSelectedId(selectedId ? Number(selectedId) : null);
    }
  }, [open, selectedId]);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (cropsQuery.isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !cropsQuery.isFetching) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, cropsQuery.isFetching],
  );

  const selectedCrop = loadedCrops.find((c) => c.id === tempSelectedId);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempSelectedId(selectedId ? Number(selectedId) : null);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[90vh] max-h-[90vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
              <Search className="h-4 w-4" />
            </div>
            Chọn cây trồng
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn một cây trồng từ danh sách thuộc nhóm này.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên cây trồng..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {cropsQuery.loading && page === 0
                ? "Đang tải..."
                : `${cropsQuery.data?.totalElements ?? loadedCrops.length} cây trồng`}
            </span>
            {selectedCrop && (
              <span className="flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-green-700 font-medium">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedCrop.name}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            {loadedCrops.map((crop) => {
              const isSelected = Number(tempSelectedId) === crop.id;

              return (
                <button
                  key={crop.id}
                  type="button"
                  onClick={() => setTempSelectedId(crop.id)}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-green-500/30 hover:shadow-md",
                    isSelected
                      ? "border-green-500 bg-green-50/10 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-100 bg-slate-50 shadow-sm">
                    {crop.imageUrl ? (
                      <img
                        src={crop.imageUrl}
                        alt={crop.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Sprout className="h-6 w-6 text-slate-300" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900">
                          {crop.name}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {crop.description || "Chưa có mô tả"}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {crop.code && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          Mã: {crop.code}
                        </Badge>
                      )}
                      {crop.cropGroupName && (
                        <Badge
                          variant="secondary"
                          className="bg-green-50 text-green-700 border-green-100"
                        >
                          {crop.cropGroupName}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}

            {hasMore && loadedCrops.length > 0 && (
              <div
                ref={loadMoreRef}
                className="col-span-full flex items-center justify-center py-4"
              >
                {cropsQuery.isFetching ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Search className="h-4 w-4 animate-pulse text-slate-400" />
                    Đang tải thêm...
                  </div>
                ) : (
                  <div className="h-1" />
                )}
              </div>
            )}

            {!cropsQuery.loading && loadedCrops.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <X className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy cây trồng phù hợp
              </div>
            )}
            {cropsQuery.loading && page === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 animate-pulse text-slate-400" />
                Đang tải danh sách cây trồng
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              const crop = loadedCrops.find(
                (item) => item.id === tempSelectedId,
              );
              if (crop) onSelect(crop);
              onOpenChange(false);
            }}
            disabled={!tempSelectedId}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
