import PageWrapper from "@/components/PageWrapper";
import { usePlantIdentificationMutations } from "@/features/farm";
import type { Plant } from "@/pages/region-chart/constants";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import PlantIdentificationForm from "./components/PlantIdentificationForm";
import { mapFrontendPlantToApiRequest } from "./utils/plantMapper";

const PlantIdentificationCreatePage = () => {
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
        description: `Đã lưu thành công ${data.length} cây trồng`,
      });
      setLocation("/plant-identification");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể lưu thông tin cây trồng",
        variant: "destructive",
      });
    }
  };

  return (
    <PageWrapper
      title="Thêm mới cây trồng"
      description="Định danh và thiết lập vị trí cho cây trồng mới"
    >
      <PlantIdentificationForm
        onSubmit={handleSubmit}
        loading={createPlant.isPending}
      />
    </PageWrapper>
  );
};

export default PlantIdentificationCreatePage;
