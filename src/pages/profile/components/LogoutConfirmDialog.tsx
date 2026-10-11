import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { LogOut } from "lucide-react";

interface LogoutConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function LogoutConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
}: LogoutConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white border border-slate-100 shadow-xl [&>button]:hidden">
        <DialogHeader className="text-center sm:text-center space-y-3 pt-2">
          <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-red-50/50">
            <LogOut className="w-7 h-7" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-800 text-center">
            Đăng xuất tài khoản?
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 text-center leading-relaxed">
            Bạn có chắc chắn muốn đăng xuất khỏi tài khoản trên thiết bị này?
            Bạn sẽ cần đăng nhập lại để tiếp tục sử dụng.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="flex-1 h-11 rounded-xl text-slate-700 font-medium"
            onClick={() => onOpenChange(false)}
          >
            Hủy bỏ
          </Button>

          <Button
            type="button"
            className="flex-1 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-sm"
            onClick={onConfirm}
          >
            Đăng xuất
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
