import type { Plant } from "@/pages/region-chart/constants";
import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import usePlantStore from "../../../stores/usePlantStore";
import PlantIdentificationForm from "./components/PlantIdentificationForm";

const PlantIdentificationCreatePage = () => {
  const [_, setLocation] = useLocation();
  const { addPlants } = usePlantStore();

  // Called once per plant entry by the form's handleComplete loop
  const handleSubmit = (data: Plant[]) => {
    addPlants(data);
    setLocation("/plant-identification");
  };

  return (
    <AdminLayout
      isDev={true}
      title="Thêm mới cây trồng"
      description="Định danh và thiết lập vị trí cho cây trồng mới"
    >
      <PlantIdentificationForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default PlantIdentificationCreatePage;
