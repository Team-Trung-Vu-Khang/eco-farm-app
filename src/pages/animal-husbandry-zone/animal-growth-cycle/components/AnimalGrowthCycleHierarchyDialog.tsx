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
import { useInfiniteQuery } from "@tanstack/react-query";
import { productionSubjectApi, productionSubjectGroupApi, productionSubjectVariantApi } from "../../../../features/foundation/api/foundation.api";
import type { PageResponse, ProductionSubjectGroupResponse, ProductionSubjectResponse, ProductionSubjectVariantResponse } from "../../../../features/foundation/types/foundation.type";
import { Check, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

export interface AnimalGrowthCycleHierarchyPrimaryOption {
  id: string;
  name: string;
  group: string;
  image: string;
  description?: string;
  code?: string;
}

export interface AnimalGrowthCycleHierarchyChildOption {
  id: string;
  primaryId: string;
  name: string;
  group: string;
  image: string;
  description?: string;
  code?: string;
}

interface AnimalGrowthCycleHierarchyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  searchPlaceholder: string;
  selectedPrimaryId: string;
  selectedChildId: string;
  primaryOptions: AnimalGrowthCycleHierarchyPrimaryOption[];
  childOptions: AnimalGrowthCycleHierarchyChildOption[];
  primaryLabel: string;
  childLabel: string;
  showChildSection: boolean;
  onConfirm: (payload: {
    primary: AnimalGrowthCycleHierarchyPrimaryOption;
    child?: AnimalGrowthCycleHierarchyChildOption;
  }) => void;
}

