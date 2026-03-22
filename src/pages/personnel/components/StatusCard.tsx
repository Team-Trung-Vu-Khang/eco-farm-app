import {
  Card,
  CardContent,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

interface StatusCardProps {
  status: string;
  onChange: (value: "active" | "inactive" | "on_leave") => void;
}

export function StatusCard({ status, onChange }: StatusCardProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="status">Trạng thái làm việc</Label>
          <Select
            value={status}
            onValueChange={(val) => onChange(val as "active" | "inactive" | "on_leave")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Đang làm việc</SelectItem>
              <SelectItem value="inactive">Đã nghỉ việc</SelectItem>
              <SelectItem value="on_leave">Nghỉ phép</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
