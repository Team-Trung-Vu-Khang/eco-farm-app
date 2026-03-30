import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Sprout } from "lucide-react";
import type { CropDetail } from "../../constants";
import { CropDetailDialogContent } from "./CropDetailDialogContent";

interface CropDetailDialogProps {
  crop: CropDetail | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getCropDetailId = (crop: CropDetail | null) => {
  if (!crop) return undefined;
  if (crop.areaId) return String(crop.areaId);
  if (crop.regionId) return String(crop.regionId);
  if (crop.id) return String(crop.id);
  return undefined;
};

export const CropDetailDialog = ({
  crop,
  open,
  onOpenChange,
}: CropDetailDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[96vw] w-[96vw] h-[92vh] p-0 overflow-hidden border-none shadow-2xl rounded-3xl z-50">
        <div className="h-full overflow-y-auto p-6 flex flex-col bg-slate-50/50">
          <div className="flex items-center gap-4 mb-4 shrink-0">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-lg bg-emerald-500">
              <Sprout size={24} />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800">
                Chi tiết cây trồng: {crop?.name}
              </DialogTitle>
            </div>
          </div>

          <div className="flex-1 mt-6">
            <CropDetailDialogContent id={getCropDetailId(crop)} crop={crop ?? undefined} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
