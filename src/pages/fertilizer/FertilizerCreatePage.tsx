import { ChevronLeft } from "lucide-react";
import {
  AdminLayout,
  StepperForm,
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useFertilizerCreateForm } from "./hooks/useFertilizerCreateForm";
import { FertilizerBasicInfoStep } from "./components/steps/FertilizerBasicInfoStep";
import { FertilizerSuppliersStep } from "./components/steps/FertilizerSuppliersStep";
import { FertilizerConfirmationStep } from "./components/steps/FertilizerConfirmationStep";

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
      title: "Thông tin cơ bản",
      content: (
        <FertilizerBasicInfoStep
          formData={formData}
          updateField={updateField}
        />
      ),
    },
    {
      id: "supply",
      title: "Nhà cung cấp",
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
    <AdminLayout
      isRice
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
          onClick={() => setLocation("/fertilizer")}
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
          onCancel={() => setLocation("/fertilizer")}
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
                    <span className="text-muted-foreground">Loại:</span>
                    <span className="font-medium">{formData.type}</span>
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
    </AdminLayout>
  );
};

export default FertilizerCreatePage;
