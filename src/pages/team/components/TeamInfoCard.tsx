import type { Team } from "@/stores/useTeamStore";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface TeamInfoCardProps {
  team: Team;
}

export function TeamInfoCard({ team }: TeamInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chung</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div>
            <Label className="text-muted-foreground">Mã đội nhóm</Label>
            <div className="font-medium font-mono">{team.code}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Tên đội nhóm</Label>
            <div className="font-medium">{team.name}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Trưởng nhóm</Label>
            <div className="font-medium text-primary">{team.leader}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Phòng ban</Label>
            <div className="font-medium">{team.department}</div>
          </div>
          <div>
            <Label className="text-muted-foreground">Trạng thái</Label>
            <div className="mt-1">
              <Badge variant={team.status === "active" ? "default" : "outline"}>
                {team.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
              </Badge>
            </div>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <Label className="text-muted-foreground">Mô tả</Label>
            <div className="text-sm">{team.description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
