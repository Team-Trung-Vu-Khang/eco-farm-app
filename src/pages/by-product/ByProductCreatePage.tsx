import PageWrapper from "@/components/PageWrapper";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Label,
  StepperForm,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import SimpleByProductForm from "./components/SimpleByProductForm";
import { ByProductBasicInfoStep } from "./components/steps/ByProductBasicInfoStep";
import { ByProductConfirmationStep } from "./components/steps/ByProductConfirmationStep";
import { ByProductSafetyLegalStep } from "./components/steps/ByProductSafetyLegalStep";
import { ByProductSuppliersStep } from "./components/steps/ByProductSuppliersStep";
import { ByProductUsageStep } from "./components/steps/ByProductUsageStep";
import { useByProductCreateForm } from "./hooks/useByProductCreateForm";

const ByProductCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    goBack,
    loading,
    submitting,
  } = useByProductCreateForm();

  const [isDetailMode, setIsDetailMode] = useState(false);

  useEffect(() => {
    if (isEdit && formData.formType) {
      setIsDetailMode(formData.formType === "advanced");
    }
  }, [isEdit, formData.formType]);

  if (loading) {
    return (
      <PageWrapper title={isEdit ? "Cập nhật phụ phẩm" : "Thêm phụ phẩm mới"}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground animate-pulse">
            Đang tải dữ liệu...
          </p>
        </div>
      </PageWrapper>
    );
  }

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
      content: (
        <ByProductBasicInfoStep
          formData={formData}
          updateField={updateField}
        />
      ),
      isValid: Boolean(formData.name),
    },
    {
      id: "usage",
      title: "Thông tin sử dụng",
      content: (
        <ByProductUsageStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "safety",
      title: "An toàn & Pháp lý",
      content: (
        <ByProductSafetyLegalStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "supply",
      title: "Xuất xứ & Cung ứng",
      content: (
        <ByProductSuppliersStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <ByProductConfirmationStep formData={formData} />,
    },
  ];

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật phụ phẩm" : "Thêm mới phụ phẩm"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo thông tin phụ phẩm mới"
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
            htmlFor="byproduct-detail-mode"
            className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
          >
            Thông tin chuyên sâu
          </Label>
          <Switch
            id="byproduct-detail-mode"
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
            onComplete={() => setConfirmOpen(true)}
            onCancel={goBack}
            loading={submitting}
          />
        ) : (
          <div className="p-4 md:p-6">
            <SimpleByProductForm
              formData={formData}
              updateField={updateField}
              handleComplete={() => setConfirmOpen(true)}
              goBack={goBack}
              completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
              loading={submitting}
            />
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3" asChild>
              <div>
                <p>
                  {isEdit
                    ? "Bạn có chắc chắn muốn cập nhật thông tin phụ phẩm này?"
                    : "Bạn có chắc chắn muốn thêm phụ phẩm mới vào hệ thống?"}
                </p>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Mã SKU / Code:
                    </span>
                    <span className="font-medium">
                      {formData.code || "Tự động tạo"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên phụ phẩm:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nguồn gốc:</span>
                    <span className="font-medium">
                      {(formData.byProductOrigins || []).join(", ") || "—"}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitting}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleConfirmSubmit(isDetailMode)}
              disabled={submitting}
            >
              {submitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
};

export default ByProductCreatePage;
