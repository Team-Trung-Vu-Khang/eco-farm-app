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
import { useCultivationZoneCreateForm } from "./hooks/useCultivationZoneCreateForm";

const CultivationRegionCreatePage = () => {
  const form = useForm<CultivationZoneFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(cultivationZoneFormSchema) as any,
    mode: "onChange",
    defaultValues: {
      name: "",
      code: "",
      selections: [],
      farmingMethodId: 0,
      irrigationSystemId: 0,
      seedIds: [],
      certificateIds: [],
      personnelIds: [],
      notes: "",
      status: "active",
    },
  });

  const { reset, watch, handleSubmit, formState } = form;

  const { isEditMode, handleComplete, handleCancel, isSubmitting } =
    useCultivationZoneCreateForm(reset);

  const selections = watch("selections") ?? [];
  const farmingMethodId = watch("farmingMethodId");
  const irrigationSystemId = watch("irrigationSystemId");

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Tên, phạm vi địa lý, chứng nhận",
      isValid:
        !formState.errors.name &&
        !formState.errors.selections &&
        !!watch("name") &&
        selections.length > 0,
      content: <ZoneGeneralInfoStep />,
    },
    {
      id: "config",
      title: "Cấu hình canh tác",
      description: "Phương pháp, tưới tiêu, hạt giống",
      isValid:
        !formState.errors.farmingMethodId &&
        !formState.errors.irrigationSystemId &&
        farmingMethodId > 0 &&
        irrigationSystemId > 0,
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
      title={isEditMode ? "Cập nhật vùng canh tác" : "Thiết lập vùng canh tác"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin vùng canh tác"
          : "Quy trình khởi tạo và cấu hình tiêu chuẩn cho đơn vị canh tác"
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
                  isEditMode ? "Lưu thay đổi" : "Khởi tạo vùng canh tác"
                }
              />
            </FormProvider>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CultivationRegionCreatePage;
