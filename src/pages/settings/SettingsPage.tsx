import { AdminLayout, Tabs, TabsContent } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { GeneralSettingsTab } from "./components/GeneralSettingsTab";
import { NotificationSettingsTab } from "./components/NotificationSettingsTab";
import { ProfileSettingsTab } from "./components/ProfileSettingsTab";
import { SecuritySettingsTab } from "./components/SecuritySettingsTab";
import { SettingsTabsHeader } from "./components/SettingsTabsHeader";
import { useSettingsPage } from "./hooks/useSettingsPage";

export default function SettingsPage() {
  const { handleSave, loading } = useSettingsPage();

  return (
    <AdminLayout
      title="Cài đặt hệ thống"
      description="Quản lý cấu hình chung, bảo mật và thông báo"
    >
      <div className="flex flex-col gap-6">
        <Tabs defaultValue="general" className="w-full">
          <SettingsTabsHeader loading={loading} onSave={handleSave} />

          <TabsContent value="general" className="space-y-6">
            <GeneralSettingsTab />
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSettingsTab />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <NotificationSettingsTab />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
