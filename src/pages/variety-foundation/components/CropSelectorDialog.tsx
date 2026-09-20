import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Filter, Leaf, Loader2, Search } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { cropApi } from "../../../features/foundation/api/foundation.api";
import { useDebounce } from "../../../shared/hooks/useDebounce";

import { useCatalog } from "../../../features/foundation";

export interface SelectedCropItem {
  id: string;
  name: string;
  code?: string;
  image: string;
  group: string;
}

interface CropSelectorDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onConfirm: (crop: SelectedCropItem) => void;
}

export const CropSelectorDialog = ({
  isOpen,
  onOpenChange,
  selectedId = "",
  onConfirm,
}: CropSelectorDialogProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [tempSelectedId, setTempSelectedId] = useState<string>(selectedId);

  const debouncedSearch = useDebounce(searchTerm, 300);

  // Fetch Crop Groups Catalog from API
  const { items: cropGroupCatalog } = useCatalog("crop-groups", {
    enabled: isOpen,
  });

  const cropsQuery = useInfiniteQuery({
    queryKey: [
      "foundation",
      "crops",
      "infinite",
      debouncedSearch,
      selectedGroup,
    ] as const,
    queryFn: ({ pageParam = 0 }) =>
      cropApi.list({
        domainCode: "CROP",
        keyword: debouncedSearch.trim() || undefined,
        cropGroupId:
          selectedGroup !== "all" ? Number(selectedGroup) : undefined,
        page: pageParam,
        size: 20,
      }),
    enabled: isOpen,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    staleTime: 5 * 60 * 1000,
  });

  const rawCrops = useMemo(
    () => cropsQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [cropsQuery.data],
  );

  const cropOptions: SelectedCropItem[] = useMemo(() => {
    return rawCrops.map((c) => ({
      id: String(c.id),
      name: c.name,
      code: c.code || "",
      image: c.imageUrl || "",
      group: c.cropGroupName || "Khác",
    }));
  }, [rawCrops]);

  // Scroll handler for Infinite Scroll API fetching
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      if (cropsQuery.hasNextPage && !cropsQuery.isFetchingNextPage) {
        cropsQuery.fetchNextPage();
      }
    }
  };

  const handleConfirm = () => {
    if (tempSelectedId) {
      const selectedItem = cropOptions.find((c) => c.id === tempSelectedId);
      if (selectedItem) {
        onConfirm(selectedItem);
      }
      onOpenChange(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setTempSelectedId(selectedId);
          setSearchTerm("");
          setSelectedGroup("all");
        }
        onOpenChange(open);
      }}
    >
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col p-6 rounded-3xl">
        <DialogHeader className="pb-2 border-b border-slate-100">
          <DialogTitle className="flex items-center gap-2.5 text-xl font-bold text-slate-800">
            <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0">
              <Leaf className="w-5 h-5" />
            </div>
            Chọn loài cây trồng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3 flex-1 flex flex-col min-h-0">
          {/* Search bar */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 z-10" />
              <Input
                placeholder="Tìm kiếm cây trồng theo tên, mã hoặc nhóm..."
                className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white focus:border-green-500 rounded-xl transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Crop Group filter badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar shrink-0">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 shrink-0 mr-1">
              <Filter size={12} /> Nhóm:
            </span>
            <Badge
              variant={selectedGroup === "all" ? "default" : "outline"}
              className={cn(
                "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0",
                selectedGroup === "all"
                  ? "bg-green-600 text-white shadow-xs border-green-600"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
              )}
              onClick={() => setSelectedGroup("all")}
            >
              Tất cả
            </Badge>
            {cropGroupCatalog.map((group) => {
              const groupIdStr = String(group.id);
              const isSelected = selectedGroup === groupIdStr;
              return (
                <Badge
                  key={group.id}
                  variant={isSelected ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer px-3 py-1.5 text-xs font-bold rounded-xl transition-all shrink-0",
                    isSelected
                      ? "bg-green-600 text-white shadow-xs border-green-600"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50",
                  )}
                  onClick={() => setSelectedGroup(groupIdStr)}
                >
                  {group.name}
                </Badge>
              );
            })}
          </div>

          {/* Crop Grid Container with Infinite Scroll */}
          <div
            className="flex-1 overflow-y-auto pr-2 max-h-[55vh] min-h-[350px]"
            onScroll={handleScroll}
          >
            {cropsQuery.isLoading ? (
              <div className="py-20 text-center flex flex-col items-center justify-center text-slate-400">
                <Loader2
                  size={32}
                  className="animate-spin text-green-600 mb-3"
                />
                <p className="text-sm font-medium">
                  Đang tải danh sách cây trồng...
                </p>
              </div>
            ) : cropOptions.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 p-1">
                {cropOptions.map((crop) => {
                  const isSelected = tempSelectedId === crop.id;
                  return (
                    <div
                      key={crop.id}
                      onClick={() => setTempSelectedId(crop.id)}
                      className={cn(
                        "group relative overflow-hidden cursor-pointer rounded-2xl border-2 transition-all duration-200 p-1.5 bg-white shadow-xs hover:shadow-md",
                        isSelected
                          ? "border-green-600 ring-4 ring-green-600/15 bg-green-50/20"
                          : "border-slate-100 hover:border-green-300",
                      )}
                    >
                      <div className="aspect-square relative overflow-hidden rounded-xl bg-slate-100">
                        {crop.image ? (
                          <img
                            src={crop.image}
                            alt={crop.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Leaf size={32} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                        {/* Selected Checkmark Badge */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shadow-lg animate-in zoom-in">
                            <Check className="w-3.5 h-3.5 text-white stroke-[3]" />
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-2.5 text-white">
                          <p className="text-[10px] font-bold text-green-300 uppercase tracking-wider truncate mb-0.5">
                            {crop.group}
                          </p>
                          <h4 className="font-bold text-sm leading-snug line-clamp-1">
                            {crop.name}
                          </h4>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center flex flex-col items-center justify-center text-slate-400">
                <Leaf size={40} className="mb-3 opacity-30 text-slate-400" />
                <p className="text-sm font-bold">
                  Không tìm thấy cây trồng phù hợp
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Thử tìm kiếm với từ khóa hoặc nhóm khác
                </p>
              </div>
            )}

            {/* Fetching Next Page Spinner */}
            {cropsQuery.isFetchingNextPage && (
              <div className="py-4 text-center flex items-center justify-center gap-2 text-xs text-green-600 font-semibold">
                <Loader2 size={16} className="animate-spin" />
                Đang tải thêm cây trồng...
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="pt-3 border-t border-slate-100 flex items-center justify-between sm:justify-between">
          <div className="text-xs text-slate-500 font-medium">
            {tempSelectedId ? (
              <span>
                Đã chọn:{" "}
                <span className="font-bold text-green-700">
                  {cropOptions.find((c) => c.id === tempSelectedId)?.name}
                </span>
              </span>
            ) : (
              <span>Vui lòng chọn 1 cây trồng</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl font-bold"
            >
              Hủy
            </Button>
            <Button
              type="button"
              disabled={!tempSelectedId}
              onClick={handleConfirm}
              className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold px-6 shadow-md shadow-green-900/10"
            >
              Xác nhận
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
