import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";

import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { RegionInfoStep } from "./components/RegionInfoStep";
import { RegionMapEditor } from "./components/RegionMapEditor";
import { RegionReviewStep } from "./components/RegionReviewStep";
import { RegionSubAreaStep } from "./components/RegionSubAreaStep";
import {
  regionFormSchema,
  type RegionFormValues,
} from "./data/region-form.schema";
import { useRegionCreateForm } from "./hooks/useRegionCreateForm";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const RegionCreatePage = () => {
  const form = useForm<RegionFormValues>({
    resolver: zodResolver(regionFormSchema),
    mode: "onChange",
  });

  const { reset, watch, handleSubmit, formState } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionCreateForm(reset);

  const coordinates = watch("coordinates") || [];

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Mã, tên, địa chỉ vùng",
      isValid:
        !formState.errors.code &&
        !formState.errors.name &&
        !!watch("code") &&
        !!watch("name"),
      content: <RegionInfoStep />,
    },
    {
      id: "map",
      title: "Bản đồ vùng trồng",
      description: "Xác định vị trí trên bản đồ",
      isValid: coordinates.length >= 3,
      content: <RegionMapEditor markerIcon={customIcon} />,
    },
    {
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo khu vực con",
      isValid: true,
      content: (
        <RegionSubAreaStep
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
        />
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      isValid: formState.isValid,
      content: <RegionReviewStep />,
    },
  ];

  return (
    <AdminLayout
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng trồng"
          : "Tạo vùng trồng mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => handleCancel()}
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-4xl mx-auto pb-10">
        <FormProvider {...form}>
          <StepperForm
            steps={steps}
            loading={isSubmitting}
            onCancel={handleCancel}
            onComplete={handleSubmit(handleComplete)}
            completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
          />
        </FormProvider>
      </div>
    </AdminLayout>
  );
};

export default RegionCreatePage;
