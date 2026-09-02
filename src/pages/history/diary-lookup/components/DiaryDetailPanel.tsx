import {
  Badge,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList, MapPin, X } from "lucide-react";
import { formatDate, STATUS_CONFIG, WORK_TYPE_CONFIG } from "../constants";
import type { DiaryEntry } from "../types";
import { SeasonTab } from "./tabs/SeasonTab";
import { PlanTab } from "./tabs/PlanTab";
import { WorkTab } from "./tabs/WorkTab";
import { TimeTab } from "./tabs/TimeTab";

interface DiaryDetailPanelProps {
  entry: DiaryEntry;
  onClose: () => void;
}

export function DiaryDetailPanel({ entry, onClose }: DiaryDetailPanelProps) {
  const workType = WORK_TYPE_CONFIG[entry.workType];
  const status = STATUS_CONFIG[entry.status];

  return (
    <div className="w-[480px] border-l bg-white flex flex-col shadow-2xl relative z-30 animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b flex items-center justify-between bg-white/80 backdrop-blur-sm sticky top-0 z-10 gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <ClipboardList size={18} className="text-primary shrink-0" />
          <h3 className="font-bold text-slate-800 truncate text-sm uppercase tracking-wider">
            Chi tiết nhật ký
          </h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-slate-100 h-8 w-8 transition-all shrink-0"
          onClick={onClose}
        >
          <X size={18} />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto split-scrollbar">
        <div className="p-4 space-y-4 border-b border-slate-100">
          <div className="flex items-start gap-3">
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${workType.iconCls}`}>
              <workType.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <span className="font-mono text-[11px] text-slate-400 font-bold">
                {entry.code}
              </span>
              <h2 className="font-bold text-slate-900 text-base leading-snug">
                {entry.name}
              </h2>
              <div className="flex items-center gap-1.5 flex-wrap mt-1">
                <Badge variant="outline" className={`text-[10px] font-bold ${status.cls}`}>
                  {status.label}
                </Badge>
                <Badge variant="outline" className={`text-[10px] font-bold ${workType.badgeCls}`}>
                  {workType.label}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Thời gian
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-800">
                {formatDate(entry.startDate)} → {formatDate(entry.endDate)}
              </p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50/80 p-2.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 flex items-center gap-1">
                <MapPin className="h-3 w-3" /> Vị trí
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-800 truncate">
                {[entry.region, entry.area, entry.plot].filter(Boolean).join(" › ")}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <Tabs defaultValue="season" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="season">Vụ mùa</TabsTrigger>
              <TabsTrigger value="plan">Kế hoạch</TabsTrigger>
              <TabsTrigger value="work">Công việc</TabsTrigger>
              <TabsTrigger value="time">Thời gian</TabsTrigger>
            </TabsList>
            <TabsContent value="season" className="mt-4">
              <SeasonTab entry={entry} />
            </TabsContent>
            <TabsContent value="plan" className="mt-4">
              <PlanTab entry={entry} />
            </TabsContent>
            <TabsContent value="work" className="mt-4">
              <WorkTab entry={entry} />
            </TabsContent>
            <TabsContent value="time" className="mt-4">
              <TimeTab entry={entry} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
