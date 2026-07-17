import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { RegionInfoStep } from "../region-distribution/components/RegionInfoStep";
import {
  regionBasicFormSchema,
  type RegionBasicFormValues,
} from "./data/region-basic-form.schema";
import { useRegionBasicCreateForm } from "./hooks/useRegionBasicCreateForm";

const RegionBasicDistributionCreateEditPage = () => {
  const form = useForm<RegionBasicFormValues>({
    resolver: zodResolver(regionBasicFormSchema),
    mode: "onChange",
    defaultValues: {
      code: "",
      name: "",
      cropId: "",
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
    useRegionBasicCreateForm(reset);

  return (
    <AdminLayout
      isDev={true}
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description="Quản lý vùng trồng với giao diện cơ bản"
      actions={
        <Button variant="outline" onClick={handleCancel} disabled={isSubmitting}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <div className="mx-auto max-w-4xl pb-10">
        <FormProvider {...form}>
          <div className="space-y-6">
            <RegionInfoStep showCenterPoint={true} />
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
                loading={isSubmitting}
                disabled={isSubmitting || !formState.isValid}
              >
                {isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
              </Button>
            </div>
          </div>
        </FormProvider>
      </div>
    </AdminLayout>
  );
};

export default RegionBasicDistributionCreateEditPage;
