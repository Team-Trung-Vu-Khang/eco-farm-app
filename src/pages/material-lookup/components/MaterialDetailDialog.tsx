import { type FC, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ExternalLink, Info } from "lucide-react";
import type { MaterialItem } from "../types/types";

interface MaterialDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  selectedItem: MaterialItem | null;
  detailUrl: string | null;
  children: ReactNode;
}

export const MaterialDetailDialog: FC<MaterialDetailDialogProps> = ({
  isOpen,
  onClose,
  selectedItem,
  detailUrl,
  children,
}) => {
  if (!selectedItem) return null;

  const handleOpenFullDetail = () => {
    if (detailUrl) {
      window.open(detailUrl, "_blank");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col overflow-hidden rounded-2xl border-none shadow-2xl p-0">
        <DialogHeader className="px-6 py-4 border-b bg-slate-50/80 flex flex-row items-center justify-between shrink-0 space-y-0">
          <DialogTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
            <Info size={18} />
            Chi tiết vật tư — {selectedItem.name}
          </DialogTitle>

          {detailUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenFullDetail}
              className="mr-6 text-xs font-bold text-primary hover:text-primary/90 border-primary/20 hover:bg-primary/5 gap-1.5"
            >
              <span>Trang chi tiết</span>
              <ExternalLink size={14} />
            </Button>
          )}
        </DialogHeader>

        <div className="flex-1 overflow-y-auto split-scrollbar p-6">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
};
