import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Check, Database, Globe, Palette } from "lucide-react";

export function GeneralSettingsTab() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            Ngôn ngữ & Khu vực
          </CardTitle>
          <CardDescription>
            Cài đặt ngôn ngữ hiển thị và múi giờ
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Ngôn ngữ hiển thị</Label>
            <Select defaultValue="vi">
              <SelectTrigger>
                <SelectValue placeholder="Chọn ngôn ngữ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vi">Tiếng Việt</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Múi giờ</Label>
            <Select defaultValue="gmt+7">
              <SelectTrigger>
                <SelectValue placeholder="Chọn múi giờ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gmt+7">
                  (GMT+07:00) Bangkok, Hanoi, Jakarta
                </SelectItem>
                <SelectItem value="gmt+8">
                  (GMT+08:00) Beijing, Singapore
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            Giao diện
          </CardTitle>
          <CardDescription>
            Tùy chỉnh màu sắc và chế độ hiển thị
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Chế độ tối (Dark Mode)</Label>
              <p className="text-sm text-muted-foreground">
                Tự động chuyển đổi theo hệ thống
              </p>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Thu gọn Sidebar</Label>
              <p className="text-sm text-muted-foreground">
                Luôn thu gọn thanh điều hướng
              </p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            Dữ liệu hệ thống
          </CardTitle>
          <CardDescription>
            Quản lý sao lưu và phục hồi dữ liệu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border border-dashed bg-muted/30 p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <Check className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">Sao lưu lần cuối</p>
                <p className="text-sm text-muted-foreground">
                  Ngày 12/01/2026 lúc 23:45
                </p>
              </div>
            </div>
            <Button variant="outline">Sao lưu ngay</Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Tự động sao lưu hàng ngày</Label>
                <p className="text-sm text-muted-foreground">
                  Hệ thống sẽ tự động sao lưu vào lúc 00:00
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
