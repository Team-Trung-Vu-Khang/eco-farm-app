import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { User } from "lucide-react";

export function ProfileSettingsTab() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
        <CardDescription>
          Cập nhật thông tin tài khoản của bạn
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mb-6 flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-background bg-primary/10 shadow-lg">
            <User className="h-12 w-12 text-primary" />
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
  );
}
