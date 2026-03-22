import { type Enterprise } from "@/pages/enterprise/data/constants";
import { type ContactGroup } from "@/stores/useContactStore";
import { type Department } from "@/stores/useDepartmentStore";
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

interface ContactFormProps {
  formData: any;
  setFormData: (data: any) => void;
  enterprises: Enterprise[];
  groups: ContactGroup[];
  departments: Department[];
}

export function ContactFormCard({
  formData,
  setFormData,
  enterprises,
  groups,
  departments,
}: ContactFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin liên hệ</CardTitle>
        <CardDescription>
          Chi tiết thông tin cá nhân và công việc
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Họ và tên *</Label>
          <Input
            id="fullName"
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="Nhập họ và tên"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="phone">Số điện thoại *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0901234567"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="contact@example.com"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="entityName">Đơn vị sở hữu *</Label>
            <Select
              value={formData.entityName}
              onValueChange={(val) =>
                setFormData({ ...formData, entityName: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn đơn vị" />
              </SelectTrigger>
              <SelectContent>
                {enterprises.map((e) => (
                  <SelectItem key={e.id} value={e.name}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="groupId">Nhóm danh bạ</Label>
            <Select
              value={formData.groupId}
              onValueChange={(val) =>
                setFormData({ ...formData, groupId: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhóm danh bạ" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id.toString()}>
                    {g.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="department">Phòng ban</Label>
            <Select
              value={formData.department}
              onValueChange={(val) =>
                setFormData({ ...formData, department: val })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn phòng ban" />
              </SelectTrigger>
              <SelectContent>
                {departments
                  .filter((d) => d.status === "active")
                  .map((d) => (
                    <SelectItem key={d.id} value={d.name}>
                      {d.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Chức vụ</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              placeholder="VD: Trưởng phòng"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái</Label>
          <Select
            value={formData.status}
            onValueChange={(val: any) =>
              setFormData({ ...formData, status: val })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang làm việc</SelectItem>
              <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="note">Ghi chú</Label>
          <Textarea
            id="note"
            value={formData.note}
            onChange={(e) => setFormData({ ...formData, note: e.target.value })}
            placeholder="Ghi chú thêm..."
            rows={3}
          />
        </div>
      </CardContent>
    </Card>
  );
}
