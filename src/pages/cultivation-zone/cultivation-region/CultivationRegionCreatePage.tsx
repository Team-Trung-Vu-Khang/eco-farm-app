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
import { useEffect, useState } from "react";
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { ZoneConfigurationStep } from "./components/ZoneConfigurationStep";
import { ZoneGeneralInfoStep } from "./components/ZoneGeneralInfoStep";
import { ZoneReviewStep } from "./components/ZoneReviewStep";
import {
  cultivationZoneFormSchema,
  type CultivationZoneFormValues,
} from "./data/cultivation-zone-form.schema";
import { useCultivationZoneCreateForm } from "./hooks/useCultivationZoneCreateForm";

// Imports for the Basic Region form
import { RegionConfirmationStep } from "../../region-chart/region-basic-distribution/components/RegionConfirmationStep";
import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../../region-chart/region-basic-distribution/data/region-basic-form.schema";
import { useRegionBasicCreateForm } from "../../region-chart/region-basic-distribution/hooks/useRegionBasicCreateForm";
import { RegionInfoStep } from "../../region-chart/region-distribution/components/RegionInfoStep";

const CultivationRegionCreatePage = () => {
  // ─── Form 1: Detailed Zone Form ─────────────────────────────────────────
  const detailedForm = useForm<CultivationZoneFormValues>({
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

  const { reset: resetDetailed, handleSubmit: handleSubmitDetailed } =
    detailedForm;
  const {
    isEditMode: isEditModeDetailed,
    handleComplete: handleCompleteDetailed,
    handleCancel: handleCancelDetailed,
    isSubmitting: isSubmittingDetailed,
    zoneData,
  } = useCultivationZoneCreateForm(resetDetailed);

  // ─── Form 2: Basic Region Form ──────────────────────────────────────────
  const basicForm = useForm<RegionBasicFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(regionBasicFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      code: "",
      name: "",
      cropIds: [],
      area: undefined,
      provinceId: "",
      wardId: "",
      address: "",
      landType: "",
      terrain: "",
      note: "",
      centerPoint: {
        lat: 11.54,
        lng: 106.895,
      },
      metadataJson: {
        address: "",
      },
      isDetailed: false,
      status: "active",
      farmingMethodId: undefined,
      rearingMethodId: undefined,
      seedIds: [],
    },
  });

  const {
    reset: resetBasic,
    handleSubmit: handleSubmitBasic,
    control: controlBasic,
  } = basicForm;
  const {
    isEditMode: isEditModeBasic,
    handleComplete: handleCompleteBasic,
    handleCancel: handleCancelBasic,
    isSubmitting: isSubmittingBasic,
  } = useRegionBasicCreateForm(resetBasic);

  // Validation for step 2 — farmingMethodId required, seedIds optional
  const [detailedFarmingMethodId] = useWatch({
    control: detailedForm.control,
    name: ["farmingMethodId", "seedIds"],
  });
  const [basicFarmingMethodId] = useWatch({
    control: controlBasic,
    name: ["farmingMethodId", "seedIds"],
  });
  const detailedStep2Valid =
    !!detailedFarmingMethodId && detailedFarmingMethodId > 0;

  const basicStep2Valid = !!basicFarmingMethodId && basicFarmingMethodId > 0;

  // ─── Mode Switching Logic ────────────────────────────────────────────────
  const [isDetailMode, setIsDetailMode] = useState(true);

  useEffect(() => {
    if (zoneData) {
      const type = zoneData.metadataJson?.formType;
      if (type === "basic") {
        setIsDetailMode(false);
      } else if (type === "advanced") {
        setIsDetailMode(true);
      }
    }
  }, [zoneData]);

  const isEditMode = isEditModeDetailed;
  const handleCancel = isDetailMode ? handleCancelDetailed : handleCancelBasic;

  const steps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Nhập thông tin cơ bản của vùng canh tác",
      content: <ZoneGeneralInfoStep />,
    },
    {
      id: "configuration",
      title: "Cấu hình canh tác",
      description: "Thiết lập phương pháp & giống cây trồng",
      content: <ZoneConfigurationStep />,
      isValid: detailedStep2Valid,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: <ZoneReviewStep />,
      isValid: true,
    },
  ];

  const basicSteps: Step[] = [
    {
      id: "general",
      title: "Thông tin chung",
      description: "Nhập thông tin cơ bản của vùng trồng",
      content: <RegionInfoStep showCenterPoint={true} />,
    },
    {
      id: "configuration",
      title: "Cấu hình canh tác",
      description: "Thiết lập phương pháp & giống cây trồng",
      content: <ZoneConfigurationStep />,
      isValid: basicStep2Valid,
    },
    {
      id: "review",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="CROP" />,
      isValid: true,
    },
  ];

  const handleDetailedComplete = async (data: CultivationZoneFormValues) => {
    await handleCompleteDetailed(data, isDetailMode);
  };

  return (
    <PageWrapper
      title={
        isEditMode
          ? isDetailMode
            ? "Cập nhật vùng canh tác"
            : "Cập nhật vùng trồng"
          : isDetailMode
            ? "Khởi tạo vùng canh tác"
            : "Thêm mới vùng trồng"
      }
      description={
        isDetailMode
          ? "Thiết lập vùng canh tác ứng dụng công nghệ cao"
          : "Quản lý vùng trồng trọt cơ bản"
      }
      actions={
        <div className="flex items-center gap-4">
          {/* {!isEditMode && (
            <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-xs">
              <Label
                htmlFor="zone-detail-mode"
                className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
              >
                Thông tin chuyên sâu
              </Label>
              <Switch
                id="zone-detail-mode"
                checked={isDetailMode}
                onCheckedChange={(checked) => {
                  setIsDetailMode(checked);
                }}
              />
            </div>
          )} */}

          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmittingDetailed || isSubmittingBasic}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Quay lại
          </Button>
        </div>
      }
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {!isDetailMode && (
          <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 text-amber-900">
            <h3 className="font-semibold text-sm">Chế độ cơ bản</h3>
            <p className="text-xs text-amber-700 mt-0.5">
              {isEditMode
                ? "Cập nhật nhanh các thông tin cơ bản của vùng trồng."
                : "Nhập các thông tin cơ bản để thêm mới vùng trồng."}
            </p>
          </div>
        )}

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
          <CardContent className="p-0">
            <div className="p-6 md:p-8">
              {isDetailMode ? (
                <FormProvider {...detailedForm}>
                  <StepperForm
                    steps={steps}
                    loading={isSubmittingDetailed}
                    onCancel={handleCancelDetailed}
                    onComplete={handleSubmitDetailed(handleDetailedComplete)}
                    completeLabel={
                      isEditModeDetailed
                        ? "Lưu thay đổi"
                        : "Khởi tạo vùng canh tác"
                    }
                  />
                </FormProvider>
              ) : (
                <FormProvider {...basicForm}>
                  <StepperForm
                    steps={basicSteps}
                    loading={isSubmittingBasic}
                    onCancel={handleCancelBasic}
                    onComplete={handleSubmitBasic(handleCompleteBasic)}
                    completeLabel={
                      isEditModeBasic ? "Lưu thay đổi" : "Khởi tạo vùng trồng"
                    }
                  />
                </FormProvider>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default CultivationRegionCreatePage;
