import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import {
  TEAM_DEPARTMENT_OPTIONS,
  TEAM_LEADER_OPTIONS,
  TEAM_STATUS_OPTIONS,
} from "../data/constants";
import type { TeamFormData } from "../types/types";

interface TeamFormCardProps {
  formData: TeamFormData;
  setFormData: (value: TeamFormData) => void;
}

export function TeamFormCard({
  formData,
  setFormData,
}: TeamFormCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin đội nhóm</CardTitle>
        <CardDescription>Thiết lập thông tin cơ bản cho đội nhóm</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã đội *</Label>
            <Input
              id="code"
              placeholder="VD: TEAM-KD-01"
              value={formData.code}
              onChange={(event) =>
                setFormData({ ...formData, code: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Tên đội nhóm *</Label>
            <Input
              id="name"
              placeholder="Nhập tên đội nhóm"
              value={formData.name}
              onChange={(event) =>
                setFormData({ ...formData, name: event.target.value })
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Thuộc phòng ban</Label>
            <Select
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_DEPARTMENT_OPTIONS.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="leader">Trưởng nhóm</Label>
            <Select
              value={formData.leader}
              onValueChange={(value) =>
                setFormData({ ...formData, leader: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trưởng nhóm" />
              </SelectTrigger>
              <SelectContent>
                {TEAM_LEADER_OPTIONS.map((leader) => (
                  <SelectItem key={leader} value={leader}>
                    {leader}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({
                ...formData,
                status: value as TeamFormData["status"],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              {TEAM_STATUS_OPTIONS.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            placeholder="Mô tả nhiệm vụ, chức năng của đội nhóm..."
            value={formData.description}
            onChange={(event) =>
              setFormData({ ...formData, description: event.target.value })
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
