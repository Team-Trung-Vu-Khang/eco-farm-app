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
import { useState } from "react";
import SimpleEnterpriseForm from "./components/SimpleEnterpriseForm";
import { EnterpriseFormContext } from "./context/EnterpriseFormContext";
import { useEnterpriseCreateForm } from "./hooks/useEnterpriseCreateForm";

export default function EnterpriseCreatePage() {
  const formState = useEnterpriseCreateForm();
  const [isSimpleMode, setIsSimpleMode] = useState(true);
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
      <PageWrapper
        title="Tạo mới Doanh nghiệp"
        description="Điền thông tin theo từng bước để tạo mới doanh nghiệp"
        actions={[
          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <span className="text-xs font-bold text-slate-700">
              Thông tin chuyên sâu
            </span>
            <Switch
              checked={!isSimpleMode}
              onCheckedChange={(checked) => setIsSimpleMode(!checked)}
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
        {isSimpleMode ? (
          <SimpleEnterpriseForm onComplete={handleComplete} />
        ) : (
          <Card>
            <CardContent className="p-6">
              <StepperForm
                steps={steps}
                onComplete={handleComplete}
                onCancel={() => setLocation("/enterprise")}
                completeLabel="Tạo mới"
                loading={isSubmitting}
              />
            </CardContent>
          </Card>
        )}
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
