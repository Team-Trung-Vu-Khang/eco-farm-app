import {
  AdminLayout,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X } from "lucide-react";
import { TeamFormCard } from "./components/TeamFormCard";
import { useTeamCreatePage } from "./hooks/useTeamCreatePage";

export default function TeamCreatePage() {
  const { formData, setFormData, handleSubmit, goBack } = useTeamCreatePage();

  return (
    <AdminLayout
      title="Thêm mới đội nhóm"
      description="Tạo đội nhóm làm việc mới"
      actions={
        <div className="flex gap-2">
          <Button variant="outline" onClick={goBack}>
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
      <div className="max-w-2xl mx-auto">
        <TeamFormCard formData={formData} setFormData={setFormData} />
      </div>
    </AdminLayout>
  );
}
