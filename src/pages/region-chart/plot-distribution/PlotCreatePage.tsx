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
import { useRoute } from "wouter";

import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import { PlotInfoStep } from "./components/PlotInfoStep";
import { PlotMapStep } from "./components/PlotMapStep";
import { PlotReviewStep } from "./components/PlotReviewStep";
import { plotFormSchema, type PlotFormValues } from "./data/plot-form.schema";
import { usePlotCreateForm } from "./hooks/usePlotCreateForm";

const customIcon = getMarkerIcon("blue");
const activeIcon = getMarkerIcon("green");
const invalidIcon = getMarkerIcon("red");

const PlotCreatePage = () => {
  const [editMatch, editParams] = useRoute("/plot-distribution/edit/:id");
  const editingPlotId = editMatch && editParams?.id ? editParams.id : null;

  const form = useForm<PlotFormValues>({
    mode: "onChange",
    resolver: zodResolver(plotFormSchema),
  });

  const { reset, watch, handleSubmit, formState } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    usePlotCreateForm(reset);

  const coordinates = watch("coordinates") || [];

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Chọn vị trí và nhập thông tin cơ bản",
      isValid:
        !formState.errors.code &&
        !formState.errors.name &&
        !formState.errors.enterpriseId &&
        !formState.errors.regionId &&
        !formState.errors.areaId &&
        !formState.errors.acreage &&
        !!watch("code") &&
        !!watch("name") &&
        !!watch("enterpriseId") &&
        !!watch("regionId") &&
        !!watch("areaId") &&
        !!watch("acreage"),
      content: <PlotInfoStep />,
    },
    {
      id: "map",
      title: "Bản đồ lô đất",
      description: "Xác định ranh giới lô đất",
      isValid: coordinates.length >= 3,
      content: (
        <PlotMapStep
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
          editingPlotId={editingPlotId}
        />
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      isValid: formState.isValid,
      content: <PlotReviewStep />,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEditMode ? "Cập nhật lô đất" : "Thêm mới lô đất"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin lô đất"
          : "Tạo lô đất mới theo quy trình từng bước"
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
            completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo lô đất"}
          />
        </FormProvider>
      </div>
    </AdminLayout>
  );
};

export default PlotCreatePage;
