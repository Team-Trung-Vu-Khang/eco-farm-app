import { Badge } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { FileText, MapPin, Users, CreditCard, Building2 } from "lucide-react";
import type { BranchFormData } from "../../hooks/useBranchForm";

interface ConfirmStepProps {
  formData: BranchFormData;
}

export function ConfirmStep({ formData }: ConfirmStepProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-muted/30 p-6 rounded-lg space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
            <FileText className="w-5 h-5 text-primary" /> Thông tin chung
          </h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mã chi nhánh:</span>
              <span className="font-medium">{formData.code}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tên chi nhánh:</span>
              <span className="font-medium">{formData.name}</span>
            </div>
            <div className="flex justify-between col-span-2">
              <span className="text-muted-foreground">Đơn vị chủ quản:</span>
              <span className="font-medium">{formData.enterpriseName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">MST:</span>
              <span className="font-medium">{formData.taxCode || "-"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Trạng thái:</span>
              <Badge
                variant={formData.status === "active" ? "default" : "secondary"}
              >
                {formData.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
            <MapPin className="w-5 h-5 text-primary" /> Địa chỉ & Liên hệ
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground min-w-[100px]">
                Địa chỉ:
              </span>
              <span className="font-medium text-right">
                {[
                  formData.address,
                  formData.ward,
                  formData.district,
                  formData.city,
                ]
                  .filter(Boolean)
                  .join(", ")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Website:</span>
              <span className="font-medium">{formData.website || "-"}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
            <Users className="w-5 h-5 text-primary" /> Người liên hệ (
            {formData.contacts.length})
          </h3>
          {formData.contacts.length > 0 ? (
            <div className="grid gap-3">
              {formData.contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="bg-card p-3 rounded border text-sm"
                >
                  <div className="font-medium flex justify-between">
                    <span>{contact.name || "Chưa nhập tên"}</span>
                    {contact.isPrimary && (
                      <Badge className="text-[10px] h-5 px-1">Chính</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">
                    {contact.position} • {contact.phone} • {contact.email}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Chưa có người liên hệ
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2 border-b pb-2">
            <CreditCard className="w-5 h-5 text-primary" /> Tài khoản ngân hàng
            ({formData.bankAccounts.length})
          </h3>
          {formData.bankAccounts.length > 0 ? (
            <div className="grid gap-3">
              {formData.bankAccounts.map((acc) => (
                <div
                  key={acc.id}
                  className="bg-card p-3 rounded border text-sm"
                >
                  <div className="font-medium flex justify-between">
                    <span>
                      {acc.bankName} - {acc.accountNumber}
                    </span>
                    {acc.isPrimary && (
                      <Badge className="text-[10px] h-5 px-1">Chính</Badge>
                    )}
                  </div>
                  <div className="text-muted-foreground text-xs mt-1">
                    {acc.accountHolder} • {acc.branch}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              Chưa có tài khoản ngân hàng
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
        <Building2 className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Lưu ý:</p>
          <p className="opacity-90 mt-1">
            Vui lòng kiểm tra kỹ tất cả thông tin trước khi xác nhận.
          </p>
        </div>
      </div>
    </div>
  );
}
