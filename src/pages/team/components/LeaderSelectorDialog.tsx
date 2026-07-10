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
import { Check, Search, X } from "lucide-react";
import { useFarmPersonnel } from "@/features/master-data";
import { useSelectedWorkspaceId } from "@/features/workspace";
import type { FarmPersonnelResponse } from "@/features/master-data";

interface LeaderSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: number | string | null;
  onSelect: (personnel: FarmPersonnelResponse) => void;
}

export function LeaderSelectorDialog({
  open,
  onOpenChange,
  selectedId = null,
  onSelect,
}: LeaderSelectorDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [loadedPersonnel, setLoadedPersonnel] = useState<
    FarmPersonnelResponse[]
  >([]);
  const [hasMore, setHasMore] = useState(true);
  const [tempSelectedId, setTempSelectedId] = useState<number | string | null>(
    selectedId ? Number(selectedId) : null,
  );

  const workspaceId = useSelectedWorkspaceId();
  const parsedWorkspaceId =
    typeof workspaceId === "number" ? workspaceId : undefined;

  // Debounce search term to minimize API calls
  useEffect(() => {
    if (!open) return;
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setPage(0);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, open]);

  const personnelQuery = useFarmPersonnel({
    workspaceId: parsedWorkspaceId,
    params: {
      keyword: debouncedSearchTerm.trim() || undefined,
      page: page,
      size: 20,
    },
    enabled: open,
  });

  // Accumulate loaded personnel as page increases
  useEffect(() => {
    if (!open) {
      setLoadedPersonnel([]);
      return;
    }

    if (personnelQuery.data) {
      const newItems = personnelQuery.data.content ?? [];
      const totalPages = personnelQuery.data.totalPages ?? 0;
      const currentPage = personnelQuery.data.page ?? 0;

      if (currentPage === 0) {
        setLoadedPersonnel(newItems);
      } else {
        setLoadedPersonnel((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const filteredNewItems = newItems.filter(
            (item) => !existingIds.has(item.id),
          );
          return [...prev, ...filteredNewItems];
        });
      }
      setHasMore(currentPage < totalPages - 1);
    }
  }, [personnelQuery.data, open]);

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
      if (personnelQuery.isFetching) return;
      if (observerRef.current) observerRef.current.disconnect();

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          hasMore &&
          !personnelQuery.isFetching
        ) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observerRef.current.observe(node);
    },
    [hasMore, personnelQuery.isFetching],
  );

  const selectedPersonnel = loadedPersonnel.find(
    (p) => p.id === tempSelectedId,
  );

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            Chọn trưởng nhóm
          </DialogTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Chọn một nhân sự từ danh sách dưới đây làm trưởng nhóm.
          </p>
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Tìm theo tên, số điện thoại, email, chức vụ..."
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {personnelQuery.loading && page === 0
                ? "Đang tải..."
                : `${personnelQuery.data?.totalElements ?? loadedPersonnel.length} nhân sự`}
            </span>
            {selectedPersonnel && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedPersonnel.fullName}
              </span>
            )}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="grid gap-3 p-6 sm:grid-cols-2">
            {loadedPersonnel.map((person) => {
              const isSelected = Number(tempSelectedId) === person.id;
              const initials = person.fullName
                ? person.fullName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                    .toUpperCase()
                : "P";

              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => setTempSelectedId(person.id)}
                  className={cn(
                    "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
                    isSelected
                      ? "border-primary/40 bg-primary/5 shadow-sm"
                      : "border-slate-200",
                  )}
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                    <img
                      alt={person.fullName}
                      src={
                        person.avatarUrl ||
                        person.metadataJson?.avatarUrl ||
                        `https://placehold.co/400?text=${encodeURIComponent(initials)}`
                      }
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          `https://placehold.co/400?text=${encodeURIComponent(initials)}`;
                      }}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-bold text-slate-900">
                          {person.fullName}
                        </h3>
                        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                          {person.positionName || person.position?.name || ""}
                          {(person.positionName || person.position?.name) &&
                          (person.departmentName || person.department?.name)
                            ? " • "
                            : ""}
                          {person.departmentName ||
                            person.department?.name ||
                            ""}
                        </p>
                      </div>
                      <div
                        className={cn(
                          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                          isSelected
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        )}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {person.phone && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          {person.phone}
                        </Badge>
                      )}
                      {person.code && (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-700"
                        >
                          Mã: {person.code}
                        </Badge>
                      )}
                    </div>

                    {person.email && (
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">
                        {person.email}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}

            {hasMore && loadedPersonnel.length > 0 && (
              <div
                ref={loadMoreRef}
                className="col-span-full flex items-center justify-center py-4"
              >
                {personnelQuery.isFetching ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Search className="h-4 w-4 animate-pulse text-slate-400" />
                    Đang tải thêm...
                  </div>
                ) : (
                  <div className="h-1" />
                )}
              </div>
            )}

            {!personnelQuery.loading && loadedPersonnel.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <X className="mb-2 h-5 w-5 text-slate-400" />
                Không tìm thấy nhân sự phù hợp
              </div>
            )}
            {personnelQuery.loading && page === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-sm text-muted-foreground">
                <Search className="mb-2 h-5 w-5 animate-pulse text-slate-400" />
                Đang tải danh sách nhân sự
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
              const person = loadedPersonnel.find(
                (item) => item.id === tempSelectedId,
              );
              if (person) onSelect(person);
              onOpenChange(false);
            }}
            disabled={!tempSelectedId}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
