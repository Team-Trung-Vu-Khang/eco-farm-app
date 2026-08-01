import PageWrapper from "@/components/PageWrapper";
import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { AnimalIdentificationIdentityCard } from "../animal-husbandry-region/components/animal-detail/AnimalIdentificationIdentityCard";
import { AnimalIdentificationNotFoundState } from "../animal-husbandry-region/components/animal-detail/AnimalIdentificationNotFoundState";
import { AnimalIdentificationPageActions } from "../animal-husbandry-region/components/animal-detail/AnimalIdentificationPageActions";
import { AnimalIdentificationSidebar } from "../animal-husbandry-region/components/animal-detail/AnimalIdentificationSidebar";
import { GeographicalHierarchyDisplay } from "../animal-husbandry-region/components/GeographicalHierarchyDisplay";
import type {
  AreaNode,
  PlotNode,
  RegionNode,
} from "../animal-husbandry-region/components/GeographicalTree";
import { useAnimalIdentificationDetailPage } from "./hooks/useAnimalIdentificationDetailPage";

const AnimalIdentificationDetailPage = () => {
  const {
    data,
    isLoading,
    deleteOpen,
    setDeleteOpen,
    cultivationRegion,
    manager,
    farmingMethod,
    irrigationMethod,
    formattedAge,
    goToList,
    goToEdit,
    handleConfirmDelete,
  } = useAnimalIdentificationDetailPage();

  const selectedHierarchy = useMemo<RegionNode[]>(() => {
    if (!data?.region) return [];

    const plotNodes: PlotNode[] = data.plot
      ? [
          {
            id: String(data.plot.id),
            name: data.plot.name || "",
            level: 3,
            type: "PLOT",
            isSelected: true,
          },
        ]
      : [];

    const areaNodes: AreaNode[] = data.area
      ? [
          {
            id: String(data.area.id),
            name: data.area.name || "",
            level: 2,
            type: "AREA",
            isSelected: true,
            plots: plotNodes,
          },
        ]
      : [];

    return [
      {
        id: String(data.region.id),
        name: data.region.name || "",
        level: 1,
        type: "REGION",
        isSelected: true,
        areas: areaNodes,
      },
    ];
  }, [data?.region, data?.area, data?.plot]);

  if (isLoading) {
    return (
      <PageWrapper
        title="Đang tải..."
        description="Đang tải chi tiết định danh và vị trí địa lý của cá thể"
      >
        <div className="p-12 text-center text-slate-400">
          <p>Đang tải thông tin cá thể...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!data?.plant) {
    return <AnimalIdentificationNotFoundState onBack={goToList} />;
  }

  const { plant } = data;

  return (
    <PageWrapper
      title={`Thông tin cá thể: ${plant.code || plant.id}`}
      description="Chi tiết định danh và vị trí địa lý của cá thể"
      actions={
        <AnimalIdentificationPageActions
          onBack={goToList}
          onEdit={goToEdit}
          onDelete={() => setDeleteOpen(true)}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <AnimalIdentificationIdentityCard
            plant={plant}
            formattedAge={formattedAge}
          />

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Vị trí địa lý hiện tại
            </h3>
            <GeographicalHierarchyDisplay
              selectedHierarchy={selectedHierarchy}
            />
          </div>
        </div>

        <AnimalIdentificationSidebar
          plant={plant}
          cultivationRegion={cultivationRegion}
          manager={manager}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
        />
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh của cá thể này? Hành động này không thể hoàn tác."
      />
    </PageWrapper>
  );
};

export default AnimalIdentificationDetailPage;
