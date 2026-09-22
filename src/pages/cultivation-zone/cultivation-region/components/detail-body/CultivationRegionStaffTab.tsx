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
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">
              Người quản lý
            </div>
            <div className="font-bold text-slate-900">
              {primaryManager?.fullName || "Chưa phân công"}
            </div>
            {primaryManager?.positionName && (
              <div className="text-sm text-muted-foreground mt-1">
                {primaryManager.positionName}
              </div>
            )}
          </div>
          <div className="rounded-lg border p-4">
            <div className="text-xs text-muted-foreground mb-2">
              Đơn vị sở hữu
            </div>
            <div className="font-bold text-slate-900">
              {details.enterprise?.name || "Đang cập nhật"}
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              {details.enterprise?.code || ""}
            </div>
          </div>
        </div>

        {/* Full personnel list assigned to the zone */}
        <div>
          <div className="text-xs text-muted-foreground mb-3">
            Nhân sự được phân công ({details.personnel.length})
          </div>
          {details.personnel.length === 0 ? (
            <div className="text-sm text-muted-foreground italic">
              Chưa phân công nhân sự.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {details.personnel.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  {person.avatarUrl ? (
                    <img
                      src={person.avatarUrl}
                      alt={person.fullName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="truncate font-semibold text-slate-900">
                      {person.fullName}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {person.positionName || "—"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
