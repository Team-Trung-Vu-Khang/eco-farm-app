import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  Checkbox,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Search, ShieldAlert } from "lucide-react";
import {
  useFarmDepartmentsMasterData,
  useFarmDepartmentMutations,
} from "@/features/master-data";
import type { MasterDepartmentResponse } from "@/features/master-data";

interface MasterDepartmentImportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId?: number;
  onImportSuccess: () => void;
}

export function MasterDepartmentImportDialog({
  open,
  onOpenChange,
  workspaceId,
  onImportSuccess,
}: MasterDepartmentImportDialogProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loadedDepartments, setLoadedDepartments] = useState<
    MasterDepartmentResponse[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch only departments that have NOT been used in this workspace
  const masterDataQuery = useFarmDepartmentsMasterData({
    params: {
      page,
      size: 20,
      used: false,
    },
    workspaceId,
    enabled: open && !!workspaceId,
  });

  const { createDepartment } = useFarmDepartmentMutations(workspaceId);

  // Reset or initialize state when Dialog opens/closes
  useEffect(() => {
    if (open) {
      setSearchTerm("");
      setPage(0);
      setLoadedDepartments([]);
      setHasMore(true);
      setSelectedIds([]);
    }
  }, [open]);

  // Accumulate loaded departments as page increases
  useEffect(() => {
    if (!open) {
      setLoadedDepartments([]);
      return;
    }

    if (masterDataQuery.data) {
      const rawItems = masterDataQuery.data.content ?? [];
      const totalPages = masterDataQuery.data.totalPages ?? 0;
      const currentPage = masterDataQuery.data.page ?? 0;

      if (currentPage === 0) {
        setLoadedDepartments(rawItems);
      } else {
        setLoadedDepartments((prev) => {
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

  // Filter based on search input (client-side)
  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return loadedDepartments;
    const term = searchTerm.toLowerCase();
    return loadedDepartments.filter(
      (dep) =>
        dep.name.toLowerCase().includes(term) ||
        dep.code.toLowerCase().includes(term),
    );
  }, [loadedDepartments, searchTerm]);

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
    if (selectedIds.length === filteredDepartments.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredDepartments.map((dep) => dep.id));
    }
  };

  const handleImport = async () => {
    if (selectedIds.length === 0) return;

    setIsSubmitting(true);
    try {
      const selectedMasterData = loadedDepartments.filter((dep) =>
        selectedIds.includes(dep.id),
      );

      // Perform parallel creates for each chosen department (no code is sent, only masterDataDepartmentId)
      await Promise.all(
        selectedMasterData.map((dep) =>
          createDepartment.mutateAsync({
            name: dep.name,
            description: dep.description,
            displayOrder: dep.displayOrder,
            status: "active",
            masterDataDepartmentId: dep.id,
            metadataJson: {
              source: "master-data",
            },
          }),
        ),
      );

      toast({
        title: "Thêm thành công",
        description: `Đã thêm thành công ${selectedIds.length} phòng ban từ danh mục mẫu.`,
      });

      // Clear selection and close
      setSelectedIds([]);
      setSearchTerm("");
      onImportSuccess();
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi";
      toast({
        title: "Không thể thêm phòng ban mẫu",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAllSelected =
    filteredDepartments.length > 0 &&
    selectedIds.length === filteredDepartments.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:w-full max-w-2xl max-h-[85vh] flex flex-col p-4 sm:p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-xl font-semibold text-slate-900">
            Thêm phòng ban từ danh sách mẫu
          </DialogTitle>
          <p className="text-sm text-slate-500 mt-1">
            Chọn các phòng ban chuẩn từ danh mục mẫu để gán nhanh cho Owner.
          </p>
        </DialogHeader>

        {/* Search and Select All Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm theo tên hoặc mã phòng ban..."
              className="pl-10 pr-4 border-slate-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {filteredDepartments.length > 0 && (
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
              <p className="text-sm">Đang tải danh sách phòng ban mẫu...</p>
            </div>
          ) : filteredDepartments.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
              <ShieldAlert className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-medium">
                Không có phòng ban mẫu nào khả dụng
              </p>
              <p className="text-xs mt-1 text-slate-400">
                Tất cả phòng ban mẫu đã được nhập hoặc không tìm thấy kết quả.
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[45vh] w-full pr-2">
              <div className="space-y-2 w-full min-w-0">
                {filteredDepartments.map((dep) => {
                  const isChecked = selectedIds.includes(dep.id);
                  return (
                    <div
                      key={dep.id}
                      onClick={() => handleToggleSelect(dep.id)}
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
                          onCheckedChange={() => handleToggleSelect(dep.id)}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                          <p className="font-semibold text-slate-800 break-words">
                            {dep.name}
                          </p>
                          <span
                            className="inline-block self-start shrink-0 px-2 py-0.5 text-[10px] sm:text-xs font-semibold rounded-md bg-slate-100 text-slate-600 uppercase"
                            title={dep.code}
                          >
                            {dep.code}
                          </span>
                        </div>
                        {dep.description && (
                          <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                            {dep.description}
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
                ? `Thêm ${selectedIds.length} phòng ban`
                : "Thêm phòng ban đã chọn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
