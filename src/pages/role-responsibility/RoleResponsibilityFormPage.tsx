import { useEffect, useMemo, useState } from "react";
import { useLocation, useRoute } from "wouter";
import {
  AdminLayout,
  Button,
  StepperForm,
  useToast,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft } from "lucide-react";
import { useRoleFormSteps } from "./components/RoleFormSteps";
import { FORM_VAI_TRO_RONG } from "./mocks";
import { useRoleResponsibilityData } from "./hooks/useRoleResponsibilityData";
import type { FormVaiTroState } from "./types";

export default function RoleResponsibilityFormPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [match, params] = useRoute("/role-responsibility/:id/edit");
  const {
    addRole,
    approvalOptions,
    getRoleById,
    getValidationSummary,
    nguoiDungList,
    standardOptions,
    updateRole,
  } = useRoleResponsibilityData();

  const isEdit = match;
  const roleId = params?.id ?? "";
  const editingRole = isEdit ? getRoleById(roleId) : null;
  const [formData, setFormData] = useState<FormVaiTroState>(FORM_VAI_TRO_RONG);

  useEffect(() => {
    if (!isEdit) {
      setFormData(FORM_VAI_TRO_RONG);
      return;
    }

    if (!editingRole) return;

    setFormData({
      maVaiTro: editingRole.maVaiTro,
      tenVaiTro: editingRole.tenVaiTro,
      nhomVaiTro: editingRole.nhomVaiTro,
      phamVi: editingRole.phamVi,
      mucPheDuyet: editingRole.mucPheDuyet,
      maTrachNhiem: editingRole.maTrachNhiem,
      maTieuChuan: editingRole.maTieuChuan,
      nguoiDungIds: editingRole.nguoiDungIds,
      moTa: editingRole.moTa,
    });
  }, [editingRole, isEdit]);

  const validationSummary = useMemo(
    () => getValidationSummary(formData, isEdit ? roleId : null),
    [formData, getValidationSummary, isEdit, roleId],
  );
  const steps = useRoleFormSteps({
    approvalOptions,
    formData,
    nguoiDungList,
    setFormData,
    standardOptions,
    validationSummary,
  });

  const handleBack = () => {
    if (isEdit && roleId) {
      setLocation(`/role-responsibility/${roleId}`);
      return;
    }

    setLocation("/role-responsibility");
  };

  const handleSubmit = () => {
    if (validationSummary.loi.length > 0) {
      toast({
        title: "Chưa thể lưu vai trò",
        description: validationSummary.loi[0],
      });
      return;
    }

    if (isEdit && roleId) {
      const updatedRole = updateRole(roleId, formData, "Phạm Quốc Huy");
      if (!updatedRole) return;

      toast({
        title: "Đã cập nhật vai trò",
        description: `Vai trò ${formData.tenVaiTro} đã được cập nhật thành công.`,
      });
      setLocation(`/role-responsibility/${updatedRole.id}`);
      return;
    }

    const newRole = addRole(formData, "Phạm Quốc Huy");
    toast({
      title: "Đã tạo vai trò",
      description: `Vai trò ${formData.tenVaiTro} đã được khởi tạo thành công.`,
    });
    setLocation(`/role-responsibility/${newRole.id}`);
  };

  if (isEdit && !editingRole) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy vai trò"
        description="Vai trò bạn muốn chỉnh sửa không còn tồn tại trong hệ thống."
      >
        <Button
          variant="outline"
          onClick={() => setLocation("/role-responsibility")}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Quay lại danh sách
        </Button>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      isDev={true}
      title={
        isEdit
          ? "Cập nhật vai trò và trách nhiệm"
          : "Tạo vai trò và trách nhiệm"
      }
      description={
        isEdit
          ? `Điều chỉnh cấu hình cho vai trò ${editingRole?.tenVaiTro ?? ""}`
          : "Tạo vai trò theo từng bước, sau đó rà soát ở bước xác nhận trước khi lưu."
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          {isEdit ? "Quay lại chi tiết" : "Quay lại danh sách"}
        </Button>
      </div>

      <div className="rounded-xl bg-white/50 backdrop-blur-xs">
        <StepperForm
          key={isEdit ? roleId : "create"}
          steps={steps}
          completeLabel={isEdit ? "Cập nhật vai trò" : "Lưu vai trò"}
          onComplete={handleSubmit}
          onCancel={handleBack}
        />
      </div>
    </AdminLayout>
  );
}
