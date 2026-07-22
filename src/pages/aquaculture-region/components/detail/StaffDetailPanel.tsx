import React from "react";
import { Card, CardContent, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Contact,
  Layers,
  Phone,
  Mail,
  MapPin,
  User,
} from "lucide-react";
import type { PersonnelItem } from "../../useCultivationRegionDetail";

interface StaffDetailPanelProps {
  staff: PersonnelItem;
}

export const StaffDetailPanel = ({ staff }: StaffDetailPanelProps) => {
  const positionName = staff.positionName || "—";
  const department = "Phòng kỹ thuật";
  const team = "Tổ nuôi trồng";
  const phone = "—";
  const email = "—";

  const addressParts = [];
  const address = addressParts.length > 0 ? addressParts.join(", ") : "—";

  return (
    <Card>
      {/* Header – Avatar & Name */}
      <div className="p-6 border-b bg-slate-50/30 relative">
        <div className="flex items-center gap-5">
          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl bg-white p-1 shadow-lg border border-slate-100 shrink-0">
            <div className="w-full h-full rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold overflow-hidden text-2xl select-none">
              {staff.avatarUrl ? (
                <img
                  src={staff.avatarUrl}
                  alt={staff.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                staff.fullName.charAt(0)
              )}
            </div>
          </div>

          {/* Name & Position badge */}
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight leading-tight">
              {staff.fullName}
            </h3>
            <div className="flex items-center gap-1.5 mt-1">
              <Badge className="bg-primary/10 text-primary border-none text-[9px] px-2 py-0 h-4 font-black uppercase tracking-widest">
                {positionName}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-6 space-y-7">
        <>
          {/* Đơn vị công tác */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <Layers className="w-3 h-3" />
              Đơn vị công tác
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 transition-colors hover:border-primary/20">
                <span className="block text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-tight">
                  Bộ phận
                </span>
                <span className="text-sm font-bold text-slate-800 tracking-tight">
                  {department}
                </span>
              </div>
            </div>
          </div>

          {/* Thông tin liên hệ */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <Contact className="w-3 h-3" />
              Thông tin liên hệ
            </div>
            <div className="space-y-2.5">
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-tight">
                    Số điện thoại
                  </span>
                  <span className="text-[15px] font-bold text-slate-800 tracking-tight select-all">
                    {phone}
                  </span>
                </div>
              </div>
              <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary border border-primary/10 group-hover:scale-110 transition-transform shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[10px] text-slate-400 font-bold uppercase mb-0.5 tracking-tight">
                    Địa chỉ Email
                  </span>
                  <span className="text-[15px] font-bold text-slate-800 truncate block tracking-tight select-all">
                    {email}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Địa chỉ thường trú */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] uppercase font-black text-slate-400 tracking-[0.2em]">
              <MapPin className="w-3 h-3" />
              Địa chỉ thường trú
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex gap-3 text-slate-600 leading-relaxed text-sm font-medium">
              <MapPin className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
              <span className="text-slate-700">{address}</span>
            </div>
          </div>
        </>
      </CardContent>
    </Card>
  );
};

// Empty state when no staff selected
export const StaffDetailEmpty = () => (
  <Card className="border-2 border-dashed border-slate-200 bg-slate-50/30 h-125 flex flex-col items-center justify-center p-12 text-center group">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500 scale-150" />
      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-slate-200 relative z-10 border border-slate-100 shadow-xl group-hover:scale-110 transition-all duration-500">
        <User className="w-12 h-12 text-slate-100" />
      </div>
    </div>
    <div className="relative z-10 space-y-3 max-w-70">
      <h4 className="font-black text-xl text-slate-300 tracking-tight">
        HỒ SƠ NHÂN SỰ
      </h4>
      <p className="text-xs text-slate-400 font-medium leading-relaxed">
        Thông tin chi tiết của nhân viên sẽ được hiển thị tại đây khi bạn chọn
        từ danh sách bên trái.
      </p>
      <div className="pt-4 flex justify-center gap-1.5 opacity-30">
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-8 h-1 rounded-full bg-slate-200" />
        ))}
      </div>
    </div>
  </Card>
);
