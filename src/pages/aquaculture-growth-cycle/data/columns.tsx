import { Badge, Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, type Column } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Eye, Fish, Hash, Layers, MoreHorizontal, PencilLine, Trash2 } from "lucide-react";
import type { GrowthCycle } from "@/pages/growth-cycle/types/types";
import { formatDaysToDuration, parseDurationToDays } from "@/pages/growth-cycle/utils/duration";

export interface AquacultureGrowthCycleColumnActions { onView: (item: GrowthCycle) => void; onEdit: (item: GrowthCycle) => void; onDelete: (item: GrowthCycle) => void; }

export function createAquacultureGrowthCycleColumns({ onView, onEdit, onDelete }: AquacultureGrowthCycleColumnActions): Column<GrowthCycle>[] {
  return [
    { key: "id", label: "Mã mẫu", render: (value, item: GrowthCycle) => { const foundation = item.isFoundation ?? String(value).startsWith("foundation-"); return <div className="flex flex-col gap-1"><div className="flex w-fit items-center gap-1.5 rounded-md border bg-muted/50 px-2 py-1 font-mono text-xs font-bold text-muted-foreground"><Hash className="h-3 w-3 opacity-60" />{String(value).replace(/^(foundation-|user-)/, "")}</div><Badge variant={foundation ? "secondary" : "outline"} className={foundation ? "w-fit border-blue-200 bg-blue-50 text-[10px] font-bold text-blue-700" : "w-fit border-green-200 bg-green-50 text-[10px] font-bold text-green-700"}>{foundation ? "Hệ thống" : "Cá nhân"}</Badge></div>; } },
    { key: "name", label: "Chu kỳ", render: (value) => <div className="flex items-center gap-2"><Fish className="h-4 w-4 text-primary" /><span className="font-semibold">{value}</span></div> },
    { key: "scope", label: "Phạm vi", render: (value) => <Badge variant="default" className="text-[10px] font-bold uppercase">{value === "group" ? "Theo nhóm loài nuôi" : value === "crop" ? "Theo loài nuôi" : "Theo giống / dòng"}</Badge> },
    { key: "totalDays", label: "Thời gian", render: (_, row: GrowthCycle) => <Badge variant="secondary" className="border-blue-100 bg-blue-50 text-[10px] font-bold uppercase tracking-wider text-blue-700">{formatDaysToDuration(row.stages.reduce((sum, stage) => sum + parseDurationToDays(String(stage.duration)), 0)) || "0 ngày"}</Badge> },
    { key: "numStages", label: "Số giai đoạn", render: (value) => <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground"><Layers className="h-3.5 w-3.5 opacity-60" />{value} giai đoạn</div> },
    { key: "actions", label: "Thao tác", render: (_, item: GrowthCycle) => <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="min-w-48"><DropdownMenuItem onClick={() => onView(item)}><Eye className="mr-2 h-4 w-4" />Xem chi tiết</DropdownMenuItem>{!item.isFoundation && <><DropdownMenuItem onClick={() => onEdit(item)}><PencilLine className="mr-2 h-4 w-4" />Chỉnh sửa</DropdownMenuItem><DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(item)}><Trash2 className="mr-2 h-4 w-4" />Xóa</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu> }
  ];
}
