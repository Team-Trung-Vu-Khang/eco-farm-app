import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { emptyTeamFormData } from "../types/types";
import useTeamStore from "@/stores/useTeamStore";

export function useTeamCreatePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const addTeam = useTeamStore((state) => state.addTeam);
  const [formData, setFormData] = useState(emptyTeamFormData);

  const handleSubmit = () => {
    if (!formData.code || !formData.name) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng nhập mã và tên đội nhóm",
        variant: "destructive",
      });
      return;
    }

    addTeam(formData);
    toast({
      title: "Thành công",
      description: `Đã tạo đội nhóm "${formData.name}"`,
    });
    setLocation("/team");
  };

  return {
    formData,
    setFormData,
    handleSubmit,
    goBack: () => setLocation("/team"),
  };
}
