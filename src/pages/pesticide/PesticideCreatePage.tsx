import {
  AdminLayout,
  StepperForm,
  Button,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import PesticideSubmitConfirmDialog from "./components/PesticideSubmitConfirmDialog";
import { usePesticideCreatePage } from "./hooks/usePesticideCreatePage";

const PesticideCreatePage = () => {
  const {
    isEdit,
    formData,
    confirmOpen,
    setConfirmOpen,
    steps,
    goBack,
    handleComplete,
    handleConfirmSubmit,
  } = usePesticideCreatePage();

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Cập nhật thuốc BVTV" : "Thêm thuốc bảo vệ thực vật"}
      description={
        isEdit
          ? `Chỉnh sửa thông tin cho ${formData.name}`
          : "Khai báo thông tin thuốc trừ sâu, bệnh mới"
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

      <div className="bg-white/50 backdrop-blur-xs rounded-xl">
        <StepperForm
          steps={steps}
          completeLabel={isEdit ? "Lưu thay đổi" : "Hoàn tất & Lưu"}
          onComplete={handleComplete}
          onCancel={goBack}
        />
      </div>

      <PesticideSubmitConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        isEdit={isEdit}
        formData={formData}
        onConfirm={handleConfirmSubmit}
      />
    </AdminLayout>
  );
};

export default PesticideCreatePage;
