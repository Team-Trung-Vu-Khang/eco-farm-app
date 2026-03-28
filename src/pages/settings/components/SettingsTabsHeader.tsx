import { Button, TabsList, TabsTrigger } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Bell, Settings, Shield, User } from "lucide-react";

interface SettingsTabsHeaderProps {
  loading: boolean;
  onSave: () => void;
}

export function SettingsTabsHeader({
  loading,
  onSave,
}: SettingsTabsHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <TabsList className="bg-muted/50 p-1">
        <TabsTrigger value="general" className="gap-2">
          <Settings className="h-4 w-4" />
          Chung
        </TabsTrigger>
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" />
          Hồ sơ
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" />
          Thông báo
        </TabsTrigger>
        <TabsTrigger value="security" className="gap-2">
          <Shield className="h-4 w-4" />
          Bảo mật
        </TabsTrigger>
      </TabsList>

      <Button onClick={onSave} disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </div>
  );
}
