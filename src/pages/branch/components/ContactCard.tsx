import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2 } from "lucide-react";

interface ContactCardProps {
  formData: {
    phone: string;
    email: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function ContactCard({ formData, onUpdate }: ContactCardProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Liên hệ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại</Label>
            <Input
              id="phone"
              placeholder="028..."
              value={formData.phone}
              onChange={(e) => onUpdate("phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="branch@example.com"
              type="email"
              value={formData.email}
              onChange={(e) => onUpdate("email", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>
      <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-700 text-sm border border-blue-200">
        <Building2 className="w-5 h-5 shrink-0" />
        <p>
          Chi nhánh sẽ kế thừa các thông tin pháp lý từ đơn vị chủ quản nếu không
          điền mã số thuế riêng.
        </p>
      </div>
    </div>
  );
}
