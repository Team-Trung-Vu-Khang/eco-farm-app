import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { AnimalDistributionConfigurationStep } from "./components/AnimalDistributionConfigurationStep";
import { AnimalDistributionConfirmationStep } from "./components/AnimalDistributionConfirmationStep";
import { AnimalDistributionGpsStep } from "./components/AnimalDistributionGpsStep";
import { AnimalDistributionScopeStep } from "./components/AnimalDistributionScopeStep";
import {
  getSeedColor,
  useAnimalDistributionCreatePage,
} from "./hooks/useAnimalDistributionCreatePage";

const AnimalDistributionCreatePage = () => {
  const {
    scope,
    selectedRegionId,
    selectedAreaIds,
    selectedPlotIds,
    selectedSeedIds,
    distributionMethod,
    animalEntries,
    rowConfigs,
    animalLocations,
    selectedAnimalId,
    selectedRegion,
    selectedAreas,
    selectedPlots,
    availableVarieties,
    totalAnimals,
    setSelectedRegionId,
    setSelectedAnimalId,
    resetScopeSelections,
    resetAnimalDistributionMethod,
    toggleArea,
    togglePlot,
    toggleSeed,
    addAnimalEntry,
    updateAnimalEntry,
    removeAnimalEntry,
    addRowConfig,
    updateRowConfig,
    removeRowConfig,
    updateAnimalLocation,
    generateAnimalLocations,
    handleComplete,
    handleCancel,
    goToList,
  } = useAnimalDistributionCreatePage();

  const steps: Step[] = [
    {
      id: "scope",
      title: "Chọn phạm vi",
      description: "Xác định vùng/khu vực/lô",
      content: (
        <AnimalDistributionScopeStep
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
      description: "Thiết lập vật nuôi",
      content: (
        <AnimalDistributionConfigurationStep
          selectedSeedIds={selectedSeedIds}
          distributionMethod={distributionMethod}
          animalEntries={animalEntries}
          rowConfigs={rowConfigs}
          availableVarieties={availableVarieties}
          onToggleSeed={toggleSeed}
          onChangeMethod={resetAnimalDistributionMethod}
          onAddAnimalEntry={addAnimalEntry}
          onUpdateAnimalEntry={updateAnimalEntry}
          onRemoveAnimalEntry={removeAnimalEntry}
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
        <AnimalDistributionGpsStep
          distributionMethod={distributionMethod}
          animalEntries={animalEntries}
          rowConfigs={rowConfigs}
          animalLocations={animalLocations}
          selectedAnimalId={selectedAnimalId}
          getSeedColor={getSeedColor}
          setSelectedAnimalId={setSelectedAnimalId}
          updateAnimalLocation={updateAnimalLocation}
          generateAnimalLocations={generateAnimalLocations}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra thông tin",
      content: (
        <AnimalDistributionConfirmationStep
          scope={scope}
          distributionMethod={distributionMethod}
          selectedRegion={selectedRegion}
          selectedAreas={selectedAreas}
          selectedPlots={selectedPlots}
          animalEntries={animalEntries}
          rowConfigs={rowConfigs}
          animalLocations={animalLocations}
          totalAnimals={totalAnimals}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title="Tạo phân bổ vật nuôi"
      description="Thiết lập phân bổ vật nuôi cho vùng, khu vực hoặc lô đất"
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

export default AnimalDistributionCreatePage;
