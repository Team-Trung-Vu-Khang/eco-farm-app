import { AdminLayout, Button } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ChevronLeft, PencilLine } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { RoleResponsibilityContent } from "./components/RoleResponsibilityContent";
import { useRoleResponsibilityData } from "./hooks/useRoleResponsibilityData";

export default function RoleResponsibilityDetailPage() {
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/role-responsibility/:id");
  const {
    approvalOptions,
    getRoleById,
    getSelectedUsers,
    getValidationSummary,
    standardOptions,
  } = useRoleResponsibilityData();

  const roleId = params?.id ?? "";
  const selectedRole = getRoleById(roleId);

  if (!selectedRole) {
    return (
      <AdminLayout
        isDev={true}
        title="Không tìm thấy vai trò"
        description="Vai trò bạn đang xem không còn tồn tại trong hệ thống."
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
      title="Chi tiết vai trò và trách nhiệm"
      description="Theo dõi cấu hình nghiệp vụ, người dùng phụ trách và tình trạng kiểm tra điều kiện."
      actions={
        <Button
          onClick={() =>
            setLocation(`/role-responsibility/${selectedRole.id}/edit`)
          }
        >
          <PencilLine className="mr-2 h-4 w-4" />
          Chỉnh sửa vai trò
        </Button>
      }
    >
      <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/role-responsibility")}
          className="gap-2 pl-0 text-muted-foreground hover:text-primary"
        >
          <ChevronLeft className="h-4 w-4" />
          Quay lại danh sách
        </Button>
      </div>

      <RoleResponsibilityContent
        approvalOptions={approvalOptions}
        selectedRole={selectedRole}
        selectedUsers={getSelectedUsers(selectedRole.id)}
        standardOptions={standardOptions}
        validationSummary={getValidationSummary(selectedRole, selectedRole.id)}
      />
    </AdminLayout>
  );
}
