import { AdminLayout, Button, DeleteDialog } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Plus } from "lucide-react";
import { SoilTreatmentPlanDetail } from "./components/SoilTreatmentPlanDetail";
import { SoilTreatmentPlanFormDialog } from "./components/SoilTreatmentPlanFormDialog";
import { SoilTreatmentSidebar } from "./components/SoilTreatmentSidebar";
import { SoilTreatmentStats } from "./components/SoilTreatmentStats";
import { useSoilAmendmentTreatmentPage } from "./hooks/useSoilAmendmentTreatmentPage";

export default function SoilAmendmentTreatmentPage() {
  const {
    deleteOpen,
    editingItem,
    filteredData,
    filterIntensity,
    filterStatus,
    formData,
    formOpen,
    handleConfirmDelete,
    handleCreate,
    handleDelete,
    handleEdit,
    handleSubmit,
    searchKeyword,
    selectedId,
    selectedPlan,
    setDeleteOpen,
    setFilterIntensity,
    setFilterStatus,
    setFormData,
    setFormOpen,
    setSearchKeyword,
    setSelectedId,
    stats,
  } = useSoilAmendmentTreatmentPage();

  return (
    <AdminLayout
      title="Phác đồ cải tạo đất"
      description="Hệ thống quản lý phác đồ, phương pháp và quy trình cải tạo đất"
      actions={
        <Button
          onClick={handleCreate}
          className="bg-green-600 shadow-sm hover:bg-green-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Thêm phác đồ mới
        </Button>
      }
    >
      <div className="space-y-6">
        <SoilTreatmentStats stats={stats} />

        <div className="grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
          <SoilTreatmentSidebar
            filterIntensity={filterIntensity}
            filterStatus={filterStatus}
            filteredData={filteredData}
            searchKeyword={searchKeyword}
            selectedId={selectedPlan?.id ?? selectedId}
            setFilterIntensity={setFilterIntensity}
            setFilterStatus={setFilterStatus}
            setSearchKeyword={setSearchKeyword}
            setSelectedId={setSelectedId}
          />

          <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-9">
            <SoilTreatmentPlanDetail
              onDelete={handleDelete}
              onEdit={handleEdit}
              selectedPlan={selectedPlan}
            />
          </div>
        </div>
      </div>

      <SoilTreatmentPlanFormDialog
        formData={formData}
        onOpenChange={setFormOpen}
        onSubmit={handleSubmit}
        open={formOpen}
        selectedItem={editingItem}
        setFormData={setFormData}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
      />
    </AdminLayout>
  );
}
