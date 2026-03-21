import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useContactStore from "@/stores/useContactStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useDepartmentStore from "@/stores/useDepartmentStore";

export function useContactEdit() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/contact/:id/edit");
  const { toast } = useToast();
  const [deleteOpen, setDeleteOpen] = useState(false);

  const contactId = params?.id ? parseInt(params.id) : undefined;
  const getContactById = useContactStore((state) => state.getContactById);
  const groups = useContactStore((state) => state.groups);
  const updateContact = useContactStore((state) => state.updateContact);
  const deleteContact = useContactStore((state) => state.deleteContact);
  const contact = contactId ? getContactById(contactId) : undefined;
  
  const enterprises = useEnterpriseStore((state) => state.enterprises);
  const departments = useDepartmentStore((state) => state.departments);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    position: "",
    department: "",
    entityName: "",
    groupId: "",
    note: "",
    status: "active" as "active" | "inactive",
  });

  useEffect(() => {
    if (contact) {
      setFormData({
        fullName: contact.fullName,
        phone: contact.phone,
        email: contact.email,
        position: contact.position,
        department: contact.department,
        entityName: contact.entityName,
        groupId: contact.groupId ? contact.groupId.toString() : "",
        note: contact.note,
        status: contact.status,
      });
    }
  }, [contact]);

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.entityName || !contactId) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    updateContact(contactId, {
      ...formData,
      groupId: formData.groupId ? parseInt(formData.groupId) : undefined,
    });

    toast({ title: "Cập nhật thành công", description: `Đã cập nhật liên hệ "${formData.fullName}"` });
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
    setLocation,
  };
}
