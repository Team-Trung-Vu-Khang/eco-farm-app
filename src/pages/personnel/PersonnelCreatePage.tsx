import { AdminLayout, Button, Form } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Save, X, Loader2 } from "lucide-react";
import { usePersonnelForm } from "./hooks/usePersonnelForm";
import { PersonnelFormTabs } from "./components/PersonnelFormTabs";

export default function PersonnelCreatePage() {
  const { methods, handleSubmit, setLocation, isSubmitting } = usePersonnelForm();

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới nhân sự"
      description="Thêm hồ sơ nhân sự mới vào hệ thống"
      actions={
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setLocation("/personnel")}
            disabled={isSubmitting}
          >
            <X className="w-4 h-4 mr-2" />
            Hủy bỏ
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Lưu lại
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Form {...methods}>
          <PersonnelFormTabs />
        </Form>
      </div>
    </AdminLayout>
  );
}
