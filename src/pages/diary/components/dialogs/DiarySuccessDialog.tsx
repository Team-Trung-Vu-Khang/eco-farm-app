import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { CheckCircle2, ListFilter, PlusCircle } from "lucide-react";

interface DiarySuccessDialogProps {
  open: boolean;
  onContinue: () => void;
  onViewList: () => void;
  title?: string;
  description?: string;
}

export function DiarySuccessDialog({
  open,
  onContinue,
  onViewList,
  title = "Đã lưu nhật ký thành công!",
  description = "Thông tin nhật ký đã được cập nhật vào hệ thống. Bạn có thể tiếp tục ghi thêm công việc hoặc xem lại danh sách nhật ký.",
}: DiarySuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md p-6 rounded-2xl bg-white border border-slate-100 shadow-xl [&>button]:hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="text-center sm:text-center space-y-3 pt-2">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner ring-8 ring-emerald-50">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <DialogTitle className="text-xl font-bold text-slate-800 text-center">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 text-center leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            className="h-11 flex-1 rounded-xl border-emerald-600 text-emerald-700 bg-emerald-50/60 hover:bg-emerald-100 font-semibold gap-2 order-2 sm:order-1 transition-all"
            onClick={onContinue}
          >
            <PlusCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            Ghi tiếp
          </Button>

          <Button
            type="button"
            className="h-11 flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold gap-2 shadow-sm order-1 sm:order-2 transition-all"
            onClick={onViewList}
          >
            <ListFilter className="w-4 h-4 shrink-0" />
            Xem nhật ký
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
