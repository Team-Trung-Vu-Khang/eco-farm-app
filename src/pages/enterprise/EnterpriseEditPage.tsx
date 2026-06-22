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
  Card,
  CardContent,
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useEnterpriseEditForm } from "./hooks/useEnterpriseEditForm";
import { EnterpriseFormContext } from "./context/EnterpriseFormContext";

export default function EnterpriseEditPage() {
  const formState = useEnterpriseEditForm();
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
        isRice
        title={`Cập nhật ${
          formData.type === "enterprise"
            ? "Doanh nghiệp"
            : formData.type === "cooperative"
              ? "Hợp tác xã"
              : "Nông hộ"
        }`}
        description="Cập nhật thông tin chi tiết"
      >
        <Card>
          <CardContent className="p-6">
            <StepperForm
              steps={steps}
              onComplete={handleComplete}
              onCancel={() => setLocation("/enterprise")}
              completeLabel="Cập nhật"
            />
          </CardContent>
        </Card>
        <AlertDialog
          open={showConfirmDialog}
          onOpenChange={setShowConfirmDialog}
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
