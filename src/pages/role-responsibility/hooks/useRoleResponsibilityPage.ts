import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@Team-Trung-Vu-Khang/eco-shared-ui";
import { useRoleResponsibilityData } from "./useRoleResponsibilityData";

export function useRoleResponsibilityPage() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { deleteRole, overview, roleColumns, roleRows, roles } = useRoleResponsibilityData();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteRoleId, setDeleteRoleId] = useState<string | null>(null);

  const openCreateDialog = () => {
    setLocation("/role-responsibility/create");
  };

  const openEditDialog = (roleId: string) => {
    setLocation(`/role-responsibility/${roleId}/edit`);
  };

  const handleViewDetail = (roleId: string) => {
    setLocation(`/role-responsibility/${roleId}`);
  };

  const handleEditRole = (roleId: string) => {
    openEditDialog(roleId);
  };

  const handleDeleteRole = (roleId: string) => {
    setDeleteRoleId(roleId);
    setDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!deleteRoleId) return;

    const role = roles.find((item) => item.id === deleteRoleId);
    if (!role) {
      setDeleteOpen(false);
      setDeleteRoleId(null);
      return;
    }

    deleteRole(deleteRoleId);
    toast({
      title: "Đã xóa vai trò",
      description: `Vai trò ${role.tenVaiTro} đã được gỡ khỏi danh sách.`,
    });
    setDeleteOpen(false);
    setDeleteRoleId(null);
  };

  return {
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
  };
}
