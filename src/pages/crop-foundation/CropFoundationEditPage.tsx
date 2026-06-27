import {
  AdminLayout,
  Card,
  CardContent,
  StepperForm,
  Form,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef } from "react";
import {
  cropFoundationSchema,
  basicInfoSchema,
  technicalSpecsSchema,
  type CropFoundationFormValues,
} from "./schemas/cropFoundationSchema";

import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmationStep } from "./components/steps/ConfirmationStep";
import { DocumentationStep } from "./components/steps/DocumentationStep";
import { TechnicalSpecsStep } from "./components/steps/TechnicalSpecsStep";
import { useCropFoundationEditForm } from "./hooks/useCropFoundationEditForm";

function CropFoundationEditFormContent({
  fileInputRef,
  handleComplete,
  handleCancel,
  isLoadingCrop,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleComplete: (data: CropFoundationFormValues) => Promise<void>;
  handleCancel: () => void;
  isLoadingCrop: boolean;
}) {
  const { watch, handleSubmit } = useFormContext<CropFoundationFormValues>();
  const watchedValues = watch();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cây",
      content: <BasicInfoStep isEdit fileInputRef={fileInputRef} />,
      isValid: basicInfoSchema.safeParse(watchedValues).success,
    },
    {
      id: "technical",
      title: "Thông số KT",
      content: <TechnicalSpecsStep />,
      isValid: technicalSpecsSchema.safeParse(watchedValues.technicalSpecs)
        .success,
    },
    {
      id: "docs",
      title: "Tài liệu",
      content: <DocumentationStep />,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      content: <ConfirmationStep />,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        {isLoadingCrop ? (
          <div className="py-10 text-center text-muted-foreground">
            Đang tải dữ liệu...
          </div>
        ) : (
          <StepperForm
            steps={steps}
            onComplete={handleSubmit(handleComplete)}
            completeLabel="Cập nhật thông tin"
            onCancel={handleCancel}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default function CropFoundationEditPage() {
  const { initialValues, handleComplete, handleCancel, isLoadingCrop } =
    useCropFoundationEditForm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<CropFoundationFormValues>({
    resolver: zodResolver(cropFoundationSchema),
    mode: "onChange",
  });

  useEffect(() => {
    if (initialValues) {
      methods.reset(initialValues);
    }
  }, [initialValues, methods]);

  const cropName = methods.watch("name");

  return (
    <AdminLayout
      isDev={true}
      title={`Cập nhật thông tin: ${cropName || "Đang tải..."}`}
      description="Chỉnh sửa thông tin kỹ thuật và tài liệu của cây trồng"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <CropFoundationEditFormContent
            fileInputRef={fileInputRef}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
            isLoadingCrop={isLoadingCrop}
          />
        </Form>
      </FormProvider>
    </AdminLayout>
  );
}
