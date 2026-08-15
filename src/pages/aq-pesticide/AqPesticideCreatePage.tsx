import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Label,
  StepperForm,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import PesticideSubmitConfirmDialog from "../pesticide/components/PesticideSubmitConfirmDialog";
import SimplePesticideForm from "../pesticide/components/SimplePesticideForm";
import { useAqPesticideCreatePage } from "./hooks/useAqPesticideCreatePage";

const AqPesticideCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack,
    handleComplete,
    handleConfirmSubmit,
    loading,
    submitting,
  } = useAqPesticideCreatePage();

  const [isDetailMode, setIsDetailMode] = useState(false);

  useEffect(() => {
    if (isEdit && formData.formType) {
      setIsDetailMode(formData.formType === "advanced");
    }
  }, [isEdit, formData.formType]);

  if (loading) {
    return (
      <PageWrapper title={isEdit ? "Cập nhật thuốc" : "Thêm thuốc thủy sản"}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật thuốc" : "Thêm thuốc thủy sản"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin cho ${formData.name}`
          : "Khai báo thông tin thuốc, hóa chất nuôi trồng thủy sản mới"
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
          <Label
            htmlFor="aq-pesticide-detail-mode"
            className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
          >
            Thông tin chuyên sâu
          </Label>
          <Switch
            id="aq-pesticide-detail-mode"
            checked={isDetailMode}
            onCheckedChange={(checked) => {
              setIsDetailMode(checked);
              if (!isEdit) {
                resetForm();
              }
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
            loading={submitting}
          />
        ) : (
          <div className="p-4 md:p-6">
            <SimplePesticideForm
              formData={formData}
              domain="aquaculture"
              onFormFieldChange={updateField}
              handleComplete={() => setConfirmOpen(true)}
              goBack={goBack}
              completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
              loading={submitting}
            />
          </div>
        )}
      </div>

      <PesticideSubmitConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isEdit={isEdit}
        formData={formData}
        onConfirm={() => handleConfirmSubmit(isDetailMode)}
        loading={submitting}
      />
    </PageWrapper>
  );
};

export default AqPesticideCreatePage;
