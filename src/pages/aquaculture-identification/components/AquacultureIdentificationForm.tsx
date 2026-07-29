/* eslint-disable @typescript-eslint/no-explicit-any */
import { Step3Confirmation } from "@/pages/aquaculture-region/components/AquacultureConfirmationStep";
import { Step1GeographicalSelection } from "@/pages/aquaculture-region/components/AquacultureGeographicalSelection";
import { ImportPlantDialog } from "@/pages/aquaculture-region/components/ImportAquacultureDialog";
import { Step2PlantEntry } from "@/pages/aquaculture-region/components/Step2AquacultureEntry";
import { type Plant } from "@/pages/region-chart/constants";
import { StepperForm, type Step } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useLocation } from "wouter";
import { useAquacultureIdentificationForm } from "../hooks/useAquacultureIdentificationForm";

interface AquacultureIdentificationFormProps {
  initialData?: Partial<Plant>;
  initialList?: Partial<Plant>[];
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const AquacultureIdentificationForm = ({
  initialData,
  initialList,
  onSubmit,
  loading = false,
}: AquacultureIdentificationFormProps) => {
  const [, setLocation] = useLocation();

  const {
    isImportOpen,
    setIsImportOpen,
    cultivationRegionId,
    selectedScopeIds,
    plants,
    setCultivationRegionId,
    setSelectedScopeIds,
    addPlant,
    removePlant,
    updatePlant,
    handleComplete,
    handleImport,
    selectedCultivationRegion,
    geographicalUnits,
    filteredCultivationRegions,
    managers,
    farmingMethod,
    irrigationMethod,
    selectedCropsData,
    areasByRegion,
    plotsByArea,
  } = useAquacultureIdentificationForm({
    initialData,
    initialList,
    onSubmit,
  });

  const steps: Step[] = [
    {
      id: "selection",
      title: "Chọn vùng nuôi trồng",
      description: "Chọn vùng nuôi trồng và phạm vi định danh",
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
          areasByRegion={areasByRegion}
          plotsByArea={plotsByArea}
        />
      ),
    },
    {
      id: "plants",
      title: "Thông tin đối tượng nuôi",
      description: "Thêm từng đối tượng nuôi và điền thông tin cơ bản",
      isValid: plants.length > 0,
      content: (
        <Step2PlantEntry
          plants={plants as any}
          addPlant={addPlant}
          removePlant={removePlant}
          updatePlant={updatePlant}
          initialData={initialData}
          isImportOpen={isImportOpen}
          setIsImportOpen={setIsImportOpen}
        />
      ),
    },
    {
      id: "confirm",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin nuôi trồng trước khi lưu",
      isValid: true,
      content: (
        <Step3Confirmation
          plants={plants as any}
          initialData={initialData}
          selectedCultivationRegion={selectedCultivationRegion}
          selectedScopeIds={selectedScopeIds}
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
        onCancel={() => setLocation("/aquaculture-identification")}
        completeLabel={initialData ? "Cập nhật thủy sản" : "Lưu thủy sản"}
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

export default AquacultureIdentificationForm;
