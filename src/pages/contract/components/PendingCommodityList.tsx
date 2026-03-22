import { Card, CardContent, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Package, CheckCircle2, X } from "lucide-react";
import { allCommodities } from "../hooks/useContractForm";

interface PendingCommodityListProps {
  pendingCommodityIds: string[];
  currentCommodityId: string;
  onSelect: (item: any) => void;
  onRemove: (id: string) => void;
}

export const PendingCommodityList = ({
  pendingCommodityIds,
  currentCommodityId,
  onSelect,
  onRemove,
}: PendingCommodityListProps) => {
  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-sm flex items-center gap-2">
          Chờ định nghĩa ({pendingCommodityIds.length})
        </h4>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 content-scrollbar py-2">
        {pendingCommodityIds.length === 0 ? (
          <div className="p-8 text-center border-2 border-dashed rounded-xl bg-slate-50/50 border-slate-200">
            <Package className="w-12 h-12 mx-auto mb-2 opacity-20" />
            <p className="text-xs text-muted-foreground italic">
              Chưa có hàng hoá chờ định nghĩa
            </p>
          </div>
        ) : (
          pendingCommodityIds.map((id) => {
            const item = allCommodities.find((c) => c.id.toString() === id);
            if (!item) return null;

            const isCurrent = currentCommodityId === id;

            return (
              <Card
                key={id}
                className={`transition-all cursor-pointer border-2 select-none shadow-none ${
                  isCurrent
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 scale-[0.98] shadow-sm"
                    : "hover:border-primary/50 hover:bg-slate-50/50 border-slate-100"
                }`}
                onClick={() => onSelect(item)}
              >
                <CardContent className="p-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm ${
                        isCurrent
                          ? "bg-primary text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0 pr-1">
                      <h5 className="font-bold text-sm truncate uppercase tracking-tight">
                        {item.name}
                      </h5>
                      <p className="text-[10px] text-muted-foreground font-mono font-bold">
                        {item.code}
                      </p>
                    </div>
                    {isCurrent ? (
                      <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-500 hover:bg-red-50 rounded-full shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemove(item.id.toString());
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};
