import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";

import { AreaInfoStep } from "./components/AreaInfoStep";
import { AreaMapStep } from "./components/AreaMapStep";
import { AreaPlotsStep } from "./components/AreaPlotsStep";
import { AreaReviewStep } from "./components/AreaReviewStep";
import { areaFormSchema, type AreaFormValues } from "./data/area-form.schema";
import { useAreaCreateForm } from "./hooks/useAreaCreateForm";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

import { useMemo } from "react";
import { useRegions } from "@/features/farm/hooks/useRegions";

const AreaCreatePage = () => {
  const { data: regionsData } = useRegions({ params: { size: 100 } });

  const dynamicSchema = useMemo(() => {
    return areaFormSchema.superRefine((data, ctx) => {
      const selectedRegion = (regionsData?.content || []).find(
        (r) => r.id === data.regionId,
      );
      if (selectedRegion && data.acreage !== undefined) {
        const regionAcreage = parseFloat(String(selectedRegion.acreage || 0));
        if (data.acreage > regionAcreage) {
          ctx.addIssue({
            code: "custom",
            path: ["acreage"],
            message: `Không được vượt quá diện tích vùng (${regionAcreage} ha)`,
          });
        }
      }
    });
  }, [regionsData]);

  const form = useForm<AreaFormValues>({
    mode: "onChange",
    resolver: zodResolver(dynamicSchema),
  });

  const { reset, watch, handleSubmit, formState } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useAreaCreateForm(reset);

  const coordinates = watch("coordinates") || [];

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Chọn vùng và thông tin cơ bản",
      isValid:
        !formState.errors.code &&
        !formState.errors.name &&
        !formState.errors.regionId &&
        !formState.errors.acreage &&
        !!watch("code") &&
        !!watch("name") &&
        !!watch("regionId"),
      content: <AreaInfoStep />,
    },
    {
      id: "map",
      title: "Bản đồ khu vực",
      description: "Xác định vị trí khu vực",
      isValid: coordinates.length >= 3,
      content: <AreaMapStep markerIcon={customIcon} />,
    },
    {
      id: "plots",
      title: "Phân chia lô",
      description: "Tạo các lô trong khu vực",
      isValid: true,
      content: (
        <AreaPlotsStep
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
      content: <AreaReviewStep />,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEditMode ? "Cập nhật khu vực" : "Thêm mới khu vực"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin khu vực"
          : "Tạo khu vực mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={isSubmitting}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto pb-10">
        <FormProvider {...form}>
          <StepperForm
            steps={steps}
            loading={isSubmitting}
            onCancel={handleCancel}
            onComplete={handleSubmit(handleComplete)}
            completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo khu vực"}
          />
        </FormProvider>
      </div>
    </AdminLayout>
  );
};

export default AreaCreatePage;
