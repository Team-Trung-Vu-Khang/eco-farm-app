import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { PlantDistributionConfigurationStep } from "./components/PlantDistributionConfigurationStep";
import { PlantDistributionConfirmationStep } from "./components/PlantDistributionConfirmationStep";
import { PlantDistributionGpsStep } from "./components/PlantDistributionGpsStep";
import { PlantDistributionScopeStep } from "./components/PlantDistributionScopeStep";
import {
  getSeedColor,
  usePlantDistributionCreatePage,
} from "./hooks/usePlantDistributionCreatePage";

const PlantDistributionCreatePage = () => {
  const {
    scope,
    selectedRegionId,
    selectedAreaIds,
    selectedPlotIds,
    selectedSeedIds,
    distributionMethod,
    plantEntries,
    rowConfigs,
    plantLocations,
    selectedPlantId,
    selectedRegion,
    selectedAreas,
    selectedPlots,
    availableVarieties,
    totalPlants,
    setSelectedRegionId,
    setSelectedPlantId,
    resetScopeSelections,
    resetDistributionMethod,
    toggleArea,
    togglePlot,
    toggleSeed,
    addPlantEntry,
    updatePlantEntry,
    removePlantEntry,
    addRowConfig,
    updateRowConfig,
    removeRowConfig,
    updatePlantLocation,
    generatePlantLocations,
    handleComplete,
    handleCancel,
    goToList,
  } = usePlantDistributionCreatePage();

  const steps: Step[] = [
    {
      id: "scope",
      title: "Chọn phạm vi",
      description: "Xác định vùng/khu vực/lô",
      content: (
        <PlantDistributionScopeStep
          scope={scope}
          selectedRegionId={selectedRegionId}
          selectedAreaIds={selectedAreaIds}
          selectedPlotIds={selectedPlotIds}
          onChangeScope={resetScopeSelections}
          onSelectRegion={setSelectedRegionId}
          onToggleArea={toggleArea}
          onTogglePlot={togglePlot}
        />
      ),
    },
    {
      id: "distribution",
      title: "Cấu hình phân bổ",
      description: "Thiết lập cây trồng",
      content: (
        <PlantDistributionConfigurationStep
          selectedSeedIds={selectedSeedIds}
          distributionMethod={distributionMethod}
          plantEntries={plantEntries}
          rowConfigs={rowConfigs}
          availableVarieties={availableVarieties}
          onToggleSeed={toggleSeed}
          onChangeMethod={resetDistributionMethod}
          onAddPlantEntry={addPlantEntry}
          onUpdatePlantEntry={updatePlantEntry}
          onRemovePlantEntry={removePlantEntry}
          onAddRowConfig={addRowConfig}
          onUpdateRowConfig={updateRowConfig}
          onRemoveRowConfig={removeRowConfig}
        />
      ),
    },
    {
      id: "gps",
      title: "Định vị GPS",
      description: "Tạo tọa độ cây",
      content: (
        <PlantDistributionGpsStep
          distributionMethod={distributionMethod}
          plantEntries={plantEntries}
          rowConfigs={rowConfigs}
          plantLocations={plantLocations}
          selectedPlantId={selectedPlantId}
          getSeedColor={getSeedColor}
          setSelectedPlantId={setSelectedPlantId}
          updatePlantLocation={updatePlantLocation}
          generatePlantLocations={generatePlantLocations}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <PlantDistributionConfirmationStep
          scope={scope}
          distributionMethod={distributionMethod}
          selectedRegion={selectedRegion}
          selectedAreas={selectedAreas}
          selectedPlots={selectedPlots}
          plantEntries={plantEntries}
          rowConfigs={rowConfigs}
          plantLocations={plantLocations}
          totalPlants={totalPlants}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      title="Tạo phân bổ cây trồng"
      description="Thiết lập phân bổ cây trồng cho vùng, khu vực hoặc lô đất"
      actions={
        <Button variant="outline" onClick={goToList}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Quay lại
        </Button>
      }
    >
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </AdminLayout>
  );
};

export default PlantDistributionCreatePage;
