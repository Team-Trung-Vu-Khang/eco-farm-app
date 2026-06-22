import {
  AdminLayout,
  Button,
  DeleteDialog,
} from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { ClipboardList, ShieldCheck, UserCog } from "lucide-react";
import { RoleLibrarySection } from "./components/RoleLibrarySection";
import { useRoleResponsibilityPage } from "./hooks/useRoleResponsibilityPage";

export default function RoleResponsibilityPage() {
  const {
    deleteOpen,
    overview,
    roleColumns,
    roleRows,
    setDeleteOpen,
    handleConfirmDelete,
    handleDeleteRole,
    handleEditRole,
    handleViewDetail,
    openCreateDialog,
  } = useRoleResponsibilityPage();

  return (
    <AdminLayout
      isRice
      title="Quản lý vai trò và trách nhiệm"
      description="Quản trị vai trò theo chức năng nông nghiệp, gắn trách nhiệm, người dùng phụ trách và kiểm tra điều kiện nghiệp vụ phục vụ audit."
      actions={
        <Button className="w-full sm:w-auto" onClick={openCreateDialog}>
          <UserCog className="mr-2 h-4 w-4" />
          Thêm vai trò mới
        </Button>
      }
    >
      <RoleLibrarySection
        columns={roleColumns}
        rows={roleRows}
        onDelete={handleDeleteRole}
        onEdit={handleEditRole}
        onView={handleViewDetail}
      />

      <DeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleConfirmDelete}
        description="Bạn có chắc chắn muốn xóa vai trò này? Thao tác này sẽ gỡ vai trò khỏi thư viện cấu hình."
      />
    </AdminLayout>
  );
}
