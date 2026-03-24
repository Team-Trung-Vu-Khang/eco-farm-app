import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Input,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import type { PersonnelFormData } from "../types";

interface PersonalInfoCardProps {
  formData: PersonnelFormData;
  onChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => void;
}

export function PersonalInfoCard({ formData, onChange }: PersonalInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên *</Label>
          <Input
            id="fullName"
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              placeholder="0901234567"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="taxCode">Mã số thuế cá nhân</Label>
            <Input
              id="taxCode"
              placeholder="MST cá nhân"
              value={formData.taxCode}
              onChange={(e) => onChange("taxCode", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
            <Input
              id="taxAddress"
              placeholder="Địa chỉ đăng ký thuế"
              value={formData.taxAddress}
              onChange={(e) => onChange("taxAddress", e.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
