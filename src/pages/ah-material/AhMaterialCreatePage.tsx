import PageWrapper from "@/components/PageWrapper";
import { Button, Label, StepperForm, Switch } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import MaterialSubmitConfirmDialog from "../material/components/MaterialSubmitConfirmDialog";
import SimpleMaterialForm from "../material/components/SimpleMaterialForm";
import { useAhMaterialCreatePage } from "./hooks/useAhMaterialCreatePage";

const AhMaterialCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack,
    handleComplete,
    handleConfirmSubmit,
  } = useAhMaterialCreatePage();

  const [isDetailMode, setIsDetailMode] = useState(false);

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật vật tư" : "Thêm mới vật tư chăn nuôi"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo thông tin vật tư chăn nuôi mới"
      }
    >
      {/* Header bar: back button + toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
          <Label htmlFor="ah-material-detail-mode" className="text-xs font-semibold text-slate-600 cursor-pointer select-none">
            Thông tin chuyên sâu
          </Label>
          <Switch
            id="ah-material-detail-mode"
            checked={isDetailMode}
            onCheckedChange={(checked) => {
              setIsDetailMode(checked);
            }}
          />
        </div>
      </div>

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        {isDetailMode ? (
          <StepperForm
            steps={steps}
            completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
            onComplete={handleComplete}
            onCancel={goBack}
          />
        ) : (
          <div className="p-4 md:p-6">
            <SimpleMaterialForm
              formData={formData}
              updateField={updateField}
              handleComplete={() => setConfirmOpen(true)}
              goBack={goBack}
              completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
            />
          </div>
        )}
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
