import { useState } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useContactStore from "@/stores/useContactStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useDepartmentStore from "@/stores/useDepartmentStore";
import { emptyContactFormData } from "../data/constants";
import type { ContactFormData } from "../types/types";

interface UseContactFormOptions {
  mode: "create" | "edit";
}

export function useContactForm({ mode }: UseContactFormOptions) {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/contact/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const contacts = useContactStore((state) => state.contacts);
  const groups = useContactStore((state) => state.groups);
  const getContactById = useContactStore((state) => state.getContactById);
  const addContact = useContactStore((state) => state.addContact);
  const updateContact = useContactStore((state) => state.updateContact);
  const deleteContact = useContactStore((state) => state.deleteContact);

  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const departments = useDepartmentStore((state) => state.departments);

  const contactId = params?.id ? parseInt(params.id) : undefined;
  const contact =
    mode === "edit" && contactId ? getContactById(contactId) : undefined;

  const [formData, setFormData] = useState<ContactFormData>(() =>
    contact
      ? {
          fullName: contact.fullName,
          phone: contact.phone,
          email: contact.email,
          position: contact.position,
          department: contact.department,
          entityName: contact.entityName,
          groupId: contact.groupId ? contact.groupId.toString() : "",
          note: contact.note,
          status: contact.status,
        }
      : emptyContactFormData,
  );

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.entityName) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (mode === "edit") {
      if (!contactId) {
        return;
      }

      updateContact(contactId, {
        ...formData,
        groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
      });
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật liên hệ "${formData.fullName}"`,
      });
    } else {
      const newId =
        contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

      addContact({
        id: newId,
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        position: formData.position,
        department: formData.department,
        entityName: formData.entityName,
        groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
        note: formData.note,
        status: formData.status,
        createdAt: new Date().toISOString(),
      });

      toast({
        title: "Thành công",
        description: `Đã thêm liên hệ "${formData.fullName}"`,
      });
    }

    setLocation("/contact");
  };

  const handleDelete = () => {
    if (contactId) {
      deleteContact(contactId);
      toast({ title: "Thành công", description: "Đã xóa liên hệ" });
      setLocation("/contact");
    }
    setDeleteOpen(false);
  };

  return {
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
    goBack: () => setLocation("/contact"),
  };
}
