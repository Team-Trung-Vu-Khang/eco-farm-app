import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
  Switch,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ZoneConfigurationStep } from "./components/ZoneConfigurationStep";
import { ZoneGeneralInfoStep } from "./components/ZoneGeneralInfoStep";
import { ZoneReviewStep } from "./components/ZoneReviewStep";
import {
  cultivationZoneFormSchema,
  type CultivationZoneFormValues,
} from "./data/cultivation-zone-form.schema";
import { useCultivationZoneCreateForm } from "./hooks/useCultivationZoneCreateForm";

// Imports for the Basic Region form
import { RegionInfoStep } from "../../region-chart/region-distribution/components/RegionInfoStep";
import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../../region-chart/region-basic-distribution/data/region-basic-form.schema";
import { useRegionBasicCreateForm } from "../../region-chart/region-basic-distribution/hooks/useRegionBasicCreateForm";

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
      rearingMethodId: 0,
      seedIds: [],
      certificateIds: [],
      personnelIds: [],
      notes: "",
      status: "active",
    },
  });

  const {
    reset: resetDetailed,
    watch: watchDetailed,
    handleSubmit: handleSubmitDetailed,
    formState: formStateDetailed,
  } = detailedForm;
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
    },
  });

  const {
    reset: resetBasic,
    handleSubmit: handleSubmitBasic,
    formState: formStateBasic,
  } = basicForm;
  const {
    isEditMode: isEditModeBasic,
    handleComplete: handleCompleteBasic,
    handleCancel: handleCancelBasic,
    isSubmitting: isSubmittingBasic,
  } = useRegionBasicCreateForm(resetBasic);

  // ─── Mode Switching Logic ────────────────────────────────────────────────
  const [isDetailMode, setIsDetailMode] = useState(true);

  useEffect(() => {
    if (zoneData?.metadataJson?.formType) {
      setIsDetailMode(zoneData.metadataJson.formType === "advanced");
    }
  }, [zoneData]);

  // Disable switcher on Edit mode since we can only edit the loaded entity type
  const isEditMode = isDetailMode ? isEditModeDetailed : isEditModeBasic;
  const isSubmitting = isDetailMode ? isSubmittingDetailed : isSubmittingBasic;
  const handleCancel = isDetailMode ? handleCancelDetailed : handleCancelBasic;

  const selections = watchDetailed("selections") ?? [];
  const farmingMethodId = watchDetailed("farmingMethodId");

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Tên, phạm vi địa lý, chứng nhận",
      isValid:
        !formStateDetailed.errors.name &&
        !formStateDetailed.errors.selections &&
        !!watchDetailed("name") &&
        selections.length > 0,
      content: <ZoneGeneralInfoStep />,
    },
    {
      id: "config",
      title: "Cấu hình canh tác",
      description: "Phương pháp, tưới tiêu, hạt giống",
      isValid:
        !formStateDetailed.errors.farmingMethodId &&
        !formStateDetailed.errors.rearingMethodId &&
        farmingMethodId > 0,
      content: <ZoneConfigurationStep />,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra và hoàn tất",
      isValid: formStateDetailed.isValid,
      content: <ZoneReviewStep />,
    },
  ];

  const handleDetailedComplete = async (data: CultivationZoneFormValues) => {
    await handleCompleteDetailed(data, true);
  };

  return (
    <PageWrapper
      title={
        isDetailMode
          ? isEditModeDetailed
            ? "Cập nhật vùng canh tác"
            : "Thiết lập vùng canh tác"
          : isEditModeBasic
            ? "Cập nhật vùng trồng (Cơ bản)"
            : "Thêm mới vùng trồng (Cơ bản)"
      }
      description={
        isDetailMode
          ? "Quy trình khởi tạo và cấu hình tiêu chuẩn cho đơn vị canh tác"
          : "Quản lý vùng trồng với giao diện cơ bản"
      }
      actions={
        <div className="flex items-center gap-4">
          {!isEditMode && (
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
          )}

          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
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
                  <div className="space-y-6">
                    <RegionInfoStep showCenterPoint={true} />
                    <div className="flex justify-end gap-3 rounded-lg border bg-white p-4">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={handleCancelBasic}
                        disabled={isSubmittingBasic}
                      >
                        Hủy
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSubmitBasic(handleCompleteBasic)}
                        disabled={isSubmittingBasic || !formStateBasic.isValid}
                      >
                        {isSubmittingBasic && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isEditModeBasic ? "Lưu thay đổi" : "Tạo vùng trồng"}
                      </Button>
                    </div>
                  </div>
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
