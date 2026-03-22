import { Card, CardContent, Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  CheckCircle2,
  FileSignature,
  FileText,
  Package,
  Building2,
} from "lucide-react";
import {
  contractTypes,
  mockContracts,
  currencies,
  commodityTypes,
  packagingSpecs,
  units,
  mockEnterprises,
} from "../../data/constants";
import type { ContractFormData } from "../../types";

interface ConfirmationStepProps {
  formData: ContractFormData;
}

export const ConfirmationStep = ({ formData }: ConfirmationStepProps) => {
  const selectedNature = contractTypes.find((t) => t.id === formData.nature);
  const selectedPartyA = mockEnterprises.find(
    (e) => e.id.toString() === formData.partyAId,
  );
  const selectedPartyB = mockEnterprises.find(
    (e) => e.id.toString() === formData.partyBId,
  );
  const selectedParentContract = mockContracts.find(
    (c) => c.id.toString() === formData.parentContractId,
  );
  const selectedCurrency = currencies.find((c) => c.id === formData.currency);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-lg">
          <CheckCircle2 className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-semibold">Xác nhận thông tin</h3>
          <p className="text-sm text-muted-foreground">
            Kiểm tra lại thông tin trước khi lưu
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Basic Info */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-primary" />
              Thông tin cơ bản
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Mã hợp đồng:</span>
                <div className="font-medium mt-1 uppercase font-mono tracking-tight">
                  {formData.code || "—"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Ngày ký kết:</span>
                <div className="font-medium mt-1">
                  {formData.signDate || "—"}
                </div>
              </div>
              <div className="col-span-2">
                <span className="text-muted-foreground">Tên hợp đồng:</span>
                <div className="font-medium mt-1">{formData.name || "—"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">
                  Tính chất hợp đồng:
                </span>
                <div className="font-medium mt-1">
                  {selectedNature?.name || "—"}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Giá trị hợp đồng:</span>
                <div className="font-medium mt-1 text-primary">
                  {formData.value
                    ? `${Number(formData.value).toLocaleString()} ${selectedCurrency?.name || "VNĐ"}`
                    : "—"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Type & Content */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Loại và nội dung
            </h4>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-muted-foreground">Loại hợp đồng:</span>
                <div className="font-medium mt-1">
                  {formData.isAppendix ? (
                    <Badge
                      variant="secondary"
                      className="bg-yellow-100 text-yellow-800 border-yellow-200"
                    >
                      Phụ lục hợp đồng
                    </Badge>
                  ) : (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-800 border-blue-200"
                    >
                      Hợp đồng mới
                    </Badge>
                  )}
                </div>
              </div>
              {formData.isAppendix && selectedParentContract && (
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 italic">
                  <span className="text-muted-foreground text-xs uppercase font-bold block mb-1">
                    Hợp đồng gốc:
                  </span>
                  <div className="font-medium">
                    {selectedParentContract.name} ({selectedParentContract.code}
                    )
                  </div>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">
                  Nội dung đính kèm:
                </span>
                <div className="font-medium mt-1 flex items-center gap-2">
                  {formData.contentType === "file" ? (
                    formData.contentFile ? (
                      <div className="flex items-center gap-2 text-primary font-bold">
                        <FileText className="w-4 h-4" />
                        {formData.contentFile.name}
                      </div>
                    ) : (
                      "Chưa tải lên file"
                    )
                  ) : formData.contentText ? (
                    <Badge variant="outline" className="font-semibold">
                      Đã nhập văn bản
                    </Badge>
                  ) : (
                    "Chưa nhập văn bản"
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commodity Info */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-primary" />
              Danh sách hàng hóa ({formData.commodities.length})
            </h4>
            {formData.commodities.length > 0 ? (
              <div className="space-y-3">
                {formData.commodities.map((commodity, index) => (
                  <div
                    key={commodity.id}
                    className="p-4 bg-slate-50/50 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="font-bold text-slate-400 w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm text-xs">
                        {index + 1}
                      </div>
                      <div className="flex-1 text-sm min-w-0">
                        <div className="font-bold text-slate-900 mb-1">
                          {commodity.commodityName}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="text-[10px] uppercase font-bold bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
                            {commodity.commodityCode}
                          </span>
                          <span className="text-[10px] text-muted-foreground italic">
                            (
                            {
                              commodityTypes.find(
                                (t) => t.id === commodity.commodityType,
                              )?.name
                            }
                            )
                          </span>
                        </div>
                        <div className="text-xs font-semibold flex items-center gap-1.5">
                          <span className="opacity-60 uppercase text-[9px] font-bold">
                            Quy cách:
                          </span>
                          <span className="text-primary">
                            {commodity.specType === "general"
                              ? packagingSpecs.find(
                                  (p) => p.id === commodity.packagingSpec,
                                )?.name
                              : `${commodity.quantity} ${units.find((u) => u.id === commodity.unit)?.name}`}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground italic border-2 border-dashed rounded-xl bg-slate-50/40">
                Chưa thêm hàng hóa nào
              </div>
            )}
          </CardContent>
        </Card>

        {/* Parties Info */}
        <Card>
          <CardContent className="p-6">
            <h4 className="font-semibold mb-6 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Thông tin các bên
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100">
                <Badge
                  variant="outline"
                  className="bg-blue-50 text-blue-700 border-blue-200 px-3 font-bold mb-3"
                >
                  BÊN A
                </Badge>
                {selectedPartyA ? (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 leading-tight">
                      {selectedPartyA.name}
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-60">Mã:</span>
                        <span className="font-mono text-slate-900">
                          {selectedPartyA.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-60">MST:</span>
                        <span className="text-slate-900">
                          {selectedPartyA.taxCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-blue-100">
                        <span className="opacity-60">👤 Đại diện:</span>
                        <span className="text-slate-900">
                          {selectedPartyA.representative}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground italic text-xs">
                    Chưa chọn đơn vị
                  </div>
                )}
              </div>

              <div className="p-4 bg-green-50/30 rounded-2xl border border-green-100">
                <Badge
                  variant="outline"
                  className="bg-green-50 text-green-700 border-green-200 px-3 font-bold mb-3"
                >
                  BÊN B
                </Badge>
                {selectedPartyB ? (
                  <div className="space-y-2">
                    <div className="font-bold text-slate-900 leading-tight">
                      {selectedPartyB.name}
                    </div>
                    <div className="grid grid-cols-1 gap-1 text-[11px] font-medium text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-60">Mã:</span>
                        <span className="font-mono text-slate-900">
                          {selectedPartyB.code}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="opacity-60">MST:</span>
                        <span className="text-slate-900">
                          {selectedPartyB.taxCode}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 pt-1 border-t border-green-100">
                        <span className="opacity-60">👤 Đại diện:</span>
                        <span className="text-slate-900">
                          {selectedPartyB.representative}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground italic text-xs">
                    Chưa chọn đối tác
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
