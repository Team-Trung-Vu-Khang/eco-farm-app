import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Separator,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function SecuritySettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mật khẩu & Bảo mật</CardTitle>
        <CardDescription>
          Đổi mật khẩu và thiết lập bảo mật 2 lớp
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="max-w-sm space-y-4">
          <div className="space-y-2">
            <Label>Mật khẩu hiện tại</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Mật khẩu mới</Label>
            <Input type="password" />
          </div>
          <div className="space-y-2">
            <Label>Xác nhận mật khẩu mới</Label>
            <Input type="password" />
          </div>
        </div>
        <Separator className="my-6" />
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Xác thực 2 yếu tố (2FA)</Label>
            <p className="text-sm text-muted-foreground">
              Tăng cường bảo mật cho tài khoản của bạn
            </p>
          </div>
          <Button variant="outline">Thiết lập</Button>
        </div>
      </CardContent>
    </Card>
  );
}
