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
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FertilizerBasicInfoStep } from "./components/steps/FertilizerBasicInfoStep";
import { FertilizerUsageStep } from "./components/steps/FertilizerUsageStep";
import FertilizerSafetyLegalStep from "./components/steps/FertilizerSafetyLegalStep";
import { FertilizerConfirmationStep } from "./components/steps/FertilizerConfirmationStep";
import { FertilizerSuppliersStep } from "./components/steps/FertilizerSuppliersStep";
import { useFertilizerCreateForm } from "./hooks/useFertilizerCreateForm";
import { originOptions } from "./data/constants";

const FertilizerCreatePage = () => {
  const {
    isEdit,
    formData,
    updateField,
    confirmOpen,
    setConfirmOpen,
    handleConfirmSubmit,
    setLocation,
  } = useFertilizerCreateForm();

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
        <FertilizerUsageStep
          formData={formData}
          updateField={updateField}
        />
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
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-material/fertilizer")}
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
          onComplete={() => setConfirmOpen(true)}
          onCancel={() => setLocation("/cultivation-material/fertilizer")}
        />
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
                      {originOptions.find(o => o.id === formData.originId)?.label || "N/A"}
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
