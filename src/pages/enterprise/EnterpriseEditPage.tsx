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
import { useEnterpriseEditForm } from "./hooks/useEnterpriseEditForm";

export default function EnterpriseEditPage() {
  const formState = useEnterpriseEditForm();
  const {
    steps,
    showConfirmDialog,
    setShowConfirmDialog,
    submitForm,
    isSubmitting,
    formData,
    setLocation,
    handleComplete,
  } = formState;

  return (
    <EnterpriseFormContext.Provider value={formState}>
      <AdminLayout
        title={`Cập nhật ${
          formData.type === "enterprise"
            ? "Doanh nghiệp"
            : formData.type === "cooperative"
              ? "Hợp tác xã"
              : "Nông hộ"
        }`}
        description="Cập nhật thông tin chi tiết"
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
              completeLabel="Cập nhật"
              loading={isSubmitting}
            />
          </CardContent>
        </Card>
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={(open) => !isSubmitting && setShowConfirmDialog(open)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Xác nhận cập nhật</AlertDialogTitle>
              <AlertDialogDescription>
                Bạn có chắc chắn muốn cập nhật{" "}
                {formData.type === "enterprise"
                  ? "doanh nghiệp"
                  : formData.type === "cooperative"
                    ? "hợp tác xã"
                    : "nông hộ"}{" "}
                "{formData.name}" không?
                <br />
                Thông tin mới sẽ được lưu vào hệ thống.
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
      </AdminLayout>
    </EnterpriseFormContext.Provider>
  );
}
