import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { VarietyFormStepper } from "./components/VarietyFormStepper";
import { useVarietyFormPage } from "./hooks/useVarietyFormPage";

export default function VarietyEditPage() {
  const form = useVarietyFormPage({ mode: "edit" });

  if (form.notFound) {
    return (
      <AdminLayout title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin giống cây này.
          </p>
          <Button onClick={form.goBack}>Quay lại danh sách</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <VarietyFormStepper
      title="Chỉnh sửa giống cây"
      description="Cập nhật thông tin giống cây, đặc tính nông học và tài liệu kỹ thuật"
      completeLabel="Lưu thay đổi"
      form={form}
    />
  );
}
