import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { AvatarCard } from "./components/AvatarCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ContactAddressCard } from "./components/ContactAddressCard";
import { JobPositionCard } from "./components/JobPositionCard";
import { BankInfoCard } from "./components/BankInfoCard";

export default function PersonnelCreatePage() {
  const { formData, onChange, handleSubmit, setLocation } = usePersonnelForm();

  return (
    <AdminLayout
      title="Thêm mới nhân sự"
      description="Thêm hồ sơ nhân sự mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/personnel")}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="info">Thông tin chung</TabsTrigger>
            <TabsTrigger value="bank">Thông tin ngân hàng</TabsTrigger>
          </TabsList>

          <TabsContent value="info">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column: Avatar */}
              <div className="md:col-span-1 space-y-6">
                <AvatarCard
                  avatar={formData.avatar}
                  onChange={(url) => onChange("avatar", url)}
                />
              </div>

              {/* Right Column: Detailed Info */}
              <div className="md:col-span-2 space-y-6">
                <PersonalInfoCard formData={formData} onChange={onChange} />
                <ContactAddressCard formData={formData} onChange={onChange} />
                <JobPositionCard formData={formData} onChange={onChange} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bank">
            <BankInfoCard formData={formData} onChange={onChange} />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
