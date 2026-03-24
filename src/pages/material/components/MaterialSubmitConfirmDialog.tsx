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
import type { MaterialFormData } from "../types/types";

interface MaterialSubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: MaterialFormData;
  onConfirm: () => void;
}

export default function MaterialSubmitConfirmDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  onConfirm,
}: MaterialSubmitConfirmDialogProps) {
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
                ? "Bạn có chắc chắn muốn cập nhật thông tin vật tư này?"
                : "Bạn có chắc chắn muốn thêm vật tư mới vào hệ thống?"}
            </p>
            <div className="space-y-2 rounded-lg bg-slate-50 p-4 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã vật tư:</span>
                <span className="font-medium">{formData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên vật tư:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Loại:</span>
                <span className="font-medium">{formData.type}</span>
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
