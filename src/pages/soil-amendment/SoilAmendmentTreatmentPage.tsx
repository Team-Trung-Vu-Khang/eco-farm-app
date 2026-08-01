import PageWrapper from "@/components/PageWrapper";
import {
  Button,
  Card,
  CardContent,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Plus, Sprout } from "lucide-react";
import { useState } from "react";
import { SoilTreatmentPlanDetail } from "./components/SoilTreatmentPlanDetail";
import { SoilTreatmentPlanFormDialog } from "./components/SoilTreatmentPlanFormDialog";
import { SoilTreatmentSidebar } from "./components/SoilTreatmentSidebar";
import { SoilTreatmentStats } from "./components/SoilTreatmentStats";
import { useSoilAmendmentTreatmentPage } from "./hooks/useSoilAmendmentTreatmentPage";

export default function SoilAmendmentTreatmentPage() {
  const [screen, setScreen] = useState<"list" | "form">("list");

  const {
    deleteOpen,
    editingItem,
    filteredData,
    filterIntensity,
    filterStatus,
    formData,
    handleConfirmDelete,
    handleCreate,
    handleDelete,
    handleDuplicate,
    handleEdit,
    handleResetFilters,
    handleSubmit,
    searchKeyword,
    selectedId,
    selectedPlan,
    setDeleteOpen,
    setFilterIntensity,
    setFilterStatus,
    setFormData,
    setSearchKeyword,
    setSelectedId,
    stats,
  } = useSoilAmendmentTreatmentPage();

  const handleCreatePage = () => {
    handleCreate();
    setScreen("form");
  };

  const handleEditPage = (item = selectedPlan) => {
    if (!item) {
      return;
    }

    handleEdit(item);
    setScreen("form");
  };

  const handleSubmitPage = () => {
    handleSubmit();
    setScreen("list");
  };

  const handleBackToList = () => {
    setScreen("list");
  };

  return (
    <PageWrapper
      title="Cải tạo đất"
      description="Hệ thống quản lý phác đồ cải tạo đất với luồng tra cứu, handbook và dữ liệu kỹ thuật theo hiện trạng đất."
      actions={
        screen === "list" ? (
          <Button
            onClick={handleCreatePage}
            className="bg-green-600 shadow-sm hover:bg-green-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Thêm phác đồ mới
          </Button>
        ) : (
          <Button
            variant="outline"
            className="bg-white"
            onClick={handleBackToList}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        )
      }
    >
      {screen === "list" ? (
        <div className="space-y-6">
          <SoilTreatmentStats stats={stats} />

          <div className="grid grid-cols-1 gap-6 overflow-hidden lg:grid-cols-12">
            <SoilTreatmentSidebar
              filterIntensity={filterIntensity}
              filterStatus={filterStatus}
              filteredData={filteredData}
              onResetFilters={handleResetFilters}
              searchKeyword={searchKeyword}
              selectedId={selectedId}
              setFilterIntensity={setFilterIntensity}
              setFilterStatus={setFilterStatus}
              setSearchKeyword={setSearchKeyword}
              setSelectedId={setSelectedId}
            />

            <div className="h-full overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm lg:col-span-9">
              {selectedPlan ? (
                <SoilTreatmentPlanDetail
                  onDelete={handleDelete}
                  onDuplicate={handleDuplicate}
                  onEdit={handleEditPage}
                  selectedPlan={selectedPlan}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gray-50/30 text-gray-400">
                  <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm">
                    <Sprout className="h-12 w-12 text-gray-300" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium text-gray-600">
                    Chưa chọn phác đồ
                  </h3>
                  <p>Vui lòng chọn một phác đồ từ danh sách bên trái</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Card className="border-slate-200 shadow-sm">
          <CardContent className="p-6">
            <div className="mb-6">
              <p className="text-sm font-medium text-emerald-700">
                {editingItem ? "Chế độ chỉnh sửa" : "Tạo mới phác đồ"}
              </p>
              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Wizard khai báo phác đồ cải tạo đất
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Điền lần lượt theo từng bước để hoàn thiện hồ sơ master data.
              </p>
            </div>

            <SoilTreatmentPlanFormDialog
              embedded
              formData={formData}
              onCancel={handleBackToList}
              onOpenChange={() => undefined}
              onSubmit={handleSubmitPage}
              open
              selectedItem={editingItem}
              setFormData={setFormData}
            />
          </CardContent>
        </Card>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        title="Xóa phác đồ"
        description="Bạn có chắc chắn muốn xóa phác đồ master data này?"
      />
    </PageWrapper>
  );
}
