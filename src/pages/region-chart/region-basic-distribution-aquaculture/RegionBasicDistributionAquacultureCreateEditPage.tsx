import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";

import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../region-basic-distribution/data/region-basic-form.schema";
import { RegionAquacultureInfoStep } from "./components/RegionAquacultureInfoStep";
import { ZoneConfigurationStep } from "../../aquaculture-region/components/ZoneConfigurationStep";
import { RegionConfirmationStep } from "../region-basic-distribution/components/RegionConfirmationStep";
import { useRegionBasicAquacultureCreateForm } from "./hooks/useRegionBasicAquacultureCreateForm";

const RegionBasicDistributionAquacultureCreateEditPage = () => {
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
      rearingMethodId: undefined,
      seedIds: [],
    },
  });

  const { reset, handleSubmit, control } = form;
  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionBasicAquacultureCreateForm(reset);

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
      description: "Nhập thông tin cơ bản của vùng nuôi trồng",
      content: <RegionAquacultureInfoStep showCenterPoint={true} />,
      isValid: step1Valid,
    },
    {
      id: "step2",
      title: "Cấu hình nuôi trồng",
      description: "Thiết lập phương pháp & con giống",
      content: <ZoneConfigurationStep />,
      isValid: step2Valid,
    },
    {
      id: "step3",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="AQUACULTURE" />,
      isValid: true,
    },
  ];

  return (
    <PageWrapper
      title={
        isEditMode ? "Cập nhật vùng nuôi trồng" : "Thêm mới vùng nuôi trồng"
      }
      description="Quản lý vùng nuôi trồng thuỷ sản với giao diện cơ bản"
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
              isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng nuôi trồng"
            }
          />
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default RegionBasicDistributionAquacultureCreateEditPage;
