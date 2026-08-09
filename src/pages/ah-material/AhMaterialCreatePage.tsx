import PageWrapper from "@/components/PageWrapper";
import { Button, StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import MaterialSubmitConfirmDialog from "../material/components/MaterialSubmitConfirmDialog";
import { useAhMaterialCreatePage } from "./hooks/useAhMaterialCreatePage";

const AhMaterialCreatePage = () => {
  const {
    isEdit,
    formData,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack,
    handleComplete,
    handleConfirmSubmit,
  } = useAhMaterialCreatePage();

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật vật tư" : "Thêm mới vật tư chăn nuôi"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo thông tin vật tư chăn nuôi mới"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        <StepperForm
          steps={steps}
          completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
          onComplete={handleComplete}
          onCancel={goBack}
        />
      </div>

      <MaterialSubmitConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isEdit={isEdit}
        formData={formData}
        onConfirm={handleConfirmSubmit}
      />
    </PageWrapper>
  );
};

export default AhMaterialCreatePage;
