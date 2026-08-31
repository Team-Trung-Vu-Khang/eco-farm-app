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
import { Loader2 } from "lucide-react";
import { getMaterialGroupLabel } from "../data/constants";
import type { MaterialFormData } from "../types/types";

interface MaterialSubmitConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isEdit: boolean;
  formData: MaterialFormData;
  onConfirm: () => void;
  loading?: boolean;
}

export default function MaterialSubmitConfirmDialog({
  open,
  onOpenChange,
  isEdit,
  formData,
  onConfirm,
  loading,
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
                <span className="text-muted-foreground">Mức độ công nghệ:</span>
                <span className="font-medium">
                  {getMaterialGroupLabel(formData.technologyLevelId) || "Chưa chọn"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giai đoạn áp dụng:</span>
                <span className="font-medium">
                  {getMaterialGroupLabel(formData.valueChainId) || "Chưa chọn"}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-muted-foreground block">Quy cách đóng gói:</span>
                <div className="flex flex-wrap gap-1.5">
                  {(formData.packagingSpecs || []).length > 0 ? (
                    formData.packagingSpecs.map((item) => (
                      <span
                        key={item}
                        className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-700 border border-slate-200"
                      >
                        {item}
                      </span>
                    ))
                  ) : (
                    <span className="font-medium text-slate-500">Chưa chọn</span>
                  )}
                </div>
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
