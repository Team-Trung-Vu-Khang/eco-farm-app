import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useForm } from "react-hook-form";

import { RegionBasicDistributionForm } from "./components/RegionBasicDistributionForm";
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

  const { reset } = form;
  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionBasicCreateForm(reset);

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
        <RegionBasicDistributionForm
          form={form}
          onSubmit={handleComplete}
          onCancel={handleCancel}
          isLoading={isSubmitting}
          isEditMode={isEditMode}
        />
      </div>
    </PageWrapper>
  );
};

export default RegionBasicDistributionCreateEditPage;
