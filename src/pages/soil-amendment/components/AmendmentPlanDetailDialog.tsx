import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { AmendmentPlan } from "../../../stores/useAmendmentPlanStore";
import { getStatusConfig } from "../utils";

interface AmendmentPlanDetailDialogProps {
  onClose: () => void;
  onEdit: (item: AmendmentPlan) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedItem: AmendmentPlan | null;
}

export function AmendmentPlanDetailDialog({
  onClose,
  onEdit,
  onOpenChange,
  open,
  selectedItem,
}: AmendmentPlanDetailDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {selectedItem?.name}
            <Badge
              className={
                selectedItem ? getStatusConfig(selectedItem.status).className : ""
              }
              variant={
                selectedItem ? getStatusConfig(selectedItem.status).variant : "outline"
              }
            >
              {selectedItem ? getStatusConfig(selectedItem.status).label : ""}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {selectedItem && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Diện tích
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {selectedItem.area} ha
                </div>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Ngân sách
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {selectedItem.budget} Tr.đ
                </div>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Thời gian
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {selectedItem.startDate} - {selectedItem.endDate}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <span className="inline-block w-24 text-slate-500">
                    Mã kế hoạch:
                  </span>
                  <span className="font-mono font-medium">
                    {selectedItem.code}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-24 text-slate-500">
                    Khu vực:
                  </span>
                  <span className="font-medium">{selectedItem.zone}</span>
                </div>
                <div>
                  <span className="inline-block w-24 text-slate-500">
                    Phụ trách:
                  </span>
                  <span className="font-medium">{selectedItem.technician}</span>
                </div>
                <div>
                  <span className="inline-block w-24 text-slate-500">
                    Mục tiêu:
                  </span>
                  <span className="font-medium text-amber-700">
                    {selectedItem.target_issue}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button onClick={onClose} variant="outline">
                Đóng
              </Button>
              <Button onClick={() => onEdit(selectedItem)}>Chỉnh sửa</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
