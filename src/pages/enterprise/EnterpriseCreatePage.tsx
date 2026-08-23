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
  Card,
  CardContent,
  StepperForm,
  Switch,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { SimpleFormPage } from "./components/steps/SimpleFormPage";
import { EnterpriseFormContext } from "./context/EnterpriseFormContext";
import { useEnterpriseCreateForm } from "./hooks/useEnterpriseCreateForm";

export default function EnterpriseCreatePage() {
  const formState = useEnterpriseCreateForm();
  const {
    steps,
    showConfirmDialog,
    setShowConfirmDialog,
    submitForm,
    isSubmitting,
    formData,
    setLocation,
    handleComplete,
    isAdvancedInfo,
    setIsAdvancedInfo,
  } = formState;

  return (
    <EnterpriseFormContext.Provider value={formState}>
      <PageWrapper
        title="Tạo mới Doanh nghiệp"
        description={
          isAdvancedInfo
            ? "Điền thông tin theo từng bước để tạo mới doanh nghiệp"
            : "Điền thông tin cơ bản để tạo mới doanh nghiệp"
        }
        actions={[
          <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm">
            <span className="text-sm font-semibold text-slate-700">
              Thông tin chuyên sâu
            </span>
            <Switch
              checked={isAdvancedInfo}
              onCheckedChange={setIsAdvancedInfo}
              aria-label="Chuyển đổi thông tin chuyên sâu"
            />
          </div>,
          <Button
            variant="outline"
            onClick={() => setLocation("/enterprise")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại
          </Button>,
        ]}
      >
        <Card>
          {isAdvancedInfo ? (
            <CardContent className="p-6">
              <StepperForm
                steps={steps}
                onComplete={handleComplete}
                onCancel={() => setLocation("/enterprise")}
                completeLabel="Tạo mới"
                loading={isSubmitting}
              />
            </CardContent>
          ) : (
            <CardContent className="p-6">
              <SimpleFormPage />
              <div className="mt-8 flex justify-end gap-3 border-t pt-6">
                <Button
                  variant="outline"
                  onClick={() => setLocation("/enterprise")}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button onClick={handleComplete} disabled={isSubmitting}>
                  Tạo mới
                </Button>
              </div>
            </CardContent>
          )}
        </Card>
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={(open) => !isSubmitting && setShowConfirmDialog(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận tạo mới</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn tạo mới doanh nghiệp "{formData.name}"
                không?
                <br />
                Thông tin đã nhập sẽ được lưu vào hệ thống.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isSubmitting}>Hủy</AlertDialogCancel>
              <AlertDialogAction
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={(e) => {
                  e.preventDefault();
                  submitForm();
                }}
              >
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </PageWrapper>{" "}
    </EnterpriseFormContext.Provider>
  );
}
