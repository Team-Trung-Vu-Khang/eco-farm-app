import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Separator,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Mail, Smartphone } from "lucide-react";

export function NotificationSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cấu hình thông báo</CardTitle>
        <CardDescription>
          Chọn cách bạn nhận thông báo từ hệ thống
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Thông báo qua Email</Label>
                <p className="text-sm text-muted-foreground">
                  Gửi báo cáo và cảnh báo quan trọng
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <Label>Thông báo trên di động</Label>
                <p className="text-sm text-muted-foreground">
                  Thông báo đẩy (Push notification) trên ứng dụng
                </p>
              </div>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
