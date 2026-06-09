import React from "react";
import {
  AdminLayout,
  Button,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import { ChevronLeft } from "lucide-react";
import { AreaInfoStep } from "./components/AreaInfoStep";
import { AreaMapStep } from "./components/AreaMapStep";
import { AreaPlotsStep } from "./components/AreaPlotsStep";
import { AreaReviewStep } from "./components/AreaReviewStep";
import { useAreaCreatePage } from "./hooks/useAreaCreatePage";

const AreaCreatePage = () => {
  const {
    setLocation,
    isEditMode,
    editAreaId,
    lands,
    terrains,
    enterprises,
    regions,
    selectEnterpriseId,
    setSelectEnterpriseId,
    selectedRegionId,
    setSelectedRegionId,
    formData,
    setFormData,
    areaPoints,
    areaMapCenter,
    plotMapCenter,
    currentRegion,
    activePointIndex,
    setActivePointIndex,
    areaPointWarnings,
    areaWarningForDisplay,
    activePersistentAreaWarning,
    isDraggingAreaPoint,
    setIsDraggingAreaPoint,
    plotPoints,
    setPlotPoints,
    editingPlot,
    setEditingPlot,
    activePlotPointIndex,
    setActivePlotPointIndex,
    plotPointWarnings,
    plotWarningForDisplay,
    activePersistentPlotWarning,
    isDraggingPlotPoint,
    setIsDraggingPlotPoint,
    customIcon,
    activeIcon,
    invalidIcon,
    formatLatLng,
    setAreaPointWithValidation,
    handlePointDrag,
    applySuggestedAreaPoint,
    removePoint,
    handlePointInputChange,
    handleAddPoint,
    setPlotPointWithValidation,
    handlePlotPointDrag,
    applySuggestedPlotPoint,
    handleAddPlotPoint,
    removePlotPoint,
    handlePlotPointInputChange,
    addPlot,
    savePlot,
    removePlot,
    handleSubmit,
  } = useAreaCreatePage();

  const steps: Step[] = [
    {
      id: "info",
      title: "Thông tin chung",
      description: "Chọn vùng và thông tin cơ bản",
      isValid: !!selectedRegionId && !!formData.code && !!formData.name,
      content: (
        <AreaInfoStep
          selectEnterpriseId={selectEnterpriseId}
          setSelectEnterpriseId={setSelectEnterpriseId}
          regions={regions}
          selectedRegionId={selectedRegionId}
          setSelectedRegionId={setSelectedRegionId}
          formData={formData}
          setFormData={setFormData}
          lands={lands}
          terrains={terrains}
        />
      ),
    },
    {
      id: "map",
      title: "Bản đồ khu vực",
      description: "Xác định vị trí khu vực",
      content: (
        <AreaMapStep
          areaMapCenter={areaMapCenter}
          selectedRegionId={selectedRegionId}
          regions={regions}
          currentRegion={currentRegion}
          isEditMode={Boolean(isEditMode)}
          editAreaId={editAreaId}
          areaPoints={areaPoints}
          activePointIndex={activePointIndex}
          areaPointWarnings={areaPointWarnings}
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
          setActivePointIndex={setActivePointIndex}
          setIsDraggingAreaPoint={setIsDraggingAreaPoint}
          setAreaPointWithValidation={setAreaPointWithValidation}
          handlePointDrag={handlePointDrag}
          areaWarningForDisplay={areaWarningForDisplay}
          activePersistentAreaWarning={activePersistentAreaWarning}
          isDraggingAreaPoint={isDraggingAreaPoint}
          formatLatLng={formatLatLng}
          applySuggestedAreaPoint={applySuggestedAreaPoint}
          removePoint={removePoint}
          handlePointInputChange={handlePointInputChange}
          handleAddPoint={handleAddPoint}
        />
      ),
    },
    {
      id: "plots",
      title: "Phân chia lô",
      description: "Tạo các lô trong khu vực",
      content: (
        <AreaPlotsStep
          plotMapCenter={plotMapCenter}
          areaPoints={areaPoints}
          formData={{ plots: formData.plots as any }}
          editingPlot={editingPlot}
          setEditingPlot={setEditingPlot}
          plotPoints={plotPoints}
          setPlotPoints={setPlotPoints}
          activePlotPointIndex={activePlotPointIndex}
          plotPointWarnings={plotPointWarnings}
          customIcon={customIcon}
          activeIcon={activeIcon}
          invalidIcon={invalidIcon}
          setActivePlotPointIndex={setActivePlotPointIndex}
          setIsDraggingPlotPoint={setIsDraggingPlotPoint}
          setPlotPointWithValidation={setPlotPointWithValidation}
          handlePlotPointDrag={handlePlotPointDrag}
          plotWarningForDisplay={plotWarningForDisplay}
          activePersistentPlotWarning={activePersistentPlotWarning}
          isDraggingPlotPoint={isDraggingPlotPoint}
          formatLatLng={formatLatLng}
          applySuggestedPlotPoint={applySuggestedPlotPoint}
          handlePlotPointInputChange={handlePlotPointInputChange}
          removePlotPoint={removePlotPoint}
          handleAddPlotPoint={handleAddPlotPoint}
          savePlot={savePlot}
          addPlot={addPlot}
          removePlot={removePlot}
        />
      ),
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại toàn bộ thông tin",
      content: (
        <AreaReviewStep
          enterprises={enterprises}
          selectEnterpriseId={selectEnterpriseId}
          regions={regions}
          selectedRegionId={selectedRegionId}
          formData={formData}
          lands={lands}
          terrains={terrains}
          areaPoints={areaPoints}
        />
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEditMode ? "Cập nhật khu vực" : "Thêm mới khu vực"}
      description={
        isEditMode
          ? "Chỉnh sửa thông tin khu vực"
          : "Tạo khu vực mới theo quy trình từng bước"
      }
      actions={
        <Button
          variant="outline"
          onClick={() => setLocation("/area-distribution")}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Quay lại
        </Button>
      }
    >
      <div className="max-w-5xl mx-auto pb-10">
        <StepperForm
          steps={steps}
          onComplete={handleSubmit}
          onCancel={() => setLocation("/area-distribution")}
          completeLabel={isEditMode ? "Lưu thay đổi" : "Tạo khu vực"}
        />
      </div>
    </AdminLayout>
  );
};

export default AreaCreatePage;
