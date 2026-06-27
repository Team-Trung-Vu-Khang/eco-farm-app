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
import { useRef } from "react";
import {
  cropFoundationSchema,
  basicInfoSchema,
  technicalSpecsSchema,
  type CropFoundationFormValues,
} from "./schemas/cropFoundationSchema";
import { initialEditorValue } from "./data/mocks";

import { BasicInfoStep } from "./components/steps/BasicInfoStep";
import { ConfirmationStep } from "./components/steps/ConfirmationStep";
import { DocumentationStep } from "./components/steps/DocumentationStep";
import { TechnicalSpecsStep } from "./components/steps/TechnicalSpecsStep";
import { useCropFoundationForm } from "./hooks/useCropFoundationForm";

function CropFoundationCreateFormContent({
  fileInputRef,
  handleComplete,
  handleCancel,
  isSubmitting,
}: {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleComplete: (data: CropFoundationFormValues) => Promise<void>;
  handleCancel: () => void;
  isSubmitting: boolean;
}) {
  const { watch, handleSubmit } = useFormContext<CropFoundationFormValues>();
  const watchedValues = watch();

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cây",
      content: <BasicInfoStep fileInputRef={fileInputRef} />,
      isValid: basicInfoSchema.safeParse(watchedValues).success,
    },
    {
      id: "technical",
      title: "Thông số kỹ thuật",
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
        <StepperForm
          steps={steps}
          onComplete={handleSubmit(handleComplete)}
          completeLabel="Khởi tạo cây trồng"
          onCancel={handleCancel}
          loading={isSubmitting}
        />
      </CardContent>
    </Card>
  );
}

export default function CropFoundationCreatePage() {
  const { handleComplete, handleCancel, isSubmitting } =
    useCropFoundationForm();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<CropFoundationFormValues>({
    resolver: zodResolver(cropFoundationSchema),
    mode: "onChange",
    defaultValues: {
      code: "TREE-" + Math.floor(1000 + Math.random() * 9000),
      name: "",
      cropGroupId: "",
      cropFoundationType: "",
      variety: "",
      illustration: null,
      description: "",
      selectedSeedIds: [],
      harvestMethod: "manual",
      technicalSpecs: {
        scientificName: "",
        family: "",
        origin: "",
        temperatureFrom: null,
        temperatureTo: null,
        humidityFrom: null,
        humidityTo: null,
        phFrom: null,
        phTo: null,
        plantingDensity: "",
        watering: "",
      },
      growthCycles: [
        {
          id: "1",
          name: "Kiến thiết cơ bản",
          stages: ["Gieo hạt", "Cây con"],
          estimatedDays: "10",
        },
      ],
      docs: {
        farmingTechnique: {
          type: "editor",
          content: initialEditorValue,
          file: null,
        },
        qualityStandard: {
          type: "editor",
          content: initialEditorValue,
          file: null,
        },
      },
    },
  });

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới cây trồng"
      description="Khởi tạo cây trồng mới với đầy đủ thông tin sinh trưởng và tài liệu"
    >
      <FormProvider {...methods}>
        <Form {...methods}>
          <CropFoundationCreateFormContent
            fileInputRef={fileInputRef}
            handleComplete={handleComplete}
            handleCancel={handleCancel}
            isSubmitting={isSubmitting}
          />
        </Form>
      </FormProvider>
    </AdminLayout>
  );
}
