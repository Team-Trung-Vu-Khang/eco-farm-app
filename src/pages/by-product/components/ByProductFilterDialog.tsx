import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface ByProductFilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  status: string;
  setStatus: (val: string) => void;
  onApply: () => void;
  onReset: () => void;
}

export function ByProductFilterDialog({
  open,
  onOpenChange,
  status,
  setStatus,
  onApply,
  onReset,
}: ByProductFilterDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bộ lọc phụ phẩm</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              className="w-full h-10 px-3 py-2 border rounded-md text-sm bg-background"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="inactive">Không hoạt động</option>
              <option value="archived">Đã lưu trữ</option>
            </select>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:justify-end">
          <Button variant="outline" onClick={onReset}>
            Đặt lại
          </Button>
          <Button onClick={onApply}>Áp dụng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
