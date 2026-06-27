import React, { useEffect, useRef } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  StepperForm,
  Form,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { VarietyFoundationClassificationStep } from "./components/VarietyFoundationClassificationStep";
import { VarietyFoundationCharacteristicsStep } from "./components/VarietyFoundationCharacteristicsStep";
import { VarietyFoundationDocumentsStep } from "./components/VarietyFoundationDocumentsStep";
import { VarietyFoundationConfirmationStep } from "./components/VarietyFoundationConfirmationStep";
import { useVarietyFoundationEditForm } from "./hooks/useVarietyFoundationEditForm";
import {
  varietyFoundationSchema,
  classificationSchema,
  type VarietyFoundationFormValues,
} from "./schemas/varietyFoundationSchema";
import { initialEditorValue } from "../docs/mocks";
import { useLocation } from "wouter";
import { useCrops } from "../../features/foundation";

function VarietyFoundationEditFormContent({
  fileInputRef,
  pdfInputRef,
  illustrationPreview,
  setIllustrationPreview,
  onPickIllustration,
  handleComplete,
  handleCancel,
  isSubmitting,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  illustrationPreview: string;
  setIllustrationPreview: (val: string) => void;
  onPickIllustration: (file?: File | null) => void;
  handleComplete: (data: VarietyFoundationFormValues) => Promise<void>;
  handleCancel: () => void;
  isSubmitting: boolean;
}) {
  const { watch, handleSubmit } = useFormContext<VarietyFoundationFormValues>();
  const watchedValues = watch();

  // Try to find selected crop data for confirmation step
  const { items: crops } = useCrops();
  const selectedCrop = React.useMemo(() => {
    if (!watchedValues.crop) return undefined;
    const crop = crops.find((c) => String(c.id) === watchedValues.crop);
    if (!crop) return undefined;
    return {
      name: crop.name,
      image: crop.imageUrl || "",
      group: crop.cropGroupName || "N/A",
    };
  }, [watchedValues.crop, crops]);

  const steps: Step[] = [
    {
      id: "classification",
      title: "Phân loại & Định danh",
      description: "Cập nhật cây trồng và thông tin định danh cho giống",
      content: <VarietyFoundationClassificationStep isEdit />,
      isValid: classificationSchema.safeParse(watchedValues).success,
    },
    {
      id: "characteristics",
      title: "Thông tin nông học",
      description: "Cập nhật đặc điểm sinh trưởng và hình ảnh nhận diện",
      content: (
        <VarietyFoundationCharacteristicsStep
          illustrationPreview={illustrationPreview}
          setIllustrationPreview={setIllustrationPreview}
          fileInputRef={fileInputRef}
          onPickIllustration={onPickIllustration}
        />
      ),
      isValid: true,
    },
    {
      id: "docs",
      title: "Tài liệu kỹ thuật",
      description: "Cập nhật quy trình canh tác và tiêu chuẩn kỹ thuật",
      content: <VarietyFoundationDocumentsStep pdfInputRef={pdfInputRef} />,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi cập nhật",
      content: (
        <VarietyFoundationConfirmationStep
          mode="edit"
          selectedCrop={selectedCrop}
        />
      ),
      isValid: true,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit(handleComplete)}
          completeLabel="Lưu thay đổi"
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default function VarietyFoundationEditPage() {
  const {
    initialValues,
    handleComplete,
    handleCancel,
    isLoadingVariety,
    isSubmitting,
  } = useVarietyFoundationEditForm();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const [illustrationPreview, setIllustrationPreview] = React.useState("");

  const methods = useForm<VarietyFoundationFormValues>({
    resolver: zodResolver(varietyFoundationSchema),
    mode: "onChange",
    defaultValues: {
      crop: "",
      varietyFoundationCode: "",
      varietyFoundationName: "",
      scientificName: "",
      origin: "",
      illustration: null,
      growthDuration: "",
      averageYield: "",
      description: "",
      contentType: "editor",
      pdfFile: null,
      editorContent: initialEditorValue as unknown as string,
    },
  });

  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    if (initialValues) {
      methods.reset({
        ...methods.getValues(),
        ...initialValues,
      });
      if (typeof initialValues.illustration === "string") {
        setIllustrationPreview(initialValues.illustration);
      } else if (initialValues.illustration instanceof File) {
        setIllustrationPreview(URL.createObjectURL(initialValues.illustration));
      } else {
        setIllustrationPreview("");
      }
    }
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [initialValues, methods]);

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    methods.setValue("illustration", file, { shouldValidate: true });
    setIllustrationPreview(URL.createObjectURL(file));
  };

  if (!isLoadingVariety && !initialValues) {
    return (
      <AdminLayout isDev={true} title="Không tìm thấy">
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-muted-foreground mb-4">
            Không tìm thấy thông tin giống cây (nền tảng) này.
          </p>
          <Button onClick={() => setLocation("/variety-foundation")}>
            Quay lại danh sách
          </Button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title="Chỉnh sửa giống cây (nền tảng)"
      description="Cập nhật thông tin giống cây (nền tảng), đặc tính nông học và tài liệu kỹ thuật"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <VarietyFoundationEditFormContent
            fileInputRef={fileInputRef}
            pdfInputRef={pdfInputRef}
            illustrationPreview={illustrationPreview}
            setIllustrationPreview={setIllustrationPreview}
            onPickIllustration={onPickIllustration}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Form>
      </FormProvider>
    </AdminLayout>
  );
}
