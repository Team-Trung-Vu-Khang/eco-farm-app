import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { UnitFormData } from "../types/types";

interface UnitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: UnitFormData;
  unitTypeLabel: string;
  selectedStandardLabel: string;
  onConfirm: () => void;
}

export function UnitConfirmDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  unitTypeLabel,
  selectedStandardLabel,
  onConfirm,
}: UnitConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <p>
              {isEdit
                ? "Bạn có chắc chắn muốn cập nhật đơn vị tính này?"
                : "Bạn có chắc chắn muốn thêm đơn vị tính mới vào hệ thống?"}
            </p>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã đơn vị:</span>
                <span className="font-medium">{formData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên đơn vị:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại:</span>
                <span className="font-medium">{unitTypeLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Quy đổi:</span>
                <span className="font-medium">
                  1 {formData.name} = {formData.conversionFactor}{" "}
                  {selectedStandardLabel}
                </span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
