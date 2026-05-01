import { type FC } from "react";
import { Badge, Separator } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Info, CalendarDays, Box, Activity, Tags } from "lucide-react";
import { Material } from "../../types/types";

interface MaterialDetailViewProps {
  item: Material;
}

export const MaterialDetailView: FC<MaterialDetailViewProps> = ({ item }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-amber-600 text-white font-bold px-3 py-1 uppercase tracking-wider">
            Vật tư tiêu hao
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Loại vật tư</p>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <Box size={14} className="text-amber-500" />
            {item.type}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Trạng thái</p>
          <div className="flex items-center gap-2 font-bold">
            <Activity size={14} className={item.status === 'active' ? 'text-primary' : 'text-slate-400'} />
            <span className={item.status === 'active' ? 'text-primary' : 'text-slate-400'}>
              {item.status === 'active' ? 'Hoạt động' : 'Ngưng'}
            </span>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} className="text-primary" />
          Mô tả chi tiết
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {item.description || "Chưa có mô tả cho vật tư này."}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Tags size={14} className="text-slate-400" />
          Phân loại nhanh
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="font-bold border-slate-200 text-slate-600">
            {item.type}
          </Badge>
          <Badge variant="outline" className="font-bold border-slate-200 text-slate-600">
            Vật tư nông nghiệp
          </Badge>
        </div>
      </div>
    </div>
  );
};
