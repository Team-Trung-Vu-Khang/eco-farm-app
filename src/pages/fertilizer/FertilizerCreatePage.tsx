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
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { FertilizerBasicInfoStep } from "./components/steps/FertilizerBasicInfoStep";
import { FertilizerUsageStep } from "./components/steps/FertilizerUsageStep";
import FertilizerSafetyLegalStep from "./components/steps/FertilizerSafetyLegalStep";
import { FertilizerConfirmationStep } from "./components/steps/FertilizerConfirmationStep";
import { FertilizerSuppliersStep } from "./components/steps/FertilizerSuppliersStep";
import SimpleFertilizerForm from "./components/SimpleFertilizerForm";
import { useFertilizerCreateForm } from "./hooks/useFertilizerCreateForm";
import { originOptions } from "./data/constants";

const FertilizerCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    resetForm,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    setLocation,
  } = useFertilizerCreateForm();

  const [isDetailMode, setIsDetailMode] = useState(false);

  const steps = [
    {
      id: "info",
      title: "Định danh & Phân loại",
      content: (
        <FertilizerBasicInfoStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "usage",
      title: "Thông tin sử dụng",
      content: (
        <FertilizerUsageStep formData={formData} updateField={updateField} />
      ),
    },
    {
      id: "safety",
      title: "An toàn & Pháp lý",
      content: (
        <FertilizerSafetyLegalStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "supply",
      title: "Xuất xứ & Cung ứng",
      content: (
        <FertilizerSuppliersStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <FertilizerConfirmationStep formData={formData} />,
    },
  ];

  return (
    <PageWrapper
      title={isEdit ? "Cập nhật phân bón" : "Thêm mới phân bón"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Khai báo thông tin chất bón, phân bón mới"
      }
    >
      {/* Header bar: back button + toggle */}
      <div className="mb-4 flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-material/fertilizer")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>

        <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
          <Label
            htmlFor="fertilizer-detail-mode"
            className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
          >
            Thông tin chuyên sâu
          </Label>
          <Switch
            id="fertilizer-detail-mode"
            checked={isDetailMode}
            onCheckedChange={(checked) => {
              setIsDetailMode(checked);
              resetForm();
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
            onCancel={() => setLocation("/cultivation-material/fertilizer")}
          />
        ) : (
          <div className="p-4 md:p-6">
            <SimpleFertilizerForm
              formData={formData}
              updateField={updateField}
              handleComplete={() => setConfirmOpen(true)}
              goBack={() => setLocation("/cultivation-material/fertilizer")}
              completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
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
                    ? "Bạn có chắc chắn muốn cập nhật thông tin phân bón này?"
                    : "Bạn có chắc chắn muốn thêm phân bón mới vào hệ thống?"}
                </p>
                <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Mã phân bón:</span>
                    <span className="font-medium">{formData.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tên phân bón:</span>
                    <span className="font-medium">{formData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Nguồn gốc:</span>
                    <span className="font-medium">
                      {originOptions.find((o) => o.id === formData.originId)
                        ?.label || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hàm lượng:</span>
                    <span className="font-medium">
                      {formData.nutrientContent}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận thêm mới"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageWrapper>
  );
};

export default FertilizerCreatePage;
