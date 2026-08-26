import PageWrapper from "@/components/PageWrapper";
import {
  contactApi,
  contactKeys,
  useCreateContact,
  type ContactCreateRequest,
} from "@/features/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Button, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useSelectedWorkspaceId } from "@/features/workspace";
import { Loader2, Save, X } from "lucide-react";
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
  const workspaceId = useSelectedWorkspaceId();
  const queryClient = useQueryClient();
  const {
    defaultValues,
    enterprises,
    enterpriseSearch,
    setEnterpriseSearch,
    loadMoreEnterprises,
    hasMoreEnterprises,
    enterprisesLoading,
    groups,
    departments,
    positions,
    goBack,
  } = useContactCreate();
  const { createContact } = useCreateContact();

  const buildOptionValue = (source: string, id: number) => `${source}_${id}`;

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
    const department = departments.find(
      (item) => item.name === values.department,
    );
    const selectedPosition = positions.find((item) => {
      const optionValue = buildOptionValue(item.source, item.id);
      return optionValue === values.position || item.name === values.position;
    });

    const payload: ContactCreateRequest = {
      fullName: values.fullName.trim(),
      name: values.fullName.trim(),
      phone: values.phone.trim(),
      email: values.email.trim() || null,
      position: (selectedPosition?.name ?? values.position.trim()) || null,
      groupIds: values.groupIds.length ? values.groupIds.map(Number) : null,
      departmentType: department?.source ?? null,
      departmentId: department ? department.id : null,
      note: values.note.trim() || null,
      status: "active",
    };

    try {
      const createdContact = await createContact(payload);
      const selectedOwner = enterprises.find(
        (enterprise) => enterprise.name === values.entityName,
      );

      if (!selectedOwner || workspaceId === null || workspaceId === undefined) {
        throw new Error("Không xác định được đơn vị sở hữu để liên kết liên hệ");
      }

      await contactApi.attachOwner(
        "ORGANIZATION",
        selectedOwner.id,
        {
          contactId: createdContact.id,
          name: createdContact.name || createdContact.fullName,
          position: createdContact.position,
          phone: createdContact.phone,
          email: createdContact.email,
          displayOrder: 1,
          isPrimary: true,
        },
        workspaceId,
      );
      await queryClient.invalidateQueries({ queryKey: contactKeys.all });

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
    <PageWrapper
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
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting ? "Đang lưu..." : "Lưu lại"}
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
          enterpriseSearch={enterpriseSearch}
          onEnterpriseSearch={setEnterpriseSearch}
          onLoadMoreEnterprises={loadMoreEnterprises}
          hasMoreEnterprises={hasMoreEnterprises}
          enterprisesLoading={enterprisesLoading}
          showStatus={false}
        />
      </div>
    </PageWrapper>
  );
}
