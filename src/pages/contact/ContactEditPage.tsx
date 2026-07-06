import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContactFormCard } from "./components/ContactFormCard";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "./data/contact-form.schema";
import { useContactEdit } from "./hooks/useContactEdit";

/**
 * Contact edit page.
 * Manages the editing of a single contact's information.
 */
export default function ContactEditPage() {
  const {
    contact,
    contactId,
    defaultValues,
    enterprises,
    groups,
    departments,
    positions,
    loading,
    deleteOpen,
    setDeleteOpen,
    submitContact,
    handleDelete,
    goBack,
  } = useContactEdit();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    defaultValues,
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  if (loading) {
    return (
      <AdminLayout
        isDev={true}
        title="Đang tải liên hệ"
        description="Vui lòng chờ một lát"
      >
        <div className="flex min-h-[40vh] items-center justify-center">
          <div className="text-sm text-muted-foreground">
            Đang tải dữ liệu liên hệ...
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (contactId && !contact) {
    return (
      <AdminLayout
        isDev={true}
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
      isDev={true}
      title="Cập nhật liên hệ"
      description="Chỉnh sửa thông tin liên hệ"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit(submitContact)} disabled={isSubmitting}>
            <Save className="w-4 h-4 mr-2" />
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-2xl mx-auto">
        <ContactFormCard
          control={control}
          errors={errors}
          enterprises={enterprises}
          groups={groups}
          departments={departments}
          positions={positions}
          showStatus
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        description={`Bạn có chắc chắn muốn xóa liên hệ ${defaultValues.fullName}?`}
      />
    </AdminLayout>
  );
}
