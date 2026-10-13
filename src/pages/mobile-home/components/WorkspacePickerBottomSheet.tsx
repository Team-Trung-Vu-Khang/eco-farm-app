import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  useWorkspace,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  useSelectedWorkspaceId,
  setSelectedWorkspaceId,
  useInfiniteWorkspaces,
  type WorkspaceRecord,
} from "@/features/workspace";
import { useDebounce } from "@/shared/hooks/useDebounce";
import { Building2, Check, Loader2, MapPin, Search } from "lucide-react";
import { formatAppWorkspaceFeatureName } from "@/shared/constants/workspace.constants";

interface WorkspacePickerBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Lấy tên hiển thị của Workspace:
 * - Ưu tiên 1: Tên farm (từ metadataJson.farmDisplayName hoặc brandName) có prefix
 * - Nếu không có tên farm: Tên chủ farm (SĐT), ví dụ: Khang (84975862265)
 */
function getWorkspaceDisplayName(item: WorkspaceRecord): string {
  const meta = item.metadataJson as Record<string, unknown> | null;
  const farmName =
    (meta?.farmDisplayName as string)?.trim() || item.brandName?.trim();

  if (farmName) {
    return formatAppWorkspaceFeatureName(farmName, "farm");
  }

  // Không có tên farm -> Lấy tên chủ farm và số điện thoại
  const ownerName = item.owner?.fullName?.trim() || item.representative?.trim();

  const phone =
    item.owner?.phoneNumber?.trim() ||
    (item.name && /^[0-9+]+$/.test(item.name.trim()) ? item.name.trim() : "");

  if (ownerName && phone) {
    return `${ownerName} (${phone})`;
  }
  if (ownerName) {
    return ownerName;
  }
  if (phone) {
    return phone;
  }

  return item.name?.trim() || formatAppWorkspaceFeatureName(undefined, "farm");
}

export function WorkspacePickerBottomSheet({
  open,
  onOpenChange,
}: WorkspacePickerBottomSheetProps) {
  const selectedWorkspaceId = useSelectedWorkspaceId();
  const { setCurrentWorkspaceId: setSharedWorkspaceId } = useWorkspace();

  const [search, setSearch] = useState("");
  // Chỉ debounce từ khóa khi sheet đang mở để tránh kích hoạt effect khi đã đóng
  const debouncedSearch = useDebounce(open ? search.trim() : "", 300);

  // Reset ô tìm kiếm khi đóng Bottom Sheet
  useEffect(() => {
    if (!open) {
      setSearch("");
    }
  }, [open]);

  // Lấy danh sách workspace hỗ trợ Infinite Scroll (chỉ fetch khi sheet mở)
  const {
    workspaces,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteWorkspaces(
    {
      keyword: debouncedSearch || undefined,
      size: 20,
    },
    { enabled: Boolean(open) },
  );

  const handleSelect = (item: WorkspaceRecord) => {
    // Đóng sheet ngay lập tức trước khi đổi workspace
    onOpenChange(false);
    setSelectedWorkspaceId(item.id);
    setSharedWorkspaceId(String(item.id));
  };

  // Bắt sự kiện cuộn đến gần cuối danh sách để tải thêm trang kế tiếp
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 80) {
      if (hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="h-[75dvh] max-h-[85dvh] flex flex-col rounded-t-3xl px-4 pb-[calc(1.5rem+env(safe-area-inset-bottom,0px))] pt-4 sm:max-w-md mx-auto"
      >
        <SheetHeader className="shrink-0 text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900">
            Chọn nông trại / đơn vị làm việc
          </SheetTitle>
        </SheetHeader>

        {/* Ô Input Search */}
        <div className="shrink-0 relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo tên nông trại, địa chỉ, MST..."
            className="w-full h-11 pl-9 pr-4 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" />
          )}
        </div>

        {/* Danh sách Workspace có Infinite Scroll */}
        <div
          onScroll={handleScroll}
          className="mt-3 flex-1 min-h-0 overflow-y-auto space-y-2 pr-1"
        >
          {workspaces.length === 0 ? (
            <div className="h-full min-h-[160px] flex flex-col items-center justify-center py-8 text-center text-sm text-slate-500">
              {isLoading
                ? "Đang tải danh sách..."
                : "Không tìm thấy nông trại nào"}
            </div>
          ) : (
            <>
              {workspaces.map((item) => {
                const isSelected =
                  String(item.id) === String(selectedWorkspaceId);
                const displayName = getWorkspaceDisplayName(item);

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-slate-200 bg-white hover:border-primary/40 active:bg-slate-50 text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div
                        className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center ${
                          isSelected
                            ? "bg-primary text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <Building2 className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span>
                            {item.province ||
                              item.address ||
                              item.representative ||
                              item.taxCode ||
                              "Cơ sở sản xuất"}
                          </span>
                        </p>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 text-white stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}

              {/* Indicator đang tải thêm trang tiếp theo */}
              {isFetchingNextPage && (
                <div className="py-3 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <span>Đang tải thêm...</span>
                </div>
              )}
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
