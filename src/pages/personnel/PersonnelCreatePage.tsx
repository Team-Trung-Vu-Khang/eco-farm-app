import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { PersonnelFormTabs } from "./components/PersonnelFormTabs";

export default function PersonnelCreatePage() {
  const { formData, onChange, handleSubmit, setLocation } = usePersonnelForm();

  return (
    <AdminLayout
      isRice
      title="Thêm mới nhân sự"
      description="Thêm hồ sơ nhân sự mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setLocation("/personnel")}>
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
      <div className="max-w-4xl mx-auto space-y-6">
        <PersonnelFormTabs formData={formData} onChange={onChange} />
      </div>
    </AdminLayout>
  );
}
