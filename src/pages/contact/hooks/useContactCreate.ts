import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import useContactStore from "@/stores/useContactStore";
import useEnterpriseStore from "@/stores/useEnterpriseStore";
import useDepartmentStore from "@/stores/useDepartmentStore";

export function useContactCreate() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const contacts = useContactStore((state) => state.contacts);
  const groups = useContactStore((state) => state.groups);
  const addContact = useContactStore((state) => state.addContact);
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

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone || !formData.entityName) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    // Generate new ID
    const newId =
      contacts.length > 0 ? Math.max(...contacts.map((c) => c.id)) + 1 : 1;

    // Add to store
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
    setLocation("/contact");
  };

  return {
    formData,
    setFormData,
    groups,
    enterprises,
    departments,
    handleSubmit,
    setLocation,
  };
}
