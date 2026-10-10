import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  Form,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import React, { useRef } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { useCrops, useCropById } from "../../features/foundation";
import { initialEditorValue } from "../docs/mocks";
import { VarietyFoundationCharacteristicsStep } from "./components/VarietyFoundationCharacteristicsStep";
import { VarietyFoundationClassificationStep } from "./components/VarietyFoundationClassificationStep";
import { VarietyFoundationConfirmationStep } from "./components/VarietyFoundationConfirmationStep";
import { VarietyFoundationDocumentsStep } from "./components/VarietyFoundationDocumentsStep";
import { useVarietyFoundationForm } from "./hooks/useVarietyFoundationForm";
import { useVarietyIllustrationSync } from "./hooks/useVarietyIllustrationSync";
import {
  classificationSchema,
  varietyFoundationSchema,
  type VarietyFoundationFormValues,
} from "./schemas/varietyFoundationSchema";

function VarietyFoundationCreateFormContent({
  fileInputRef,
  pdfInputRef,
  illustrationPreview,
  setIllustrationPreview,
  onPickIllustration,
  onRemoveIllustration,
  handleComplete,
  handleCancel,
  isSubmitting,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  pdfInputRef: React.RefObject<HTMLInputElement | null>;
  illustrationPreview: string;
  setIllustrationPreview: (val: string) => void;
  onPickIllustration: (file?: File | null) => void;
  onRemoveIllustration: () => void;
  handleComplete: (data: VarietyFoundationFormValues) => Promise<void>;
  handleCancel: () => void;
  isSubmitting: boolean;
}) {
  const { watch, handleSubmit } = useFormContext<VarietyFoundationFormValues>();
  const watchedValues = watch();

  const { items: crops } = useCrops({
    params: { domainCode: "CROP", status: "active", page: 0, size: 100 },
  });
  const { data: cropData } = useCropById(Number(watchedValues.crop), {
    enabled: Boolean(watchedValues.crop && !isNaN(Number(watchedValues.crop))),
  });

  const selectedCrop = React.useMemo(() => {
    if (!watchedValues.crop) return undefined;
    const crop =
      crops.find((c) => String(c.id) === String(watchedValues.crop)) ||
      cropData;
    if (!crop) return undefined;
    return {
      name: crop.name,
      image: crop.imageUrl || "",
      group:
        (crop.subjectGroups || [])
          .map((g) => g.name)
          .filter(Boolean)
          .join(", ") || "N/A",
    };
  }, [watchedValues.crop, crops, cropData]);

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
          onRemoveIllustration={onRemoveIllustration}
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
      content: (
        <VarietyFoundationConfirmationStep
          mode="create"
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
          completeLabel="Tạo giống cây (nền tảng)"
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default function CreateVarietyFoundationPage() {
  const { handleComplete, handleCancel, isSubmitting } =
    useVarietyFoundationForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
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

  const {
    illustrationPreview,
    setIllustrationPreview,
    onPickIllustration,
    onRemoveIllustration,
  } = useVarietyIllustrationSync({
    methods,
    fileInputRef,
  });

  return (
    <PageWrapper
      title="Tạo mới giống cây (nền tảng)"
      description="Khởi tạo thông tin định danh, đặc tính và tài liệu kỹ thuật cho giống cây (nền tảng)"
      actions={
        <Button variant="outline" onClick={handleCancel}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <VarietyFoundationCreateFormContent
            fileInputRef={fileInputRef}
            pdfInputRef={pdfInputRef}
            illustrationPreview={illustrationPreview}
            setIllustrationPreview={setIllustrationPreview}
            onPickIllustration={onPickIllustration}
            onRemoveIllustration={onRemoveIllustration}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Form>
      </FormProvider>
    </PageWrapper>
  );
}
