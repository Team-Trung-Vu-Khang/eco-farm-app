import { useState } from "react";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";

export function useSettingsPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Thành công",
        description: "Cấu hình hệ thống đã được cập nhật.",
      });
    }, 1000);
  };

  return {
    handleSave,
    loading,
  };
}