function OptionCard({
  option,
  selected,
  onClick,
}: {
  option: AnimalGrowthCycleHierarchyPrimaryOption | AnimalGrowthCycleHierarchyChildOption;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md",
        selected ? "border-primary/40 bg-primary/5 shadow-sm" : "border-slate-200",
      )}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
        <img
          src={option.image}
          alt={option.name}
          className="h-full w-full rounded-xl object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-slate-900">
              {option.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {option.description}
            </p>
          </div>
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors",
              selected ? "border-primary bg-primary text-white" : "border-slate-300 bg-white",
            )}
          >
            {selected && <Check className="h-3 w-3" />}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {option.group && (
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {option.group}
            </Badge>
          )}
          {option.code && (
            <Badge variant="outline" className="border-slate-200 text-slate-600">
              {option.code}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

export function AnimalGrowthCycleHierarchyDialog({
  open,
  onOpenChange,
  title,
  description,
  searchPlaceholder,
  selectedPrimaryId,
  selectedChildId,
  primaryOptions,
  childOptions,
  primaryLabel,
  childLabel,
  showChildSection,
  onConfirm,
}: AnimalGrowthCycleHierarchyDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [tempPrimaryId, setTempPrimaryId] = useState(selectedPrimaryId);
  const [tempChildId, setTempChildId] = useState(selectedChildId);
  const childSectionRef = useRef<HTMLDivElement | null>(null);

  const isGroup = primaryLabel === "Nhóm vật nuôi";
  const primaryQuery = useInfiniteQuery<PageResponse<ProductionSubjectGroupResponse | ProductionSubjectResponse>, Error>({
    queryKey: ["animal-growth-cycle-dialog-primary", isGroup ? "groups" : "subjects", searchTerm],
    enabled: open,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => isGroup
      ? productionSubjectGroupApi.list({ page: pageParam as number, size: 20, keyword: searchTerm || undefined, status: "active", domainCode: "LIVESTOCK" })
      : productionSubjectApi.list({ page: pageParam as number, size: 20, keyword: searchTerm || undefined, status: "active", domainCode: "LIVESTOCK" }),
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.page + 1,
    refetchOnWindowFocus: false,
  });
  const childQuery = useInfiniteQuery<PageResponse<ProductionSubjectVariantResponse>, Error>({
    queryKey: ["animal-growth-cycle-dialog-varieties", searchTerm, tempPrimaryId],
    enabled: open && showChildSection && !!tempPrimaryId,
    initialPageParam: 0,
    queryFn: ({ pageParam }) => productionSubjectVariantApi.list({ page: pageParam as number, size: 20, keyword: searchTerm || undefined, status: "active", domainCode: "LIVESTOCK", subjectId: Number(tempPrimaryId) }),
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.page + 1,
    refetchOnWindowFocus: false,
  });

  const apiPrimaryOptions = useMemo(() => primaryQuery.data?.pages.flatMap((page) => page.content).map((item) => {
    if (isGroup) {
      const group = item as ProductionSubjectGroupResponse;
      return { id: String(group.id), name: group.name, group: "", image: group.imageUrl || "", description: group.description || "", code: group.code };
    }
    const subject = item as ProductionSubjectResponse;
    return { id: String(subject.id), name: subject.name, group: subject.family || "", image: subject.imageUrl || "", description: subject.origin || "", code: subject.code };
  }).filter((option, index, all) => all.findIndex((item) => item.id === option.id) === index) || [], [isGroup, primaryQuery.data?.pages]);
  const apiChildOptions = useMemo(() => childQuery.data?.pages.flatMap((page) => page.content).map((item) => ({ id: String(item.id), primaryId: String(item.subject?.id), name: item.name, group: item.origin || "", image: item.imageUrl || "", description: item.description || "", code: item.code })).filter((option, index, all) => all.findIndex((item) => item.id === option.id) === index) || [], [childQuery.data?.pages]);

  const filteredPrimaryOptions = apiPrimaryOptions;

  const filteredChildOptions = apiChildOptions;

  const selectedPrimary = filteredPrimaryOptions.find((item) => item.id === tempPrimaryId) || primaryOptions.find((item) => item.id === tempPrimaryId);

  useEffect(() => {
    if (!open) return;
    if (!showChildSection) return;
    if (!tempPrimaryId) return;

    const timer = window.setTimeout(() => {
      childSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 120);

    return () => window.clearTimeout(timer);
  }, [open, tempPrimaryId, showChildSection]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          setTempPrimaryId(selectedPrimaryId);
          setTempChildId(selectedChildId);
          setSearchTerm("");
        }
        onOpenChange(nextOpen);
      }}
    >
      <DialogContent className="flex h-[88vh] max-h-[88vh] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
        <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Search className="h-4 w-4" />
            </div>
            {title}
          </DialogTitle>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </DialogHeader>

        <div className="shrink-0 border-b bg-white px-6 py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
            />
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>
              {filteredPrimaryOptions.length} mục cha, {filteredChildOptions.length} mục con
            </span>
            {selectedPrimary && (
              <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary">
                <Check className="h-3 w-3" />
                Đang chọn: {selectedPrimary.name}
              </span>
            )}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto" onScroll={(event) => {
          const element = event.currentTarget;
          const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 240;
          if (nearBottom && primaryQuery.hasNextPage && !primaryQuery.isFetchingNextPage) void primaryQuery.fetchNextPage();
          if (nearBottom && childQuery.hasNextPage && !childQuery.isFetchingNextPage) void childQuery.fetchNextPage();
        }}>
          <div className="space-y-5 p-5">
            <div>
              <div className="mb-3 text-sm font-semibold text-slate-700">
                {primaryLabel}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {primaryQuery.isLoading && <div className="col-span-full flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Đang tải dữ liệu...</div>}
                {filteredPrimaryOptions.map((option) => {
                  const isSelected = tempPrimaryId === option.id;
                  return (
                    <OptionCard
                      key={option.id}
                      option={option}
                      selected={isSelected}
                      onClick={() => {
                        setTempPrimaryId(option.id);
                        setTempChildId("");
                      }}
                    />
                  );
                })}
              </div>
              {primaryQuery.isFetchingNextPage && <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Đang tải thêm...</div>}
            </div>

            {showChildSection ? (
              <div>
                <div className="mb-3 text-sm font-semibold text-slate-700">
                  {childLabel}
                </div>
                <div ref={childSectionRef} />
                <div className="grid gap-3 sm:grid-cols-2">
                  {childQuery.isLoading && <div className="col-span-full flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Đang tải dữ liệu...</div>}
                  {tempPrimaryId && filteredChildOptions.length > 0 ? (
                    filteredChildOptions.map((option) => {
                      const isSelected = tempChildId === option.id;
                      return (
                        <OptionCard
                          key={option.id}
                          option={option}
                          selected={isSelected}
                          onClick={() => setTempChildId(option.id)}
                        />
                      );
                    })
                  ) : (
                    <div className="col-span-full flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-muted-foreground">
                      Chọn {primaryLabel.toLowerCase()} để xem {childLabel.toLowerCase()} tương ứng
                    </div>
                  )}
                </div>
                {childQuery.isFetchingNextPage && <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Đang tải thêm...</div>}
              </div>
            ) : null}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t bg-white px-6 py-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={() => {
              if (!selectedPrimary) return;
              const child = filteredChildOptions.find((item) => item.id === tempChildId) || childOptions.find((item) => item.id === tempChildId);
              onConfirm({ primary: selectedPrimary, child });
              onOpenChange(false);
            }}
            disabled={!tempPrimaryId}
            className="bg-primary hover:bg-primary/90"
          >
            Xác nhận
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
