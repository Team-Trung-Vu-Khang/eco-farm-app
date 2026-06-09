import {
  Badge,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type {
  EnterpriseCertificate,
  Standard,
} from "../../../stores/useEnterpriseCertificateStore";

interface BasicInfoProps {
  formData: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">;
  setFormData: (
    data: Omit<EnterpriseCertificate, "id" | "createdAt" | "status">,
  ) => void;
  standards: Standard[];
  availableOrganizations: string[];
  onStandardTypeChange: (value: string) => void;
}

export function CertificateBasicInfoFields({
  formData,
  setFormData,
  standards,
  availableOrganizations,
  onStandardTypeChange,
}: BasicInfoProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="code">Mã chứng nhận *</Label>
          <Input
            id="code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            placeholder="VD: CN-2024-001"
            className="bg-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="name">Tên chứng nhận *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="VD: Chứng nhận VietGAP..."
            className="bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="standardType">Loại tiêu chuẩn *</Label>
          <Select
            value={formData.standardType}
            onValueChange={onStandardTypeChange}
          >
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Chọn loại tiêu chuẩn" />
            </SelectTrigger>
            <SelectContent>
              {standards.map((standard) => (
                <SelectItem key={standard.code} value={standard.code}>
                  {standard.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="organization">Tổ chức cấp *</Label>
          <Select
            value={formData.organization}
            onValueChange={(val) =>
              setFormData({ ...formData, organization: val })
            }
            disabled={availableOrganizations.length === 0}
          >
            <SelectTrigger className="bg-white">
              <SelectValue
                placeholder={
                  availableOrganizations.length === 0
                    ? "Chọn tiêu chuẩn trước"
                    : "Chọn tổ chức cấp..."
                }
              />
            </SelectTrigger>
            <SelectContent>
              {availableOrganizations.map((org) => (
                <SelectItem key={org} value={org}>
                  {org}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
