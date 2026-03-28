import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Droplets, Tractor } from "lucide-react";
import type { AmendmentTask } from "../../stores/useAmendmentTaskStore";
import { getPriorityConfig, getStatusConfig } from "../data/amendmentTaskData";

interface AmendmentTaskDetailDialogProps {
  onEdit: (task: AmendmentTask) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedItem: AmendmentTask | null;
}

export function AmendmentTaskDetailDialog({
  onEdit,
  onOpenChange,
  open,
  selectedItem,
}: AmendmentTaskDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {selectedItem?.name}
            <Badge
              variant={
                selectedItem
                  ? getStatusConfig(selectedItem.status).variant
                  : "outline"
              }
            >
              {selectedItem ? getStatusConfig(selectedItem.status).label : ""}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        {selectedItem && (
          <div className="space-y-6 py-4">
            <div className="grid grid-cols-4 gap-3">
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Diện tích
                </div>
                <div className="text-lg font-bold text-slate-900">
                  {selectedItem.targetArea} ha
                </div>
              </div>
              <div className="rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Ưu tiên
                </div>
                <Badge
                  variant={getPriorityConfig(selectedItem.priority).variant}
                  className={getPriorityConfig(selectedItem.priority).className}
                >
                  {getPriorityConfig(selectedItem.priority).label}
                </Badge>
              </div>
              <div className="col-span-2 rounded-lg border bg-slate-50 p-3">
                <div className="mb-1 text-xs font-medium uppercase text-slate-500">
                  Thời gian
                </div>
                <div className="text-sm font-medium text-slate-900">
                  {selectedItem.startDate} → {selectedItem.endDate}
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                <div>
                  <span className="inline-block w-32 text-slate-500">Mã công việc:</span>
                  <span className="font-mono font-medium">{selectedItem.code}</span>
                </div>
                <div>
                  <span className="inline-block w-32 text-slate-500">Kế hoạch:</span>
                  <span className="font-medium">{selectedItem.plan}</span>
                </div>
                <div>
                  <span className="inline-block w-32 text-slate-500">Khu vực:</span>
                  <span className="font-medium">{selectedItem.zone}</span>
                </div>
                <div>
                  <span className="inline-block w-32 text-slate-500">Phương pháp:</span>
                  <span className="font-medium text-blue-700">
                    {selectedItem.method}
                  </span>
                </div>
                <div>
                  <span className="inline-block w-32 text-slate-500">Phân công:</span>
                  <span className="font-medium">
                    {selectedItem.assignedTo}
                    <span className="ml-1 text-xs text-slate-500">
                      ({selectedItem.assignedType === "team" ? "Đội" : "Cá nhân"})
                    </span>
                  </span>
                </div>
                {selectedItem.actualArea && (
                  <div>
                    <span className="inline-block w-32 text-slate-500">
                      Diện tích thực tế:
                    </span>
                    <span className="font-medium text-green-700">
                      {selectedItem.actualArea} ha
                    </span>
                  </div>
                )}
              </div>
            </div>

            {(selectedItem.materials.length > 0 ||
              selectedItem.equipment.length > 0) && (
              <div className="border-t pt-4">
                <div className="grid grid-cols-2 gap-4">
                  {selectedItem.materials.length > 0 && (
                    <div>
                      <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Droplets className="h-4 w-4" />
                        Vật tư sử dụng
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {selectedItem.materials.map((material, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                            {material.name} ({material.quantity} {material.unit})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {selectedItem.equipment.length > 0 && (
                    <div>
                      <h5 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900">
                        <Tractor className="h-4 w-4" />
                        Thiết bị cần thiết
                      </h5>
                      <ul className="space-y-1 text-sm">
                        {selectedItem.equipment.map((equipment, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                            {equipment}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedItem.notes && (
              <div className="border-t pt-4">
                <h5 className="mb-2 text-sm font-semibold text-slate-900">
                  Ghi chú kỹ thuật
                </h5>
                <p className="rounded border bg-slate-50 p-3 text-sm text-slate-700">
                  {selectedItem.notes}
                </p>
              </div>
            )}

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
