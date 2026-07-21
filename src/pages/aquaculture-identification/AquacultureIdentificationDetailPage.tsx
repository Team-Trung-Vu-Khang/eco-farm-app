import { AdminLayout, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { PlantIdentificationIdentityCard } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationIdentityCard";
import { PlantIdentificationMapSection } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationMapSection";
import { PlantIdentificationNotFoundState } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationNotFoundState";
import { PlantIdentificationPageActions } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationPageActions";
import { PlantIdentificationSidebar } from "@/pages/aquaculture-region/components/aquaculture-detail/AquacultureIdentificationSidebar";
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

  if (isLoading) {
    return (
      <AdminLayout
        isDev={true}
        title="Đang tải..."
        description="Đang tải chi tiết định danh vùng nuôi trồng"
      >
        <div className="p-12 text-center text-slate-400">
          <p>Đang tải thông tin...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!data?.plant) {
    return <PlantIdentificationNotFoundState onBack={goToList} />;
  }

  const { plant, plot, area, region } = data;

  return (
    <AdminLayout
      isDev={true}
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
            {/* <PlantIdentificationHistoryTabs
              historyColumns={historyColumns}
              historyData={historyData}
            /> */}
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
        description="Bạn có chắc chắn muốn xóa thông tin định danh này? Hành động này không thể hoàn tác."
      />
    </AdminLayout>
  );
};

export default AquacultureIdentificationDetailPage;
