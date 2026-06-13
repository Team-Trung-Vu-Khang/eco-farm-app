import { VarietyFoundationFormStepper } from "./components/VarietyFoundationFormStepper";
import { useVarietyFoundationFormPage } from "./hooks/useVarietyFoundationFormPage";

export default function CreateVarietyFoundationPage() {
  const form = useVarietyFoundationFormPage({ mode: "create" });

  return (
    <VarietyFoundationFormStepper
      title="Tạo mới giống cây (nền tảng)"
      description="Khởi tạo thông tin định danh, đặc tính và tài liệu kỹ thuật cho giống cây (nền tảng)"
      completeLabel="Tạo giống cây (nền tảng)"
      form={form}
    />
  );
}
