import { AdminLayout } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trees } from "lucide-react";
import { useLocation, useParams } from "wouter";
import usePlantStore from "../../../stores/usePlantStore";
import PlantIdentificationForm from "./components/PlantIdentificationForm";

const PlantIdentificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { getPlantById, updatePlant } = usePlantStore();

  const data = getPlantById(id || "");

  if (!data?.plant) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy"
        description="Cây không tồn tại"
      >
        <div className="p-12 text-center text-slate-400">
          <Trees className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Không tìm thấy thông tin cây trồng để chỉnh sửa.</p>
        </div>
      </AdminLayout>
    );
  }

  const handleSubmit = (formData: any) => {
    if (id) {
      updatePlant(id, formData);
      setLocation(`/plant-identification/${id}`);
    }
  };

  return (
    <AdminLayout
      isDev={true}
      title={`Chỉnh sửa: ${data.plant.code}`}
      description="Cập nhật thông tin định danh và thông số sinh trưởng"
    >
      <PlantIdentificationForm
        initialData={data.plant}
        onSubmit={handleSubmit}
      />
    </AdminLayout>
  );
};

export default PlantIdentificationEditPage;
