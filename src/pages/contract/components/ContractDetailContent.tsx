import {
  Card,
  CardContent,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, Download } from "lucide-react";
import type { Contract } from "../types";

interface ContractDetailContentProps {
  contract: Contract;
}

export const ContractDetailContent = ({ contract }: ContractDetailContentProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-primary" />
          Nội dung hợp đồng
        </h3>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Loại hợp đồng
            </div>
            <div className="font-medium">
              {contract.isAppendix ? "Phụ lục hợp đồng" : "Hợp đồng mới"}
            </div>
          </div>

          {contract.isAppendix && contract.parentContractCode && (
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Hợp đồng gốc
              </div>
              <div className="font-medium">
                {contract.parentContractCode}
              </div>
            </div>
          )}

          <div>
            <div className="text-sm text-muted-foreground mb-1">
              Nội dung
            </div>
            {contract.contentType === "file" ? (
              <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border">
                <FileText className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {contract.contentFileName}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    File đính kèm
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div className="p-3 bg-slate-50 rounded-lg border">
                <div className="text-sm">Nội dung văn bản</div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
