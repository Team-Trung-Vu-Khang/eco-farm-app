import { useState } from "react";

import {
  Settings,
  User,
  Bell,
  Shield,
  Globe,
  Palette,
  Database,
  Mail,
  Smartphone,
  Check,
} from "lucide-react";
import {
  AdminLayout,
  Button,
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
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  useToast,
} from "@tankhang1/eco-shared-ui";

export default function SettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Thành công",
        description: "Cấu hình hệ thống đã được cập nhật.",
      });
    }, 1000);
  };

  return (
    <AdminLayout
      title="Cài đặt hệ thống"
      description="Quản lý cấu hình chung, bảo mật và thông báo"
    >
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="general" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="general" className="gap-2">
                <Settings className="w-4 h-4" />
                Chung
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Hồ sơ
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="w-4 h-4" />
                Thông báo
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="w-4 h-4" />
                Bảo mật
              </TabsTrigger>
            </TabsList>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </div>

          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
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
                    <Palette className="w-5 h-5 text-primary" />
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
                    <Database className="w-5 h-5 text-primary" />
                    Dữ liệu hệ thống
                  </CardTitle>
                  <CardDescription>
                    Quản lý sao lưu và phục hồi dữ liệu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-dashed">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Check className="w-6 h-6 text-blue-600" />
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
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
                <CardDescription>
                  Cập nhật thông tin tài khoản của bạn
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 mb-6">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <Button variant="outline">Thay đổi ảnh đại diện</Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Họ và tên</Label>
                    <Input defaultValue="Quản trị viên" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chức vụ</Label>
                    <Input defaultValue="Quản lý tổng" disabled />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email liên hệ</Label>
                  <Input defaultValue="admin@farm.vn" />
                </div>
                <div className="space-y-2">
                  <Label>Số điện thoại</Label>
                  <Input defaultValue="0987654321" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
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
                      <Mail className="w-5 h-5 text-muted-foreground" />
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
                      <Smartphone className="w-5 h-5 text-muted-foreground" />
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
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Mật khẩu & Bảo mật</CardTitle>
                <CardDescription>
                  Đổi mật khẩu và thiết lập bảo mật 2 lớp
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4 max-w-sm">
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
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
