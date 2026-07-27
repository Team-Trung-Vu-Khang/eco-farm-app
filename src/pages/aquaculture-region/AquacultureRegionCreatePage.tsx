import { zodResolver } from "@hookform/resolvers/zod";
import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { ZoneConfigurationStep } from "./components/ZoneConfigurationStep";
import { ZoneGeneralInfoStep } from "./components/ZoneGeneralInfoStep";
import { ZoneReviewStep } from "./components/ZoneReviewStep";
import {
  cultivationZoneFormSchema,
  type CultivationZoneFormValues,
} from "./data/cultivation-zone-form.schema";
import { useAquacultureZoneCreateForm } from "./hooks/useAquacultureZoneCreateForm";

const AquacultureRegionCreatePage = () => {
  const form = useForm<CultivationZoneFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cultivationZoneFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      selections: [],
      farmingMethodId: 0,
      rearingMethodId: 0,
      seedIds: [],
      certificateIds: [],
      personnelIds: [],
      notes: "",
      status: "active",
    },
  });

  const { reset, watch, handleSubmit, formState } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useAquacultureZoneCreateForm(reset);

  const selections = watch("selections") ?? [];
  const farmingMethodId = watch("farmingMethodId");

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin vùng",
      description: "Tên, phạm vi và cấu hình cơ bản",
      isValid:
        !formState.errors.name &&
        !formState.errors.selections &&
        !!watch("name") &&
        selections.length > 0,
      content: <ZoneGeneralInfoStep />,
    },
    {
      id: "config",
      title: "Cấu hình nuôi trồng",
      description: "Loại hình nuôi, hệ thống nước, loài nuôi",
      isValid:
        !formState.errors.farmingMethodId &&
        !formState.errors.rearingMethodId &&
        farmingMethodId > 0,
      content: <ZoneConfigurationStep />,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra và hoàn tất",
      isValid: formState.isValid,
      content: <ZoneReviewStep />,
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={
        isEditMode ? "Cập nhật vùng nuôi trồng" : "Thiết lập vùng nuôi trồng"
      }
      description={
        isEditMode
          ? "Chỉnh sửa dữ liệu vùng nuôi trồng thủy sản"
          : "Quy trình khởi tạo và cấu hình mẫu cho vùng nuôi trồng thủy sản"
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
      <Card className="max-w-5xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <FormProvider {...form}>
              <StepperForm
                steps={steps}
                loading={isSubmitting}
                onCancel={handleCancel}
                onComplete={handleSubmit(handleComplete)}
                completeLabel={
                  isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng thủy sản"
                }
              />
            </FormProvider>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default AquacultureRegionCreatePage;
