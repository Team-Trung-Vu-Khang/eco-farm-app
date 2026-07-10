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
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";
import { useLocation } from "wouter";
import type { FarmRegionResponse } from "@/features/farm/types/farm.type";
import type {
  Area,
  Standard,
} from "../../stores/useEnterpriseCertificateStore";
import { CertificateBasicInfoFields } from "./components/CertificateBasicInfoFields";
import { CertificateContentFields } from "./components/CertificateContentFields";
import { CertificateEntitySelection } from "./components/CertificateEntitySelection";
import { CertificateReviewStep } from "./components/CertificateReviewStep";
import { CertificateTimedFields } from "./components/CertificateTimedFields";
import {
  enterpriseCertificateBasicInfoStepSchema,
  enterpriseCertificateContentStepSchema,
  enterpriseCertificateEntityStepSchema,
  enterpriseCertificateTimingStepSchema,
  type EnterpriseCertificateFormValues,
} from "./data/enterprise-certificate-form.schema";
import { useEnterpriseCertificateStepperForm } from "./hooks/useEnterpriseCertificateStepperForm";

function EnterpriseCertificateStepperContent({
  isEdit,
  loading,
  onComplete,
  onCancel,
  standards,
  regions,
  areas,
}: {
  isEdit: boolean;
  loading: boolean;
  onComplete: () => void;
  onCancel: () => void;
  standards: Standard[];
  regions: FarmRegionResponse[];
  areas: Area[];
}) {
  const { watch } = useFormContext<EnterpriseCertificateFormValues>();
  const watchedValues = watch();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Mã, tên và tiêu chuẩn",
      content: <CertificateBasicInfoFields standards={standards} />,
      isValid:
        enterpriseCertificateBasicInfoStepSchema.safeParse(watchedValues)
          .success,
    },
    {
      id: "timing",
      title: "Thời hạn",
      description: "Ngày cấp và ngày hết hạn",
      content: <CertificateTimedFields />,
      isValid:
        enterpriseCertificateTimingStepSchema.safeParse(watchedValues).success,
    },
    {
      id: "entity",
      title: "Phạm vi chứng nhận",
      description: "Đơn vị - tổ chức hoặc vùng canh tác cụ thể",
      content: <CertificateEntitySelection regions={regions} />,
      isValid:
        enterpriseCertificateEntityStepSchema.safeParse(watchedValues).success,
    },
    {
      id: "content",
      title: "Nội dung",
      description: "Soạn thảo hoặc file đính kèm",
      content: <CertificateContentFields />,
      isValid:
        enterpriseCertificateContentStepSchema.safeParse(watchedValues).success,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại trước khi lưu",
      content: (
        <CertificateReviewStep
          standards={standards}
          areas={areas}
        />
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <StepperForm
          steps={steps}
          onComplete={onComplete}
          onCancel={onCancel}
          completeLabel={isEdit ? "Cập nhật chứng nhận" : "Lưu chứng nhận"}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}

export default function EnterpriseCertificateFormPage() {
  const [, setLocation] = useLocation();
  const {
    isEdit,
    methods,
    standards,
    regions,
    areas,
    loading,
    error,
    showConfirmDialog,
    setShowConfirmDialog,
    showLoadingDialog,
    handleComplete,
    submitForm,
    handleCancel,
  } = useEnterpriseCertificateStepperForm();

  const watchedName = methods.watch("name");

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Chỉnh sửa chứng nhận" : "Tạo mới chứng nhận"}
      description="Điền thông tin theo từng bước để tạo hồ sơ phạm vi chứng nhận: đơn vị - tổ chức hoặc vùng canh tác cụ thể"
      actions={
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setLocation("/enterprise-certificate")}
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
          ⚠️ {error}
        </div>
      ) : null}

      <FormProvider {...methods}>
        <EnterpriseCertificateStepperContent
          isEdit={isEdit}
          loading={loading}
          onComplete={handleComplete}
          onCancel={handleCancel}
          standards={standards}
          regions={regions}
          areas={areas}
        />
      </FormProvider>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận tạo mới"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} chứng nhận
              "{watchedName || "chưa đặt tên"}" không?
              <br />
              Thông tin đã nhập sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm} loading={showLoadingDialog}>
              Xác nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
