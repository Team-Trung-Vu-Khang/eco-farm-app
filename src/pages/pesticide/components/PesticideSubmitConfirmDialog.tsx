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
import type { PesticideFormData } from "../types";
import { Loader2 } from "lucide-react";

interface PesticideSubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: PesticideFormData;
  onConfirm: () => void;
  loading?: boolean;
}

export default function PesticideSubmitConfirmDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  onConfirm,
  loading = false,
}: PesticideSubmitConfirmDialogProps) {
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
                ? "Bạn có chắc chắn muốn cập nhật thông tin thuốc BVTV này?"
                : "Bạn có chắc chắn muốn thêm thuốc BVTV mới vào hệ thống?"}
            </p>
            <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mã thuốc:</span>
                <span className="font-medium">{formData.code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Tên thuốc:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nhóm:</span>
                <span className="font-medium">{formData.group}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nguồn gốc:</span>
                <span className="font-medium">{formData.origin}</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Hủy bỏ</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
