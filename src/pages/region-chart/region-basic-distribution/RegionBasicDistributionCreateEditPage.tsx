import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useFormState, useWatch } from "react-hook-form";

import { RegionInfoStep } from "../region-distribution/components/RegionInfoStep";
import { ZoneConfigurationStep } from "../../cultivation-zone/cultivation-region/components/ZoneConfigurationStep";
import { RegionConfirmationStep } from "./components/RegionConfirmationStep";
import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "./data/region-basic-form.schema";
import { useRegionBasicCreateForm } from "./hooks/useRegionBasicCreateForm";

const RegionBasicDistributionCreateEditPage = () => {
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
    useRegionBasicCreateForm(reset);

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
      description: "Nhập thông tin cơ bản của vùng trồng",
      content: <RegionInfoStep showCenterPoint={true} />,
      isValid: step1Valid,
    },
    {
      id: "step2",
      title: "Cấu hình canh tác",
      description: "Thiết lập phương pháp & giống cây trồng",
      content: <ZoneConfigurationStep />,
      isValid: step2Valid,
    },
    {
      id: "step3",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="CROP" />,
      isValid: true,
    },
  ];

  return (
    <PageWrapper
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description="Quản lý vùng trồng với giao diện cơ bản"
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
            completeLabel={isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng trồng"}
          />
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default RegionBasicDistributionCreateEditPage;
