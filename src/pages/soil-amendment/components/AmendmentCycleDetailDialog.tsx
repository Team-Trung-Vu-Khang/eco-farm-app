import {
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Clock, List, Sprout } from "lucide-react";
import { getActivityConfig } from "../data/amendmentCycleData";
import type { AmendmentCycle } from "../types/amendment-cycle";

interface AmendmentCycleDetailDialogProps {
  item: AmendmentCycle | null;
  onOpenChange: (open: boolean) => void;
  open: boolean;
}

export function AmendmentCycleDetailDialog({
  item,
  onOpenChange,
  open,
}: AmendmentCycleDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Chi tiết chu kỳ cải tạo</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="space-y-6 py-4">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">{item.title}</h2>
                <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{item.duration}</span>
                </div>
              </div>
              <Badge className="px-3 py-1 text-lg uppercase" variant="outline">
                {item.type}
              </Badge>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg border bg-slate-50 p-4">
                <h3 className="mb-2 font-semibold">Điều kiện áp dụng</h3>
                <p className={`rounded p-2 ${item.conditionColor} bg-opacity-20`}>
                  {item.condition}
                </p>
              </div>
              <div className="rounded-lg border border-emerald-100 bg-emerald-50 p-4">
                <h3 className="mb-2 font-semibold text-emerald-800">
                  Kết quả dự kiến
                </h3>
                <div className="flex items-start gap-2">
                  <Sprout className="mt-0.5 h-5 w-5 text-emerald-600" />
                  <p className="text-emerald-700">{item.outcome}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 flex items-center gap-2 font-semibold">
                <List className="h-5 w-5" /> Danh sách hoạt động
              </h3>
              <div className="grid gap-3">
                {item.activities.map((activity, index) => {
                  const { color, icon: Icon, label } = getActivityConfig(
                    activity.type,
                  );

                  return (
                    <div
                      key={`${activity.text}-${index}`}
                      className="flex items-center gap-3 rounded-lg border bg-white p-3 shadow-sm"
                    >
                      <div className={`rounded-full p-2 ${color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className="h-5 px-1.5 py-0 text-[10px]"
                          >
                            {label}
                          </Badge>
                        </div>
                        <span className="font-medium">{activity.text}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Đóng</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
