import {
  Card,
  CardContent,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Calendar } from "lucide-react";
import { contractTypes } from "../data/constants";
import type { Contract } from "../types";
import { StatusBadge } from "./StatusBadge";

interface ContractDetailHeaderProps {
  contract: Contract;
}

export const ContractDetailHeader = ({
  contract,
}: ContractDetailHeaderProps) => {
  const contractType = contractTypes.find((t) => t.id === contract.type);

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold">{contract.name}</h2>
              <StatusBadge status={contract.status} />
            </div>
            <div className="text-sm text-muted-foreground">
              Mã hợp đồng:{" "}
              <span className="font-mono font-medium">{contract.code}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Loại hợp đồng</div>
            <div className="font-medium">{contractType?.name}</div>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Calendar className="w-4 h-4" />
              Ngày ký kết
            </div>
            <div className="font-medium">{contract.signDate}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Ngày tạo</div>
            <div className="font-medium">{contract.createdAt}</div>
          </div>
          <div>
            <div className="text-muted-foreground mb-1">Cập nhật lần cuối</div>
            <div className="font-medium">{contract.updatedAt}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
