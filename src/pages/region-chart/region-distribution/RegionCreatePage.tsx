import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
  Switch,
  Label,
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

  const { reset, watch, handleSubmit, formState, setValue } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionCreateForm(reset);

  const coordinates = watch("coordinates") || [];
  const isDetailed = watch("isDetailed") !== false;



  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Tên, địa chỉ vùng",
      isValid: !formState.errors.name && !!watch("name"),
      content: <RegionInfoStep showCenterPoint={false} />,
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
      isDev={true}
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng trồng"
          : "Tạo vùng trồng mới theo quy trình từng bước"
      }
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label
              htmlFor="map-mode"
              className="text-sm font-medium cursor-pointer text-slate-700 select-none"
            >
              Giao diện chi tiết
            </Label>
            <Switch
              id="map-mode"
              checked={isDetailed}
              onCheckedChange={(checked) => {
                setValue("isDetailed", checked, { shouldValidate: true });
              }}
            />
          </div>
          <Button
            variant="outline"
            onClick={() => handleCancel()}
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
          </Button>
        </div>
      }
    >
      <div className="max-w-4xl mx-auto pb-10">
        <FormProvider {...form}>
          {isDetailed ? (
            <StepperForm
              key="detailed"
              steps={steps}
              loading={isSubmitting}
              onCancel={handleCancel}
              onComplete={handleSubmit(handleComplete)}
              completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
            />
          ) : (
            <div className="space-y-6">
              <RegionInfoStep showCenterPoint={true} />
              <div className="flex justify-end gap-3 bg-white p-4 rounded-lg border">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleCancel()}
                  disabled={isSubmitting}
                >
                  Hủy
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmit(handleComplete)}
                  disabled={isSubmitting || !formState.isValid}
                >
                  {isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
                </Button>
              </div>
            </div>
          )}
        </FormProvider>
      </div>
    </AdminLayout>
  );
};

export default RegionCreatePage;
