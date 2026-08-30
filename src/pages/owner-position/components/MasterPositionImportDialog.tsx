import type { MasterPositionResponse } from "@/features/master-data";
import {
  useFarmPositionMutations,
  useFarmPositionsMasterData,
} from "@/features/master-data";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, ShieldAlert } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface MasterPositionImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: number;
  onImportSuccess: () => void;
}

export function MasterPositionImportDialog({
  open,
  onOpenChange,
  workspaceId,
  onImportSuccess,
}: MasterPositionImportDialogProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loadedPositions, setLoadedPositions] = useState<
    MasterPositionResponse[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const keyword = searchTerm.trim();

  // Fetch only positions that have NOT been used in this workspace
  const masterDataQuery = useFarmPositionsMasterData({
    params: {
      keyword: keyword || undefined,
      page,
      size: 20,
      used: false,
    },
    workspaceId,
    enabled: open && !!workspaceId,
  });

  const { createPosition } = useFarmPositionMutations(workspaceId);

  // Reset or initialize state when Dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setPage(0);
      setLoadedPositions([]);
      setHasMore(true);
      setSelectedIds([]);
    }
  }, [open]);

  // A new keyword starts a new paginated result set.
  useEffect(() => {
    if (!open) return;

    setPage(0);
    setLoadedPositions([]);
    setHasMore(true);
  }, [keyword, open]);

  // Accumulate loaded positions as page increases
  useEffect(() => {
    if (!open) {
      setLoadedPositions([]);
      return;
    }

    if (masterDataQuery.data) {
      const rawItems = masterDataQuery.data.content ?? [];
      const totalPages = masterDataQuery.data.totalPages ?? 0;
      const currentPage = masterDataQuery.data.page ?? 0;

      if (currentPage === 0) {
        setLoadedPositions(rawItems);
      } else {
        setLoadedPositions((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNewItems = rawItems.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewItems];
        });
      }
      setHasMore(currentPage < totalPages - 1);
    }
  }, [masterDataQuery.data, open]);

  // Search and pagination are performed by the master-data API. The local
  // collection contains only pages returned for the current keyword.
  const filteredPositions = useMemo(() => loadedPositions, [loadedPositions]);

  // IntersectionObserver callback for infinite scroll trigger
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (masterDataQuery.isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !masterDataQuery.isFetching
        ) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, masterDataQuery.isFetching],
  );

  const handleToggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredPositions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredPositions.map((pos) => pos.id));
    }
  };

  const handleImport = async () => {
    if (selectedIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const selectedMasterData = loadedPositions.filter((pos) =>
        selectedIds.includes(pos.id),
      );

      // Perform parallel creates for each chosen position
      await Promise.all(
        selectedMasterData.map((pos) =>
          createPosition.mutateAsync({
            name: pos.name,
            description: pos.description,
            displayOrder: pos.displayOrder,
            positionGroupId: pos.positionGroupId,
            status: "active",
            masterDataPositionId: pos.id,
            metadataJson: {
              source: "master-data",
            },
          }),
        ),
      );

      toast({
        title: "Thêm thành công",
        description: `Đã thêm thành công ${selectedIds.length} chức vụ từ danh mục mẫu.`,
      });

      // Clear selection and close
      setSelectedIds([]);
      setSearchTerm("");
      onImportSuccess();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      toast({
        title: "Không thể thêm chức vụ mẫu",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllSelected =
    filteredPositions.length > 0 &&
    selectedIds.length === filteredPositions.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Danh mục chức vụ trong hệ thống
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Chọn chức vụ định nghĩa sẵn trong hệ thống
          </p>
        </DialogHeader>

        {/* Search and Select All Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên chức vụ"
              className="pl-10 pr-4 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredPositions.length > 0 && (
            <Button
              size="sm"
              variant="outline"
              className="shrink-0 h-9"
              onClick={handleSelectAll}
            >
              {isAllSelected ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Button>
          )}
        </div>

        {/* List Content */}
        <div className="flex-1 min-h-0 w-full overflow-hidden border border-slate-100 rounded-2xl bg-slate-50/50 p-2">
          {masterDataQuery.loading && page === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500 mb-2"></span>
              <p className="text-sm">Đang tải danh sách chức vụ mẫu...</p>
            </div>
          ) : filteredPositions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-medium">
                Không có chức vụ mẫu nào khả dụng
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Tất cả chức vụ mẫu đã được nhập hoặc chưa có thông tin.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[45vh] w-full pr-2">
              <div className="space-y-2 w-full min-w-0">
                {filteredPositions.map((pos) => {
                  const isChecked = selectedIds.includes(pos.id);
                  return (
                    <div
                      key={pos.id}
                      onClick={() => handleToggleSelect(pos.id)}
                      className={`
                        flex w-full min-w-0 items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer select-none
                        ${
                          isChecked
                            ? "bg-white border-violet-200 shadow-sm"
                            : "bg-white/80 border-slate-100 hover:border-slate-200 hover:bg-white"
                        }
                      `}
                    >
                      <div
                        className="pt-0.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={isChecked}
                          onCheckedChange={() => handleToggleSelect(pos.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <p className="font-semibold text-slate-800 break-words">
                            {pos.name}
                          </p>
                          <span
                            className="inline-block self-start shrink-0 px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-md bg-slate-100 text-slate-600 uppercase"
                            title={pos.code}
                          >
                            {pos.code}
                          </span>
                        </div>
                        {pos.positionGroupName && (
                          <p className="text-xs font-medium text-violet-600 mt-0.5">
                            Nhóm: {pos.positionGroupName}
                          </p>
                        )}
                        {pos.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {pos.description}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}

                {hasMore && (
                  <div
                    ref={loadMoreRef}
                    className="flex items-center justify-center py-4"
                  >
                    {masterDataQuery.isFetching ? (
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Search className="h-4 w-4 animate-pulse text-slate-400" />
                        Đang tải thêm...
                      </div>
                    ) : (
                      <div className="h-1" />
                    )}
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </div>

        <DialogFooter className="mt-6 gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Hủy bỏ
          </Button>
          <Button
            onClick={handleImport}
            disabled={selectedIds.length === 0 || isSubmitting}
          >
            {isSubmitting
              ? "Đang thêm..."
              : selectedIds.length > 0
                ? `Thêm ${selectedIds.length} chức vụ`
                : "Thêm chức vụ đã chọn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
