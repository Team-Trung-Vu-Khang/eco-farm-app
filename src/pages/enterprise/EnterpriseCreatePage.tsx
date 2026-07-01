import {
  AdminLayout,
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
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { EnterpriseFormContext } from "./context/EnterpriseFormContext";
import { useEnterpriseCreateForm } from "./hooks/useEnterpriseCreateForm";

export default function EnterpriseCreatePage() {
  const formState = useEnterpriseCreateForm();
  const {
    steps,
    showConfirmDialog,
    setShowConfirmDialog,
    submitForm,
    formData,
    setLocation,
    handleComplete,
  } = formState;

  return (
    <EnterpriseFormContext.Provider value={formState}>
      <AdminLayout
        isDev={true}
        title="Tạo mới Doanh nghiệp"
        description="Điền thông tin theo từng bước để tạo mới doanh nghiệp"
        actions={[
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
          <CardContent className="p-6">
            <StepperForm
              steps={steps}
              onComplete={handleComplete}
              onCancel={() => setLocation("/enterprise")}
              completeLabel="Tạo mới"
            />
          </CardContent>
        </Card>
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
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
              <AlertDialogCancel>Hủy</AlertDialogCancel>
              <AlertDialogAction onClick={submitForm}>
                Xác nhận
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </AdminLayout>
    </EnterpriseFormContext.Provider>
  );
}
