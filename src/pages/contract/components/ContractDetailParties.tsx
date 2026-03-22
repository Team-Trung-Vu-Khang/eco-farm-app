import {
  Card,
  CardContent,
  Badge,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2 } from "lucide-react";
import type { Contract, Enterprise } from "../types";

interface ContractDetailPartiesProps {
  contract: Contract;
}

export const ContractDetailParties = ({
  contract,
}: ContractDetailPartiesProps) => {
  const partyA = contract.partyA as Enterprise;
  const partyB = contract.partyB as Enterprise;

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary" />
          Thông tin các bên
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Party A */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="bg-blue-100 text-blue-700 border-blue-300"
              >
                Bên A
              </Badge>
              <span className="text-sm text-muted-foreground">
                Bên cung cấp
              </span>
            </div>
            {partyA && (
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg">
                    {partyA.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mã: {partyA.code}
                  </div>
                </div>
                <Separator />
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Mã số thuế:</span>{" "}
                    <span className="font-medium">
                      {partyA.taxCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Đại diện:</span>{" "}
                    <span className="font-medium">
                      {partyA.representative}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Điện thoại:</span>{" "}
                    <span className="font-medium">
                      {partyA.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                    <span className="font-medium">
                      {partyA.address}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Party B */}
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-3">
              <Badge
                variant="outline"
                className="bg-green-100 text-green-700 border-green-300"
              >
                Bên B
              </Badge>
              <span className="text-sm text-muted-foreground">
                Bên nhận
              </span>
            </div>
            {partyB && (
              <div className="space-y-2">
                <div>
                  <div className="font-semibold text-lg">
                    {partyB.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Mã: {partyB.code}
                  </div>
                </div>
                <Separator />
                <div className="text-sm space-y-1">
                  <div>
                    <span className="text-muted-foreground">Mã số thuế:</span>{" "}
                    <span className="font-medium">
                      {partyB.taxCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Đại diện:</span>{" "}
                    <span className="font-medium">
                      {partyB.representative}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Điện thoại:</span>{" "}
                    <span className="font-medium">
                      {partyB.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Địa chỉ:</span>{" "}
                    <span className="font-medium">
                      {partyB.address}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
