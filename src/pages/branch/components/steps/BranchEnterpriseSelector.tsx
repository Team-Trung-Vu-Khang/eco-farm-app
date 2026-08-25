import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Briefcase, Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { Enterprise } from "@/pages/enterprise/data/constants";

interface BranchEnterpriseSelectorProps {
  enterprises: Enterprise[];
  selectedId: string;
  onSelect: (id: string) => void;
  disabled?: boolean;
  searchTerm?: string;
  onSearch?: (value: string) => void;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loading?: boolean;
}

const enterpriseTypeLabels: Record<Enterprise["type"], string> = {
  enterprise: "Doanh nghiệp",
  farm: "Nông hộ",
  cooperative: "Hợp tác xã",
};

const getEnterpriseTypeLabel = (type: Enterprise["type"]) =>
  enterpriseTypeLabels[type] ?? type;

export function BranchEnterpriseSelector({
  enterprises,
  selectedId,
  onSelect,
  disabled = false,
  searchTerm: controlledSearchTerm,
  onSearch,
  onLoadMore,
  hasMore: remoteHasMore,
  loading = false,
}: BranchEnterpriseSelectorProps) {
  const PAGE_SIZE = 8;
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSelectedId, setTempSelectedId] = useState(selectedId);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const selectedEnterprise = enterprises.find(
    (enterprise) => enterprise.id.toString() === selectedId,
  );

  const isRemoteSearch = Boolean(onSearch);
  const displayedSearchTerm = controlledSearchTerm ?? searchTerm;
  const filteredEnterprises = useMemo(() => {
    if (isRemoteSearch) return enterprises;
    const keyword = displayedSearchTerm.toLowerCase();
    return enterprises.filter((enterprise) => {
      return (
        enterprise.name.toLowerCase().includes(keyword) ||
        enterprise.code.toLowerCase().includes(keyword)
      );
    });
  }, [displayedSearchTerm, enterprises, isRemoteSearch]);

  const visibleEnterprises = useMemo(
    () =>
      isRemoteSearch
        ? filteredEnterprises
        : filteredEnterprises.slice(0, visibleCount),
    [filteredEnterprises, isRemoteSearch, visibleCount],
  );
  const hasMore = isRemoteSearch
    ? Boolean(remoteHasMore)
    : visibleCount < filteredEnterprises.length;

  const handleConfirm = () => {
    onSelect(tempSelectedId);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setTempSelectedId(selectedId);
    if (isRemoteSearch) onSearch?.("");
    else setSearchTerm("");
    setVisibleCount(PAGE_SIZE);
    setIsOpen(false);
  };

  return (
    <>
      <div
        className={[
          "group border rounded-xl p-4 transition-all min-h-10 flex items-center",
          selectedEnterprise
            ? "bg-white border-slate-200"
            : "bg-slate-50 border-dashed border-slate-300",
          disabled
            ? "cursor-default opacity-80"
            : "hover:shadow-sm cursor-pointer",
        ].join(" ")}
        onClick={() => {
          if (disabled) return;
          setTempSelectedId(selectedId);
          if (isRemoteSearch) onSearch?.("");
          else setSearchTerm("");
          setVisibleCount(PAGE_SIZE);
          setIsOpen(true);
        }}
      >
        {selectedEnterprise ? (
          <div className="flex w-full flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-primary/20 bg-primary/10 shadow-sm">
                {selectedEnterprise.image ? (
                  <img
                    src={selectedEnterprise.image}
                    alt={selectedEnterprise.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Briefcase className="h-6 w-6 text-primary" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="h-4 border-primary/20 bg-primary/5 px-1.5 py-0 font-mono text-[10px] text-primary"
                  >
                    {selectedEnterprise.code}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="h-4 bg-slate-100 px-1.5 py-0 text-[10px] capitalize font-medium"
                  >
                    {getEnterpriseTypeLabel(selectedEnterprise.type)}
                  </Badge>
                </div>
                <div className="mb-1 text-base font-bold leading-tight text-slate-900">
                  {selectedEnterprise.name}
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <span className="font-medium text-slate-500">MST:</span>
                  <span>{selectedEnterprise.taxCode}</span>
                </div>
              </div>
              {!disabled && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 rounded-full p-0 text-slate-400 hover:bg-primary/10 hover:text-primary group-hover:text-primary"
                >
                  <Search className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2.5 text-xs text-slate-600">
                <div className="shrink-0 rounded-md bg-slate-100 p-1">
                  <Briefcase className="h-3.5 w-3.5 text-slate-500" />
                </div>
                <div className="leading-relaxed">
                  <span className="mr-1 font-medium text-slate-800">Địa chỉ:</span>
                  {selectedEnterprise.address}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center gap-3 py-4 text-muted-foreground transition-all group-hover:text-primary">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-primary/10">
              <Search className="h-6 w-6 opacity-40 group-hover:opacity-100" />
            </div>
            <div className="text-sm font-semibold">Bấm để chọn đơn vị sở hữu</div>
            <div className="text-[11px] opacity-60">
              Thông tin đơn vị sẽ được điền vào chi nhánh
            </div>
          </div>
        )}
      </div>

      <Dialog
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) handleCancel();
        }}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Đơn vị sở hữu
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 z-10 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc mã đơn vị..."
                className="border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white"
                value={displayedSearchTerm}
                onChange={(event) => {
                  if (isRemoteSearch) onSearch?.(event.target.value);
                  else setSearchTerm(event.target.value);
                  setVisibleCount(PAGE_SIZE);
                }}
              />
            </div>

            <div
              className="h-100 overflow-y-auto rounded-xl border bg-slate-50/50"
              onScroll={(event) => {
                const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
                if (
                  hasMore &&
                  !loading &&
                  scrollHeight - scrollTop - clientHeight < 48
                ) {
                  if (isRemoteSearch) onLoadMore?.();
                  else {
                    setVisibleCount((count) =>
                      Math.min(count + PAGE_SIZE, filteredEnterprises.length),
                    );
                  }
                }
              }}
            >
              <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
                {visibleEnterprises.map((enterprise) => (
                  <div
                    key={enterprise.id}
                    className={[
                      "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-all hover:shadow-md",
                      tempSelectedId === enterprise.id.toString()
                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                        : "border-slate-200 bg-white hover:border-primary/40",
                    ].join(" ")}
                    onClick={() => setTempSelectedId(enterprise.id.toString())}
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
                      {enterprise.image ? (
                        <img
                          src={enterprise.image}
                          alt={enterprise.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Briefcase className="h-6 w-6 text-slate-400" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 line-clamp-2 min-h-10 text-sm font-bold leading-tight text-slate-900">
                        {enterprise.name}
                      </div>
                      <div className="mt-auto flex flex-wrap gap-1.5">
                        <Badge
                          variant="secondary"
                          className="h-4 px-1.5 py-0 font-mono text-[10px]"
                        >
                          {enterprise.code}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="h-4 bg-slate-50 px-1.5 py-0 text-[10px] capitalize"
                        >
                          {getEnterpriseTypeLabel(enterprise.type)}
                        </Badge>
                      </div>
                    </div>
                    <div className="mt-1">
                      <div
                        className={[
                          "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-all",
                          tempSelectedId === enterprise.id.toString()
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300 bg-white",
                        ].join(" ")}
                      >
                        {tempSelectedId === enterprise.id.toString() && (
                          <div className="h-2 w-2 rounded-full bg-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {loading && filteredEnterprises.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <div className="text-sm">Đang tìm kiếm đơn vị...</div>
                  </div>
                ) : filteredEnterprises.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center gap-3 py-12 text-muted-foreground">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <Search className="h-6 w-6 text-slate-300" />
                    </div>
                    <div className="text-sm">Không tìm thấy đơn vị phù hợp</div>
                  </div>
                ) : null}
              </div>
              {hasMore ? (
                <p className="py-3 text-center text-sm text-muted-foreground">
                  {loading ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Đang tải đơn vị...
                    </span>
                  ) : (
                    "Cuộn xuống để tải thêm đơn vị"
                  )}
                </p>
              ) : loading && filteredEnterprises.length > 0 ? (
                <p className="flex items-center justify-center gap-2 py-3 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang tìm đơn vị...
                </p>
              ) : null}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
              <Button onClick={handleConfirm}>Chọn đơn vị</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
