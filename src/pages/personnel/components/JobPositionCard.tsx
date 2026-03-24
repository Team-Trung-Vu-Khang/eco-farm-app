import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useTeamStore from "../../../stores/useTeamStore";
import useDepartmentStore from "../../../stores/useDepartmentStore";
import usePositionStore from "../../../stores/usePositionStore";
import type { PersonnelFormData } from "../types";

interface JobPositionCardProps {
  formData: PersonnelFormData;
  onChange: <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => void;
}

export function JobPositionCard({ formData, onChange }: JobPositionCardProps) {
  const teams = useTeamStore((state) => state.teams);
  const departments = useDepartmentStore((state) => state.departments);
  const positions = usePositionStore((state) => state.positions);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Công việc & Chức vụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban</Label>
            <Select
              value={formData.department}
              onValueChange={(val) => onChange("department", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dep) => (
                  <SelectItem key={dep.id} value={dep.name}>
                    {dep.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Chức vụ</Label>
            <Select
              value={formData.position}
              onValueChange={(val) => onChange("position", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn chức vụ" />
              </SelectTrigger>
              <SelectContent className="max-h-96">
                {positions.map((pos) => (
                  <SelectItem key={pos.id} value={pos.name}>
                    {pos.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="team">Đội / Nhóm</Label>
          <Select
            value={formData.team}
            onValueChange={(val) => onChange("team", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn Đội / Nhóm" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.name}>
                  {team.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
