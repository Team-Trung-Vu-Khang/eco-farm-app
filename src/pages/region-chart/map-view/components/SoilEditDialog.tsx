import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Input,
  Label,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FlaskConical, Save } from "lucide-react";
import type { SoilData } from "../types/types";

interface SoilEditDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tempSoil: SoilData | null;
  setTempSoil: (soil: SoilData) => void;
  onSave: () => void;
}

export const SoilEditDialog: React.FC<SoilEditDialogProps> = ({
  isOpen,
  onOpenChange,
  tempSoil,
  setTempSoil,
  onSave,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-primary" />
            Cập nhật chỉ số thổ nhưỡng
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Độ pH
              </Label>
              <Input
                type="number"
                step="0.1"
                value={tempSoil?.ph}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({ ...tempSoil, ph: parseFloat(e.target.value) })
                }
                className="bg-slate-50/50"
                placeholder="Ví dụ: 6.5"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Độ ẩm (%)
              </Label>
              <Input
                type="number"
                value={tempSoil?.moisture}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({
                    ...tempSoil,
                    moisture: parseFloat(e.target.value),
                  })
                }
                className="bg-slate-50/50"
                placeholder="Ví dụ: 70"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase text-slate-500">
              Chỉ số NPK (mg/kg)
            </Label>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-red-500 px-1 border border-red-100 rounded bg-red-50/50">
                  N
                </div>
                <Input
                  type="number"
                  value={tempSoil?.nitrogen}
                  onChange={(e) =>
                    tempSoil &&
                    setTempSoil({
                      ...tempSoil,
                      nitrogen: parseFloat(e.target.value),
                    })
                  }
                  className="h-9 text-center"
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-blue-500 px-1 border border-blue-100 rounded bg-blue-50/50">
                  P
                </div>
                <Input
                  type="number"
                  value={tempSoil?.phosphorus}
                  onChange={(e) =>
                    tempSoil &&
                    setTempSoil({
                      ...tempSoil,
                      phosphorus: parseFloat(e.target.value),
                    })
                  }
                  className="h-9 text-center"
                />
              </div>
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-center text-orange-500 px-1 border border-orange-100 rounded bg-orange-50/50">
                  K
                </div>
                <Input
                  type="number"
                  value={tempSoil?.potassium}
                  onChange={(e) =>
                    tempSoil &&
                    setTempSoil({
                      ...tempSoil,
                      potassium: parseFloat(e.target.value),
                    })
                  }
                  className="h-9 text-center"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Hữu cơ (%)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={tempSoil?.organicMatter}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({
                    ...tempSoil,
                    organicMatter: parseFloat(e.target.value),
                  })
                }
                className="bg-slate-50/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                EC (mS/cm)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={tempSoil?.ec}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({ ...tempSoil, ec: parseFloat(e.target.value) })
                }
                className="bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Nhiệt độ (°C)
              </Label>
              <Input
                type="number"
                step="0.1"
                value={tempSoil?.temperature}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({
                    ...tempSoil,
                    temperature: parseFloat(e.target.value),
                  })
                }
                className="bg-slate-50/50"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-bold uppercase text-slate-500">
                Độ nén (psi)
              </Label>
              <Input
                type="number"
                value={tempSoil?.compaction}
                onChange={(e) =>
                  tempSoil &&
                  setTempSoil({
                    ...tempSoil,
                    compaction: parseFloat(e.target.value),
                  })
                }
                className="bg-slate-50/50"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Hủy bỏ
          </Button>
          <Button
            variant="default"
            onClick={onSave}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            <Save className="w-4 h-4 mr-2" />
            Lưu thông tin
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
