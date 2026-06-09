import {
  AdminLayout,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Avatar,
  AvatarFallback,
  Badge,
  Card,
  CardContent,
  StepperForm,
  type Step,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { Building2, CheckCircle2, MapPin, Sparkles } from "lucide-react";
import { useEnterpriseCertificateStepperForm } from "./hooks/useEnterpriseCertificateStepperForm";
import { CertificateBasicInfoFields } from "./components/CertificateBasicInfoFields";
import { CertificateContentFields } from "./components/CertificateContentFields";
import { CertificateEntitySelection } from "./components/CertificateEntitySelection";
import { CertificateTimedFields } from "./components/CertificateTimedFields";

export default function EnterpriseCertificateFormPage() {
  const {
    isEdit,
    editItem,
    formData,
    setFormData,
    standards,
    enterprises,
    areas,
    availableOrganizations,
    selectedEnterpriseId,
    showConfirmDialog,
    setShowConfirmDialog,
    editorContentRef,
    handleStandardTypeChange,
    handleEnterpriseSelect,
    handleAreaSelect,
    handleComplete,
    submitForm,
    handleCancel,
  } = useEnterpriseCertificateStepperForm();

  const entityAvatarClass =
    formData.entityType === "area"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-primary/10 text-primary";

  const steps: Step[] = [
    {
      id: "basic",
      title: "Thông tin cơ bản",
      description: "Mã, tên và tiêu chuẩn",
      content: (
        <CertificateBasicInfoFields
          formData={formData}
          setFormData={setFormData}
          standards={standards}
          availableOrganizations={availableOrganizations}
          onStandardTypeChange={handleStandardTypeChange}
        />
      ),
      isValid:
        formData.code.trim().length > 0 &&
        formData.name.trim().length > 0 &&
        formData.standardType.trim().length > 0 &&
        formData.organization.trim().length > 0,
    },
    {
      id: "timing",
      title: "Thời hạn",
      description: "Ngày cấp và ngày hết hạn",
      content: (
        <CertificateTimedFields formData={formData} setFormData={setFormData} />
      ),
      isValid:
        formData.issuedDate.trim().length > 0 &&
        formData.expiryDate.trim().length > 0,
    },
    {
      id: "entity",
      title: "Đối tượng",
      description: "Doanh nghiệp hoặc vùng trồng",
      content: (
        <CertificateEntitySelection
          formData={formData}
          setFormData={setFormData}
          enterprises={enterprises}
          areas={areas}
          selectedEnterpriseId={selectedEnterpriseId}
          onEnterpriseSelect={handleEnterpriseSelect}
          onAreaSelect={handleAreaSelect}
        />
      ),
      isValid:
        formData.entityName.trim().length > 0 &&
        formData.entityId.trim().length > 0,
    },
    {
      id: "content",
      title: "Nội dung",
      description: "Soạn thảo hoặc file đính kèm",
      content: (
        <CertificateContentFields
          formData={formData}
          setFormData={setFormData}
          editorContentRef={editorContentRef}
        />
      ),
      isValid: formData.content.trim().length > 0,
    },
    {
      id: "review",
      title: "Xác nhận",
      description: "Kiểm tra lại trước khi lưu",
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-primary">Hồ sơ xem lại</p>
            </div>
            <h3 className="text-2xl font-semibold text-slate-900">
              {isEdit ? "Chỉnh sửa chứng nhận" : "Tạo mới chứng nhận"}
            </h3>
            <p className="max-w-2xl text-sm text-slate-500">
              Đây là bản nháp cuối cùng trước khi lưu. Hãy rà lại tiêu chuẩn,
              đối tượng, thời hạn và nội dung để tránh thiếu sót.
            </p>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Mã chứng nhận
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formData.code || "Chưa nhập"}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Tên chứng nhận
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formData.name || "Chưa nhập"}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Tiêu chuẩn
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formData.standardType || "Chưa chọn"}
                  </div>
                  <div className="mt-1 text-sm text-slate-600">
                    {formData.organization || "Chưa chọn tổ chức cấp"}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-xs uppercase tracking-wide text-slate-500">
                    Thời hạn
                  </div>
                  <div className="mt-1 font-semibold text-slate-900">
                    {formData.issuedDate || "Chưa chọn"} -{" "}
                    {formData.expiryDate || "Chưa chọn"}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="text-xs uppercase tracking-wide text-slate-500">
                  Nội dung
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  {formData.contentType === "editor" ? (
                    <div className="whitespace-pre-wrap leading-6">
                      {formData.content || "Chưa nhập nội dung chứng nhận."}
                    </div>
                  ) : formData.fileUrl ? (
                    <div className="space-y-3">
                      <div className="font-medium text-slate-900">
                        {formData.content || "Đã đính kèm file"}
                      </div>
                      <a
                        href={formData.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex text-sm font-medium text-primary underline-offset-4 hover:underline"
                      >
                        Xem file đính kèm
                      </a>
                    </div>
                  ) : (
                    "Chưa có file đính kèm."
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-primary" />
                  <h4 className="font-semibold text-slate-900">
                    Đối tượng cấp
                  </h4>
                </div>
                <div className="mt-3 flex items-start gap-3">
                  <Avatar className="h-14 w-14 shrink-0 border border-white shadow-sm">
                    <AvatarFallback
                      className={`${entityAvatarClass} font-bold`}
                    >
                      {formData.entityType === "area" ? (
                        <MapPin className="h-6 w-6" />
                      ) : (
                        <Building2 className="h-6 w-6" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <Badge
                        variant="secondary"
                        className="rounded-full px-2.5 py-1 text-[10px] font-mono"
                      >
                        {formData.entityId || "Chưa có mã"}
                      </Badge>
                      <Badge
                        variant="outline"
                        className="rounded-full px-2.5 py-1 text-[10px]"
                      >
                        {formData.entityType === "enterprise"
                          ? "Doanh nghiệp"
                          : "Vùng trồng"}
                      </Badge>
                    </div>
                    <div className="text-base font-semibold text-slate-900">
                      {formData.entityName || "Chưa chọn đối tượng"}
                    </div>
                    <div className="mt-1 text-sm text-slate-600">
                      {formData.entityType === "enterprise"
                        ? "Áp dụng cho toàn bộ doanh nghiệp đã chọn."
                        : "Áp dụng cho vùng trồng cụ thể đã chọn trong doanh nghiệp."}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout
      isDev={true}
      title={isEdit ? "Chỉnh sửa chứng nhận" : "Tạo mới chứng nhận"}
      description="Điền thông tin theo từng bước để tạo hồ sơ chứng nhận"
    >
      <div className="mb-6">
        <p className="text-sm text-slate-500">
          {editItem
            ? "Đang chỉnh sửa hồ sơ chứng nhận hiện có."
            : "Luồng tạo mới được chia thành các bước rõ ràng để dễ nhập và kiểm tra."}
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <StepperForm
            steps={steps}
            onComplete={handleComplete}
            onCancel={handleCancel}
            completeLabel={isEdit ? "Cập nhật chứng nhận" : "Lưu chứng nhận"}
          />
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEdit ? "Xác nhận cập nhật" : "Xác nhận tạo mới"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn {isEdit ? "cập nhật" : "tạo mới"} chứng nhận
              "{formData.name}" không?
              <br />
              Thông tin đã nhập sẽ được lưu vào hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={submitForm}>Xác nhận</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
