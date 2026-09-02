import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Apple, FileText, Image as ImageIcon, Link2, ListChecks } from "lucide-react";
import { WORK_TYPE_CONFIG } from "../../constants";
import type { DiaryEntry } from "../../types";

export function WorkTab({ entry }: { entry: DiaryEntry }) {
  const workType = WORK_TYPE_CONFIG[entry.workType];

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 ${workType.iconCls}`}>
            <workType.icon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={`text-[10px] font-bold ${workType.badgeCls}`}>
                {workType.label}
              </Badge>
              <span className="inline-block rounded-md bg-green-50 px-1.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-200">
                {entry.taskCategory.name}
              </span>
            </div>
            <h4 className="font-bold text-slate-800 mt-0.5">{entry.name}</h4>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <FileText className="h-3.5 w-3.5" /> Mô tả chi tiết
        </p>
        <p className="text-sm text-slate-700 leading-relaxed">
          {entry.description || "Chưa có mô tả."}
        </p>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
            <ListChecks className="h-3.5 w-3.5" /> Hạng mục công việc
          </p>
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-[10px]">
            {entry.stages.length} mục
          </Badge>
        </div>
        {entry.stages.length > 0 ? (
          <div className="grid gap-2">
            {entry.stages.map((stage, index) => (
              <div
                key={stage}
                className="flex items-center gap-3 rounded-xl border border-slate-150 bg-slate-50/50 px-3 py-2.5 text-xs font-semibold text-slate-700"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-white border text-[10px] text-slate-400 font-bold">
                  {index + 1}
                </span>
                <span className="flex-1 truncate">{stage}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Chưa có hạng mục nào.</p>
        )}
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <Link2 className="h-3.5 w-3.5" /> Vật tư sử dụng
        </p>
        {entry.materialAllocations.length > 0 ? (
          <div className="space-y-1.5">
            {entry.materialAllocations.map((m, idx) => (
              <div
                key={`${m.materialName}-${idx}`}
                className="flex items-center justify-between bg-slate-50 rounded-lg border border-slate-100 px-3 py-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-700">{m.materialName}</span>
                  <span className="text-slate-400"> ({m.materialType})</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    Hạng mục: {m.stageId}
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border shrink-0">
                  {m.quantity} {m.unit}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Chưa cấp phát vật tư.</p>
        )}
      </div>

      {entry.harvest && (
        <div className="rounded-2xl border border-orange-100 bg-orange-50/30 p-4 space-y-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange-600 flex items-center gap-1.5">
            <Apple className="h-3.5 w-3.5" /> Chi tiết thu hoạch (
            {entry.harvest.scope === "region" ? "Vùng canh tác" : "Cây canh tác"})
          </p>
          <div className="space-y-1.5">
            {entry.harvest.details.map((d) => (
              <div
                key={d.targetLabel}
                className="flex items-center justify-between bg-white rounded-lg border border-orange-100 px-3 py-2 text-xs"
              >
                <span className="font-semibold text-slate-700">{d.targetLabel}</span>
                <span className="text-[11px] font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                  {d.quantity} {d.unitBase}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400 flex items-center gap-1.5">
          <ImageIcon className="h-3.5 w-3.5" /> Hình ảnh công việc
        </p>
        {entry.images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {entry.images.map((url) => (
              <div
                key={url}
                className="h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm"
              >
                <img src={url} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">Chưa có hình ảnh đính kèm.</p>
        )}
      </div>
    </div>
  );
}
