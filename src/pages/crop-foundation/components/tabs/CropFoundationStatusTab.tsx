import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Building2, CalendarDays, MapPin, User } from "lucide-react";
import type { CropFoundation } from "../../types/types";

interface CropFoundationStatusTabProps {
  cropFoundation: CropFoundation;
}

export function CropFoundationStatusTab({ cropFoundation }: CropFoundationStatusTabProps) {
  return (
    <Card className="border-none shadow-sm ring-1 ring-slate-200/50 bg-white rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
      <CardContent className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0 border border-emerald-100">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Khu vực & Vị trí
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {cropFoundation.statusInfo?.area} - {cropFoundation.statusInfo?.location}
                </p>
                <Badge
                  variant="outline"
                  className="bg-slate-50 text-slate-600 border-slate-200 mt-1"
                >
                  {cropFoundation.statusInfo?.lote}
                </Badge>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Chủ sở hữu
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {cropFoundation.statusInfo?.owner}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0 border border-orange-100">
                <CalendarDays className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Thời gian trồng & Tuổi
                </p>
                <p className="font-bold text-slate-900 text-lg">
                  {cropFoundation.statusInfo?.plantDate}
                </p>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Đã trồng: {cropFoundation.statusInfo?.age}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-rose-50 rounded-lg flex items-center justify-center text-rose-600 shrink-0 border border-rose-100">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                  Hiện trạng sức khỏe
                </p>
                <p className="font-bold text-emerald-600 text-lg">
                  {cropFoundation.statusInfo?.status}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nhân sự phụ trách
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Thực hiện
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {cropFoundation.statusInfo?.responsiblePerson.executor}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Quản lý
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {cropFoundation.statusInfo?.responsiblePerson.manager}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                    Kiểm định
                  </p>
                  <p className="text-sm font-medium text-slate-900">
                    {cropFoundation.statusInfo?.responsiblePerson.inspector}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
