import { Input, Label } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { EnterpriseCertificate } from "../../../stores/useEnterpriseCertificateStore";

interface TimedFieldsProps {
  formData: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">;
  setFormData: (data: any) => void;
}

export function CertificateTimedFields({ formData, setFormData }: TimedFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="issuedDate">Ngày cấp *</Label>
        <Input
          id="issuedDate"
          type="date"
          value={formData.issuedDate}
          onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="expiryDate">Ngày hết hạn *</Label>
        <Input
          id="expiryDate"
          type="date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
        />
      </div>
    </div>
  );
}
