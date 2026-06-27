import React, { useRef } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
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
import { useVarietyFoundationForm } from "./hooks/useVarietyFoundationForm";
import {
  varietyFoundationSchema,
  classificationSchema,
  type VarietyFoundationFormValues,
} from "./schemas/varietyFoundationSchema";
import { initialEditorValue } from "../docs/mocks";

function VarietyFoundationCreateFormContent({
  fileInputRef,
  pdfInputRef,
  illustrationPreview,
  setIllustrationPreview,
  onPickIllustration,
  handleComplete,
  handleCancel,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  illustrationPreview: string;
  setIllustrationPreview: (val: string) => void;
  onPickIllustration: (file?: File | null) => void;
  handleComplete: (data: VarietyFoundationFormValues) => Promise<void>;
  handleCancel: () => void;
}) {
  const { watch, handleSubmit } = useFormContext<VarietyFoundationFormValues>();
  const watchedValues = watch();

  const steps: Step[] = [
    {
      id: "classification",
      title: "Phân loại & Định danh",
      description: "Chọn cây trồng và thiết lập thông tin định danh cho giống",
      content: <VarietyFoundationClassificationStep />,
      isValid: classificationSchema.safeParse(watchedValues).success,
    },
    {
      id: "characteristics",
      title: "Thông tin nông học",
      description: "Mô tả đặc điểm sinh trưởng và hình ảnh nhận diện",
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
      description: "Tải lên quy trình canh tác và tiêu chuẩn kỹ thuật",
      content: <VarietyFoundationDocumentsStep pdfInputRef={pdfInputRef} />,
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi tạo",
      content: <VarietyFoundationConfirmationStep mode="create" />,
      isValid: true,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit(handleComplete)}
          completeLabel="Tạo giống cây (nền tảng)"
          onCancel={handleCancel}
        />
      </CardContent>
    </Card>
  );
}

export default function CreateVarietyFoundationPage() {
  const { handleComplete, handleCancel } = useVarietyFoundationForm();
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

  const onPickIllustration = (file?: File | null) => {
    if (!file) return;
    methods.setValue("illustration", file, { shouldValidate: true });
    setIllustrationPreview(URL.createObjectURL(file));
  };

  return (
    <AdminLayout
      isDev={true}
      title="Tạo mới giống cây (nền tảng)"
      description="Khởi tạo thông tin định danh, đặc tính và tài liệu kỹ thuật cho giống cây (nền tảng)"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <VarietyFoundationCreateFormContent
            fileInputRef={fileInputRef}
            pdfInputRef={pdfInputRef}
            illustrationPreview={illustrationPreview as any}
            setIllustrationPreview={setIllustrationPreview as any}
            onPickIllustration={onPickIllustration}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
          />
        </Form>
      </FormProvider>
    </AdminLayout>
  );
}
