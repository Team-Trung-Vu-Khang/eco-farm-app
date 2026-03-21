import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Phone, Mail } from "lucide-react";

interface SidebarContactCardProps {
  branch: {
    phone?: string;
    email?: string;
  };
}

export function SidebarContactCard({ branch }: SidebarContactCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Phone className="w-4 h-4 text-primary" />
          Thông tin liên hệ
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Điện thoại</p>
              <p className="font-medium text-gray-900">{branch.phone || "-"}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="font-medium text-gray-900">{branch.email || "-"}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
