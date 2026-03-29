import {
  AdminLayout,
  Button,
  Card,
  CardContent,
  StepperForm,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useLocation } from "wouter";
import useRegionStore from "../../../stores/useRegionStore";
import { CultivationRegionCreateConfigurationStep } from "./components/CultivationRegionCreateConfigurationStep";
import { CultivationRegionCreateConfirmationStep } from "./components/CultivationRegionCreateConfirmationStep";
import { CultivationRegionCreateGeneralInfoStep } from "./components/CultivationRegionCreateGeneralInfoStep";
import { useCultivationRegionCreatePage } from "./hooks/useCultivationRegionCreatePage";

const CultivationRegionCreatePage = () => {
  const [, setLocation] = useLocation();
  const { regions } = useRegionStore();
  const {
    varieties,
    farmingMethods,
    irrigationSystems,
    seeds,
    selectedRegion,
    selectedManagers,
    selectedCerts,
    seedDialogOpen,
    setSeedDialogOpen,
    activeSeedVariety,
    applyToAllDialogOpen,
    setApplyToAllDialogOpen,
    name,
    setName,
    note,
    setNote,
    selectedEnterpriseId,
    handleSelectEnterprise,
    selections,
    setSelections,
    selectedCertIds,
    toggleCertificate,
    selectedManagerIds,
    setSelectedManagerIds,
    cropSearchTerm,
    setCropSearchTerm,
    entities,
    commonConfig,
    availableCrops,
    updateCommonConfig,
    toggleCropSelection,
    handleSeedSelection,
    applyConfigToAll,
    handleComplete,
    handleCancel,
  } = useCultivationRegionCreatePage();

  const steps = [
    {
      id: "step-1",
      title: "Thông tin chung",
      content: (
        <CultivationRegionCreateGeneralInfoStep
          name={name}
          note={note}
          selectedEnterpriseId={selectedEnterpriseId}
          selections={selections}
          selectedCertIds={selectedCertIds}
          selectedManagerIds={selectedManagerIds}
          selectedRegion={selectedRegion}
          regions={regions}
          setName={setName}
          setNote={setNote}
          onSelectEnterprise={handleSelectEnterprise}
          onConfirmSelections={setSelections}
          onToggleCertificate={toggleCertificate}
          onSelectManagers={setSelectedManagerIds}
        />
      ),
    },
    {
      id: "step-2",
      title: "Cấu hình canh tác",
      content: (
        <CultivationRegionCreateConfigurationStep
          entitiesCount={entities.length}
          commonConfig={commonConfig}
          availableCrops={availableCrops}
          cropSearchTerm={cropSearchTerm}
          farmingMethods={farmingMethods}
          irrigationSystems={irrigationSystems}
          seeds={seeds}
          seedDialogOpen={seedDialogOpen}
          activeSeedVariety={activeSeedVariety}
          applyToAllDialogOpen={applyToAllDialogOpen}
          setSeedDialogOpen={setSeedDialogOpen}
          setApplyToAllDialogOpen={setApplyToAllDialogOpen}
          setCropSearchTerm={setCropSearchTerm}
          onUpdateConfig={updateCommonConfig}
          onToggleCrop={toggleCropSelection}
          onSelectSeeds={handleSeedSelection}
          onApplyToAll={applyConfigToAll}
        />
      ),
    },
    {
      id: "step-3",
      title: "Xác nhận & Lưu",
      content: (
        <CultivationRegionCreateConfirmationStep
          name={name}
          note={note}
          entities={entities}
          selectedManagers={selectedManagers}
          selectedCerts={selectedCerts}
          commonConfig={commonConfig}
          farmingMethods={farmingMethods}
          irrigationSystems={irrigationSystems}
          varieties={varieties}
          seeds={seeds}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      title="Thiết lập vùng canh tác"
      description="Quy trình khởi tạo và cấu hình tiêu chuẩn cho đơn vị canh tác"
    >
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/cultivation-region")}
          className="gap-2 text-muted-foreground hover:text-primary pl-0"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <Card className="max-w-6xl mx-auto border-none shadow-xl bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden ring-1 ring-slate-900/5">
        <CardContent className="p-0">
          <div className="p-6 md:p-8">
            <StepperForm
              steps={steps}
              completeLabel="Khởi tạo Vùng canh tác"
              onComplete={handleComplete}
              onCancel={handleCancel}
            />
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  );
};

export default CultivationRegionCreatePage;
