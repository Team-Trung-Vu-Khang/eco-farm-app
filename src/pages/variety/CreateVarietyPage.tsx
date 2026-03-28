import { VarietyFormStepper } from "./components/VarietyFormStepper";
import { useVarietyFormPage } from "./hooks/useVarietyFormPage";

export default function CreateVarietyPage() {
  const form = useVarietyFormPage({ mode: "create" });

  return (
    <VarietyFormStepper
      title="Tạo mới giống cây"
      description="Khởi tạo thông tin định danh, đặc tính và tài liệu kỹ thuật cho giống cây"
      completeLabel="Tạo giống cây"
      form={form}
    />
  );
}
