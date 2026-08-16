import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { supplyConversionRuleApi } from "@/features/farm-supply";
import type {
  DeletionImpactBlocker,
  DeletionImpactResponse,
  SupplyConversionRuleResponse,
} from "@/features/farm-supply";
import type { SupplyType } from "@/features/farm-supply";

interface DeletionImpactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Which scope to query */
  scope: "admin" | "farm";
  /** Type of supply item being deleted */
  supplyType: SupplyType;
  /** ID of the supply item being deleted */
  itemId: number | null;
  /** Name of the item being deleted (for display) */
  itemName?: string;
  /** Called when user confirms deletion (only when there are no blockers) */
  onConfirmDelete: () => void;
}

/**
 * Dialog that checks for deletion-impact before allowing a user to delete a supply item.
 *
 * - If `totalElements === 0` → shows a standard delete confirmation.
 * - If `totalElements > 0` → shows blockers list and disables the delete button.
 */
export function DeletionImpactDialog({
  open,
  onOpenChange,
  scope,
  supplyType,
  itemId,
  itemName,
  onConfirmDelete,
}: DeletionImpactDialogProps) {
  const [loading, setLoading] = useState(false);
  const [impactData, setImpactData] = useState<DeletionImpactResponse | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && itemId) {
      setLoading(true);
      setError(null);
      setImpactData(null);

      supplyConversionRuleApi
        .checkDeletionImpact(scope, supplyType, itemId, { page: 0, size: 20 })
        .then((data) => {
          setImpactData(data);
        })
        .catch((err) => {
          setError(err.message || "Không thể kiểm tra ảnh hưởng");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [open, itemId, scope, supplyType]);

  const hasBlockers = (impactData?.totalElements ?? 0) > 0;

  const handleConfirm = () => {
    if (!hasBlockers) {
      onConfirmDelete();
      onOpenChange(false);
    }
  };

  const renderBlocker = (blocker: DeletionImpactBlocker, index: number) => {
    switch (blocker.resourceType) {
      case "SUPPLY_CONVERSION_RULE": {
        const rule = blocker.resourceData as SupplyConversionRuleResponse;
        return (
          <div
            key={index}
            className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm"
          >
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="font-medium text-slate-800">
                Quy tắc quy đổi #{rule.id}:
              </span>{" "}
              <span className="text-slate-600">
                1 {rule.fromSupplyItem.name} = {rule.quantity}{" "}
                {rule.toSupplyItem.name}
              </span>
              <span className="text-xs text-slate-400 ml-2">
                ({rule.source === "MASTER" ? "Hệ thống" : "Nội bộ"})
              </span>
            </div>
          </div>
        );
      }
      default:
        return (
          <div
            key={index}
            className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600"
          >
            Blocker: {blocker.resourceType}
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {hasBlockers ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Không thể xóa vật tư
              </>
            ) : (
              "Xác nhận xóa"
            )}
          </DialogTitle>
          <DialogDescription>
            {loading && "Đang kiểm tra ảnh hưởng..."}
            {error && `Lỗi: ${error}`}
            {!loading && !error && !hasBlockers && (
              <>
                Bạn có chắc chắn muốn xóa{" "}
                {itemName ? <strong>{itemName}</strong> : "vật tư này"}? Hành
                động này không thể hoàn tác.
              </>
            )}
            {!loading && !error && hasBlockers && (
              <>
                Vật tư {itemName ? <strong>{itemName}</strong> : "này"} đang
                được sử dụng trong{" "}
                <strong>{impactData!.totalElements} quy tắc quy đổi</strong>.
                Bạn cần xóa các quy tắc quy đổi liên quan trước khi xóa vật tư.
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Blockers List */}
        {!loading && hasBlockers && impactData && (
          <div className="max-h-60 overflow-y-auto space-y-2 my-2">
            {impactData.content.map((blocker, index) =>
              renderBlocker(blocker, index),
            )}
            {impactData.totalElements > impactData.content.length && (
              <p className="text-xs text-slate-400 text-center pt-1">
                ...và {impactData.totalElements - impactData.content.length} quy
                tắc khác
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {hasBlockers ? "Đóng" : "Hủy"}
          </Button>
          {!hasBlockers && !loading && (
            <Button variant="destructive" onClick={handleConfirm}>
              Xóa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
