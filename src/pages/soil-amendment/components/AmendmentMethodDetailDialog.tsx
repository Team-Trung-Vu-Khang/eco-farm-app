import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AmendmentMethod } from "../types/amendment-method";
import {
  getMethodLevelColor,
  getMethodTypeConfig,
} from "../data/amendmentMethodData";

interface AmendmentMethodDetailDialogProps {
  onEdit: (item: AmendmentMethod) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedItem: AmendmentMethod | null;
}

export function AmendmentMethodDetailDialog({
  onEdit,
  onOpenChange,
  open,
  selectedItem,
}: AmendmentMethodDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {selectedItem?.name}
            <Badge
              variant="outline"
              className="ml-2 text-xs font-normal uppercase tracking-wider"
            >
              {selectedItem?.code}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        {selectedItem && (
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Loại phương pháp
                </div>
                <Badge
                  variant="secondary"
                  className={`${getMethodTypeConfig(selectedItem.type).className} border-0`}
                >
                  {getMethodTypeConfig(selectedItem.type).label}
                </Badge>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Trạng thái
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${selectedItem.status === "active" ? "bg-green-500" : "bg-slate-400"}`}
                  />
                  <span className="text-sm font-medium">
                    {selectedItem.status === "active"
                      ? "Đang áp dụng"
                      : "Tạm ngưng"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-semibold text-slate-900">
                Vấn đề xử lý
              </h4>
              <div className="flex items-start gap-2 rounded border border-amber-100 bg-amber-50 p-3 text-sm text-slate-700">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                {selectedItem.target}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-900">
                  Chi phí thực hiện
                </h4>
                <div
                  className={`inline-flex items-center rounded px-2.5 py-1 text-sm font-medium ${getMethodLevelColor(selectedItem.cost, "cost")}`}
                >
                  {selectedItem.cost.charAt(0).toUpperCase() +
                    selectedItem.cost.slice(1)}
                </div>
              </div>
              <div>
                <h4 className="mb-2 text-sm font-semibold text-slate-900">
                  Độ khó kỹ thuật
                </h4>
                <div
                  className={`inline-flex items-center rounded px-2.5 py-1 text-sm font-medium ${getMethodLevelColor(selectedItem.difficulty, "difficulty")}`}
                >
                  {selectedItem.difficulty.charAt(0).toUpperCase() +
                    selectedItem.difficulty.slice(1)}
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t pt-4">
              <div>
                <h4 className="mb-1 text-sm font-semibold text-slate-900">
                  Mô tả & Nguyên lý
                </h4>
                <p className="text-sm leading-relaxed text-slate-600">
                  {selectedItem.description}
                </p>
              </div>
              <div>
                <h4 className="mb-1 text-sm font-semibold text-slate-900">
                  Quy trình thực hiện
                </h4>
                <div className="whitespace-pre-wrap rounded-lg border bg-slate-50 p-4 font-mono text-sm text-slate-700">
                  {selectedItem.implementation}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Đóng
              </Button>
              <Button
                onClick={() => {
                  onOpenChange(false);
                  onEdit(selectedItem);
                }}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
