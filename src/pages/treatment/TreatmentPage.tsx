import PageWrapper from "@/components/PageWrapper";
import { Button, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Bug, Plus } from "lucide-react";
import { useLocation } from "wouter";
import { MaterialDetailModal } from "./components/MaterialDetailModal";
import { TreatmentDetail } from "./components/TreatmentDetail";
import { TreatmentSeverityStats } from "./components/TreatmentSeverityStats";
import { TreatmentSidebar } from "./components/TreatmentSidebar";
import { useTreatmentPage } from "./hooks/useTreatmentPage";

export default function TreatmentPage() {
  const [, setLocation] = useLocation();
  const {
    filteredData,
    selectedId,
    setSelectedId,
    selectedTreatment,
    deleteOpen,
    setDeleteOpen,
    searchFilters,
    setSearchFilters,
    materialModalOpen,
    setMaterialModalOpen,
    selectedMaterial,
    severityCounts,
    severityConfig,
    handleEdit,
    handleDelete,
    handleDuplicate,
    handleConfirmDelete,
    handleViewMaterial,
    handleResetFilters,
  } = useTreatmentPage();

  return (
    <PageWrapper
      title="Phác đồ điều trị"
      description="Hệ thống quản lý quy trình kỹ thuật & sâu bệnh"
      actions={
        <Button
          onClick={() => setLocation("/treatment/create")}
          className="bg-green-600 hover:bg-green-700 shadow-sm"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm phác đồ mới
        </Button>
      }
    >
      <div className="space-y-6">
        <TreatmentSeverityStats
          severityConfig={severityConfig}
          severityCounts={severityCounts}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
          <TreatmentSidebar
            filteredData={filteredData}
            searchFilters={searchFilters}
            setSearchFilters={setSearchFilters}
            selectedId={selectedId}
            onSelect={setSelectedId}
            severityConfig={severityConfig}
            onResetFilters={handleResetFilters}
          />

          <div className="lg:col-span-9 h-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white">
            {selectedTreatment ? (
              <TreatmentDetail
                treatment={selectedTreatment}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onDuplicate={handleDuplicate}
                onViewMaterial={handleViewMaterial}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-gray-50/30 text-gray-400">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100">
                  <Bug className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">
                  Chưa chọn phác đồ
                </h3>
                <p>Vui lòng chọn một phác đồ từ danh sách bên trái</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />

      <MaterialDetailModal
        material={selectedMaterial}
        open={materialModalOpen}
        onOpenChange={setMaterialModalOpen}
      />
    </PageWrapper>
  );
}
