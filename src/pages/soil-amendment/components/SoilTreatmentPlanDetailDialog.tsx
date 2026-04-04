import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { SoilTreatmentPlanDetail } from "./SoilTreatmentPlanDetail";
import type { TreatmentPlan } from "../types/treatment";

interface SoilTreatmentPlanDetailDialogProps {
  onDelete: (item: TreatmentPlan) => void;
  onEdit: (item: TreatmentPlan) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  selectedItem: TreatmentPlan | null;
}

export function SoilTreatmentPlanDetailDialog({
  onDelete,
  onEdit,
  onOpenChange,
  open,
  selectedItem,
}: SoilTreatmentPlanDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{selectedItem?.name || "Chi tiết phác đồ"}</DialogTitle>
        </DialogHeader>
        <SoilTreatmentPlanDetail
          onDelete={onDelete}
          onEdit={onEdit}
          selectedPlan={selectedItem}
        />
      </DialogContent>
    </Dialog>
  );
}
