import {
  Card,
  CardContent,
  Badge,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ShoppingCart, Trash2 } from "lucide-react";
import { packagingSpecs, units } from "../data/constants";
import type { CommodityItem } from "../types";

interface CommoditySummaryListProps {
  commodities: CommodityItem[];
  onRemove: (id: string) => void;
}

export const CommoditySummaryList = ({
  commodities,
  onRemove,
}: CommoditySummaryListProps) => {
  if (commodities.length === 0) return null;

  return (
    <Card className="shadow-sm border-slate-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Hàng hoá trong hợp đồng
          </h4>
          <Badge
            variant="outline"
            className="bg-primary/5 text-primary border-primary/20"
          >
            Tổng: {commodities.length}
          </Badge>
        </div>
        <div className="space-y-3">
          {commodities.map((commodity, index) => (
            <div
              key={commodity.id}
              className="p-4 border border-slate-200 rounded-xl bg-slate-50/30 hover:shadow-sm transition-all flex items-center justify-between group"
            >
              <div className="flex items-start gap-4">
                <div className="text-xs font-bold text-slate-500 w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="font-bold text-sm truncate">
                    {commodity.commodityName}
                  </h5>
                  <div className="flex flex-wrap items-center gap-3 mt-1 underline-offset-4">
                    <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 uppercase font-bold">
                      {commodity.commodityCode}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <span className="opacity-60 text-[10px] uppercase font-semibold">
                        Quy cách:
                      </span>
                      <span className="font-semibold text-slate-900">
                        {commodity.specType === "general"
                          ? packagingSpecs.find(
                              (p) => p.id === commodity.packagingSpec,
                            )?.name
                          : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all rounded-full h-8 w-8 p-0"
                onClick={() => onRemove(commodity.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
