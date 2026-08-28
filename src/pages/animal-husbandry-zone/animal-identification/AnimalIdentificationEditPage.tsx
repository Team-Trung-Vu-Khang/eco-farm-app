import PageWrapper from "@/components/PageWrapper";
import {
  usePlantIdentificationById,
  usePlantIdentificationMutations,
} from "@/features/farm";
import { Button, useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, PawPrint } from "lucide-react";
import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import PlantIdentificationForm from "../animal-husbandry-region/components/PlantIdentificationForm";
import {
  mapApiPlantToFrontend,
  mapFrontendPlantToApiRequest,
} from "./utils/animalMapper";

const AnimalIdentificationEditPage = () => {
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
      const payload = mapFrontendPlantToApiRequest(formData, null, true);
      await updatePlant.mutateAsync({ id: Number(id), data: payload });
      toast({
        title: "Thành công",
        description: `Đã cập nhật cá thể thành công`,
      });
      setLocation(`/animal-identification/${id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast({
        title: "Lỗi",
        description: error?.message || "Không thể cập nhật cá thể",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageWrapper title="Đang tải..." description="Đang tải thông tin cá thể">
        <div className="p-12 text-center text-slate-400">
          <p>Đang tải thông tin cá thể...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!plant) {
    return (
      <PageWrapper title="Không tìm thấy" description="Cá thể không tồn tại">
        <div className="p-12 text-center text-slate-400">
          <PawPrint className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Không tìm thấy thông tin cá thể để chỉnh sửa.</p>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper
      title={`Chỉnh sửa: ${plant.code}`}
      description="Cập nhật thông tin định danh và thông số sinh trưởng"
      actions={
        <Button
          variant="outline"
          className="gap-2"
          onClick={() => setLocation(`/animal-identification/${id}`)}
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại
        </Button>
      }
    >
      <PlantIdentificationForm
        initialData={plant}
        onSubmit={handleSubmit}
        loading={updatePlant.isPending}
      />
    </PageWrapper>
  );
};

export default AnimalIdentificationEditPage;
