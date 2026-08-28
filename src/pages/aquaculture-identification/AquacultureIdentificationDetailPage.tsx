import PageWrapper from "@/components/PageWrapper";
import { PlantIdentificationIdentityCard } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationIdentityCard";
import { PlantIdentificationNotFoundState } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationNotFoundState";
import { PlantIdentificationPageActions } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationPageActions";
import { PlantIdentificationSidebar } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationSidebar";
import { GeographicalHierarchyDisplay } from "@/pages/animal-husbandry-zone/animal-husbandry-region/components/GeographicalHierarchyDisplay";
import type {
  AreaNode,
  PlotNode,
  RegionNode,
} from "@/pages/animal-husbandry-zone/animal-husbandry-region/components/GeographicalTree";
import { DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { useAquacultureIdentificationDetailPage } from "./hooks/useAquacultureIdentificationDetailPage";

const AquacultureIdentificationDetailPage = () => {
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
  } = useAquacultureIdentificationDetailPage();

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
        description="Đang tải chi tiết định danh vùng nuôi trồng"
      >
        <div className="p-12 text-center text-slate-400">
          <p>Đang tải thông tin...</p>
        </div>
      </PageWrapper>
    );
  }

  if (!data?.plant) {
    return <PlantIdentificationNotFoundState onBack={goToList} />;
  }

  const { plant } = data;

  return (
    <PageWrapper
      title={`Thông tin định danh: ${plant.id}`}
      description="Chi tiết định danh và vị trí địa lý của vùng nuôi trồng"
      actions={
        <PlantIdentificationPageActions
          onBack={goToList}
          onEdit={goToEdit}
          onDelete={() => setDeleteOpen(true)}
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <PlantIdentificationIdentityCard
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

        <PlantIdentificationSidebar
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
        description="Bạn có chắc chắn muốn xóa thông tin định danh này? Hành động này không thể hoàn tác."
      />
    </PageWrapper>
  );
};

export default AquacultureIdentificationDetailPage;
