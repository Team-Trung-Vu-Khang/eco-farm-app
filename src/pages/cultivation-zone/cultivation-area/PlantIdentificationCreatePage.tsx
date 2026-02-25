import { AdminLayout } from "@tankhang1/eco-shared-ui";
import { useLocation } from "wouter";
import usePlantStore from "../../../stores/usePlantStore";
import PlantIdentificationForm from "./components/PlantIdentificationForm";

const PlantIdentificationCreatePage = () => {
  const [, setLocation] = useLocation();
  const { addPlant } = usePlantStore();

  const handleSubmit = (data: any) => {
    addPlant(data);
    setLocation("/plant-identification");
  };

  return (
    <AdminLayout
      title="Thêm mới cây trồng"
      description="Định danh và thiết lập vị trí cho cây trồng mới"
    >
      <PlantIdentificationForm onSubmit={handleSubmit} />
    </AdminLayout>
  );
};

export default PlantIdentificationCreatePage;
