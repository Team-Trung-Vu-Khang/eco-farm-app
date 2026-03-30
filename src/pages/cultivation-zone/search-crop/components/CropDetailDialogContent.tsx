import { Tabs, TabsList, TabsTrigger } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import "leaflet/dist/leaflet.css";
import type { CropDetail } from "../../constants";
import { useCropDetailDialogContent } from "../hooks/useCropDetailDialogContent";
import TaskDetailDialog from "../../../task/components/TaskDetailDialog";
import { CropDetailCertificatesTab } from "./crop-detail/CropDetailCertificatesTab";
import { CropDetailCropsTab } from "./crop-detail/CropDetailCropsTab";
import { CropDetailNotFoundState } from "./crop-detail/CropDetailNotFoundState";
import { CropDetailOverviewTab } from "./crop-detail/CropDetailOverviewTab";
import { CropDetailPlansTab } from "./crop-detail/CropDetailPlansTab";
import { CropDetailStaffTab } from "./crop-detail/CropDetailStaffTab";
import { CropDetailStatisticsTab } from "./crop-detail/CropDetailStatisticsTab";

type CropDetailDialogContentProps = {
  id?: string;
  crop?: CropDetail;
};

export const CropDetailDialogContent = ({
  id,
  crop,
}: CropDetailDialogContentProps) => {
  const {
    handleBack,
    navigateToPlans,
    activeCrop,
    area,
    details,
    cropGeoRefs,
    scopedGroupedSelections,
    scopedSelectionCount,
    scopeMapData,
    scopeMapBounds,
    isScopeMapExpanded,
    setIsScopeMapExpanded,
    focusScopeMapToCoordinates,
    formatFullAddress,
    cropMarkerIcon,
    regionIndex,
    scopeMapRef,
    expandedScopeMapRef,
    filteredTechnicalCrops,
    groupedCrops,
    personnel,
    selectedStaffId,
    setSelectedStaffId,
    growthCycles,
    baseRelevantPlans,
    relevantPlans,
    planFilter,
    setPlanFilter,
    incurredTasks,
    regions,
    selectedTask,
    isTaskDetailOpen,
    setIsTaskDetailOpen,
    openTaskDetail,
  } = useCropDetailDialogContent({ id, crop });

  if (!activeCrop) {
    return (
      <CropDetailNotFoundState
        icon="crop"
        title="Không tìm thấy dữ liệu cây trồng"
        onBack={handleBack}
      />
    );
  }

  if (!area || !details) {
    return (
      <CropDetailNotFoundState
        icon="scope"
        title="Không tìm thấy dữ liệu vùng canh tác cho cây"
        onBack={handleBack}
      />
    );
  }

  return (
    <Tabs defaultValue="overview" className="mt-6 space-y-6">
      <TabsList className="grid w-full grid-cols-7 overflow-x-auto">
        <TabsTrigger value="overview">Thông tin</TabsTrigger>
        <TabsTrigger value="crops">Cây trồng</TabsTrigger>
        <TabsTrigger value="staff">Nhân viên</TabsTrigger>
        <TabsTrigger value="certificates">Chứng nhận</TabsTrigger>
        <TabsTrigger value="plans">Kế hoạch & Công việc</TabsTrigger>
        <TabsTrigger value="statistics">Thống kê</TabsTrigger>
      </TabsList>

      <CropDetailOverviewTab
        activeCrop={activeCrop}
        area={area}
        details={details}
        cropGeoRefs={cropGeoRefs}
        scopedGroupedSelections={scopedGroupedSelections}
        scopedSelectionCount={scopedSelectionCount}
        scopeMapData={scopeMapData}
        scopeMapBounds={scopeMapBounds}
        isScopeMapExpanded={isScopeMapExpanded}
        setIsScopeMapExpanded={setIsScopeMapExpanded}
        focusScopeMapToCoordinates={focusScopeMapToCoordinates}
        formatFullAddress={formatFullAddress}
        cropMarkerIcon={cropMarkerIcon}
        regionIndex={regionIndex}
        scopeMapRef={scopeMapRef}
        expandedScopeMapRef={expandedScopeMapRef}
      />

      <CropDetailCropsTab
        details={details}
        filteredTechnicalCrops={filteredTechnicalCrops}
        groupedCrops={groupedCrops}
      />

      <CropDetailStaffTab
        details={details}
        personnel={personnel}
        selectedStaffId={selectedStaffId}
        setSelectedStaffId={setSelectedStaffId}
      />

      <CropDetailCertificatesTab details={details} />

      <CropDetailPlansTab
        baseRelevantPlans={baseRelevantPlans}
        relevantPlans={relevantPlans}
        planFilter={planFilter}
        setPlanFilter={setPlanFilter}
        incurredTasks={incurredTasks}
        regions={regions}
        growthCycles={growthCycles}
        onNavigateToPlans={navigateToPlans}
        onOpenTask={openTaskDetail}
      />

      <CropDetailStatisticsTab details={details} />

      <TaskDetailDialog
        open={isTaskDetailOpen}
        onOpenChange={setIsTaskDetailOpen}
        task={selectedTask}
      />
    </Tabs>
  );
};
