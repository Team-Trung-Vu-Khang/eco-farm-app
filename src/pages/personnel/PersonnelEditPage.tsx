import { useState } from "react";
import { useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  DeleteDialog,
  Form,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, Trash2, X, Loader2 } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { PersonnelFormTabs } from "./components/PersonnelFormTabs";

export default function PersonnelEditPage() {
  const [, params] = useRoute("/personnel/:id/edit");
  const id = params?.id ? Number(params.id) : 0;

  const {
    methods,
    handleSubmit,
    handleDelete,
    setLocation,
    personnel,
    isPersonnelLoading,
    isSubmitting,
    isDeleting,
  } = usePersonnelForm(id);

  const [deleteOpen, setDeleteOpen] = useState(false);

  if (isPersonnelLoading) {
    return (
      <AdminLayout isDev={true} title="Cập nhật nhân sự">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin nhân sự...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!personnel) {
    return (
      <AdminLayout isDev={true} title="Cập nhật nhân sự">
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
      isDev={true}
      title="Cập nhật nhân sự"
      description="Chỉnh sửa hồ sơ nhân sự"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteOpen(true)}
            disabled={isDeleting || isSubmitting}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa
          </Button>
          <Button
            variant="outline"
            onClick={() => setLocation("/personnel")}
            disabled={isSubmitting || isDeleting}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || isDeleting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Form {...methods}>
          <PersonnelFormTabs showStatus />
        </Form>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={() => {
          handleDelete();
          setDeleteOpen(false);
        }}
        description={`Bạn có chắc chắn muốn xóa nhân sự ${personnel.fullName}?`}
        loading={isDeleting}
      />
    </AdminLayout>
  );
}
