import React, { useMemo } from "react";
import {
  FormProvider,
  type UseFormReturn,
  useWatch,
  useFormState,
} from "react-hook-form";
import { StepperForm } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { RegionInfoStep } from "../../region-distribution/components/RegionInfoStep";
import { ZoneConfigurationStep } from "../../../cultivation-zone/cultivation-region/components/ZoneConfigurationStep";
import { RegionConfirmationStep } from "./RegionConfirmationStep";
import type { RegionBasicFormValues } from "../data/region-basic-form.schema";
import { useMethodApplications } from "@/features/foundation";
import { useQueries } from "@tanstack/react-query";
import { seedApi } from "@/features/farm/api/farm.api";
import { seedKeys } from "@/features/farm/hooks/useSeeds";
import type { FarmSeedResponse } from "@/features/farm/types/farm.type";

interface RegionBasicDistributionFormProps {
  form: UseFormReturn<RegionBasicFormValues>;
  onSubmit: (data: RegionBasicFormValues) => void;
  onCancel: () => void;
  isLoading: boolean;
  isEditMode: boolean;
  isDialogMode?: boolean;
  completeLabel?: string;
  bypassSeedSelection?: boolean;
}

export const RegionBasicDistributionForm: React.FC<
  RegionBasicDistributionFormProps
> = ({
  form,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode,
  isDialogMode = false,
  completeLabel,
  bypassSeedSelection = false,
}) => {
  const { control, handleSubmit } = form;

  const [name, farmingMethodId, seedIds] = useWatch({
    control,
    name: ["name", "farmingMethodId", "seedIds"],
  });

  const { errors } = useFormState({ control });

  // 1. Lấy thông tin các Cây trồng và Giống cây trồng của Phương pháp canh tác đang được áp dụng
  const { items: methodApplications } = useMethodApplications({
    params: {
      domainCode: "CROP",
      size: 100,
      status: "active",
    },
    enabled: !!farmingMethodId && farmingMethodId > 0,
  });

  const activeMethodApp = useMemo(() => {
    if (!farmingMethodId || farmingMethodId <= 0) return null;
    return methodApplications.find(
      (item) => item.productionMethod?.id === farmingMethodId,
    );
  }, [methodApplications, farmingMethodId]);

  const allVariants = useMemo(() => {
    const list: Array<{ id: number; name?: string }> = [];
    activeMethodApp?.subjects?.forEach((s) => {
      s.variants?.forEach((v) => {
        list.push(v);
      });
    });
    return list;
  }, [activeMethodApp]);

  // 2. Sử dụng useQueries để gọi song song danh sách hạt giống (Seeds) theo từng Giống (Variant)
  const seedQueries = useQueries({
    queries: allVariants.map((v) => ({
      queryKey: seedKeys.list({
        foundationSubjectVariantId: v.id,
        size: 100,
        status: "active",
      }),
      queryFn: () =>
        seedApi.list({
          foundationSubjectVariantId: v.id,
          size: 100,
          status: "active",
        }),
      enabled: !!v.id && allVariants.length > 0,
    })),
  });

  // 3. Gộp tất cả hạt giống từ các query kết quả và loại bỏ trùng lặp
  const allSeeds = useMemo(() => {
    const all: FarmSeedResponse[] = [];
    seedQueries.forEach((q) => {
      if (q.data?.content) {
        all.push(...q.data.content);
      }
    });
    return Array.from(new Map(all.map((item) => [item.id, item])).values());
  }, [seedQueries]);

  const step1Valid = !!name && name.trim().length > 0 && !errors.name;

  const step2Valid =
    !!farmingMethodId &&
    farmingMethodId > 0 &&
    (bypassSeedSelection ? true : !!seedIds && seedIds.length > 0);

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
      content: (
        <ZoneConfigurationStep
          allSeeds={allSeeds}
          bypassSeedSelection={bypassSeedSelection}
        />
      ),
      isValid: step2Valid,
    },
    {
      id: "step3",
      title: "Xác nhận thông tin",
      description: "Xác nhận lại các thông tin trước khi hoàn thành",
      content: <RegionConfirmationStep domainCode="CROP" allSeeds={allSeeds} />,
      isValid: true,
    },
  ];

  return (
    <FormProvider {...form}>
      <StepperForm
        steps={steps}
        loading={isLoading}
        onComplete={handleSubmit(onSubmit)}
        onCancel={isDialogMode ? () => {} : onCancel} // Disable cancel button in StepperForm if in dialog onboarding mode
        completeLabel={
          completeLabel || (isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng trồng")
        }
      />
    </FormProvider>
  );
};

export default RegionBasicDistributionForm;
