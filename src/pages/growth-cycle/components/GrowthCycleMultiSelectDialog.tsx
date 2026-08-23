import { useInfiniteQuery } from "@tanstack/react-query";
import { Badge, Button, Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, Input, cn } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Loader2, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { productionSubjectApi, productionSubjectGroupApi, productionSubjectVariantApi } from "../../../features/foundation/api/foundation.api";
import type { PageResponse, ProductionSubjectGroupResponse, ProductionSubjectResponse, ProductionSubjectVariantResponse } from "../../../features/foundation/types/foundation.type";

export interface GrowthCycleMultiSelectOption { id: string; name: string; group: string; image: string; description?: string; code?: string; }
type ScopeResource = "group" | "crop" | "variety";
type ScopeResponse = PageResponse<ProductionSubjectGroupResponse> | PageResponse<ProductionSubjectResponse> | PageResponse<ProductionSubjectVariantResponse>;

interface GrowthCycleMultiSelectDialogProps {
  open: boolean; onOpenChange: (open: boolean) => void; title: string; description?: string; searchPlaceholder: string;
  selectedIds: string[]; resource: ScopeResource; subjectIds?: string[];
  optionsLabel: string; onConfirm: (ids: string[]) => void;
  domainCode?: "CROP" | "LIVESTOCK" | "AQUACULTURE";
}

const PAGE_SIZE = 20;

function toOption(item: ProductionSubjectGroupResponse | ProductionSubjectResponse | ProductionSubjectVariantResponse): GrowthCycleMultiSelectOption {
  if ("domainCode" in item && "subject" in item) return { id: String(item.id), name: item.name, group: item.subject?.name || item.origin || "", image: item.imageUrl || "", description: item.description || "", code: item.code };
  if ("biological" in item) return { id: String(item.id), name: item.name, group: "", image: "", description: item.description || item.biological || "", code: item.code };
  return { id: String(item.id), name: item.name, group: item.scientificName || "", image: item.imageUrl || "", description: item.scientificName || "", code: item.code };
}

function OptionCard({ option, selected, onClick }: { option: GrowthCycleMultiSelectOption; selected: boolean; onClick: () => void }) {
  return <button type="button" onClick={onClick} className={cn("group flex items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:border-primary/30 hover:shadow-md", selected ? "border-primary/40 bg-primary/5 shadow-sm" : "border-slate-200")}>
    <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">{option.image ? <img src={option.image} alt={option.name} className="h-full w-full rounded-xl object-cover" /> : <span className="text-lg font-black text-muted-foreground">{option.name.charAt(0).toUpperCase()}</span>}</div>
    <div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="truncate text-sm font-bold text-slate-900">{option.name}</h3><p className="mt-1 line-clamp-2 text-xs text-slate-500">{option.description}</p></div><div className={cn("mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors", selected ? "border-primary bg-primary text-white" : "border-slate-300 bg-white")}>{selected && <Check className="h-3 w-3" />}</div></div><div className="mt-3 flex flex-wrap items-center gap-2">{option.group && <Badge variant="secondary" className="bg-slate-100 text-slate-700">{option.group}</Badge>}{option.code && <Badge variant="outline" className="border-slate-200 text-slate-600">{option.code}</Badge>}</div></div>
  </button>;
}

