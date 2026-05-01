import { type FC } from "react";
import { Badge, Separator } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Info, CalendarDays, Settings, Clock } from "lucide-react";
import { Equipment } from "../../types/types";

interface EquipmentDetailViewProps {
  item: Equipment;
}

export const EquipmentDetailView: FC<EquipmentDetailViewProps> = ({ item }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-slate-800 text-white font-bold px-3 py-1 uppercase tracking-wider">
            Thiết bị / Công cụ
          </Badge>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border">
            {item.code}
          </span>
        </div>
        
        <h2 className="text-2xl font-black text-slate-900 leading-tight">
          {item.name}
        </h2>

        <div className="flex items-center gap-2 text-sm text-slate-500 font-medium">
          <CalendarDays size={14} />
          Ngày tạo: {item.createdAt}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại thiết bị</p>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Settings size={14} className="text-slate-500" />
            {item.type}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
          <div className="flex items-center gap-2 font-bold">
            <span className={
              item.status === 'active' ? 'text-emerald-600' : 
              item.status === 'maintenance' ? 'text-amber-600' : 'text-slate-400'
            }>
              {item.status === 'active' ? 'Hoạt động' : 
               item.status === 'maintenance' ? 'Bảo trì' : 'Ngưng'}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={14} className="text-blue-500" />
          Chu kỳ bảo trì
        </h3>
        <p className="text-sm text-slate-700 font-bold bg-slate-100 p-4 rounded-xl border border-slate-200">
          {item.maintainanceInterval}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} className="text-primary" />
          Mô tả kỹ thuật
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description}
        </p>
      </div>
    </div>
  );
};
