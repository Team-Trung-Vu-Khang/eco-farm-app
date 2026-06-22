import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, Trash2, X } from "lucide-react";
import { useContactEdit } from "./hooks/useContactEdit";
import { ContactFormCard } from "./components/ContactFormCard";

/**
 * Contact edit page.
 * Manages the editing of a single contact's information.
 */
export default function ContactEditPage() {
  const {
    contact,
    contactId,
    formData,
    setFormData,
    groups,
    enterprises,
    departments,
    deleteOpen,
    setDeleteOpen,
    handleSubmit,
    handleDelete,
    goBack,
  } = useContactEdit();

  if (contactId && !contact) {
    return (
      <AdminLayout
        isRice
        title="Không tìm thấy"
        description="Liên hệ không tồn tại"
      >
        <div className="flex flex-col items-center justify-center h-96">
          <h2 className="text-2xl font-bold mb-4">Không tìm thấy liên hệ</h2>
          <Button onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isRice
      title="Cập nhật liên hệ"
      description="Chỉnh sửa thông tin liên hệ"
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
          <Button variant="outline" onClick={goBack}>
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
      <div className="max-w-2xl mx-auto">
        <ContactFormCard
          formData={formData}
          setFormData={setFormData}
          enterprises={enterprises}
          groups={groups}
          departments={departments}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa liên hệ ${formData.fullName}?`}
      />
    </AdminLayout>
  );
}
