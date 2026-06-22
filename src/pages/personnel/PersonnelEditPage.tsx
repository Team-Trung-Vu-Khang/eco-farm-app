import { useState } from "react";
import { useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, Trash2, X } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { PersonnelFormTabs } from "./components/PersonnelFormTabs";

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
      <AdminLayout isRice title="Cập nhật nhân sự">
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
      isRice
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
        <PersonnelFormTabs formData={formData} onChange={onChange} showStatus />
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
