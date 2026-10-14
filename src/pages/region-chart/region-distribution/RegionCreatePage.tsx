import PageWrapper from "@/components/PageWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  StepperForm,
  type Step,
  Switch,
  Label,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm, useWatch } from "react-hook-form";

import { getMarkerIcon } from "@/pages/cultivation-zone/cultivation-region/components/mapUtils";
import {
  buildSquareAround,
  DEFAULT_REGION_CENTER,
  getBoundsFromPoints,
} from "./utils";
import { RegionInfoStep } from "./components/RegionInfoStep";
import { RegionMapEditor } from "./components/RegionMapEditor";
import { RegionReviewStep } from "./components/RegionReviewStep";
import { RegionSubAreaStep } from "./components/RegionSubAreaStep";
import { RegionBasicSubAreaStep } from "./components/RegionBasicSubAreaStep";
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
    defaultValues: {
      isDetailed: true,
    },
  });

  const { reset, handleSubmit, formState, setValue, control } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useRegionCreateForm(reset);

  const [
    isDetailedValue,
    name,
    provinceId,
    wardId,
    coordinates = [],
    centerPoint,
    area,
    subAreas = [],
  ] = useWatch({
    control,
    name: [
      "isDetailed",
      "name",
      "provinceId",
      "wardId",
      "coordinates",
      "centerPoint",
      "area",
      "subAreas",
    ],
  });

  const isDetailed = isDetailedValue !== false;

  const isBaseInfoValid =
    Boolean(name?.trim()) &&
    Boolean(provinceId?.trim()) &&
    Boolean(wardId?.trim()) &&
    !formState.errors.name &&
    !formState.errors.provinceId &&
    !formState.errors.wardId;

  const isBasicCenterPointValid =
    centerPoint?.lat !== undefined &&
    centerPoint?.lng !== undefined &&
    !Number.isNaN(centerPoint.lat) &&
    !Number.isNaN(centerPoint.lng) &&
    !formState.errors.centerPoint;

  const isStep1AdvancedValid = isBaseInfoValid;
  const isStep1BasicValid = isBaseInfoValid && isBasicCenterPointValid;

  const totalSubAreaAcreage = subAreas.reduce(
    (acc, curr) => acc + (curr.area || 0),
    0,
  );
  const isSubAreaAreaValid =
    !area || area <= 0 || totalSubAreaAcreage <= area + 1e-4;

  const handleToggleDetailedMode = (checked: boolean) => {
    setValue("isDetailed", checked, { shouldValidate: true, shouldDirty: true });

    if (checked) {
      // 1. Tự động khởi tạo polygon coordinates nếu chưa có hoặc < 3 điểm
      const currentCoords = form.getValues("coordinates") || [];
      if (currentCoords.length < 3) {
        const currentCenter = form.getValues("centerPoint");
        const lat =
          typeof currentCenter?.lat === "number" && Number.isFinite(currentCenter.lat)
            ? currentCenter.lat
            : DEFAULT_REGION_CENTER.lat;
        const lng =
          typeof currentCenter?.lng === "number" && Number.isFinite(currentCenter.lng)
            ? currentCenter.lng
            : DEFAULT_REGION_CENTER.lng;

        const newSquare = buildSquareAround(lat, lng);
        setValue("coordinates", newSquare, { shouldValidate: true, shouldDirty: true });
      }

      // 2. Khởi tạo coordinates cho các subAreas đã tạo ở chế độ cơ bản (nếu chưa có polygon)
      const currentSubAreas = form.getValues("subAreas") || [];
      if (currentSubAreas.length > 0) {
        const currentCenter = form.getValues("centerPoint");
        const regionLat =
          typeof currentCenter?.lat === "number" && Number.isFinite(currentCenter.lat)
            ? currentCenter.lat
            : DEFAULT_REGION_CENTER.lat;
        const regionLng =
          typeof currentCenter?.lng === "number" && Number.isFinite(currentCenter.lng)
            ? currentCenter.lng
            : DEFAULT_REGION_CENTER.lng;

        const updatedSubs = currentSubAreas.map((sub, idx) => {
          if (!sub.coordinates || sub.coordinates.length < 3) {
            const subLat =
              typeof sub.centerPoint?.lat === "number" && Number.isFinite(sub.centerPoint.lat)
                ? sub.centerPoint.lat
                : regionLat + (idx % 2 === 0 ? 0.002 : -0.002);
            const subLng =
              typeof sub.centerPoint?.lng === "number" && Number.isFinite(sub.centerPoint.lng)
                ? sub.centerPoint.lng
                : regionLng + (idx >= 2 ? 0.002 : -0.002);

            return {
              ...sub,
              coordinates: buildSquareAround(subLat, subLng, 0.003),
            };
          }
          return sub;
        });
        setValue("subAreas", updatedSubs, { shouldValidate: true, shouldDirty: true });
      }
    } else {
      // Khi chuyển sang Chế độ cơ bản:
      // Nếu centerPoint chưa có, tính tâm từ coordinates
      const currentCenter = form.getValues("centerPoint");
      const currentCoords = form.getValues("coordinates") || [];
      if (
        (!currentCenter?.lat || !currentCenter?.lng) &&
        currentCoords.length >= 3
      ) {
        const boundsCenter = getBoundsFromPoints(
          currentCoords.map((c) => L.latLng(c.lat, c.lng)),
        ).getCenter();
        setValue(
          "centerPoint",
          {
            lat: Number(boundsCenter.lat.toFixed(6)),
            lng: Number(boundsCenter.lng.toFixed(6)),
          },
          { shouldValidate: true, shouldDirty: true },
        );
      }
    }
  };

  const basicSteps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Tên, địa chỉ & tọa độ trung tâm",
      isValid: isStep1BasicValid,
      content: <RegionInfoStep showCenterPoint={true} />,
    },
    {
      id: "subarea",
      title: "Phân chia khu vực",
      description: "Tạo khu vực theo tọa độ điểm",
      isValid: isSubAreaAreaValid,
      content: <RegionBasicSubAreaStep />,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      isValid: formState.isValid,
      content: <RegionReviewStep isDetailed={false} />,
    },
  ];

  const advancedSteps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Tên, địa chỉ vùng",
      isValid: isStep1AdvancedValid,
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
      isValid: isSubAreaAreaValid,
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
      content: <RegionReviewStep isDetailed={true} />,
    },
  ];

  const currentSteps = isDetailed ? advancedSteps : basicSteps;

  return (
    <PageWrapper
      title={isEditMode ? "Cập nhật vùng trồng" : "Thêm mới vùng trồng"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng trồng"
          : "Tạo vùng trồng mới theo quy trình từng bước"
      }
      actions={
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-full px-3 py-1.5 shadow-sm">
            <Label
              htmlFor="region-mode-switch"
              className="text-xs font-semibold text-slate-600 cursor-pointer select-none"
            >
              Thông tin chuyên sâu
            </Label>
            <Switch
              id="region-mode-switch"
              checked={isDetailed}
              onCheckedChange={handleToggleDetailedMode}
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
          <StepperForm
            key={isDetailed ? "detailed" : "basic"}
            steps={currentSteps}
            loading={isSubmitting}
            onCancel={handleCancel}
            onComplete={handleSubmit(handleComplete)}
            completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo vùng trồng"}
          />
        </FormProvider>
      </div>
    </PageWrapper>
  );
};

export default RegionCreatePage;
