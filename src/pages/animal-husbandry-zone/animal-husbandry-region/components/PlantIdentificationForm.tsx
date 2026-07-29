/* eslint-disable @typescript-eslint/no-explicit-any */
import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { type Plant } from "../../../region-chart/constants";
import { ImportPlantDialog } from "./ImportPlantDialog";
import { Step1GeographicalSelection } from "./Step1GeographicalSelection";
import { Step2PlantEntry } from "./Step2PlantEntry";
import { Step3Confirmation } from "./Step3Confirmation";
import { usePlantIdentificationForm } from "../../animal-identification/hooks/useAnimalIdentificationForm";

interface PlantIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const PlantIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
  loading = false,
}: PlantIdentificationFormProps) => {
  const [, setLocation] = useLocation();

  const {
    isImportOpen,
    setIsImportOpen,
    cultivationRegionId,
    selectedScopeIds,
    plants,
    setCultivationRegionId,
    setSelectedScopeIds,
    setPlants,
    addPlant,
    removePlant,
    updatePlant,
    handleComplete,
    handleImport,
    selectedCultivationRegion,
    geographicalUnits,
    scopedGeographicalUnits,
    managers,
    farmingMethod,
    irrigationMethod,
    selectedCropsData,
    filteredCultivationRegions,
    areasByRegion,
    plotsByArea,
  } = usePlantIdentificationForm({ initialData, initialList, onSubmit });

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn vùng chăn nuôi",
      description: "Chọn vùng chăn nuôi và phạm vi định danh",
      isValid: !!(cultivationRegionId && selectedScopeIds.length > 0),
      content: (
        <Step1GeographicalSelection
          cultivationRegionId={cultivationRegionId}
          setCultivationRegionId={setCultivationRegionId}
          filteredCultivationRegions={filteredCultivationRegions}
          selectedCultivationRegion={selectedCultivationRegion}
          geographicalUnits={geographicalUnits}
          selectedScopeIds={selectedScopeIds}
          onScopeChange={setSelectedScopeIds}
          manager={managers}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
          selectedCropsData={selectedCropsData}
          setPlants={setPlants}
          areasByRegion={areasByRegion}
          plotsByArea={plotsByArea}
        />
      ),
    },
    {
      id: "plants",
      title: "Thông tin cá thể",
      description: "Thêm từng cá thể, chọn vị trí và điền thông tin",
      isValid:
        plants.length > 0 &&
        plants.every((p) => p.plotId && !p.isInvalidBoundary),
      content: (
        <Step2PlantEntry
          plants={plants as any}
          addPlant={addPlant}
          removePlant={removePlant}
          updatePlant={updatePlant}
          scopedGeographicalUnits={scopedGeographicalUnits}
          initialData={initialData}
          isImportOpen={isImportOpen}
          setIsImportOpen={setIsImportOpen}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin trước khi lưu",
      isValid: true,
      content: (
        <Step3Confirmation
          plants={plants as any}
          initialData={initialData}
          selectedCultivationRegion={selectedCultivationRegion}
          geographicalUnits={geographicalUnits}
          manager={managers}
          farmingMethod={farmingMethod}
          irrigationMethod={irrigationMethod}
          selectedCropsData={selectedCropsData}
        />
      ),
    },
  ];

  return (
    <>
      <StepperForm
        steps={steps}
        onComplete={handleComplete}
        onCancel={() => setLocation("/animal-identification")}
        completeLabel={initialData ? "Cập nhật cá thể" : "Lưu cá thể"}
        loading={loading}
      />
      <ImportPlantDialog
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImport}
      />
    </>
  );
};

export default PlantIdentificationForm;
