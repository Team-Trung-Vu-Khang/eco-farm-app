import { AdminLayout, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PlantIdentificationHistoryTabs } from "./components/plant-detail/PlantIdentificationHistoryTabs";
import { PlantIdentificationIdentityCard } from "./components/plant-detail/PlantIdentificationIdentityCard";
import { PlantIdentificationMapSection } from "./components/plant-detail/PlantIdentificationMapSection";
import { PlantIdentificationNotFoundState } from "./components/plant-detail/PlantIdentificationNotFoundState";
import { PlantIdentificationPageActions } from "./components/plant-detail/PlantIdentificationPageActions";
import { PlantIdentificationSidebar } from "./components/plant-detail/PlantIdentificationSidebar";
import { usePlantIdentificationDetailPage } from "./hooks/usePlantIdentificationDetailPage";

const PlantIdentificationDetailPage = () => {
  const {
    data,
    deleteOpen,
    setDeleteOpen,
    cultivationRegion,
    manager,
    farmingMethod,
    irrigationMethod,
    formattedAge,
    historyData,
    historyColumns,
    goToList,
    goToEdit,
    handleConfirmDelete,
  } = usePlantIdentificationDetailPage();

  if (!data?.plant) {
    return <PlantIdentificationNotFoundState onBack={goToList} />;
  }

  const { plant, plot, area, region } = data;

  return (
    <AdminLayout
      isDev={true}
      title={`Thông tin cây: ${plant.id}`}
      description="Chi tiết định danh và vị trí địa lý của cây trồng"
      actions={
        <PlantIdentificationPageActions
          onBack={goToList}
          onEdit={goToEdit}
          onDelete={() => setDeleteOpen(true)}
        />
      }
    >
      <div className="space-y-6">
        <PlantIdentificationIdentityCard
          plant={plant}
          formattedAge={formattedAge}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PlantIdentificationMapSection
              plant={plant}
              region={region}
              area={area}
              plot={plot}
            />
            <PlantIdentificationHistoryTabs
              historyColumns={historyColumns}
              historyData={historyData}
            />
          </div>

          <PlantIdentificationSidebar
            plant={plant}
            cultivationRegion={cultivationRegion}
            manager={manager}
            farmingMethod={farmingMethod}
            irrigationMethod={irrigationMethod}
            region={region}
            area={area}
            plot={plot}
          />
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa thông tin định danh của cây này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default PlantIdentificationDetailPage;
