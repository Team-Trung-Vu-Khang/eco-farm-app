import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, Loader2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "../region-basic-distribution/data/region-basic-form.schema";
import { RegionLivestockInfoStep } from "./components/RegionLivestockInfoStep";
import { useRegionBasicLivestockCreateForm } from "./hooks/useRegionBasicLivestockCreateForm";

const RegionBasicDistributionLivestockCreateEditPage = () => {
  const form = useForm<RegionBasicFormValues>({
    resolver: zodResolver(regionBasicFormSchema),
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

  const { reset, handleSubmit, formState } = form;
  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionBasicLivestockCreateForm(reset);

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
      <div className="mx-auto max-w-4xl pb-10">
        <FormProvider {...form}>
          <div className="space-y-6">
            <RegionLivestockInfoStep showCenterPoint={true} />
            <div className="flex justify-end gap-3 rounded-lg border bg-white p-4">
              <Button
                variant="outline"
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button
                type="button"
                onClick={handleSubmit(handleComplete)}
                disabled={isSubmitting || !formState.isValid}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isEditMode ? "Lưu thay đổi" : "Tạo vùng chăn nuôi"}
              </Button>
            </div>
          </div>
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default RegionBasicDistributionLivestockCreateEditPage;
