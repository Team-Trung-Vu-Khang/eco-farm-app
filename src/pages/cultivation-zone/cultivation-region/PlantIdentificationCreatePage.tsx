import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import usePlantStore from "../../../stores/usePlantStore";
import PlantIdentificationForm from "./components/PlantIdentificationForm";
import type { Plant } from "@/pages/region-chart/constants";
import { useLocation } from "wouter";

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
      isRice
      title="Thêm mới cây trồng"
      description="Định danh và thiết lập vị trí cho cây trồng mới"
    >
      <PlantIdentificationForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default PlantIdentificationCreatePage;