export function GrowthCycleMultiSelectDialog({ open, onOpenChange, title, description, searchPlaceholder, selectedIds, resource, subjectIds = [], optionsLabel, onConfirm, domainCode = "CROP" }: GrowthCycleMultiSelectDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [keyword, setKeyword] = useState("");
  const [tempIds, setTempIds] = useState<string[]>(selectedIds);
  const wasOpen = useRef(false);

  useEffect(() => { const timer = window.setTimeout(() => setKeyword(searchTerm.trim()), 300); return () => window.clearTimeout(timer); }, [searchTerm]);
  useEffect(() => {
    if (open && !wasOpen.current) {
      setTempIds(selectedIds);
      setSearchTerm("");
      setKeyword("");
    }
    wasOpen.current = open;
  }, [open, selectedIds]);

  const query = useInfiniteQuery<ScopeResponse, Error>({
    queryKey: ["growth-cycle-scope-options", resource, keyword, subjectIds, domainCode], enabled: open, initialPageParam: 0,
    queryFn: ({ pageParam }) => {
      const params = { page: pageParam as number, size: PAGE_SIZE, keyword: keyword || undefined, status: "active" as const, domainCode };
      if (resource === "group") return productionSubjectGroupApi.list({ ...params, domainCode });
      if (resource === "crop") return productionSubjectApi.list(params);
      return productionSubjectVariantApi.list({ ...params, subjectId: subjectIds.length === 1 ? Number(subjectIds[0]) : undefined });
    },
    getNextPageParam: (lastPage) => lastPage.last ? undefined : lastPage.page + 1,
    refetchOnWindowFocus: false,
  });
  const fetchedOptions = useMemo(() => query.data?.pages.flatMap((page) => page.content).map((item) => toOption(item as ProductionSubjectGroupResponse | ProductionSubjectResponse | ProductionSubjectVariantResponse)).filter((option, index, all) => all.findIndex((item) => item.id === option.id) === index) ?? [], [query.data?.pages]);
  const totalElements = query.data?.pages[0]?.totalElements ?? fetchedOptions.length;
  const toggleOption = (id: string) => setTempIds((prev) => prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]);

  return <Dialog open={open} onOpenChange={(nextOpen) => { if (nextOpen) { setTempIds(selectedIds); setSearchTerm(""); } onOpenChange(nextOpen); }}>
    <DialogContent className="flex max-h-[calc(100vh-2rem)] max-w-4xl flex-col overflow-hidden rounded-2xl border-none p-0 shadow-2xl">
      <DialogHeader className="shrink-0 border-b bg-slate-50 px-6 py-5"><DialogTitle className="flex items-center gap-2 text-lg"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Search className="h-4 w-4" /></div>{title}</DialogTitle>{description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}</DialogHeader>
      <div className="shrink-0 border-b bg-white px-6 py-4"><div className="relative"><Search className="absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder={searchPlaceholder} className="h-11 rounded-xl border-slate-200 bg-slate-50 pl-10 transition-all focus:bg-white" /></div><div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground"><span>{totalElements} mục</span>{tempIds.length > 0 && <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-primary"><Check className="h-3 w-3" />Đã chọn {tempIds.length}</span>}</div></div>
      <div className="min-h-0 flex-1 overflow-y-auto" onScroll={(event) => { const element = event.currentTarget; const nearBottom = element.scrollHeight - element.scrollTop - element.clientHeight < 240; if (nearBottom && query.hasNextPage && !query.isFetchingNextPage) void query.fetchNextPage(); }}><div className="space-y-5 p-5"><div><div className="mb-3 text-sm font-semibold text-slate-700">{optionsLabel}</div><div className="grid gap-3 sm:grid-cols-2">{fetchedOptions.map((option) => <OptionCard key={option.id} option={option} selected={tempIds.includes(option.id)} onClick={() => toggleOption(option.id)} />)}</div>{query.isLoading && <div className="flex min-h-[120px] items-center justify-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" />Đang tải dữ liệu...</div>}{!query.isLoading && fetchedOptions.length === 0 && <div className="flex min-h-[120px] items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 text-center text-sm text-muted-foreground">Không tìm thấy dữ liệu phù hợp</div>}{query.isFetchingNextPage && <div className="flex items-center justify-center gap-2 py-3 text-xs text-muted-foreground"><Loader2 className="h-3.5 w-3.5 animate-spin" />Đang tải thêm...</div>}</div></div></div>
      <DialogFooter className="shrink-0 border-t bg-white px-6 py-4"><Button variant="ghost" onClick={() => onOpenChange(false)}>Hủy</Button><Button onClick={() => { onConfirm(tempIds); onOpenChange(false); }} className="bg-primary hover:bg-primary/90">Xác nhận{tempIds.length > 0 ? ` (${tempIds.length})` : ""}</Button></DialogFooter>
    </DialogContent>
  </Dialog>;
}
