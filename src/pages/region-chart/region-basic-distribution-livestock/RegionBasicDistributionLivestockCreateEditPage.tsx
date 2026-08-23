import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";

import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../region-basic-distribution/data/region-basic-form.schema";
import { RegionLivestockInfoStep } from "./components/RegionLivestockInfoStep";
import { ZoneConfigurationStep } from "../../animal-husbandry-zone/animal-husbandry-region/components/ZoneConfigurationStep";
import { RegionConfirmationStep } from "../region-basic-distribution/components/RegionConfirmationStep";
import { useRegionBasicLivestockCreateForm } from "./hooks/useRegionBasicLivestockCreateForm";

const RegionBasicDistributionLivestockCreateEditPage = () => {
  const form = useForm<RegionBasicFormValues>({
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
      irrigationSystemId: undefined,
      seedIds: [],
    },
  });

  const { reset, handleSubmit, control } = form;
  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionBasicLivestockCreateForm(reset);

  const [name, cropIds, farmingMethodId, seedIds] = useWatch({
    control,
    name: ["name", "cropIds", "farmingMethodId", "seedIds"],
  });
  const { errors } = useFormState({ control });

  const step1Valid =
    !!name &&
    name.trim().length > 0 &&
    Array.isArray(cropIds) &&
    cropIds.length > 0 &&
    !errors.name &&
    !errors.cropIds;

  const step2Valid =
    !!farmingMethodId && farmingMethodId > 0 && !!seedIds && seedIds.length > 0;

  const steps = [
    {
      id: "step1",
      title: "Thông tin chung",
      description: "Nhập thông tin cơ bản của vùng chăn nuôi",
      content: <RegionLivestockInfoStep showCenterPoint={true} />,
      isValid: step1Valid,
    },
    {
      id: "step2",
      title: "Cấu hình chăn nuôi",
      description: "Thiết lập phương pháp & con giống",
      content: <ZoneConfigurationStep />,
      isValid: step2Valid,
    },
    {
      id: "step3",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="LIVESTOCK" />,
      isValid: true,
    },
  ];

  return (
    <PageWrapper
      title={isEditMode ? "Cập nhật vùng chăn nuôi" : "Thêm mới vùng chăn nuôi"}
      description="Quản lý vùng chăn nuôi với giao diện cơ bản"
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
      <div className="mx-auto max-w-5xl pb-10">
        <FormProvider {...form}>
          <StepperForm
            steps={steps}
            loading={isSubmitting}
            onCancel={handleCancel}
            onComplete={handleSubmit(handleComplete)}
            completeLabel={
              isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng chăn nuôi"
            }
          />
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default RegionBasicDistributionLivestockCreateEditPage;
