import { Card, CardContent, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Package } from "lucide-react";
import { commodityTypes, packagingSpecs, units } from "../data/constants";
import type { Contract } from "../types";

interface ContractDetailCommoditiesProps {
  contract: Contract;
}

export const ContractDetailCommodities = ({
  contract,
}: ContractDetailCommoditiesProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5 text-primary" />
          Danh sách hàng hóa ({contract.commodities?.length || 0})
        </h3>

        <div className="space-y-3">
          {contract.commodities?.map((commodity, index) => {
            const commodityType = commodityTypes.find(
              (t) => t.id === commodity.commodityType,
            );
            return (
              <div
                key={commodity.id}
                className="p-4 bg-slate-50 rounded-lg border"
              >
                <div className="flex items-start gap-3">
                  <div className="font-semibold text-primary">{index + 1}.</div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg">{commodityType?.icon}</span>
                        <span className="font-semibold">
                          {commodity.commodityName}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Mã: {commodity.commodityCode}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {commodityType?.name}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {commodity.specType === "general"
                          ? packagingSpecs.find(
                              (p) => p.id === commodity.packagingSpec,
                            )?.name
                          : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
