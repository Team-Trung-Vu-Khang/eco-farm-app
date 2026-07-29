import type { Plant } from "@/pages/region-chart/constants";
import { AdminLayout, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { usePlantIdentificationMutations } from "@/features/farm";
import { mapFrontendPlantToApiRequest } from "./utils/aquacultureMapper";
import AquacultureIdentificationForm from "./components/AquacultureIdentificationForm";

const AquacultureIdentificationCreatePage = () => {
  const [, setLocation] = useLocation();
  const { createPlant } = usePlantIdentificationMutations();
  const { toast } = useToast();

  const handleSubmit = async (data: Plant[]) => {
    try {
      await Promise.all(
        data.map((p) => {
          const payload = mapFrontendPlantToApiRequest(p);
          return createPlant.mutateAsync(payload);
        }),
      );
      toast({
        title: "Thành công",
        description: `Đã lưu thành công ${data.length} mẫu nuôi trồng thủy sản`,
      });
      setLocation("/aquaculture-identification");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description:
          error?.message || "Không thể lưu thông tin nuôi trồng thủy sản",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới nuôi trồng thủy sản"
      description="Định danh và thiết lập vị trí cho vùng nuôi trồng thủy sản mới"
    >
      <AquacultureIdentificationForm
        onSubmit={handleSubmit}
        loading={createPlant.isPending}
      />
    </AdminLayout>
  );
};

export default AquacultureIdentificationCreatePage;
