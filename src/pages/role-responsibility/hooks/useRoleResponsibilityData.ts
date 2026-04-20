import { useMemo } from "react";
import usePersonnelStore from "../../../stores/usePersonnelStore";
import usePositionStore from "../../../stores/usePositionStore";
import useRoleResponsibilityStore from "../../../stores/useRoleResponsibilityStore";
import useEnterpriseCertificateStore from "../../../stores/useEnterpriseCertificateStore";
import {
  COT_VAI_TRO,
  kiemTraDieuKienNghiepVu,
  taoRowsVaiTro,
} from "../constants/roleResponsibilityConstants";
import { DANH_SACH_NGUOI_DUNG } from "../mocks";
import type { FormVaiTroState, NguoiDungVaiTro } from "../types";

export function useRoleResponsibilityData() {
  const roles = useRoleResponsibilityStore((state) => state.roles);
  const addRole = useRoleResponsibilityStore((state) => state.addRole);
  const updateRole = useRoleResponsibilityStore((state) => state.updateRole);
  const deleteRole = useRoleResponsibilityStore((state) => state.deleteRole);
  const personnel = usePersonnelStore((state) => state.personnel);
  const positions = usePositionStore((state) => state.positions);
  const standards = useEnterpriseCertificateStore((state) => state.standards);

  const personnelNguoiDungList = useMemo<NguoiDungVaiTro[]>(
    () =>
      personnel.map((item) => ({
        id: `personnel-${item.id}`,
        hoTen: item.fullName,
        chucDanh: item.position,
        donVi: item.team ? `${item.department} • ${item.team}` : item.department,
        trangThai: item.status === "active" ? "dang-lam-viec" : "tam-ngung",
        avatar: item.avatar,
        email: item.email,
      })),
    [personnel],
  );

  const nguoiDungList = useMemo<NguoiDungVaiTro[]>(() => {
    if (personnelNguoiDungList.length === 0) {
      return DANH_SACH_NGUOI_DUNG;
    }

    const referencedLegacyUserIds = new Set(
      roles.flatMap((role) => role.nguoiDungIds).filter((id) => id.startsWith("user-")),
    );
    const missingMockUsers = DANH_SACH_NGUOI_DUNG.filter((user) =>
      referencedLegacyUserIds.has(user.id),
    );

    return [...personnelNguoiDungList, ...missingMockUsers];
  }, [personnelNguoiDungList, roles]);

  const roleRows = useMemo(
    () => taoRowsVaiTro(roles, nguoiDungList),
    [nguoiDungList, roles],
  );

  const overview = useMemo(() => {
    const tongVaiTro = roles.length;
    const tongNguoiDuocGan = roles.reduce(
      (tong, item) => tong + item.nguoiDungIds.length,
      0,
    );
    const canRaSoat = roles.filter((vaiTro) => {
      const ketQua = kiemTraDieuKienNghiepVu(
        vaiTro,
        roles,
        nguoiDungList,
        vaiTro.id,
      );
      return ketQua.loi.length > 0 || ketQua.canhBao.length > 0;
    }).length;

    return { tongVaiTro, tongNguoiDuocGan, canRaSoat };
  }, [nguoiDungList, roles]);

  const getRoleById = (roleId: string) =>
    roles.find((item) => item.id === roleId) || null;

  const getSelectedUsers = (roleId: string) => {
    const role = getRoleById(roleId);
    if (!role) return [];

    return nguoiDungList.filter((nguoiDung) => role.nguoiDungIds.includes(nguoiDung.id));
  };

  const getValidationSummary = (
    formData: Pick<
      FormVaiTroState,
      | "maVaiTro"
      | "tenVaiTro"
      | "phamVi"
      | "mucPheDuyet"
      | "maTrachNhiem"
      | "maTieuChuan"
      | "nguoiDungIds"
    >,
    editingRoleId?: string | null,
  ) => kiemTraDieuKienNghiepVu(formData, roles, nguoiDungList, editingRoleId);

  return {
    addRole,
    deleteRole,
    getRoleById,
    getSelectedUsers,
    getValidationSummary,
    nguoiDungList,
    overview,
    approvalOptions: positions
      .filter((item) => item.status === "active")
      .map((item) => ({ value: item.code, label: item.name })),
    roleColumns: COT_VAI_TRO,
    roleRows,
    roles,
    standardOptions: standards.map((item) => ({ value: item.code, label: item.name })),
    updateRole,
  };
}
