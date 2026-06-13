import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { VarietyFoundationFormStepper } from "./components/VarietyFoundationFormStepper";
import { useVarietyFoundationFormPage } from "./hooks/useVarietyFoundationFormPage";

export default function VarietyFoundationEditPage() {
  const form = useVarietyFoundationFormPage({ mode: "edit" });

  if (form.notFound) {
    return (
      <AdminLayout isDev={true} title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin giống cây (nền tảng) này.
          </p>
          <Button onClick={form.goBack}>Quay lại danh sách</Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <VarietyFoundationFormStepper
      title="Chỉnh sửa giống cây (nền tảng)"
      description="Cập nhật thông tin giống cây (nền tảng), đặc tính nông học và tài liệu kỹ thuật"
      completeLabel="Lưu thay đổi"
      form={form}
    />
  );
}
