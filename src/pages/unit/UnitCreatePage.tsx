import { ChevronLeft, Save } from "lucide-react";
import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { UnitBasicInfoCard } from "./components/UnitBasicInfoCard";
import { UnitConfirmDialog } from "./components/UnitConfirmDialog";
import { UnitConversionCard } from "./components/UnitConversionCard";
import { useUnitFormPage } from "./hooks/useUnitFormPage";

const UnitCreatePage = () => {
  const {
    isEdit,
    formData,
    selectedStandard,
    selectedStandardLabel,
    unitTypeLabel,
    standardOptions,
    confirmOpen,
    setConfirmOpen,
    updateField,
    setSelectedStandard,
    handleSubmit,
    handleConfirmSubmit,
    goBack,
  } = useUnitFormPage();

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Cập nhật đơn vị tính" : "Thêm mới đơn vị tính"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin ${formData.name}`
          : "Định nghĩa đơn vị tính và quy tắc quy đổi"
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="w-4 h-4" />
          Quay lại danh sách
        </Button>
      </div>

      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <UnitBasicInfoCard formData={formData} updateField={updateField} />

            <UnitConversionCard
              unitName={formData.name}
              conversionFactor={formData.conversionFactor}
              selectedStandard={selectedStandard}
              selectedStandardLabel={selectedStandardLabel}
              standardOptions={standardOptions}
              onSelectStandard={setSelectedStandard}
              onChangeFactor={(value) => updateField("conversionFactor", value)}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={goBack}>
                Hủy bỏ
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                {isEdit ? "Lưu thay đổi" : "Lưu lại"}
              </Button>
            </div>
          </div>
        </form>
      </div>

      <UnitConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isEdit={isEdit}
        formData={formData}
        unitTypeLabel={unitTypeLabel}
        selectedStandardLabel={selectedStandardLabel}
        onConfirm={handleConfirmSubmit}
      />
    </AdminLayout>
  );
};

export default UnitCreatePage;
