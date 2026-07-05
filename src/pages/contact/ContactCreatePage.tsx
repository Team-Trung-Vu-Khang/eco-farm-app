import {
  AdminLayout,
  Button,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useCreateContact, type ContactCreateRequest } from "@/features/contact";
import { Save, X } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ContactFormCard } from "./components/ContactFormCard";
import {
  contactFormSchema,
  type ContactFormInput,
  type ContactFormValues,
} from "./data/contact-form.schema";
import { useContactCreate } from "./hooks/useContactCreate";

/**
 * Contact create page.
 * Manages the addition of a new contact.
 */
export default function ContactCreatePage() {
  const { toast } = useToast();
  const {
    defaultValues,
    enterprises,
    groups,
    departments,
    positions,
    goBack,
  } = useContactCreate();
  const { createContact } = useCreateContact();
  const activeDepartments = departments.filter(
    (department) => department.status === "active",
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput, unknown, ContactFormValues>({
    defaultValues,
    resolver: zodResolver(contactFormSchema),
    mode: "onTouched",
  });

  const handleCreateContact = async (values: ContactFormValues) => {
    const department = activeDepartments.find(
      (item) => item.name === values.department,
    );

    const payload: ContactCreateRequest = {
      fullName: values.fullName.trim(),
      name: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || null,
      position: values.position.trim() || null,
      entityName: values.entityName.trim() || null,
      groupId: values.groupId ? Number(values.groupId) : null,
      departmentType: department ? "OWNER" : null,
      departmentId: department ? department.id : null,
      note: values.note.trim() || null,
      status: "active",
    };

    try {
      await createContact(payload);

      toast({
        title: "Thành công",
        description: `Đã thêm liên hệ "${values.fullName}"`,
      });

      goBack();
    } catch (error) {
      toast({
        title: "Không thể tạo liên hệ",
        description: error instanceof Error ? error.message : "Đã xảy ra lỗi",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      title="Thêm mới liên hệ"
      description="Thêm thông tin liên hệ mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button
            onClick={handleSubmit(handleCreateContact)}
            disabled={isSubmitting}
          >
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
          showStatus={false}
        />
      </div>
    </AdminLayout>
  );
}
