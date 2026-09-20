import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ZoneConfigurationStep } from "./components/ZoneConfigurationStep";
import { ZoneGeneralInfoStep } from "./components/ZoneGeneralInfoStep";
import { ZoneReviewStep } from "./components/ZoneReviewStep";
import {
  cultivationZoneFormSchema,
  type CultivationZoneFormValues,
} from "./data/cultivation-zone-form.schema";
import { useCultivationZoneCreateForm } from "./hooks/useCultivationZoneCreateForm";

const CultivationRegionCreatePage = () => {
  const form = useForm<CultivationZoneFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cultivationZoneFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      selections: [],
      farmingMethodId: 0,
      rearingMethodId: undefined,
      seedIds: [],
      certificateIds: [],
      personnelIds: [],
      notes: "",
      status: "active",
    },
  });

  const { reset, handleSubmit, control, watch } = form;
  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useCultivationZoneCreateForm(reset);

  // Validation for Step 1 & Step 2
  const [
    name,
    selections,
    farmingMethodId,
    isSeedSelectionValid,
    healthUpdateMethod,
    cropIds,
    varietyIds,
    useSpecificSeeds,
    varietySeedMap,
  ] = useWatch({
    control,
    name: [
      "name",
      "selections",
      "farmingMethodId",
      "isSeedSelectionValid",
      "healthUpdateMethod",
      "cropIds",
      "varietyIds",
      "useSpecificSeeds",
      "varietySeedMap",
    ],
  });

  const step1Valid = !!name?.trim() && (selections?.length ?? 0) > 0;

  const hasCrops = (cropIds?.length ?? 0) > 0;
  const hasVarieties = (varietyIds?.length ?? 0) > 0;

  const allVarietiesHaveSeeds =
    !useSpecificSeeds ||
    (hasVarieties &&
      varietyIds.every((vId: number) => {
        const vSeeds = (varietySeedMap as Record<string, number[]>)?.[
          String(vId)
        ];
        return Array.isArray(vSeeds) && vSeeds.length > 0;
      }));

  const step2Valid =
    !!farmingMethodId &&
    farmingMethodId > 0 &&
    !!healthUpdateMethod &&
    hasCrops &&
    hasVarieties &&
    allVarietiesHaveSeeds &&
    isSeedSelectionValid !== false;

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Nhập thông tin cơ bản của vùng canh tác",
      content: <ZoneGeneralInfoStep />,
      isValid: step1Valid,
    },
    {
      id: "configuration",
      title: "Cấu hình canh tác",
      description: "Thiết lập phương pháp & giống cây trồng",
      content: <ZoneConfigurationStep />,
      isValid: step2Valid,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: <ZoneReviewStep />,
      isValid: true,
    },
  ];

  const onFormSubmit = async (data: CultivationZoneFormValues) => {
    await handleComplete(data, true);
  };

  return (
    <PageWrapper
      title={isEditMode ? "Cập nhật vùng canh tác" : "Khởi tạo vùng canh tác"}
      description="Thiết lập vùng canh tác ứng dụng công nghệ cao"
      actions={
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              <FormProvider {...form}>
                <StepperForm
                  steps={steps}
                  loading={isSubmitting}
                  onCancel={handleCancel}
                  onComplete={handleSubmit(onFormSubmit)}
                  completeLabel={
                    isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng canh tác"
                  }
                />
              </FormProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default CultivationRegionCreatePage;
