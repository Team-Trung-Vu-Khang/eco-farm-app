import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useAuth } from "@/features/auth";
import { getUserLogoText } from "@/pages/mobile-home/utils/user-logo.util";
import {
  Phone,
  Mail,
  User,
  Shield,
  UserRound,
} from "lucide-react";

interface PersonalInfoBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PersonalInfoBottomSheet({
  open,
  onOpenChange,
}: PersonalInfoBottomSheetProps) {
  const { currentUser } = useAuth();

  const displayName = currentUser?.fullName || currentUser?.username || "Người dùng";
  const logoText = getUserLogoText(displayName);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-blue-600" />
            Thông tin cá nhân
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Avatar & Display name summary */}
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100/60">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#16B371] to-[#139B62] text-xl font-bold text-white shadow-sm ring-2 ring-primary/20 select-none">
              {displayName ? logoText : <UserRound className="h-6 w-6 text-white" />}
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-slate-900 truncate">
                {displayName}
              </h4>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Tài khoản thành viên MEVI Farm
              </p>
            </div>
          </div>

          {/* Details list */}
          <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
            {/* Họ và tên */}
            <div className="flex items-start gap-3 p-3.5">
              <div className="h-8 w-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 mt-0.5">
                <User className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 font-medium">Họ và tên</p>
                <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                  {currentUser?.fullName || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Số điện thoại (Chính thức nằm trong Thông tin cá nhân) */}
            <div className="flex items-start gap-3 p-3.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <Phone className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-500 font-medium">Số điện thoại</p>
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Đã xác thực
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                  {currentUser?.phoneNumber || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Tên đăng nhập */}
            <div className="flex items-start gap-3 p-3.5">
              <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                <Shield className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-500 font-medium">Tên đăng nhập</p>
                <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                  {currentUser?.username || "Chưa cập nhật"}
                </p>
              </div>
            </div>

            {/* Email */}
            {currentUser?.email && (
              <div className="flex items-start gap-3 p-3.5">
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Mail className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-500 font-medium">Email liên hệ</p>
                  <p className="text-sm font-semibold text-slate-900 truncate mt-0.5">
                    {currentUser.email}
                  </p>
                </div>
              </div>
            )}
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
