import type { Plant } from "@/pages/region-chart/constants";
import { AdminLayout, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { usePlantIdentificationMutations } from "@/features/farm";
import { mapFrontendPlantToApiRequest } from "./utils/animalMapper";
import PlantIdentificationForm from "../animal-husbandry-region/components/PlantIdentificationForm";

const AnimalIdentificationCreatePage = () => {
  const [, setLocation] = useLocation();
  const { createPlant } = usePlantIdentificationMutations();
  const { toast } = useToast();

  const handleSubmit = async (data: Plant[]) => {
    try {
      await Promise.all(
        data.map((p) => {
          const payload = mapFrontendPlantToApiRequest(p, null, false);
          return createPlant.mutateAsync(payload);
        }),
      );
      toast({
        title: "Thành công",
        description: `Đã lưu thành công ${data.length} cá thể`,
      });
      setLocation("/animal-identification");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể lưu thông tin cá thể",
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới cá thể"
      description="Định danh và thiết lập vị trí cho cá thể mới"
    >
      <PlantIdentificationForm
        onSubmit={handleSubmit}
        loading={createPlant.isPending}
      />
    </AdminLayout>
  );
};

export default AnimalIdentificationCreatePage;
