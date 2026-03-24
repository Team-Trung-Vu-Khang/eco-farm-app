import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import { emptyPersonnelFormData, type PersonnelFormData } from "../types";

export function usePersonnelForm(id?: number) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const addPersonnel = usePersonnelStore((state) => state.addPersonnel);
  const updatePersonnel = usePersonnelStore((state) => state.updatePersonnel);
  const getPersonnelById = usePersonnelStore((state) => state.getPersonnelById);
  const deletePersonnel = usePersonnelStore((state) => state.deletePersonnel);

  const personnel = id ? getPersonnelById(id) : null;

  const [formData, setFormData] = useState<PersonnelFormData>(
    emptyPersonnelFormData,
  );

  useEffect(() => {
    if (personnel) {
      setFormData({
        fullName: personnel.fullName,
        phone: personnel.phone,
        email: personnel.email,
        province: personnel.province,
        district: personnel.district,
        address: personnel.address,
        taxCode: personnel.taxCode,
        taxAddress: personnel.taxAddress,
        avatar: personnel.avatar,
        department: personnel.department,
        position: personnel.position,
        team: personnel.team,
        status: personnel.status,
        bankName: personnel.bankName || "",
        accountNumber: personnel.accountNumber || "",
        accountHolder: personnel.accountHolder || "",
        bankBranch: personnel.bankBranch || "",
      });
    }
  }, [personnel]);

  const onChange = <K extends keyof PersonnelFormData>(
    field: K,
    value: PersonnelFormData[K],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.fullName || !formData.phone) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập đầy đủ các trường bắt buộc",
        variant: "destructive",
      });
      return;
    }

    if (id) {
      updatePersonnel(id, formData);
      toast({
        title: "Cập nhật thành công",
        description: `Đã cập nhật nhân sự "${formData.fullName}"`,
      });
    } else {
      addPersonnel(formData);
      toast({
        title: "Thành công",
        description: `Đã thêm nhân sự "${formData.fullName}"`,
      });
    }
    setLocation("/personnel");
  };

  const handleDelete = () => {
    if (id) {
      deletePersonnel(id);
      toast({
        title: "Thành công",
        description: "Đã xóa nhân sự khỏi hệ thống",
      });
      setLocation("/personnel");
    }
  };

  return {
    formData,
    setFormData,
    onChange,
    handleSubmit,
    handleDelete,
    setLocation,
    personnel, // Return personnel so the view can check if it exists (for edit page)
  };
}
