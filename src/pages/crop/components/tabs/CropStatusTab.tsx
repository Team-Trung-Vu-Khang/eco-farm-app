import { Badge, Card, CardContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Activity, Building2, CalendarDays, MapPin, User } from "lucide-react";
import type { Crop } from "../../types/types";

interface CropStatusTabProps {
  crop: Crop;
}

const EMPTY_TEXT = "Chưa có thông tin";

export function CropStatusTab({ crop }: CropStatusTabProps) {
  const info = crop.statusInfo;
  const locationText = [info?.area, info?.location].filter(Boolean).join(" - ");

  // Ưu tiên nhân sự từ API; fallback về dữ liệu cũ (mock) nếu có
  const personnel =
    info?.personnel ??
    (info?.responsiblePerson
      ? [
          { name: info.responsiblePerson.executor, role: "Thực hiện" },
          { name: info.responsiblePerson.manager, role: "Quản lý" },
          { name: info.responsiblePerson.inspector, role: "Kiểm định" },
        ]
      : []);

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
                  {locationText || EMPTY_TEXT}
                </p>
                {info?.lote && (
                  <Badge
                    variant="outline"
                    className="bg-slate-50 text-slate-600 border-slate-200 mt-1"
                  >
                    {info.lote}
                  </Badge>
                )}
              </div>
            </div>
            {info?.owner && (
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Chủ sở hữu
                  </p>
                  <p className="font-bold text-slate-900 text-lg">
                    {info.owner}
                  </p>
                </div>
              </div>
            )}
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
                  {info?.plantDate || EMPTY_TEXT}
                </p>
                {info?.age && (
                  <p className="text-sm text-slate-500 font-medium mt-1">
                    Đã trồng: {info.age}
                  </p>
                )}
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
                <p
                  className={
                    info?.status
                      ? "font-bold text-emerald-600 text-lg"
                      : "font-bold text-slate-400 text-lg"
                  }
                >
                  {info?.status || "Chưa đánh giá"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100 space-y-4">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Nhân sự phụ trách
            </p>
            {personnel.length > 0 ? (
              <div className="space-y-4">
                {personnel.map((person, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm border border-slate-100">
                      <User className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      {person.role && (
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          {person.role}
                        </p>
                      )}
                      <p className="text-sm font-medium text-slate-900">
                        {person.name || EMPTY_TEXT}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm font-medium text-slate-400">{EMPTY_TEXT}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
