import {
  Card,
  CardContent,
  Badge,
  Label,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, Search, CheckCircle2 } from "lucide-react";
import { mockEnterprises } from "../../data/constants";
import type { ContractFormData } from "../../types";

interface PartiesStepProps {
  formData: ContractFormData;
  updateField: (field: keyof ContractFormData, value: any) => void;
  searchPartyA: string;
  setSearchPartyA: (v: string) => void;
  searchPartyB: string;
  setSearchPartyB: (v: string) => void;
}

export const PartiesStep = ({
  formData,
  updateField,
  searchPartyA,
  setSearchPartyA,
  searchPartyB,
  setSearchPartyB,
}: PartiesStepProps) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <Building2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-bold">Thông tin các bên</h3>
          <p className="text-sm text-muted-foreground">
            Chọn đơn vị cung cấp (Bên A) và đơn vị tiếp nhận (Bên B)
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Party A */}
        <Card className="border-blue-100/50 shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="outline"
                className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1 font-bold"
              >
                BÊN A
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                  Bên cung cấp
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  Chủ trì hợp đồng hoặc bên cho thuê
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-slate-700 font-semibold">
                Tìm kiếm đơn vị sở hữu <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập mã số thuế, tên hoặc mã đơn vị..."
                  className="pl-10 h-11 border-slate-200 focus:ring-blue-500 shadow-sm bg-white"
                  value={searchPartyA}
                  onChange={(e) => setSearchPartyA(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 content-scrollbar py-1">
                {mockEnterprises
                  .filter(
                    (e) =>
                      e.code
                        .toLowerCase()
                        .includes(searchPartyA.toLowerCase()) ||
                      e.name.toLowerCase().includes(searchPartyA.toLowerCase()),
                  )
                  .map((enterprise) => (
                    <Card
                      key={enterprise.id}
                      className={`cursor-pointer transition-all relative border-2 shadow-sm ${
                        formData.partyAId === enterprise.id.toString()
                          ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                          : "hover:border-primary/40 border-slate-100 hover:shadow-md"
                      }`}
                      onClick={() =>
                        updateField("partyAId", enterprise.id.toString())
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-sm truncate text-slate-900 mb-2">
                              {enterprise.name}
                            </h4>
                            <div className="space-y-1.5 text-[11px] text-muted-foreground">
                              <div className="font-mono bg-slate-100 px-2 py-0.5 rounded inline-block text-[10px] font-bold text-slate-600">
                                {enterprise.code}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">MST:</span>
                                <span className="font-medium text-slate-800">
                                  {enterprise.taxCode}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">👤 Đại diện:</span>
                                <span className="font-medium text-slate-800 truncate">
                                  {enterprise.representative}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">📞 Liên hệ:</span>
                                <span className="font-medium text-slate-800">
                                  {enterprise.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          {formData.partyAId === enterprise.id.toString() && (
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Party B */}
        <Card className="border-green-100/50 shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Badge
                variant="outline"
                className="bg-green-50 text-green-700 border-green-200 px-3 py-1 font-bold"
              >
                BÊN B
              </Badge>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 tracking-tight uppercase">
                  Bên tiếp nhận
                </span>
                <span className="text-[10px] text-muted-foreground leading-none">
                  Bên thụ hưởng hoặc bên thuê
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-slate-700 font-semibold">
                Tìm kiếm đơn vị đối tác <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Nhập mã số thuế, tên hoặc mã đơn vị..."
                  className="pl-10 h-11 border-slate-200 focus:ring-green-500 shadow-sm bg-white"
                  value={searchPartyB}
                  onChange={(e) => setSearchPartyB(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[350px] overflow-y-auto pr-2 content-scrollbar py-1">
                {mockEnterprises
                  .filter(
                    (e) =>
                      e.code
                        .toLowerCase()
                        .includes(searchPartyB.toLowerCase()) ||
                      e.name.toLowerCase().includes(searchPartyB.toLowerCase()),
                  )
                  .map((enterprise) => (
                    <Card
                      key={enterprise.id}
                      className={`cursor-pointer transition-all relative border-2 shadow-sm ${
                        formData.partyBId === enterprise.id.toString()
                          ? "border-primary bg-primary/5 ring-1 ring-primary/10"
                          : "hover:border-primary/40 border-slate-100 hover:shadow-md"
                      }`}
                      onClick={() =>
                        updateField("partyBId", enterprise.id.toString())
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-bold text-sm truncate text-slate-900 mb-2">
                              {enterprise.name}
                            </h4>
                            <div className="space-y-1.5 text-[11px] text-muted-foreground">
                              <div className="font-mono bg-slate-100 px-2 py-0.5 rounded inline-block text-[10px] font-bold text-slate-600">
                                {enterprise.code}
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">MST:</span>
                                <span className="font-medium text-slate-800">
                                  {enterprise.taxCode}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">👤 Đại diện:</span>
                                <span className="font-medium text-slate-800 truncate">
                                  {enterprise.representative}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span className="opacity-70">📞 Liên hệ:</span>
                                <span className="font-medium text-slate-800">
                                  {enterprise.phone}
                                </span>
                              </div>
                            </div>
                          </div>
                          {formData.partyBId === enterprise.id.toString() && (
                            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
