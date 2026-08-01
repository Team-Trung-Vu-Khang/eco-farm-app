import PageWrapper from "@/components/PageWrapper";
import {
  usePlantIdentificationById,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Trees } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import PlantIdentificationForm from "./components/PlantIdentificationForm";
import {
  mapApiPlantToFrontend,
  mapFrontendPlantToApiRequest,
} from "./utils/plantMapper";

const PlantIdentificationEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { data: apiData, isLoading } = usePlantIdentificationById(Number(id));
  const { updatePlant } = usePlantIdentificationMutations();

  const plant = useMemo(() => {
    if (!apiData) return null;
    return mapApiPlantToFrontend(apiData);
  }, [apiData]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = async (formData: any) => {
    if (!id) return;
    try {
      const payload = mapFrontendPlantToApiRequest(formData);
      await updatePlant.mutateAsync({ id: Number(id), data: payload });
      toast({
        title: "Thành công",
        description: `Đã cập nhật cây trồng thành công`,
      });
      setLocation(`/plant-identification/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể cập nhật cây trồng",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageWrapper
        title="Đang tải..."
        description="Đang tải thông tin cây trồng"
      >
        <div className="p-12 text-center text-slate-400">
          <p>Đang tải thông tin cây trồng...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!plant) {
    return (
      <PageWrapper title="Không tìm thấy" description="Cây không tồn tại">
        <div className="p-12 text-center text-slate-400">
          <Trees className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Không tìm thấy thông tin cây trồng để chỉnh sửa.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Chỉnh sửa: ${plant.code}`}
      description="Cập nhật thông tin định danh và thông số sinh trưởng"
    >
      <PlantIdentificationForm
        initialData={plant}
        onSubmit={handleSubmit}
        loading={updatePlant.isPending}
      />
    </PageWrapper>
  );
};

export default PlantIdentificationEditPage;
