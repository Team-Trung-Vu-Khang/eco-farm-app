import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  Button,
  Switch,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { toast } from "sonner";
import {
  Bell,
  Globe,
  HardDrive,
  Info,
  Settings,
} from "lucide-react";

interface SettingsBottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsBottomSheet({
  open,
  onOpenChange,
}: SettingsBottomSheetProps) {
  const [notifyDaily, setNotifyDaily] = useState(true);
  const [notifyTask, setNotifyTask] = useState(true);

  const handleClearCache = () => {
    try {
      // Clear non-auth caches
      const keysToKeep = ["eco_auth_token", "eco_refresh_token", "user", "workspace_id"];
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && !keysToKeep.some((k) => key.includes(k))) {
          localStorage.removeItem(key);
        }
      }
      toast.success("Đã làm sạch bộ nhớ đệm thành công!");
    } catch {
      toast.error("Không thể làm sạch bộ nhớ đệm");
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="rounded-t-3xl px-4 pb-8 pt-4 sm:max-w-md mx-auto max-h-[85vh] overflow-y-auto"
      >
        <SheetHeader className="text-left pb-3 border-b border-slate-100">
          <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Settings className="h-5 w-5 text-purple-600" />
            Cài đặt ứng dụng
          </SheetTitle>
        </SheetHeader>

        <div className="py-4 space-y-4">
          {/* Nhóm Thông báo */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Thông báo
            </span>
            <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 pr-2">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <Label htmlFor="notify-task" className="text-sm font-semibold text-slate-900 block cursor-pointer">
                      Nhắc việc kế hoạch
                    </Label>
                    <p className="text-xs text-slate-500">
                      Thông báo công việc cần làm trong ngày
                    </p>
                  </div>
                </div>
                <Switch
                  id="notify-task"
                  checked={notifyTask}
                  onCheckedChange={setNotifyTask}
                />
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 pr-2">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Bell className="h-4 w-4" />
                  </div>
                  <div>
                    <Label htmlFor="notify-daily" className="text-sm font-semibold text-slate-900 block cursor-pointer">
                      Nhắc ghi nhật ký
                    </Label>
                    <p className="text-xs text-slate-500">
                      Nhắc nhở cập nhật nhật ký cuối ngày
                    </p>
                  </div>
                </div>
                <Switch
                  id="notify-daily"
                  checked={notifyDaily}
                  onCheckedChange={setNotifyDaily}
                />
              </div>
            </div>
          </div>

          {/* Nhóm Dữ liệu & Ngôn ngữ */}
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
              Hệ thống & Dữ liệu
            </span>
            <div className="rounded-2xl border border-slate-200 bg-white divide-y divide-slate-100 overflow-hidden">
              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Globe className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Ngôn ngữ hiển thị
                    </p>
                    <p className="text-xs text-slate-500">
                      Tiếng Việt (Mặc định)
                    </p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-1 rounded-md">
                  VI
                </span>
              </div>

              <div className="flex items-center justify-between p-3.5">
                <div className="flex items-center gap-3 pr-2">
                  <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <HardDrive className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Xóa bộ nhớ đệm
                    </p>
                    <p className="text-xs text-slate-500">
                      Giải phóng bộ nhớ tạm trên thiết bị
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-lg text-xs font-semibold h-8"
                  onClick={handleClearCache}
                >
                  Dọn dẹp
                </Button>
              </div>
            </div>
          </div>

          {/* Phiên bản ứng dụng */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center gap-2.5">
              <Info className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-600">
                Phiên bản ứng dụng
              </span>
            </div>
            <span className="text-xs font-bold text-slate-700">
              MEVI Farm v1.0.0
            </span>
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
