import { useMemo, useState } from "react";
import {
  AdminLayout,
  Badge,
  Button,
  Card,
  CardContent,
  DataTable,
  DeleteDialog,
  type Column,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ArrowLeft, Plus } from "lucide-react";
import { SoilTreatmentPlanDetail } from "./components/SoilTreatmentPlanDetail";
import { SoilTreatmentPlanFormDialog } from "./components/SoilTreatmentPlanFormDialog";
import { SoilTreatmentStats } from "./components/SoilTreatmentStats";
import {
  responsibleUnitOptions,
  targetSeverityOptions,
  treatmentPlanIntensityOptions,
} from "./data/soilAmendmentTreatmentData";
import { useSoilAmendmentTreatmentPage } from "./hooks/useSoilAmendmentTreatmentPage";
import type { TreatmentPlan } from "./types/treatment";

function getOptionLabel(
  options: ReadonlyArray<{ label: string; value: string }>,
  value?: string,
) {
  return options.find((item) => item.value === value)?.label || "Chưa cập nhật";
}

export default function SoilAmendmentTreatmentPage() {
  const [screen, setScreen] = useState<"list" | "form" | "detail">("list");

  const {
    deleteOpen,
    editingItem,
    filteredData,
    formData,
    handleConfirmDelete,
    handleCreate,
    handleDelete,
    handleEdit,
    handleSubmit,
    selectedPlan,
    setDeleteOpen,
    setFormData,
    setSelectedId,
    stats,
  } = useSoilAmendmentTreatmentPage();

  const columns = useMemo<Column<TreatmentPlan>[]>(
    () => [
      {
        key: "code",
        label: "Mã",
        render: (value) => (
          <span className="font-mono text-xs font-medium text-slate-500">
            {value}
          </span>
        ),
      },
      {
        key: "name",
        label: "Tên phác đồ",
        render: (value, item) => (
          <div className="max-w-[320px]">
            <p className="font-medium text-slate-900 truncate">{value}</p>
            <p className="line-clamp-2 text-xs text-slate-500">
              {item.soilIssue}
            </p>
          </div>
        ),
      },
      {
        key: "zone",
        label: "Khu vực",
      },
      {
        key: "responsibleUnit",
        label: "Đơn vị phụ trách",
        render: (value) => (
          <span className="text-sm text-slate-700">
            {getOptionLabel(responsibleUnitOptions, String(value || ""))}
          </span>
        ),
      },
      {
        key: "targetSeverity",
        label: "Mức độ mục tiêu",
        render: (value) => (
          <Badge variant="outline" className="rounded-full">
            {getOptionLabel(targetSeverityOptions, String(value || ""))}
          </Badge>
        ),
      },
      {
        key: "intensity",
        label: "Cường độ",
        render: (value) => (
          <Badge variant="secondary" className="rounded-full">
            {getOptionLabel(treatmentPlanIntensityOptions, String(value || ""))}
          </Badge>
        ),
      },
      {
        key: "duration",
        label: "Thời lượng",
      },
    ],
    [],
  );

  const tableFilters = useMemo(
    () => [
      {
        key: "status",
        label: "Trạng thái",
        options: [
          { label: "Lên kế hoạch", value: "planning" },
          { label: "Đang triển khai", value: "in_progress" },
          { label: "Hoàn tất", value: "completed" },
          { label: "Ngưng", value: "cancelled" },
        ],
      },
      {
        key: "intensity",
        label: "Cường độ",
        options: treatmentPlanIntensityOptions.map((option) => ({ ...option })),
      },
      {
        key: "targetSeverity",
        label: "Mức độ mục tiêu",
        options: targetSeverityOptions.map((option) => ({ ...option })),
      },
    ],
    [],
  );

  const handleViewDetail = (item: TreatmentPlan) => {
    setSelectedId(item.id);
    setScreen("detail");
  };

  const handleCreatePage = () => {
    handleCreate();
    setScreen("form");
  };

  const handleEditPage = (item: TreatmentPlan) => {
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

  const handleConfirmDeletePage = () => {
    handleConfirmDelete();
    setScreen("list");
  };

  return (
    <AdminLayout
      title="Cải tạo đất"
      description="Danh mục phác đồ master data với bảng danh sách, wizard tạo mới và detail dạng handbook cho đội kỹ thuật."
      actions={
        screen === "list" ? (
          <Button
            onClick={handleCreatePage}
            className="bg-emerald-600 shadow-sm hover:bg-emerald-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tạo phác đồ
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
      {screen === "list" && (
        <div className="space-y-6">
          <SoilTreatmentStats stats={stats} />

          <DataTable
            columns={columns}
            data={filteredData}
            filters={tableFilters}
            onDelete={handleDelete}
            onEdit={handleEditPage}
            onView={handleViewDetail}
            searchPlaceholder="Tìm theo mã, tên phác đồ, tình trạng đất..."
          />
        </div>
      )}

      {screen === "form" && (
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

      {screen === "detail" && (
        <div>
          <SoilTreatmentPlanDetail
            onDelete={handleDelete}
            onEdit={handleEditPage}
            selectedPlan={selectedPlan}
          />
        </div>
      )}

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDeletePage}
        title="Xóa phác đồ"
        description="Bạn có chắc chắn muốn xóa phác đồ master data này?"
      />
    </AdminLayout>
  );
}
