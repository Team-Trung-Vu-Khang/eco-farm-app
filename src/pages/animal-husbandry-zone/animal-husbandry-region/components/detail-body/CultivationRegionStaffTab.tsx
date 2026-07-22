import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { User } from "lucide-react";
import type { CultivationRegionDetailBodyCommonProps } from "./types";

export const CultivationRegionStaffTab = ({
  details,
  primaryManager,
}: CultivationRegionDetailBodyCommonProps) => {
  return (
    <Card>
      <CardHeader className="border-b bg-slate-50">
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Nhân sự phụ trách
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">Người quản lý</div>
            <div className="font-bold text-slate-900">
              {primaryManager?.fullName || "Chưa phân công"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {primaryManager?.phone || ""}
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">Đơn vị sở hữu</div>
            <div className="font-bold text-slate-900">
              {details.enterprise?.name || "Đang cập nhật"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {details.enterprise?.code || ""}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
