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

interface GeneralInfoCardProps {
  formData: {
    enterpriseId: string;
    code: string;
    taxCode: string;
    taxAddress: string;
    website: string;
    name: string;
    description: string;
  };
  onUpdate: (field: string, value: string) => void;
}

export function GeneralInfoCard({ formData, onUpdate }: GeneralInfoCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin chung</CardTitle>
        <CardDescription>Thông tin cơ bản của chi nhánh</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="enterprise">Đơn vị chủ quản *</Label>
          <Select
            value={formData.enterpriseId}
            onValueChange={(val) => onUpdate("enterpriseId", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Đơn vị sở hữu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Công ty CP Nông nghiệp Xanh EcoFarm</SelectItem>
              <SelectItem value="2">HTX Rau sạch Thanh Hà</SelectItem>
              <SelectItem value="3">Nông hộ Nguyễn Văn A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Mã chi nhánh</Label>
            <Input
              id="code"
              placeholder="Tự động tạo nếu để trống"
              value={formData.code}
              onChange={(e) => onUpdate("code", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="taxCode">Mã số thuế chi nhánh</Label>
            <Input
              id="taxCode"
              placeholder="MST chi nhánh (nếu có)"
              value={formData.taxCode}
              onChange={(e) => onUpdate("taxCode", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxAddress">Địa chỉ thuế</Label>
          <Input
            id="taxAddress"
            placeholder="Địa chỉ đăng ký thuế (nếu khác địa chỉ chi nhánh)"
            value={formData.taxAddress}
            onChange={(e) => onUpdate("taxAddress", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            placeholder="VD: https://ecofarm.vn"
            value={formData.website}
            onChange={(e) => onUpdate("website", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Tên chi nhánh *</Label>
          <Input
            id="name"
            placeholder="VD: Chi nhánh Miền Nam"
            value={formData.name}
            onChange={(e) => onUpdate("name", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả / Ghi chú</Label>
          <Textarea
            id="description"
            placeholder="Thông tin thêm về chi nhánh..."
            rows={3}
            value={formData.description}
            onChange={(e) => onUpdate("description", e.target.value)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
