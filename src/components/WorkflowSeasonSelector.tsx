import { useSystemGrowthCycleSeasons, useUserGrowthCycleSeasons } from "@/features/farm";
import type { DomainCode } from "@/features/farm-supply/types";
import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Search } from "lucide-react";
import { useMemo, useState } from "react";

type SeasonOption = { id: number; code?: string; name?: string };

interface WorkflowSeasonSelectorProps {
  domainCode: DomainCode;
  value: number[];
  onChange: (ids: number[], seasons: SeasonOption[]) => void;
}

export default function WorkflowSeasonSelector({
  domainCode,
  value,
  onChange,
}: WorkflowSeasonSelectorProps) {
  const [keyword, setKeyword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const params = { domainCode, keyword: keyword.trim() || undefined, page: 0, size: 100 };
  const userQuery = useUserGrowthCycleSeasons({ params });
  const systemQuery = useSystemGrowthCycleSeasons({ params });

  const options = useMemo(() => {
    const byId = new Map<number, SeasonOption>();
    [...(systemQuery.items || []), ...(userQuery.items || [])].forEach((item) => {
      const id = Number(item.id);
      if (!Number.isNaN(id)) byId.set(id, { id, code: item.code, name: item.name });
    });
    return Array.from(byId.values());
  }, [systemQuery.items, userQuery.items]);

  const selected = useMemo(
    () => options.filter((option) => value.includes(option.id)),
    [options, value],
  );

  const toggle = (option: SeasonOption) => {
    const nextIds = value.includes(option.id)
      ? value.filter((id) => id !== option.id)
      : [...value, option.id];
    const nextOptions = options.filter((item) => nextIds.includes(item.id));
    onChange(nextIds, nextOptions);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-500">Vụ mùa áp dụng</p>
          <p className="mt-1 text-xs text-slate-500">Có thể chọn nhiều vụ mùa, không bắt buộc.</p>
        </div>
        {value.length > 0 && <Badge variant="outline" className="border-emerald-200 bg-white text-emerald-700">{value.length} đã chọn</Badge>}
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={() => setIsOpen(true)}
        className="h-12 w-full justify-center border-2 border-dashed border-emerald-200 bg-emerald-50/40 font-bold text-emerald-700 hover:bg-emerald-50"
      >
        {selected.length === 0 ? "+  Chọn vụ mùa áp dụng" : selected.map((item) => item.name || item.code || `#${item.id}`).join(", ")}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-xl overflow-hidden rounded-2xl p-0">
          <DialogHeader className="border-b bg-slate-50 p-6">
            <DialogTitle>Chọn vụ mùa áp dụng</DialogTitle>
            <p className="text-sm text-slate-500">Chọn một hoặc nhiều vụ mùa cho quy trình.</p>
          </DialogHeader>
          <div className="border-b p-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="Tìm vụ mùa..." className="h-11 pl-9" />
            </div>
          </div>
          <ScrollArea className="max-h-[55vh]">
            <div className="space-y-2 p-5">
              {userQuery.isLoading || systemQuery.isLoading ? <div className="p-8 text-center text-sm text-slate-500">Đang tải vụ mùa...</div> : options.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">Không tìm thấy vụ mùa</div> : options.map((option) => {
                const checked = value.includes(option.id);
                return <button type="button" key={option.id} onClick={() => toggle(option)} className={`flex w-full items-center gap-3 rounded-xl border-2 p-3 text-left transition ${checked ? "border-emerald-300 bg-emerald-50" : "border-slate-100 hover:border-emerald-200"}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checked ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}>{checked && <Check className="h-3.5 w-3.5" />}</span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold">{option.name || option.code || `Vụ mùa #${option.id}`}</span>
                  {option.code && <span className="text-xs text-slate-400">{option.code}</span>}
                </button>;
              })}
            </div>
          </ScrollArea>
          <div className="flex justify-end border-t bg-slate-50 p-4"><Button type="button" onClick={() => setIsOpen(false)}>Xác nhận</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
