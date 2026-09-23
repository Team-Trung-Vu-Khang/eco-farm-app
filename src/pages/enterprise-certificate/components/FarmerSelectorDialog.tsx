import { adminWorkspaceApi, type WorkspaceRecord } from "@/features/workspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import {
  Avatar,
  AvatarFallback,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
  cn,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Building2, Check, Loader2, Search, Sprout } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface FarmerSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedId?: string;
  onConfirm: (farmer: WorkspaceRecord) => void;
}

export const getOrganizationTypeLabel = (organization?: {
  type?: string;
  organizationType?: { name?: string } | null;
}) => {
  const organizationTypeName = organization?.organizationType?.name?.trim();
  if (organizationTypeName) return organizationTypeName;

  switch (organization?.type) {
    case "enterprise":
      return "Doanh nghiệp";
    case "farm":
    case "farm_household":
      return "Nông hộ";
    case "cooperative":
      return "Hợp tác xã";
    default:
      return organization?.type || "Đơn vị";
  }
};

export function FarmerSelectorDialog({
  open,
  onOpenChange,
  selectedId,
  onConfirm,
}: FarmerSelectorDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState(selectedId || "");
  const debouncedKeyword = useDebounce(keyword, 300);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!open) return;
    setKeyword("");
    setTempSelectedId(selectedId || "");
  }, [open, selectedId]);

  const farmersQuery = useInfiniteQuery({
    queryKey: [
      "enterprise-certificate",
      "farmer-workspaces",
      debouncedKeyword,
    ] as const,
    queryFn: ({ pageParam }) =>
      adminWorkspaceApi.list({
        keyword: debouncedKeyword.trim() || undefined,
        status: "active",
        page: pageParam,
        size: 20,
      }),
    enabled: open,
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.last ? undefined : lastPage.page + 1,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const farmers = useMemo(
    () => farmersQuery.data?.pages.flatMap((page) => page.content) ?? [],
    [farmersQuery.data],
  );

  const selectedFarmer = farmers.find(
    (farmer) => String(farmer.id) === tempSelectedId,
  );

  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (
        farmersQuery.isFetchingNextPage ||
        !farmersQuery.hasNextPage ||
        !node
      ) {
        return;
      }

      observerRef.current?.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0]?.isIntersecting) {
          void farmersQuery.fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    },
    [farmersQuery],
  );

  const handleConfirm = () => {
    if (!selectedFarmer) return;
    onConfirm(selectedFarmer);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl gap-0 overflow-hidden p-0">
        <DialogHeader className="border-b bg-slate-50/50 p-6">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p>Chọn nông hộ</p>
              <p className="mt-1 text-sm font-normal text-muted-foreground">
                Tìm kiếm nông hộ để tạo chứng nhận theo đúng đơn vị được cấp.
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="border-b bg-white p-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên nông hộ, mã, MST, người đại diện..."
              className="h-11 pl-10"
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="h-[420px] bg-slate-50/30">
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {farmers.map((farmer) => {
              const isSelected = tempSelectedId === String(farmer.id);
              const typeLabel = getOrganizationTypeLabel(farmer);
              return (
                <button
                  key={farmer.id}
                  type="button"
                  onClick={() => setTempSelectedId(String(farmer.id))}
                  className={cn(
                    "flex items-start gap-3 rounded-2xl border-2 bg-white p-4 text-left transition-all hover:shadow-sm",
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-transparent hover:border-slate-200",
                  )}
                >
                  <Avatar className="h-11 w-11 shrink-0 border bg-white">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700">
                      <Building2 className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate font-semibold text-slate-900">
                        {farmer.name}
                      </p>
                      <Badge variant="outline" className="text-[10px]">
                        {typeLabel}
                      </Badge>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>Mã: {farmer.code || farmer.id}</span>
                      {farmer.taxCode ? <span>MST: {farmer.taxCode}</span> : null}
                    </div>
                    {farmer.representative ? (
                      <p className="mt-1 truncate text-xs text-slate-500">
                        Đại diện: {farmer.representative}
                      </p>
                    ) : null}
                    {farmer.address ? (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {farmer.address}
                      </p>
                    ) : null}
                  </div>
                  <div
                    className={cn(
                      "mt-1 flex h-5 w-5 items-center justify-center rounded-full border-2",
                      isSelected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300 bg-white",
                    )}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : null}
                  </div>
                </button>
              );
            })}

            {farmersQuery.isLoading ? (
              <div className="col-span-full flex min-h-32 items-center justify-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang tải danh sách nông hộ...
              </div>
            ) : null}

            {!farmersQuery.isLoading && farmers.length === 0 ? (
              <div className="col-span-full flex min-h-32 items-center justify-center rounded-2xl border border-dashed bg-white text-sm text-muted-foreground">
                Không tìm thấy nông hộ phù hợp
              </div>
            ) : null}

            {farmersQuery.hasNextPage ? (
              <div
                ref={loadMoreRef}
                className="col-span-full flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"
              >
                {farmersQuery.isFetchingNextPage ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Đang tải thêm...
                  </>
                ) : (
                  "Cuộn để tải thêm"
                )}
              </div>
            ) : null}
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-2 border-t bg-white p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button disabled={!selectedFarmer} onClick={handleConfirm}>
            Chọn nông hộ
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
