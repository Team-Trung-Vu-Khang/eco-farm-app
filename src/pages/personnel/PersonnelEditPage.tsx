import { useState } from "react";
import { useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, Trash2, X } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { AvatarCard } from "./components/AvatarCard";
import { StatusCard } from "./components/StatusCard";
import { PersonalInfoCard } from "./components/PersonalInfoCard";
import { ContactAddressCard } from "./components/ContactAddressCard";
import { JobPositionCard } from "./components/JobPositionCard";
import { BankInfoCard } from "./components/BankInfoCard";

export default function PersonnelEditPage() {
  const [, params] = useRoute("/personnel/:id/edit");
  const id = params?.id ? Number(params.id) : 0;

  const {
    formData,
    onChange,
    handleSubmit,
    handleDelete,
    setLocation,
    personnel,
  } = usePersonnelForm(id);

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!personnel) {
    return (
      <AdminLayout title="Cập nhật nhân sự">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin nhân sự.
          </p>
          <Button onClick={() => setLocation("/personnel")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Cập nhật nhân sự"
      description="Chỉnh sửa hồ sơ nhân sự"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
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
              {/* Left Column: Avatar & Basic Status */}
              <div className="md:col-span-1 space-y-6">
                <AvatarCard
                  avatar={formData.avatar}
                  onChange={(url) => onChange("avatar", url)}
                />
                <StatusCard
                  status={formData.status}
                  onChange={(val) => onChange("status", val)}
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

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          handleDelete();
          setDeleteOpen(false);
        }}
        description={`Bạn có chắc chắn muốn xóa nhân sự ${formData.fullName}?`}
      />
    </AdminLayout>
  );
}
