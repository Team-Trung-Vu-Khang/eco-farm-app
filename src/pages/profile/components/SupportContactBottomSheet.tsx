import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  Clock,
  Headphones,
  Mail,
  MessageCircle,
  PhoneCall,
} from "lucide-react";

interface SupportContactBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SupportContactBottomSheet({
  open,
  onOpenChange,
}: SupportContactBottomSheetProps) {
  const hotline = "0901 234 567";
  const email = "hotro@mevi.vn";
  const zaloUrl = "https://zalo.me";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Headphones className="h-5 w-5 text-cyan-600" />
            Liên hệ hỗ trợ
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          <div className="p-3.5 rounded-2xl bg-cyan-50/60 border border-cyan-150 text-cyan-900 text-xs leading-relaxed">
            Đội ngũ hỗ trợ kỹ thuật MEVI Farm luôn sẵn sàng đồng hành cùng bà con nông dân và đối tác 6 ngày trong tuần.
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {/* Hotline */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <PhoneCall className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Hotline CSKH</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {hotline}
                  </p>
                </div>
              </div>
              <a
                href={`tel:${hotline.replace(/\s+/g, "")}`}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs"
              >
                Gọi ngay
              </a>
            </div>

            {/* Zalo OA */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Zalo hỗ trợ</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    Nông nghiệp số MEVI
                  </p>
                </div>
              </div>
              <a
                href={zaloUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs"
              >
                Nhắn tin
              </a>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3.5">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium">Email hỗ trợ</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {email}
                  </p>
                </div>
              </div>
              <a
                href={`mailto:${email}`}
                className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
              >
                Gửi mail
              </a>
            </div>
          </div>

          {/* Giờ làm việc */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-150 text-xs text-slate-600">
            <Clock className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-800">Khung giờ hỗ trợ</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                08:00 - 18:00 từ Thứ 2 đến Thứ 7 (Nghỉ Chủ nhật & ngày Lễ)
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="button"
              className="w-full h-12 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold text-sm"
              onClick={() => onOpenChange(false)}
            >
              Đóng
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
