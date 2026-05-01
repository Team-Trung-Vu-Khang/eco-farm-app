import { type FC } from "react";
import { Badge, Card, CardContent, Separator } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ShieldCheck, FlaskConical, Info, CalendarDays, Package, Building2 } from "lucide-react";
import { Pesticide } from "../../types/types";

interface PesticideDetailViewProps {
  item: Pesticide;
}

export const PesticideDetailView: FC<PesticideDetailViewProps> = ({ item }) => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Badge className="bg-emerald-600 text-white font-bold px-3 py-1 uppercase tracking-wider">
            Thuốc BVTV
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
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Dạng thuốc</p>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <FlaskConical size={14} className="text-blue-500" />
            {item.form}
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Cơ chế</p>
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <ShieldCheck size={14} className="text-emerald-500" />
            {item.actionType}
          </div>
        </div>
      </div>

      <Separator className="bg-slate-100" />

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Info size={14} className="text-primary" />
          Thành phần hoạt chất
        </h3>
        <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/50 p-4 rounded-xl border border-dashed border-slate-200">
          {item.activeIngredient}
        </p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Building2 size={14} className="text-slate-400" />
          Nguồn gốc & Nhóm
        </h3>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="font-bold border-slate-200 text-slate-600">
            {item.origin}
          </Badge>
          <Badge variant="outline" className="font-bold border-slate-200 text-slate-600">
            {item.group}
          </Badge>
        </div>
      </div>

      <Card className="border-slate-100 shadow-none bg-blue-50/30 border-blue-100">
        <CardContent className="p-4 flex items-start gap-3">
          <Package className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-blue-900 uppercase tracking-tight">Quy cách đóng gói</h4>
            <p className="text-sm text-blue-800/80 mt-1">Sản phẩm được đóng gói theo tiêu chuẩn an toàn sinh học.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
